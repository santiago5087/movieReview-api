"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const database_1 = __importDefault(require("../database"));
const passport_1 = __importDefault(require("../passport"));
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
                passport_1.default.authenticate('local')(req, res, () => {
                    res.setHeader('Content-Type', 'application/json');
                    res.status(200).json({ succes: true, state: 'Registration successful!' });
                });
            }
        });
    }
}
exports.userController = new UserController();
