import { Request, Response, Router } from 'express';
import * as superagent from 'superagent';

let host ="https://www.omdbapi.com/";

class MovieController {

  public getMovie(req: Request, res: Response) {
    let apiKey: string = process.env.OMDB_API_KEY as string;

    let movieTitle: string = req.body.movieTitle;
    let movieYear: string = req.body.movieYear;

    superagent.get(`${host}?apikey=${apiKey}&t=${movieTitle}&y=${movieYear}`)
      .then(movie => {
        res.status(200).json(JSON.parse(movie.text));
      })
      .catch(err => console.log(err));
  }

}

export const movieController = new MovieController();