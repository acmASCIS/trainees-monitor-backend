import { Schema, Model, model, Document } from 'mongoose';
import { UserDTO } from './UserDTO';

export type UserType = UserDTO & Document;

const userSchema = new Schema(
  {
    handle: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, required: true },
    onlineJudgesHandles: {
      codeforces: { type: String, required: true }
    }
  },
  { timestamps: true }
);

userSchema.index({ handle: 'text', email: 'text' });

export const UserModel: Model<UserType> = model<UserType>('User', userSchema);
