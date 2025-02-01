import { Controller, Get } from '@nestjs/common';

import { Auth } from '~/common/decorator/auth.decorator';

@Controller('health/corn')
@Auth()
export class HealthCornController {
  constructor() {}

  @Get('/')
  async getAllCorn() {
    // TODO
    return 'TODO';
  }
}
