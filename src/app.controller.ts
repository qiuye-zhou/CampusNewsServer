import * as dayjs from 'dayjs';
import { Controller, Get, OnModuleInit } from '@nestjs/common';

import { HttpCache } from './common/decorator/cache.decorator';

@Controller()
export class AppController implements OnModuleInit {
  private UpStartAt: number;
  onModuleInit() {
    this.UpStartAt = Date.now();
  }

  @Get(['/', '/info'])
  ping(): 'normal' {
    return 'normal';
  }

  @Get('/uptime')
  @HttpCache.disable
  async getUpTime() {
    const time = Date.now() - this.UpStartAt;
    return {
      timestamp: time,
      time: dayjs.duration(time).locale('zh-cn').humanize(),
    };
  }
}
