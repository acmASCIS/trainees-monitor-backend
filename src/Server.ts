import express from 'express';
import * as bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import 'express-async-errors';

import controllers from './controllers';
import { errorHandler } from './utils/middleware/errorHandler';

export default class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.config();
  }

  public start(): express.Application {
    const PORT = process.env.PORT || 3000;
    const HOST = process.env.HOST || 'http://localhost';
    this.app.listen(PORT, () => {
      console.log(`
        Server is running on port: ${PORT}
        Host: ${HOST}:${PORT}
      `);
    });

    return this.app;
  }

  private config(): void {
    this.registerMiddlewares();
    this.registerControllers();
    this.registerErrorHandlers();
  }

  private registerMiddlewares(): void {
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
        origin: [process.env.CLIENT_URL as string],
        methods: ['GET', 'POST', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization'],
      })
    );
  }

  private registerControllers(): void {
    controllers.forEach((controller) => controller.register(this.app));
  }

  private registerErrorHandlers(): void {
    this.app.use(errorHandler);
  }
}
