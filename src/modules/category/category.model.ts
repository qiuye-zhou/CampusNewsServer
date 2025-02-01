import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { index, modelOptions, prop, DocumentType } from '@typegoose/typegoose';

import { BaseModel } from '~/shared/model/base.model';

export type CategoryDocument = DocumentType<CategoryModel>;

export enum CategoryTypeEnum {
  Category,
  Tag,
}

@index({ sign: -1 })
@modelOptions({ options: { customName: 'Category' } })
export class CategoryModel extends BaseModel {
  @prop({ unique: true, trim: true, required: true })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @prop({ default: CategoryTypeEnum.Category })
  @IsEnum(CategoryTypeEnum)
  @IsOptional()
  type?: CategoryTypeEnum;

  @prop({ unique: true, required: true })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sign!: string;
}
