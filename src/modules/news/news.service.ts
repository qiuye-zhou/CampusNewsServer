import { Injectable } from '@nestjs/common';

import { InjectModel } from '~/transformers/model.transformer';
import { NewsModel } from './news.model';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(NewsModel) private readonly newModel: MongooseModel<NewsModel>,
  ) {}

  public get model() {
    return this.newModel;
  }
}
