import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import pool from './database';
import { User } from './models/user';

passport.use(new LocalStrategy((username, password, done) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, user: User[], fields) => {
      if (err) return done(err);
      if (user.length == 0) return done(null, false, { message: 'Username doesn\'t exist or incorrect' });
      
      let actualUser: User = user[0];
      // Crear el método que compara las claves cifradas
      if (actualUser.password !== password) return done(null, false, { message: 'Incorrect password' });
      
      return done(null, actualUser);
    });
}));

/* El username es guardado en la sesión, para después recuperar el objeto completo con el método deserialize.
Resultado por ejm: req.session.passport.user = { id: 'xyz' }
*/
passport.serializeUser((user: User, done) => { 
  done(null, user.username);
});

/* El objeto extraído del método de deserialize es ligado al objeto request como req.user
*/
passport.deserializeUser((username: string, done) => {
  pool.query('SELECT * FROM users WHERE username = ?', [username], (err, user: User []) => {
    done(user[0]); 
  });
});

export default passport;