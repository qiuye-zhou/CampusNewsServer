/**
 * HttpCache interceptor.
 * @file 缓存拦截器
 * @class HttpCacheInterceptor
 */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { of, tap } from 'rxjs';

import { REDIS } from '~/app.config';
import { API_CACHE_PREFIX } from '~/constants/cache.constants';
import { HTTP_CACHE_DISABLE } from '~/constants/meta.constants';
import { isTest } from '~/global/env.global';
import { LoggerService } from '~/processors/logger/logger.service';
import { CacheService } from '~/processors/redis/cache.service';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(
    private readonly cacheManager: CacheService,
    private readonly logger: LoggerService,
    private readonly reflector: Reflector,
  ) {}

  async intercept(context: ExecutionContext, next: CallHandler) {
    const handle$ = next.handle();
    // 如果想禁用缓存服务，则直接返回handle$
    if (REDIS.disableApiCache && !isTest) {
      return handle$;
    }

    const request = context.switchToHttp().getRequest();
    // 只有GET请求才会缓存
    if (request.method.toLowerCase() !== 'get') {
      return handle$;
    }

    const isDisable = this.reflector.get(
      HTTP_CACHE_DISABLE,
      context.getHandler(),
    );
    if (isDisable) {
      return handle$;
    }

    const key = `${API_CACHE_PREFIX}${request.url}`;
    const ttl = REDIS.httpCacheTTL;

    try {
      const value = await this.cacheManager.get(key);

      if (value) {
        this.logger.info('cache', `hit cache:${key}`, value);
      }
      return value
        ? of(value)
        : handle$.pipe(
            tap(
              (response) =>
                response && this.cacheManager.set(key, response, ttl * 1000),
            ),
          );
    } catch (error) {
      this.logger.info('cache', `cache error`, error);

      return handle$;
    }
  }
}
