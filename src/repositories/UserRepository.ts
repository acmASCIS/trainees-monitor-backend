import { Model } from 'mongoose';

import { BaseRepository } from './BaseRepository';
import { UserModel, UserType } from './../models/User/UserSchema';
import { User } from '../models/User/User';

export interface IUserRepository extends BaseRepository<User, UserType> {
  findByEmail(email: string): Promise<User | undefined>;
  findByHandle(handle: string): Promise<User | undefined>;
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

  protected toEntity(item: UserType): User {
    const { handle, name, email, password, role, onlineJudgesHandles, _id } = item;
    return new User(handle, name, email, password, role, onlineJudgesHandles, _id);
  }
}
