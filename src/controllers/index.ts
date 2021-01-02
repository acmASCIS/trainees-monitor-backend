import { IController } from './IController';
import AccountsController from './AccountsController';
import ProfilesController from './ProfilesController';
import AnalysisController from './AnalysisController';
import UserSearchController from './UserSearchController';
import CFContestsController from './CFContestsController';

const controllers: IController[] = [
  new AccountsController(),
  new ProfilesController(),
  new AnalysisController(),
  new UserSearchController(),
  new CFContestsController(),
];

export default controllers;
