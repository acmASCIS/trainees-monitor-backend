import jwt from 'jsonwebtoken';
import { OnlineJudgesHandles, Role } from './UserDTO';
import { hash, compare } from '../../utils/hash';

export class User {
  constructor(
    public handle: string,
    public name: string,
    public email: string,
    public password: string,
    public role: Role,
    public onlineJudgesHandles: OnlineJudgesHandles,
    public readonly _id?: string | undefined,
    public following: string[] = []
  ) {}

  public async hashPassword(): Promise<string> {
    return await hash(this.password);
  }

  public async validatePassword(plainPassword: string) {
    return await compare(plainPassword, this.password);
  }

  public generateAuthToken(): string {
    return jwt.sign(
      { _id: this._id, handle: this.handle, name: this.name, role: this.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRY }
    );
  }
}
