"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.getToken = exports.passport = void 0;
const passport_1 = __importDefault(require("passport"));
exports.passport = passport_1.default;
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("./database"));
let getToken = (username) => {
    return jsonwebtoken_1.default.sign(username, process.env.SECRET_KEY, { expiresIn: '8h' });
};
exports.getToken = getToken;
let verifyUser = passport_1.default.authenticate('jwt', { session: false });
exports.verifyUser = verifyUser;
/* Los parámetros username y password (credenciales) que toma la estrategia son los que se obtienen de sacar
del objeto req.body, por lo que se espera que existan en este objeto estos atributos.
*/
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => {
    database_1.default.query('SELECT * FROM users WHERE username = ?', [username], (err, user, fields) => {
        if (err)
            return done(err);
        if (user.length == 0)
            return done(null, false, { message: 'Username doesn\'t exist or incorrect' });
        let actualUser = user[0];
        // Crear el método que compara las claves cifradas
        if (actualUser.password !== password)
            return done(null, false, { message: 'Incorrect password' });
        return done(null, actualUser);
    });
}));
/* El username es guardado en la sesión, para después recuperar el objeto completo con el método deserialize.
Resultado por ejm: req.session.passport.user = { id: 'xyz' }
*/
passport_1.default.serializeUser((user, done) => {
    done(null, user.username);
});
/* El objeto extraído del método de deserialize es ligado al objeto request como req.user
*/
passport_1.default.deserializeUser((username, done) => {
    database_1.default.query('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        done(user[0]);
    });
});
let ops = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
};
passport_1.default.use(new passport_jwt_1.Strategy(ops, (jwt_payload, done) => {
    database_1.default.query('SELECT * FROM users WHERE username = ?', [jwt_payload.username], (err, user, fields) => {
        if (err)
            return done(err);
        if (user.length == 0)
            return done(null, false, { message: 'Username doesn\'t exist or incorrect' });
        let actualUser = user[0];
        return done(null, actualUser);
    });
}));
