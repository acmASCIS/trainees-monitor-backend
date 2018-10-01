import { Application, Router, Request, Response } from 'express';

import { IController } from './IController';
import { Role } from '../models/User/UserDTO';
import { authorize } from '../utils/middleware/authHandler';
import { IUserRepository, UserRepository } from '../repositories/UserRepository';
import { ApiError } from '../utils/ApiError';
import AnalysisService from '../services/AnalysisService';

export default class AnalysisController implements IController {
  private userRepository: IUserRepository = new UserRepository();
  private analsysService: AnalysisService = new AnalysisService();

  public register(app: Application): void {
    const router = Router();
    router.get('/:handle', authorize(Role.Mentor), this.getProfileAnalysis.bind(this));

    // attaching the router to the endpoint.
    app.use('/analysis', router);
  }

  private async getProfileAnalysis(req: Request, res: Response) {
    const handle = req.params.handle;
    const user = await this.userRepository.findByHandle(handle);
    if (!user) {
      throw new ApiError('User not found.', 404);
    }

    res.send(await this.analsysService.analyseProfile(user.onlineJudgesHandles.codeforces));
  }
}
