import { Router } from 'express';

import { userController } from '../controllers/userController';
import { verifyUser } from '../authenticate';

class UserRoutes {

  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.post('/signup', userController.signUp);
    this.router.post('/login', userController.login);
    this.router.get('/checkToken', userController.checkJWT);
    this.router.put('/changePass', verifyUser, userController.changePassword);
  }

}

const userRoutes = new UserRoutes();
export default userRoutes.router;