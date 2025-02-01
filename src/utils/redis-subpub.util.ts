import { Logger } from '@nestjs/common';
import type { Redis, RedisOptions } from 'ioredis';
import IORedis from 'ioredis';

import { REDIS } from '~/app.config';

class RedisSubPub {
  public pubClient: Redis;
  public subClient: Redis;
  constructor(private channelPrefix: string = 'qy-channel#') {
    this.init();
  }

  public init() {
    const redisOptions: RedisOptions = {
      host: REDIS.host,
      port: REDIS.port,
    };

    if (REDIS.password) {
      redisOptions.password = REDIS.password;
    }

    const pubClient = new IORedis(redisOptions);
    const subClient = pubClient.duplicate();
    this.pubClient = pubClient;
    this.subClient = subClient;
  }

  public async publish(event: string, data: any) {
    const channel = this.channelPrefix + event;
    const _data = JSON.stringify(data);
    if (event !== 'log') {
      Logger.debug(`发布事件：${channel} <- ${_data}`, RedisSubPub.name);
    }
    await this.pubClient.publish(channel, _data);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private calltc = new WeakMap<Function, Callback>();

  public async subscribe(event: string, callback: (data: any) => void) {
    const myChannel = this.channelPrefix + event;
    this.subClient.subscribe(myChannel);

    const callb = (channel: string, message: string) => {
      if (channel === myChannel) {
        if (event !== 'log') {
          Logger.debug(`接收事件：${channel} -> ${message}`, RedisSubPub.name);
        }
        callback(JSON.parse(message));
      }
    };

    this.calltc.set(callback, callb);
    this.subClient.on('message', callb);
  }

  public async unsubscribe(event: string, callback: (data: any) => void) {
    const channel = this.channelPrefix + event;
    this.subClient.unsubscribe(channel);
    const callb = this.calltc.get(callback);
    if (callb) {
      this.subClient.off('message', callb);

      this.calltc.delete(callback);
    }
  }
}

type Callback = (channel: string, message: string) => void;

export const redisSubPub = new RedisSubPub();

export type { RedisSubPub };
