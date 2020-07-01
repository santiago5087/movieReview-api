import { Request, Response, NextFunction} from 'express';

import pool from '../database';
import { User } from '../models/user';
import { passport, getToken } from '../authenticate';

class UserController {

  public signUp(req: Request, res: Response) {
    var user: User = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      profilePicture: req.body.profilePicture
    }
    
    pool.query('INSERT INTO users SET ?', [user], (err, results, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ err: err });
      } else {
        passport.authenticate('local')(req, res, () => {
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json({ succes: true, state: 'Registration successful!' });
        });
      }

    });
  }

  public login(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('local', { session: false }, (err, user: User, info) => {
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

        let reqUsername: User = req.user as User;

        let token = getToken({ username: reqUsername.username });
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ succes: true, state: 'Login successful', token: token });
      });
    })(req, res, next);
  }

  public checkJWT(req: Request, res: Response, next: NextFunction) {
    passport.authenticate('jwt', { session: false }, (err, user: User, info) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ err: err });
      }
      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ succes: false, state: 'JWT invalid', err: info });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ succes: true, state: 'JWT valid', user });
      }
    })(req, res, next);
  }

}

export const userController = new UserController();