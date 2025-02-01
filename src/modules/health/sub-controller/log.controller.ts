import { Controller, Get } from '@nestjs/common';

import { Auth } from '~/common/decorator/auth.decorator';

@Controller('health/log')
@Auth()
export class HealthLogController {
  constructor() {}

  @Get('/')
  async getlog() {
    // TODO
    return 'TODO';
  }
}
