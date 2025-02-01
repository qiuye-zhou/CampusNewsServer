import { SetMetadata } from '@nestjs/common';
import { CacheKey, CacheTTL } from '@nestjs/cache-manager';

import { HTTP_CACHE_DISABLE } from '~/constants/meta.constants';

interface CacheOption {
  ttl?: number;
  key?: string;
  disable?: boolean;
}

/**
 * @description 两种使用法
 * @example @HttpCache({ key: CACHE_KEY, ttl: 60 * 60 })
 * @example @HttpCache({ disable: true })
 */

export function HttpCache(option: CacheOption): MethodDecorator {
  const { disable, key, ttl = 60 } = option;

  return ($, $$, descriptor: PropertyDescriptor) => {
    if (disable) {
      SetMetadata(HTTP_CACHE_DISABLE, true)(descriptor.value);
      return descriptor;
    }
    if (key) {
      CacheKey(key)(descriptor.value);
    }
    if (typeof ttl === 'number' && !isNaN(ttl)) {
      CacheTTL(ttl)(descriptor.value);
    }
    return descriptor;
  };
}

HttpCache.disable = ($: any, $$: any, descriptor: any) => {
  SetMetadata(HTTP_CACHE_DISABLE, true)(descriptor.value);
};
