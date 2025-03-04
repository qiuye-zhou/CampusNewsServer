import { IsNotEmpty, IsString } from 'class-validator';

export class SignOrIdDto {
  @IsString()
  @IsNotEmpty()
  query?: string;
}

export class BodyCategoryModel {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  description: string;
}
