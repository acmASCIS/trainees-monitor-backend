import { Model } from 'mongoose';
import _ from 'lodash';

import { BaseRepository } from './BaseRepository';
import { UserModel, UserType } from './../models/User/UserSchema';
import { User } from '../models/User/User';

export interface IUserRepository extends BaseRepository<User, UserType> {
  findByEmail(email: string): Promise<User | undefined>;
  findByHandle(handle: string): Promise<User | undefined>;
  findFollowing(id: string): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
}

export class UserRepository extends BaseRepository<User, UserType> implements IUserRepository {
  constructor(model: Model<UserType> = UserModel) {
    super(model);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const model = await this._model.find({ email: new RegExp(`^${email}$`, 'i') }).limit(1);

    if (!model.length) {
      return undefined;
    }
    return this.toEntity(model[0]);
  }

  public async findByHandle(handle: string): Promise<User | undefined> {
    const model = await this._model.find({ handle: new RegExp(`^${handle}$`, 'i') }).limit(1);

    if (!model.length) {
      return undefined;
    }
    return this.toEntity(model[0]);
  }

  public async findFollowing(id: string): Promise<User[]> {
    const model = await this._model.findById(id).populate('following');

    if (!model) {
      return [];
    }
    return model.following.map((user: any) => this.toEntity(user));
  }

  public async searchUsers(query: string): Promise<User[]> {
    const model = await this._model
      .aggregate()
      .match({ $text: { $search: query } })
      .sort({ score: { $meta: 'textScore' } });

    if (!model) {
      return [];
    }
    return model.map(user => this.toEntity(user));
  }

  protected toEntity(item: UserType): User {
    const { handle, name, email, password, role, onlineJudgesHandles, _id, following } = item;
    return new User(handle, name, email, password, role, onlineJudgesHandles, _id, following);
  }
}
