import { Controller, Get } from '@nestjs/common';

import { HttpCache } from '~/common/decorator/cache.decorator';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get('/check')
  @HttpCache({
    disable: true,
  })
  async check() {
    // TODO
    return 'OK';
  }
}
