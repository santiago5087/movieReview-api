import { Request, Response, NextFunction } from 'express';

import pool from '../database';
import { Review } from '../models/review';
import { User } from '../models/user';

class ReviewController {

  public getReviews(req: Request, res:Response) {
    pool.query('SELECT r.movieTitle as movieTitle, r.movieYear as movieYear, r.movieGenre as movieGenre, r.moviePlot as moviePlot, r.moviePoster as moviePoster, r.movieRating as movieRating, r.created_at as created_at, r.type as type, r.review as review, u.username as username, u.profilePicture as profilePicture, r.userRating as userRating FROM reviews r JOIN users u ON r.username=u.username', 
      (err, reviews, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, result: reviews });
      }
    });
  }

  public getReview(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('SELECT * FROM reviews WHERE id = ?', [id], (err, review, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, result: review });
      }
    });
  }

  public createReview(req: Request, res: Response) {
    let user: User = req.user as User;

    let review: Review = {
      movieTitle: req.body.movieTitle,
      movieYear: req.body.movieYear,
      movieGenre: req.body.movieGenre,
      moviePlot: req.body.moviePlot,
      moviePoster: req.body.moviePoster,
      movieRating: req.body.movieRating,
      userRating: req.body.userRating,
      type: req.body.type,
      review: req.body.review,
      username: user.username
    }

    pool.query('INSERT INTO reviews SET ?', [review], (err, results, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, result: results });
      }
    });
  }

  public getUserReview(req: Request, res: Response) {
    let user: User = req.user as User;

    pool.query('SELECT * FROM reviews WHERE username = ?', [user.username], (err, results, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, result: results });
      }
    });
  }

  public updateReview(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('UPDATE reviews SET ? WHERE id = ?', [req.body, id], (err, results, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, err });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ success: true, result: results });
      }
    });
  }

  public deleteReview(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('DELETE FROM reviews WHERE id = ?', [id], (err, results, fields) => {
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.status(401).json({ success: false, err });
      } else {
        let user: User = req.user as User;

        pool.query('SELECT * FROM reviews WHERE username = ?', [user.username], (err, results, fields) => {
          if (err) {
            res.setHeader('Content-Type', 'application/json');
            res.status(401).json({ success: false, err });
          } else {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({ success: true, result: results });
          }
        });
      }
    });
  }

}

export const reviewController = new ReviewController();