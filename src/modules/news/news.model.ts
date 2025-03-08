import { IsString } from 'class-validator';
import { modelOptions, prop } from '@typegoose/typegoose';

import { BaseModel } from '~/shared/model/base.model';
import { NewsState } from './news.state';

@modelOptions({
  options: { customName: 'News' },
})
export class NewsModel extends BaseModel {
  @prop({ required: true })
  @IsString()
  title: string;

  @prop({ required: true })
  @IsString()
  typename!: string;

  @prop({ required: true })
  editid: string;

  @prop()
  @IsString()
  detail: string;

  @prop({ default: NewsState[0] })
  state: string;

  @prop({ default: 0 })
  browsenum: number;
}
