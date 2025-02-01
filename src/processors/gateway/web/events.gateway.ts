import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import type {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';

import { BroadcastBaseGateway } from '../base.gateway';
import { BusinessEvents } from '~/constants/BusinessEvents.constant';
import { CacheService } from '~/processors/redis/cache.service';

const namespace = 'web';
@WebSocketGateway({ namespace })
export class WebEventsGateway
  extends BroadcastBaseGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly cacheService: CacheService) {
    super();
  }

  @WebSocketServer()
  private namespace: Namespace;

  async getcurrentClientCount() {
    const server = this.namespace.server;
    const sockets = await server.of(`/${namespace}`).adapter.sockets(new Set());
    return sockets.size;
  }

  async sendOnlineNumber() {
    return {
      online: await this.getcurrentClientCount(),
      timestamp: new Date().toISOString(),
    };
  }

  async handleConnection(socket: Socket) {
    this.broadcast(
      BusinessEvents.VISITOR_ONLINE,
      await this.sendOnlineNumber(),
    );
    super.handleConnect(socket);
  }

  async handleDisconnect(client: Socket) {
    super.handleDisconnect(client);
    this.broadcast(
      BusinessEvents.VISITOR_OFFLINE,
      await this.sendOnlineNumber(),
    );
  }

  override broadcast(event: BusinessEvents, data: any): void {
    const emitter = this.cacheService.emitter;

    emitter
      .of(`/${namespace}`)
      .emit('message', this.gatewayMessageFormat(event, data));
  }
}
