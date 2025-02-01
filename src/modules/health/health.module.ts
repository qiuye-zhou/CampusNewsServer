import { Module } from '@nestjs/common';

import { HealthController } from './health.controller';
import { HealthLogController } from './sub-controller/log.controller';
import { HealthCornController } from './sub-controller/corn.controller';

@Module({
  controllers: [HealthController, HealthLogController, HealthCornController],
})
export class HealthModule {}
