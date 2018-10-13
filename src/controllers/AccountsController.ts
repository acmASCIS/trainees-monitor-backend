import { Application, Request, Response } from 'express';
import _ from 'lodash';

import { IController } from './IController';
import { User } from '../models/User/User';
import { IUserRepository, UserRepository } from './../repositories/UserRepository';
import { validateRegisterInput, validateLoginInput } from '../utils/validation';
import { ApiError } from './../utils/ApiError';
import { CodeforcesService } from '../services/onlinejudges/CodeforcesService';
import { Role } from '../models/User/UserDTO';
import { authorize } from '../utils/middleware/authHandler';

export default class AccountsController implements IController {
  private userRepository: IUserRepository = new UserRepository();
  private cfService: CodeforcesService = new CodeforcesService(
    process.env.CF_KEY as string,
    process.env.CF_SECRET as string
  );

  public register(app: Application): void {
    app.post('/register', this.registerUser.bind(this));
    app.post('/login', this.login.bind(this));
    app.post('/confirm', authorize(Role.Admin), this.confirmUser.bind(this));
    app.get('/unconfirmed', authorize(Role.Admin), this.getUnconfirmedUsers.bind(this));
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

    const { handle, name, email, password, role, codeforcesHandle } = req.body;
    // validate codeforces handle;
    const cfUser = await this.cfService.getUser(codeforcesHandle);
    if (!cfUser) {
      throw new ApiError('Invalid Input', 400, {
        codeforcesHandle: 'Handle does not exist'
      });
    }

    // Trainee is confirmed by default
    const isConfirmed: boolean = role === Role.Trainee ? true : false;

    // creating new user and hashing the password
    const user: User = new User(
      handle,
      name,
      email,
      password,
      role,
      { codeforces: codeforcesHandle },
      isConfirmed
    );
    user.password = await user.hashPassword();

    // Checking duplicate user email and handle
    if (await this.userRepository.findByEmail(email)) {
      throw new ApiError('Invalid Input', 400, {
        email: 'Email already exists'
      });
    } else if (await this.userRepository.findByHandle(handle)) {
      throw new ApiError('Invalid Input', 400, {
        handle: 'Handle already exists'
      });
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
    const user: User | undefined = await this.userRepository.findByEmail(req.body.email);
    if (!user) {
      throw new ApiError('Invalid email or password', 400);
    }

    // validate password
    if ((await user.validatePassword(req.body.password)) === false) {
      throw new ApiError('Invalid email or password', 400);
    }

    // Checking confirmation
    if (user.isConfirmed === false) {
      throw new ApiError('Please wait for confirmation', 400);
    }

    // return jwt token
    const token = user.generateAuthToken();
    res.setHeader('Authorization', token);
    res.json({ success: true });
  }

  /**
   * @route POST /confirm?handle={handle}
   * @desc Confirms the account.
   * @access Private
   */
  private async confirmUser(req: Request, res: Response) {
    const handle = req.query.handle;
    const user = await this.userRepository.findByHandle(handle);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    user.isConfirmed = true;
    await this.userRepository.update(user._id as string, user);
    res.json({ success: true });
  }

  /**
   * @route GET /unconfirmed
   * @desc Gets a list of unconfirmed users.
   * @access Private
   */
  private async getUnconfirmedUsers(req: Request, res: Response) {
    const unconfirmedUsers = await this.userRepository.find({ isConfirmed: false });
    const filteredUsers = unconfirmedUsers.map(
      (user: any) =>
        (user = _.pick(user, ['handle', 'name', 'email', 'role', 'onlineJudgesHandles']))
    );

    res.json(filteredUsers);
  }
}
