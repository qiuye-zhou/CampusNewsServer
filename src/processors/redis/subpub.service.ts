import { Injectable } from '@nestjs/common';

import { redisSubPub } from '~/utils/redis-subpub.util';

@Injectable()
export class SubPubService {
  public async public(event: string, data: any) {
    return redisSubPub.publish(event, data);
  }

  public async subscribe(event: string, callback: (data: any) => void) {
    return redisSubPub.subscribe(event, callback);
  }

  public async unsubscribe(event: string, callback: (data: any) => void) {
    return redisSubPub.unsubscribe(event, callback);
  }
}
