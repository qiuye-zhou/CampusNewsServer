import { Injectable } from '@nestjs/common';
import { InjectModel } from '~/transformers/model.transformer';
import { AnalyzeModel } from './analyze.model';

@Injectable()
export class AnalyzeService {
  constructor(
    @InjectModel(AnalyzeModel)
    private readonly analyzeModel: MongooseModel<AnalyzeModel>,
  ) {}

  public get model() {
    return this.analyzeModel;
  }
}
