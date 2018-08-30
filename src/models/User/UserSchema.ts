import { Schema, Model, model, Document } from 'mongoose';
import { UserDTO, Role } from './UserDTO';

type UserType = UserDTO & Document;

const userSchema = new Schema(
  {
    handle: String,
    name: String,
    email: String,
    password: String,
    role: Role,
    onlineJudgesHandles: {
      codeforces: String
    }
  },
  { timestamps: true }
);

export const UserModel: Model<UserType> = model<UserType>('User', userSchema);
