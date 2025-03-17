import { modelOptions, prop } from '@typegoose/typegoose';

import { BaseModel } from '~/shared/model/base.model';

@modelOptions({
  options: { customName: 'analyze' },
})
export class AnalyzeModel extends BaseModel {
  @prop({ required: true })
  time: Date;

  @prop()
  Day: number;

  @prop()
  Hours: number;
}
