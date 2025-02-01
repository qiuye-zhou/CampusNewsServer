import { Injectable } from '@nestjs/common';

import { ProjectModel } from './project.model';
import { InjectModel } from '~/transformers/model.transformer';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(ProjectModel)
    private readonly projectModel: MongooseModel<ProjectModel>,
  ) {}

  public get model() {
    return this.projectModel;
  }
}
