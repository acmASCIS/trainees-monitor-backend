import express, { Request, Response } from 'express';
import _ from 'lodash';

import { IController } from './IController';
import { IUserRepository, UserRepository } from '../repositories/UserRepository';
import { ApiError } from '../utils/ApiError';
import { authorize } from '../utils/middleware/authHandler';
import { Role } from '../models/User/UserDTO';

export default class UserSearchController implements IController {
  private userRepository: IUserRepository = new UserRepository();

  public register(app: express.Application): void {
    app.get('/users/search', authorize(Role.Trainee), this.userSearch.bind(this));
  }

  /**
   * @route GET users/search?query={query}
   * @desc Searches the users using the query.
   * @access Private
   */
  private async userSearch(req: Request, res: Response) {
    const query = req.query.query;
    const searchResult = (await this.userRepository.searchUsers(query)).slice(0, 10);

    // Getting current user
    const authenticatedUser = await this.userRepository.findById(req.user._id);
    if (!authenticatedUser) {
      throw new ApiError();
    }

    const searchResultFiltered = searchResult
      .map(user => {
        const filteredUser: any = _.pick(user, [
          'handle',
          'name',
          'email',
          'role',
          'onlineJudgesHandles'
        ]);
        filteredUser.isFollowed = authenticatedUser.following.indexOf(user._id as string) !== -1;
        return filteredUser;
      })
      .filter(user => user.role !== Role.Admin && user.name !== req.user.name);

    res.send(searchResultFiltered);
  }
}
