import passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import pool from './database';
import { User } from './models/user';  

let getToken = (username: any) => {
  return jwt.sign(username, process.env.SECRET_KEY as string, { expiresIn: '8h' });
}

let verifyUser = passport.authenticate('jwt', { session: false });

/* Los parámetros username y password (credenciales) que toma la estrategia son los que se obtienen de sacar 
del objeto req.body, por lo que se espera que existan en este objeto estos atributos.
*/
passport.use(new LocalStrategy((username, password, done) => {
    pool.query('SELECT * FROM users WHERE username = ?', [username], (err, user: User[], fields) => {
      if (err) return done(err);
      if (user.length == 0) return done(null, false, { message: 'Username doesn\'t exist or incorrect' });
      
      let actualUser: User = user[0];
      
      bcrypt.compare(password, actualUser.password).then(result => {
        if (result) return done(null, actualUser);
        else return done(null, false, { message: 'Incorrect password' }); 
      });      
      
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

let ops: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY as string
}

passport.use(new JwtStrategy(ops, (jwt_payload, done) => {
  pool.query('SELECT * FROM users WHERE username = ?', [jwt_payload.username], (err, user: User[], fields) => {
    if (err) return done(err);
    if (user.length == 0) return done(null, false, { message: 'Username doesn\'t exist or incorrect' });
    
    let actualUser: User = user[0];
    return done(null, actualUser);
  });
}));

export { passport, getToken, verifyUser };