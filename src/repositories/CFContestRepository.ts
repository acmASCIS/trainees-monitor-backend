import { Model } from 'mongoose';

import { BaseRepository } from './BaseRepository';
import { CFContestType, CFContestModel } from '../models/CFContest/CFContestSchema';
import { CFContest } from '../models/CFContest/CFContest';

export interface ICFContestRepository extends BaseRepository<CFContest, CFContestType> {}

export class CFContestRepository extends BaseRepository<CFContest, CFContestType>
  implements ICFContestRepository {
  constructor(model: Model<CFContestType> = CFContestModel) {
    super(model);
  }

  protected toEntity(item: CFContestType): CFContest {
    return new CFContest(item._id, item.name);
  }
}
