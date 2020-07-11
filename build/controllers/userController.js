"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const bcrypt = __importStar(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const authenticate_1 = require("../authenticate");
let saltRounds = 10;
;
class UserController {
    signUp(req, res) {
        bcrypt.hash(req.body.password, saltRounds).then(passHash => {
            var user = {
                username: req.body.username,
                email: req.body.email,
                password: passHash,
                profilePicture: req.body.profilePicture
            };
            database_1.default.query('INSERT INTO users SET ?', [user], (err, results, fields) => {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(401).json({ succes: false, state: 'Error', err });
                }
                else {
                    authenticate_1.passport.authenticate('local')(req, res, () => {
                        res.setHeader('Content-Type', 'application/json');
                        res.status(200).json({ success: true, state: 'Registration successful!' });
                    });
                }
            });
        });
    }
    login(req, res, next) {
        authenticate_1.passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ success: false, state: 'Error', err });
            }
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                return res.status(401).json({ success: false, state: 'Login unsuccessful', err: info });
            }
            /* req.logIn() asigna el objeto user a req.user
            */
            req.logIn(user, (err) => {
                if (err) {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(401).json({ success: false, state: 'Login unsuccessful', err });
                }
                let reqUsername = req.user;
                let token = authenticate_1.getToken({ username: reqUsername.username });
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, state: 'Login successful', user, token });
            });
        })(req, res, next);
    }
    checkJWT(req, res, next) {
        authenticate_1.passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, state: 'Error', err });
            }
            if (!user) {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, state: 'JWT invalid', err: info });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(200).json({ success: true, state: 'JWT valid', user });
            }
        })(req, res, next);
    }
    changePassword(req, res) {
        let user = req.user;
        bcrypt.compare(req.body.password, user.password).then(result => {
            if (result) {
                bcrypt.hash(req.body.newPassword, saltRounds).then(passwordHash => {
                    user.password = passwordHash;
                    database_1.default.query('UPDATE users SET ? WHERE username = ?', [user, user.username], (err, results, fields) => {
                        if (err) {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(401).json({ success: false, err });
                        }
                        else {
                            res.setHeader('Content-Type', 'application/json');
                            res.status(200).json({ success: true, result: results });
                        }
                    });
                });
            }
            else {
                res.setHeader('Content-Type', 'application/json');
                res.status(401).json({ success: false, err: '' });
            }
        });
    }
}
exports.userController = new UserController();
