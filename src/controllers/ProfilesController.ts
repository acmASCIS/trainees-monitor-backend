import { Application, Router, Request, Response } from 'express';
import _ from 'lodash';

import { ApiError } from './../utils/ApiError';
import { IController } from './IController';
import { IUserRepository, UserRepository } from '../repositories/UserRepository';
import { authorize } from '../utils/middleware/authHandler';
import { Role } from '../models/User/UserDTO';
import { CodeforcesService } from './../services/onlinejudges/CodeforcesService';

export default class ProfilesController implements IController {
  private userRepository: IUserRepository = new UserRepository();
  private cfService: CodeforcesService = new CodeforcesService(
    process.env.CF_KEY as string,
    process.env.CF_SECRET as string
  );

  public register(app: Application): void {
    const router = Router();
    router.get('/follow', authorize(Role.Trainee), this.follow.bind(this));
    router.get('/unfollow', authorize(Role.Trainee), this.unfollow.bind(this));
    router.get('/:handle', authorize(Role.Trainee), this.getProfile.bind(this));

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

    const userProfile: any = _.pick(user, [
      'handle',
      'name',
      'email',
      'onlineJudgesHandles',
      'role'
    ]);

    // Loading Codeforces User info
    const cfInfo = await this.cfService.getUser(user.onlineJudgesHandles.codeforces);
    if (cfInfo) {
      userProfile.rank = cfInfo.rank;
      userProfile.rating = cfInfo.rating;
      userProfile.lastOnlineTimeSeconds = cfInfo.lastOnlineTimeSeconds;
    }

    // Loading follow info
    const authenticatedUser = await this.userRepository.findById(req.user._id);
    if (!authenticatedUser) {
      throw new ApiError();
    }
    userProfile.isFollowed = authenticatedUser.following.indexOf(user._id as string) !== -1;

    res.json(userProfile);
  }

  /**
   * @route GET /follow?:handle
   * @desc Adds a user to the following list.
   * @access Private
   */
  private async follow(req: Request, res: Response) {
    const followingHandle = req.query.handle;

    const currentUser = await this.userRepository.findById(req.user._id);
    const followingUser = await this.userRepository.findByHandle(followingHandle);

    if (!currentUser || !followingUser) {
      throw new ApiError('Bad request', 400);
    }

    if (currentUser.following.indexOf(followingUser._id as string) === -1) {
      currentUser.following.push(followingUser._id as string);
    }
    this.userRepository.update(currentUser._id as string, currentUser);
    res.status(201).json({ success: true });
  }

  /**
   * @route GET /unfollow?:handle
   * @desc Removes a user to the following list.
   * @access Private
   */
  private async unfollow(req: Request, res: Response) {
    const unfollowingHandle = req.query.handle;

    const currentUser = await this.userRepository.findById(req.user._id);
    const unfollowingUser = await this.userRepository.findByHandle(unfollowingHandle);

    if (!currentUser || !unfollowingUser) {
      throw new ApiError('Bad request', 400);
    }

    const index = currentUser.following.indexOf(unfollowingUser._id as string);
    if (index !== -1) {
      currentUser.following.splice(index, 1);
    }

    this.userRepository.update(currentUser._id as string, currentUser);
    res.status(201).json({ success: true });
  }
}
