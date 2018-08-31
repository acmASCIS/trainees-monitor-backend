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
    public readonly _id?: string | undefined
  ) {}

  public async hashPassword(): Promise<string> {
    return await hash(this.password);
  }

  public async validatePassword(plainPassword: string) {
    return await compare(plainPassword, this.password);
  }
}
