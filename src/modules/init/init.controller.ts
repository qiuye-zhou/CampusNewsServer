import { Controller, ForbiddenException, Get, UseGuards } from '@nestjs/common';

import { InitService } from './init.service';
import { ConfigService } from '../config/config.service';
import { InitGuard } from './init.guard';

@Controller('/init')
@UseGuards(InitGuard) // 完成后初始化，不再开放init接口
export class InitController {
  constructor(
    private readonly configs: ConfigService,

    private readonly initService: InitService,
  ) {}

  @Get('/')
  async isInit() {
    return {
      isInit: await this.initService.isInit(),
    };
  }

  @Get('/configs/default')
  async getDefaultConfig() {
    const { isInit } = await this.isInit();
    if (isInit) {
      throw new ForbiddenException('默认设置在完成注册之后不可见');
    }
    return this.configs.defaultConfig;
  }
}
