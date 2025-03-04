import { IsNotEmpty, IsString } from 'class-validator';
import { modelOptions, prop } from '@typegoose/typegoose';

import { BaseModel } from '~/shared/model/base.model';

@modelOptions({ options: { customName: 'Category' } })
export class CategoryModel extends BaseModel {
  @prop({ unique: true, trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @prop()
  @IsString()
  description: string;
}
