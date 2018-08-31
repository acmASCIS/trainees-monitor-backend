import { Schema, Model, model, Document } from 'mongoose';
import { UserDTO } from './UserDTO';

export type UserType = UserDTO & Document;

const userSchema = new Schema(
  {
    handle: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    onlineJudgesHandles: {
      codeforces: { type: String, required: true }
    }
  },
  { timestamps: true }
);

export const UserModel: Model<UserType> = model<UserType>('User', userSchema);
