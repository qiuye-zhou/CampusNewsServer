import { Global, Module } from '@nestjs/common';

import { WebEventsGateway } from './web/events.gateway';

@Global()
@Module({
  providers: [WebEventsGateway],
  exports: [WebEventsGateway],
})
export class GatewayModule {}
