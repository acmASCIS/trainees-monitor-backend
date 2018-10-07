import { IController } from './IController';
import AccountsController from './AccountsController';
import ProfilesController from './ProfilesController';
import AnalysisController from './AnalysisController';
import UserSearchController from './UserSearchController';

const controllers: IController[] = [
  new AccountsController(),
  new ProfilesController(),
  new AnalysisController(),
  new UserSearchController()
];

export default controllers;
