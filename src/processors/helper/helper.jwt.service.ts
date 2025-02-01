import { Injectable, Logger } from '@nestjs/common';
import { verify, sign } from 'jsonwebtoken';

import { SECURITY } from '~/app.config';
import { CacheService } from '../redis/cache.service';
import { RedisKeys } from '~/constants/cache.constants';
import { md5 } from '~/utils/tool.util';
import { getRedisKey } from '~/utils/redis.util';
import { isDev } from '~/global/env.global';

@Injectable()
export class JWTService {
  private secret = SECURITY.jwtSecret;
  public static readonly expiresDay = SECURITY.jwtExpire;

  constructor(private readonly cacheService: CacheService) {}

  async storeTokenInRedis(token: string, info?: any) {
    const redis = this.cacheService.getClient();
    await redis.hset(
      getRedisKey(RedisKeys.JWTStore),
      md5(token),
      JSON.stringify({
        date: new Date().toISOString(),
        ...info,
      } as StoreJWTPayload),
    );
  }

  async revokeToken(token: string) {
    const redis = this.cacheService.getClient();
    const key = getRedisKey(RedisKeys.JWTStore);
    await redis.hdel(key, md5(token));
  }

  // 删除除当前登入的token所有的有效token
  async revokeAll(excludeTokens?: string[]) {
    if (Array.isArray(excludeTokens) && excludeTokens.length > 0) {
      const redis = this.cacheService.getClient();
      const key = getRedisKey(RedisKeys.JWTStore);
      const allMd5Tokens = await redis.hkeys(key);

      const excludedMd5Tokens = excludeTokens.map((token) => md5(token));
      for (const md5Token of allMd5Tokens) {
        if (!excludedMd5Tokens.includes(md5Token)) {
          await redis.hdel(key, md5Token);
        }
      }
    } else {
      const redis = this.cacheService.getClient();
      const key = getRedisKey(RedisKeys.JWTStore);
      await redis.del(key);
    }
  }

  async getAllSession(currToken?: string) {
    const redis = this.cacheService.getClient();
    const res = await redis.hgetall(getRedisKey(RedisKeys.JWTStore));
    const hashedCur = currToken && md5(currToken);
    return Object.entries(res).map(([key, val]) => {
      const data = { ...JSON.parse(val) };
      data.date = new Date(data.date).toString();
      return {
        ...data,
        id: key,
        current: hashedCur === key,
      };
    });
  }

  // 判断token是否在redis中
  async isTokenInRedis(token: string) {
    const redis = this.cacheService.getClient();
    const key = getRedisKey(RedisKeys.JWTStore);
    const has = await redis.hexists(key, md5(token));
    return !!has;
  }

  async sign(id: string, info?: { ip: string; ua: string }) {
    const token = sign({ id }, this.secret, {
      expiresIn: `${JWTService.expiresDay}d`,
    });
    await this.storeTokenInRedis(token, info || {});
    return token;
  }

  async verify(token: string) {
    try {
      verify(token, this.secret);
      return await this.isTokenInRedis(token);
    } catch (er) {
      if (isDev) Logger.debug('verify JWT error:', er.message, token);
      return false;
    }
  }
}

export interface StoreJWTPayload {
  date: string;
  [k: string]: any;
}
