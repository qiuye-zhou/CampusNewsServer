import { Global, Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';

import { RedisConfigService } from './redis.config.service';
import { CacheService } from './cache.service';
import { SubPubService } from './subpub.service';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useClass: RedisConfigService,
      inject: [RedisConfigService],
    }),
  ],
  providers: [RedisConfigService, CacheService, SubPubService],
  exports: [CacheService, SubPubService],
})
export class RedisModule {}
