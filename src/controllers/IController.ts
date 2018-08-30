import { Application } from 'express';

export interface IController {
  register(app: Application): void;
}
