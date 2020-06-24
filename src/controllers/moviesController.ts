import { Request, Response } from 'express';

import pool from '../database';

class MoviesController {

  public list(req: Request, res: Response) {
    pool.query('SELECT * FROM movies', (err, movies, fields) => {
      if (err) throw err;

      res.json(movies);
    });
    
  }

  public getOne(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('SELECT * FROM movies WHERE id = ?', [id], (err, movie, fields) => {
      if (err) throw err;

      if (movie.length > 0) {
        return res.json(movie[0]);
      }

      res.status(404).json({text: "The movie doesn't exist"});
    });

  }

  public create(req: Request, res: Response) {
    pool.query('INSERT INTO movies SET ?', [req.body], (err, results, fields) => {
      if (err) throw err;

      res.json({ result: results });
    });

  }

  public update(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('UPDATE movies SET ? WHERE id = ?', [req.body, id], (err, results, fields) => {
      if (err) throw err;

      res.json({ result: results });
    });

  }

  public delete(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('DELETE FROM movies WHERE id = ?', [id], (err, results, fields) => {
      if (err) throw err;
      
      res.json({ result: results });
    });

  }

}

export const moviesController = new MoviesController();