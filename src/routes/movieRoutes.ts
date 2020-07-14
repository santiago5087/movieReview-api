import { Router } from 'express';

import { movieController } from '../controllers/movieController';

class MovieRoutes {

  router: Router = Router();

  constructor() {
    this.config();
  }

  public config(): void {
    this.router.post('/', movieController.getMovie);
  }

}

let movieRoutes = new MovieRoutes();
export default movieRoutes.router;