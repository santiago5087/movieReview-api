import { Router } from 'express';

import { reviewController } from '../controllers/reviewController';
import { verifyUser } from '../authenticate';

class ReviewRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  public config(): void {
    this.router.get('/', reviewController.getReviews);
    this.router.get('/my-reviews', verifyUser, reviewController.getUserReview);
    this.router.get('/:id', verifyUser, reviewController.getReview);
    this.router.post('/', verifyUser, reviewController.createReview);
    this.router.put('/:id', verifyUser, reviewController.updateReview);
    this.router.delete('/:id', verifyUser, reviewController.deleteReview);
  }

}

let reviewRoutes = new ReviewRoutes();
export default reviewRoutes.router;