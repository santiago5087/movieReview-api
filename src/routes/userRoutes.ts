import { Router } from 'express';

import { userController } from '../controllers/userController';

class UserRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/signup', userController.signUp);
    this.router.post('/login', userController.login);
  }

}

const userRoutes = new UserRoutes();
export default userRoutes.router;