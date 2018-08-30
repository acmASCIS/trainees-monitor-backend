import { Application, Request, Response } from 'express';
import { IController } from './IController';

export default class AccountsController implements IController {
  public register(app: Application): void {
    app.get('/', this.ping);
  }

  private ping(req: Request, res: Response) {
    res.json('Hello World!');
  }
}
