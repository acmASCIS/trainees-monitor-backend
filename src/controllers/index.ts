import { IController } from './IController';
import AccountsController from './AccountsController';
import ProfilesController from './ProfilesController';
import AnalysisController from './AnalysisController';

const controllers: IController[] = [
  new AccountsController(),
  new ProfilesController(),
  new AnalysisController()
];

export default controllers;
