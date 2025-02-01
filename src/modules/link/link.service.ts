import { Injectable } from '@nestjs/common';

import { InjectModel } from '~/transformers/model.transformer';
import { LinkModel } from './link.model';

@Injectable()
export class LinkService {
  constructor(
    @InjectModel(LinkModel)
    private readonly linkModel: MongooseModel<LinkModel>,
  ) {}
}
