import { Injectable } from '@nestjs/common';

import { InjectModel } from '~/transformers/model.transformer';
import { ReadBooksModel } from './readbooks.model';

@Injectable()
export class ReadBooksService {
  constructor(
    @InjectModel(ReadBooksModel)
    private readonly readBooksModel: MongooseModel<ReadBooksModel>,
  ) {}

  public get model() {
    return this.readBooksModel;
  }
}
