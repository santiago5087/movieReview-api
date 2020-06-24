import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/indexRoutes';
import moviesRoutes from './routes/moviesRoutes';

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
    this.app.use(express.json()); // parsea application/json request bodies (reemplaza bodyparser)
    this.app.use(express.urlencoded({ extended: false })); 
    // parsea x-ww-form-urlencoded request bodies (reemplaza bodyparser) 
    // extended: true -> soporta nested objects, con extended: false no. 
  }

  routes(): void {
    this.app.use('/', indexRoutes);
    this.app.use('/api/movies', moviesRoutes);
  }

  start(): void {
    this.app.listen(this.app.get('port'), () => {
      console.log('Server on port', this.app.get('port'));
    });
  }

}

const server = new Server();
server.start();
