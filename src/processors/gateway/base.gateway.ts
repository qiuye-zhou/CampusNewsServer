import type { Socket } from 'socket.io';

import { BusinessEvents } from '~/constants/BusinessEvents.constant';

export abstract class BaseGateway {
  public gatewayMessageFormat(
    type: BusinessEvents,
    message: any,
    code?: number,
  ) {
    return {
      type,
      data: message,
      code,
    };
  }

  handleConnect(client: Socket) {
    client.send(
      this.gatewayMessageFormat(
        BusinessEvents.GATEWAY_CONNECT,
        'WebSocket 已连接',
      ),
    );
  }

  handleDisconnect(client: Socket) {
    client.send(
      this.gatewayMessageFormat(
        BusinessEvents.GATEWAY_CONNECT,
        'WebSocket 断开',
      ),
    );
  }
}

export abstract class BroadcastBaseGateway extends BaseGateway {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  broadcast(event: BusinessEvents, data: any) {}
}
