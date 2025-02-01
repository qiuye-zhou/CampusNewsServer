import { IsOptional, IsString } from 'class-validator';
import { modelOptions, prop } from '@typegoose/typegoose';

import { BaseModel } from '~/shared/model/base.model';

@modelOptions({
  options: { customName: 'ReadBooks' },
})
export class ReadBooksModel extends BaseModel {
  @prop({ required: true })
  @IsString()
  title: string;

  @prop()
  @IsString()
  @IsOptional()
  date: Date;

  @prop()
  @IsString()
  @IsOptional()
  author: string;
}
