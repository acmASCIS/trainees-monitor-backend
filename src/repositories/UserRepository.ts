import { BaseRepository } from './BaseRepository';
import { UserModel, UserType } from './../models/User/UserSchema';
import { UserDTO } from '../models/User/UserDTO';
import { Model } from 'mongoose';

export interface IUserRepository {
  create(user: UserDTO): Promise<UserDTO>;
  find(id: string): Promise<UserDTO>;
  findAll(): Promise<UserDTO[]>;
  update(user: UserDTO): Promise<UserDTO>;
}

export class UserRepository extends BaseRepository<UserType> implements IUserRepository {
  constructor(model: Model<UserType> = UserModel) {
    super(model);
  }

  public async create(user: UserDTO): Promise<UserDTO> {
    return await this._model.create(user);
  }

  public find(id: string): Promise<UserDTO> {
    throw new Error('Method not implemented.');
  }

  public findAll(): Promise<UserDTO[]> {
    throw new Error('Method not implemented.');
  }

  public update(user: UserDTO): Promise<UserDTO> {
    throw new Error('Method not implemented.');
  }
}
