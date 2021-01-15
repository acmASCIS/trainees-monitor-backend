import { Model } from 'mongoose';
import _ from 'lodash';

import { BaseRepository } from './BaseRepository';
import { TicketModel, TicketType } from './../models/Ticket/TicketSchema';
import { Ticket } from '../models/Ticket/Ticket';

export interface ITicketRepository extends BaseRepository<Ticket, TicketType> {
  //   addMessage(id: string): Promise<Boolean | undefined>;
  //   findByEmail(email: string): Promise<User | udefined>;
  //   findByHandle(handle: string): Promise<User | undefined>;
  //   findFollowing(id: string): Promise<User[]>;
  //   searchUsers(query: string): Promise<User[]>;
}

export class TicketRepository
  extends BaseRepository<Ticket, TicketType>
  implements ITicketRepository {
  constructor(model: Model<TicketType> = TicketModel) {
    super(model);
  }

  public async findAll(): Promise<Ticket[]> {
    const ticketModel = await this._model.find({});
    if (!ticketModel.length) return [];
    return ticketModel;
  }
  public async find(item: any): Promise<Ticket[]> {
    const ticketModel: Ticket[] = await this._model.find({ item });
    if (!ticketModel.length) return [];
    return ticketModel;
  }
  public async findById(id: string): Promise<Ticket | undefined> {
    const ticketModel: Ticket = await this._model.findById(id);
    if (!ticketModel) return undefined;
    return ticketModel;
  }
  public async create(item: Ticket): Promise<Ticket> {
    const ticketModel = await this._model.create(item);
    return ticketModel;
  }
  public async update(id: string, item: Ticket): Promise<Ticket | undefined> {
    const ticketModel = await this._model.findByIdAndUpdate(id, item);
    if (!ticketModel) return undefined;
    return ticketModel;
  }
  public async delete(id: string): Promise<void> {
    return await this._model.deleteOne(id);
  }
  protected toEntity(item: TicketType): Ticket {
    throw new Error('Method not implemented.');
  }
}
