import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { CategoryTypeEnum } from './category.model';

export class SignOrIdDto {
  @IsString()
  @IsNotEmpty()
  query?: string;
}

export class QueryTagAndCategoryDto {
  @IsOptional()
  @Transform(({ value: val }) => {
    if (val === '1' || val === 'true') {
      return true;
    } else {
      return false;
    }
  })
  istag?: boolean | string;
}

export class BodyCategoryModel {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Transform(({ value: val }) => {
    if (val === '1' || val === 'true') {
      return CategoryTypeEnum.Tag;
    } else {
      return CategoryTypeEnum.Category;
    }
  })
  @IsEnum(CategoryTypeEnum)
  @IsOptional()
  type?: CategoryTypeEnum;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  sign!: string;
}
