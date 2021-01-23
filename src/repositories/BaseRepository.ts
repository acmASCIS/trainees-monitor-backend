import { Model, Document } from 'mongoose';

import { IWrite } from './interfaces/IWrite';
import { IRead } from './interfaces/IRead';

export abstract class BaseRepository<TEntity, TModel extends Document>
  implements IRead<TEntity>, IWrite<TEntity> {
  constructor(protected _model: Model<TModel>) {}

  public async findAll(): Promise<TEntity[]> {
    const models = await this._model.find({});
    return models.map((model:TModel) => this.toEntity(model));
  }

  public async find(item: any): Promise<TEntity[]> {
    const models = await this._model.find(item);
    return models.map((model:TModel) => this.toEntity(model));
  }

  public async findById(id: string): Promise<TEntity | undefined> {
    const model = await this._model.findById(id);
    if (!model) {
      return undefined;
    }
    return this.toEntity(model);
  }

  public async create(item: TEntity): Promise<TEntity> {
    const model = await this._model.create(item);
    return this.toEntity(model);
  }

  public async update(id: string, item: TEntity): Promise<TEntity | undefined> {
    const model = await this._model.findByIdAndUpdate(id, item);
    if (!model) {
      return undefined;
    }
    return this.toEntity(model);
  }

  public async delete(id: string): Promise<void> {
    await this._model.findByIdAndRemove(id);
  }

  protected abstract toEntity(item: TModel): TEntity;
}
