"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const database_1 = __importDefault(require("../database"));
const authenticate_1 = require("../authenticate");
class UserController {
    signUp(req, res) {
        var user = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profilePicture: req.body.profilePicture
        };
        database_1.default.query('INSERT INTO users SET ?', [user], (err, results, fields) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ err: err });
            }
            else {
                authenticate_1.passport.authenticate('local')(req, res, () => {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ succes: true, state: 'Registration successful!' });
                });
            }
        });
    }
    login(req, res, next) {
        authenticate_1.passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ err: err });
            }
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                res.status(404).json({ succes: false, state: 'Login unsuccessful', err: info });
            }
            /* req.logIn() asigna el objeto user a req.user
            */
            req.logIn(user, (err) => {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(401).json({ success: false, state: 'Login unsuccessful', err: err });
                }
                let reqUsername = req.user;
                let token = authenticate_1.getToken({ username: reqUsername.username });
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ succes: true, state: 'Login successful', token: token });
            });
        })(req, res, next);
    }
    checkJWT(req, res, next) {
        authenticate_1.passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ err: err });
            }
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ succes: false, state: 'JWT invalid', err: info });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ succes: true, state: 'JWT valid', user });
            }
        })(req, res, next);
    }
}
exports.userController = new UserController();
