import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { JSONSchema } from 'class-validator-jsonschema';

import { IsAllowedUrl } from '~/decorators/isAllowedUrl';
import {
  JSONSchemaHalfGirdPlainField,
  JSONSchemaPlainField,
} from './configs.jsonschema.decorator';
import { IConfig } from './configs.interface';

@JSONSchema({ title: '网站设置' })
export class UrlDto {
  @IsAllowedUrl()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('前端地址')
  webUrl: string;

  @IsAllowedUrl()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('管理后台地址')
  adminUrl: string;

  @IsAllowedUrl()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('API 地址')
  serverUrl: string;

  @IsAllowedUrl()
  @IsOptional()
  @JSONSchemaHalfGirdPlainField('Gateway 地址')
  wsUrl: string;
}

@JSONSchema({ title: '后台附加设置' })
export class AdminExtraDto {
  @IsString()
  @IsOptional()
  @JSONSchemaPlainField('登录页面背景')
  backgroundUrl?: string;
}

export class ConfigKeyDto {
  @IsString()
  @IsNotEmpty()
  key: keyof IConfig;
}
