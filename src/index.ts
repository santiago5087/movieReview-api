import * as dotenv from "dotenv";
dotenv.config();
import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import * as authenticate from './authenticate';

import indexRoutes from './routes/indexRoutes';
import moviesRoutes from './routes/moviesRoutes';
import userRoutes from './routes/userRoutes';

class Server {

  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  config(): void {
    this.app.set('port', process.env.PORT || 3000);
    this.app.use(morgan('dev'));
    this.app.use(cors());

    /* Parsea application/json request bodies (reemplaza bodyparser)
    */
    this.app.use(express.json()); // 

    /* Parsea x-ww-form-urlencoded request bodies (reemplaza bodyparser)
    extended: true -> soporta nested objects, con extended: false no.
    */
    this.app.use(express.urlencoded({ extended: false })); 
    
    this.app.use(authenticate.passport.initialize());
    this.app.use(authenticate.passport.session());
  }

  routes(): void {
    this.app.use('/', indexRoutes);
    this.app.use('/api/movies', moviesRoutes);
    this.app.use('/api/users', userRoutes);
  }

  start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server on port', this.app.get('port'));
    });
  }

}

const server = new Server();
server.start();