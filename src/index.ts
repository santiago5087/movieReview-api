import * as dotenv from "dotenv";
dotenv.config();
import express, { Application } from 'express';
import morgan from 'morgan';
import path from 'path';
import cors from 'cors';

import * as authenticate from './authenticate';

import userRoutes from './routes/userRoutes';
import reviewRoutes from './routes/reviewRoutes';
import movieRoutes from './routes/movieRoutes';

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
    this.app.use(express.json());
    console.log(path.join(__dirname, 'public'));
    this.app.use(express.static(path.join(__dirname, '../src/public')));

    /* Parsea x-ww-form-urlencoded request bodies (reemplaza bodyparser)
    extended: true -> soporta nested objects, con extended: false no.
    */
    this.app.use(express.urlencoded({ extended: false })); 
    
    this.app.use(authenticate.passport.initialize());
    this.app.use(authenticate.passport.session());
  }

  routes(): void {
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/reviews', reviewRoutes);
    this.app.use('/api/movies', movieRoutes);
    this.app.get('*', (req, res) => {
      return res.sendFile(path.join(__dirname, '../src/public/index.html'));
    });
  }

  start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server on port', this.app.get('port'));
    });
  }

}

const server = new Server();
server.start();