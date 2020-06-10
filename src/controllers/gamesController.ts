import { Request, Response } from 'express';

import pool from '../database';

class GamesController {

  public index(req: Request, res: Response) {
    pool.query('DESCEIBE games;');
    res.json({test: "test"});
  }

}

export const gamesController = new GamesController();