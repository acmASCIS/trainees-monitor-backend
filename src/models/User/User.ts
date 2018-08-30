import { OnlineJudgesHandles, Role } from './UserDTO';

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
}
