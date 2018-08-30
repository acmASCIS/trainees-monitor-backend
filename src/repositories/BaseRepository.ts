import { Model, Document } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  constructor(protected _model: Model<T>) {}
}
