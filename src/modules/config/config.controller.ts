import { Body, Controller, Get, Param, Patch } from '@nestjs/common';

import { ConfigService } from './config.service';
import { Auth } from '~/common/decorator/auth.decorator';
import { ConfigKeyDto } from './config.dto';

@Controller('config')
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/getconfig')
  @Auth()
  async getconfig() {
    return this.configService.getConfig();
  }

  @Patch('/:key')
  @Auth()
  async updataconfig(
    @Param() params: ConfigKeyDto,
    @Body() body: Record<string, any>,
  ) {
    return this.configService.updata(params.key, body);
  }
}
