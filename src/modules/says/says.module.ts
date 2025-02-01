import { Module } from '@nestjs/common';

import { SaysController } from './says.controller';
import { SaysService } from './says.service';

@Module({
  controllers: [SaysController],
  providers: [SaysService],
  exports: [SaysService],
})
export class SaysModule {}
