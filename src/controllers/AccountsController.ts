import { ApiError } from './../utils/ApiError';
import { Application, Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import { IUserRepository, UserRepository } from './../repositories/UserRepository';
import { UserDTO } from './../models/User/UserDTO';
import { IController } from './IController';
import { validateRegisterInput } from '../utils/validator';
import { User } from '../models/User/User';

export default class AccountsController implements IController {
  private userRepository: IUserRepository = new UserRepository();

  public register(app: Application): void {
    app.post('/register', this.registerUser.bind(this));
  }

  private async registerUser(req: Request, res: Response, next: NextFunction) {
    const { errors } = validateRegisterInput(req.body);
    if (errors) {
      next(new ApiError('Invalid Input', 400, errors));
      return;
    }

    const { handle, name, email, password, role, codeforcesHandle } = req.body;
    const user: User = new User(handle, name, email, password, role, {
      codeforces: codeforcesHandle
    });
    user.password = await user.hashPassword();

    // Checking duplicate user email and handle
    if (await this.userRepository.findOne({ email: user.email })) {
      next(new ApiError('Invalid Input', 400, { email: 'Email already exists' }));
    } else if (await this.userRepository.findOne({ handle: user.handle })) {
      next(new ApiError('Invalid Input', 400, { handle: 'Handle already exists' }));
    } else {
      const createdUser: UserDTO = await this.userRepository.create(user);
      res.status(201).json(_.pick(createdUser, ['_id', 'handle', 'name']));
    }
  }
}
