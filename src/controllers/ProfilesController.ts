import { Application, Router, Request, Response } from 'express';
import _ from 'lodash';

import { ApiError } from './../utils/ApiError';
import { IController } from './IController';
import { IUserRepository, UserRepository } from '../repositories/UserRepository';
import { authorize } from '../utils/middleware/authHandler';
import { Role } from '../models/User/UserDTO';

export default class ProfilesController implements IController {
  private userRepository: IUserRepository = new UserRepository();

  public register(app: Application): void {
    const router = Router();
    router.get('/:handle', authorize(Role.Mentor), this.getProfile.bind(this));

    // attaching the router to the endpoint.
    app.use('/profile', router);
  }

  /**
   * @route GET /profile/:handle
   * @desc Returns User Profile Data.
   * @access Private
   */
  private async getProfile(req: Request, res: Response) {
    const handle = req.params.handle;
    const user = await this.userRepository.findByHandle(handle);
    if (!user) {
      throw new ApiError('User not found.', 404);
    }

    // TODO: return all the needed About Section details

    res.json(_.pick(user, ['handle', 'name', 'email', 'onlineJudgesHandles', 'role']));
  }
}
