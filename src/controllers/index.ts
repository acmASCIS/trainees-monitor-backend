import { IController } from './IController';
import AccountsController from './AccountsController';

const controllers: IController[] = [new AccountsController()];

export default controllers;
