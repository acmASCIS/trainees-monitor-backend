import { Document, Schema, Model, model } from 'mongoose';
import { CFContestDTO } from './CFContestDTO';

export type CFContestType = CFContestDTO & Document;

const contestSchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const CFContestModel: Model<CFContestType> = model<CFContestType>(
  'CF_Contests',
  contestSchema
);
