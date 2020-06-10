import { Request, Response } from 'express';

import pool from '../database';

class GamesController {

  public list(req: Request, res: Response) {
    pool.query('SELECT * FROM games', (err, games, fields) => {
      if (err) throw err;

      res.json({ games: games });
    });
    
  }

  public getOne(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('SELECT * FROM games WHERE id = ?', [id], (err, game, fields) => {
      if (err) throw err;

      if (game.length > 0) {
        return res.json({ game: game[0] });
      }

      res.status(404).json({text: "The game doesn't exist"});
    });

  }

  public create(req: Request, res: Response) {
    pool.query('INSERT INTO games SET ?', [req.body], (err, results, fields) => {
      if (err) throw err;

      res.json({ result: results });
    });

  }

  public update(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('UPDATE games SET ? WHERE id = ?', [req.body, id], (err, results, fields) => {
      if (err) throw err;

      res.json({ result: results });
    });

  }

  public delete(req: Request, res: Response) {
    const { id } = req.params;
    pool.query('DELETE FROM games WHERE id = ?', [id], (err, results, fields) => {
      if (err) throw err;
      
      res.json({ result: results });
    });

  }

}

export const gamesController = new GamesController();