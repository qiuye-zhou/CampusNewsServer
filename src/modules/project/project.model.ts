import { modelOptions, prop } from '@typegoose/typegoose';
import { IsOptional, IsString, IsUrl, isURL } from 'class-validator';

import { BaseModel } from '~/shared/model/base.model';

const validateURL = {
  message: '请更正为正确的网址',
  validator: (val: string): boolean => {
    if (!val) {
      return true;
    }
    if (!isURL(val, { require_protocol: true })) {
      return false;
    }
    return true;
  },
};

@modelOptions({
  options: { customName: 'Project' },
})
export class ProjectModel extends BaseModel {
  @prop({ required: true, unique: true })
  @IsString()
  name: string;

  @prop({ required: true, validate: validateURL })
  @IsUrl({ require_protocol: true }, { message: '请更正为正确的网址' })
  projectUrl?: string;

  @prop({ required: true })
  @IsString()
  description: string;

  @prop({
    type: String,
    validate: validateURL,
  })
  @IsOptional()
  image?: string;
}
