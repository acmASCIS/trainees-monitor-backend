import { IController } from './IController';
import AccountsController from './AccountsController';
import ProfilesController from './ProfilesController';

const controllers: IController[] = [new AccountsController(), new ProfilesController()];

export default controllers;
