import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class UserOptionDto {
  @IsString()
  @IsOptional()
  name?: string;
}

export class UserDto extends UserOptionDto {
  @IsString()
  @IsNotEmpty({ message: '用户名？' })
  readonly username: string;

  @IsString()
  @IsNotEmpty({ message: '密码？' })
  readonly password: string;

  @IsString()
  @IsNotEmpty({ message: '权限？' })
  readonly grade: boolean;
}

export class UserModifyDto extends UserOptionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password: string;
}

export class LoginDto {
  @IsString({ message: '用户名？' })
  username: string;

  @IsString({ message: '密码？' })
  password: string;
}

export class UserUpdataDto extends UserOptionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password: string;
}
