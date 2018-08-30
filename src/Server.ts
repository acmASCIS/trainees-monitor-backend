import express from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';

import controllers from './controllers';

export default class Server {
  public readonly app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.startControllers();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(compression());
    this.app.use(helmet());

    if (process.env.NODE_ENV !== 'production') {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    this.app.use(
      cors({
        origin: ['http://localhost:3001'],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization']
      })
    );

    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || 'http://localhost';
    this.app.listen(PORT, () => {
      console.log(`
        Server is running on port: ${PORT}
        Host: ${HOST}:${PORT}
      `);
    });
  }

  private startControllers(): void {
    controllers.forEach(controller => controller.register(this.app));
  }
}
