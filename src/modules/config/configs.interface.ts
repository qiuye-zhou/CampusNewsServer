/* eslint-disable @typescript-eslint/ban-types */
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import type {
  ClassConstructor,
  TypeHelpOptions,
  TypeOptions,
} from 'class-transformer';
import { JSONSchema } from 'class-validator-jsonschema';

import { AdminExtraDto, UrlDto } from './config.dto';

export const configDtoMapping = {} as Record<string, ClassConstructor<any>>;
const ConfigField =
  (typeFunction: (type?: TypeHelpOptions) => Function, options?: TypeOptions) =>
  (target: any, propertyName: string): void => {
    configDtoMapping[propertyName] = typeFunction() as ClassConstructor<any>;
    Type(typeFunction, options)(target, propertyName);
    ValidateNested()(target, propertyName);
  };

@JSONSchema({
  title: '设置',
})
export abstract class IConfig {
  @ConfigField(() => UrlDto)
  url: Required<UrlDto>;

  @ConfigField(() => AdminExtraDto)
  adminExtra: Required<AdminExtraDto>;
}

export type IConfigKeys = keyof IConfig;
