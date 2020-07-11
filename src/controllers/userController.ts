import { Request, Response, NextFunction} from 'express';
import * as bcrypt from 'bcrypt';

import pool from '../database';
import { User } from '../models/user';
import { passport, getToken } from '../authenticate';

let saltRounds = 10;;

class UserController {

  public signUp(req: Request, res: Response) {

    bcrypt.hash(req.body.password, saltRounds).then(passHash => {

      var user: User = {
        username: req.body.username,
        email: req.body.email,
        password: passHash,
        profilePicture: req.body.profilePicture
      }
      
      pool.query('INSERT INTO users SET ?', [user], (err, results, fields) => {
        if (err) {
          res.setHeader('Content-Type', 'application/json');
          res.status(401).json({ succes: false, state: 'Error', err });
        } else {
          passport.authenticate('local')(req, res, () => {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ success: true, state: 'Registration successful!' });
          });
        }
  
      });
    });

  }

  public login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (err, user: User, info) => {
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

        let reqUsername: User = req.user as User;

        let token = getToken({ username: reqUsername.username });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, state: 'Login successful', user, token });
      });
    })(req, res, next);
  }

  public checkJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err, user: User, info) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, state: 'Error', err });
      }
      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, state: 'JWT invalid', err: info });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, state: 'JWT valid', user });
      }
    })(req, res, next);
  }

  changePassword(req: Request, res: Response) {
    let user: User = req.user as User;

    bcrypt.compare(req.body.password, user.password).then(result => {
      if (result) {
        bcrypt.hash(req.body.newPassword, saltRounds).then(passwordHash => {
          user.password = passwordHash;

          pool.query('UPDATE users SET ? WHERE username = ?', [user, user.username], (err, results, fields) => {
            if (err) {
              res.setHeader('Content-Type', 'application/json');
              res.status(401).json({ success: false, err });
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.status(200).json({ success: true, result: results });
            }
          });
        })
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, err: '' }); 
      }
    });
  }

}

export const userController = new UserController();