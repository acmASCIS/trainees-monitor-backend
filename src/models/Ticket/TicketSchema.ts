import { TicketDTO } from './TicketDTO';
import { date } from 'joi';
import { Schema, Model, model, Document } from 'mongoose';
// import { UserDTO } from './UserDTO';

export type TicketType = TicketDTO & Document;

const ticketSchema = new Schema(
  {
    title: { type: String, required: true },
    from: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    create_at: {
      type: Date,
      default: Date.now(),
    },
    messages: {
      type: [String],
    },
  },
  { timestamps: true }
);

// userSchema.index({ handle: 'text', name: 'text', email: 'text' });

export const TicketModel: Model<TicketType> = model<TicketType>('Ticket', ticketSchema);
