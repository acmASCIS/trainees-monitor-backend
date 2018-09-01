import { Application, Request, Response, NextFunction } from 'express';
import _ from 'lodash';

import { IController } from './IController';
import { User } from '../models/User/User';
import { UserDTO } from './../models/User/UserDTO';
import { IUserRepository, UserRepository } from './../repositories/UserRepository';
import { validateRegisterInput, validateLoginInput } from '../utils/validation';
import { ApiError } from './../utils/ApiError';

export default class AccountsController implements IController {
  private userRepository: IUserRepository = new UserRepository();

  public register(app: Application): void {
    app.post('/register', this.registerUser.bind(this));
    app.post('/login', this.login.bind(this));
  }

  /**
   * @route POST /register
   * @desc Creates new user.
   * @access Public
   */
  private async registerUser(req: Request, res: Response) {
    // validate register input
    const { errors } = validateRegisterInput(req.body);
    if (errors) {
      throw new ApiError('Invalid Input', 400, errors);
    }

    // creating new user and hashing the password
    const { handle, name, email, password, role, codeforcesHandle } = req.body;
    const user: User = new User(handle, name, email, password, role, {
      codeforces: codeforcesHandle
    });
    user.password = await user.hashPassword();

    // Checking duplicate user email and handle
    // FIXME: use regex to find
    if (await this.userRepository.findOne({ email: user.email })) {
      throw new ApiError('Invalid Input', 400, { email: 'Email already exists' });
    } else if (await this.userRepository.findOne({ handle: user.handle })) {
      throw new ApiError('Invalid Input', 400, { handle: 'Handle already exists' });
    } else {
      await this.userRepository.create(user);
      res.status(201).json({ success: true });
    }
  }

  /**
   * @route POST /login
   * @desc Sign in using email and password.
   * @access Public
   */
  private async login(req: Request, res: Response) {
    // validate login input
    const { errors } = validateLoginInput(req.body);
    if (errors) {
      throw new ApiError('Invalid email or password', 404);
    }

    // check if user exists
    // TODO: abstract the user search logic in UserService
    const foundUser: UserDTO | null = await this.userRepository.findOne({
      email: new RegExp(`^${req.body.email}$`, 'i')
    });
    if (!foundUser) {
      throw new ApiError('Invalid email or password', 404);
    }

    // validate password
    const { handle, name, email, password, role, onlineJudgesHandles, _id } = foundUser;
    const user: User = new User(handle, name, email, password, role, onlineJudgesHandles, _id);
    if ((await user.validatePassword(req.body.password)) === false) {
      throw new ApiError('Invalid email or password', 404);
    }

    // return jwt token
    const token = user.generateAuthToken();
    res.setHeader('Authorization', token);
    res.json({ success: true });
  }
}
