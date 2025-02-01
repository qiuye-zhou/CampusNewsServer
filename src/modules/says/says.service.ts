import { Injectable } from '@nestjs/common';

import { InjectModel } from '~/transformers/model.transformer';
import { SaysModel } from './says.model';

@Injectable()
export class SaysService {
  constructor(
    @InjectModel(SaysModel) private readonly sayModel: MongooseModel<SaysModel>,
  ) {}

  public get model() {
    return this.sayModel;
  }
}
