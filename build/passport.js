"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const database_1 = __importDefault(require("./database"));
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
exports.default = passport_1.default;
