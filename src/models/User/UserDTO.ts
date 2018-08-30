export enum Role {
  Trainee,
  Mentor
}

enum OnlineJudge {
  codeforces = 'codeforces'
}
export type OnlineJudgesHandles = { [judge in OnlineJudge]: string };

export interface UserDTO {
  _id?: string;
  handle: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  onlineJudgesHandles: OnlineJudgesHandles;
}
