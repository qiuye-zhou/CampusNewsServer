/**
 * @class CacheService
 * @classdesc 承载缓存服务
 * @example CacheService.get(CacheKey).then()
 * @example CacheService.set(CacheKey).then()
 */
import { Inject, Injectable, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Emitter } from '@socket.io/redis-emitter';
import type { Redis } from 'ioredis';
import { Cache } from 'cache-manager';

import { RedisIoAdapterKey } from '~/constants/socket.adapter';

// Cache 客户端管理器
@Injectable()
export class CacheService {
  private cache!: Cache;

  constructor(@Inject(CACHE_MANAGER) cache: Cache) {
    this.cache = cache;
    this.redisClient.on('ready', () => {
      Logger.log('redis 已就绪！', 'cache');
    });
  }

  private get redisClient(): Redis {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return this.cache.store.client;
  }

  public get<T>(key: string): Promise<T | undefined> {
    return this.cache.get(key);
  }

  public set(key: string, value: any, milliseconds: number) {
    return this.cache.set(key, value, milliseconds);
  }

  public getClient() {
    return this.redisClient;
  }

  public async clearAllRedisKey() {
    const redis = this.getClient();
    const keys = await redis.keys(`*`);

    await Promise.all(keys.map((key) => redis.del(key)));
    return;
  }

  private _emitter: Emitter;

  public get emitter(): Emitter {
    if (this._emitter) {
      return this._emitter;
    }
    this._emitter = new Emitter(this.redisClient, {
      key: RedisIoAdapterKey,
    });
    return this._emitter;
  }
}
