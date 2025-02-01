import type { RedisKeys } from '~/constants/cache.constants';

const prefix = 'qy';

export const getRedisKey = <T extends string = RedisKeys | '*'>(
  key: T,
  ...concatKeys: string[]
): `qy:${T}${string | ''}` => {
  return `${prefix}:${key}${
    concatKeys && concatKeys.length > 0 ? `:${concatKeys.join('_')}` : ''
  }`;
};
