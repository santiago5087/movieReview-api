import { Request, Response } from 'express';

import pool from '../database';
import { User } from '../models/user';
import passport from '../passport';

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

}

export const userController = new UserController();