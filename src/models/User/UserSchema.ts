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
    isConfirmed: { type: Boolean, required: true, default: false },
    onlineJudgesHandles: {
      codeforces: { type: String, required: true },
    },
    following: {
      type: [Schema.Types.ObjectId],

      ref: 'User',
    },
  },
  { timestamps: true }
);

userSchema.index({ handle: 'text', name: 'text', email: 'text' });

export const UserModel: Model<UserType> = model<UserType>('User', userSchema);
