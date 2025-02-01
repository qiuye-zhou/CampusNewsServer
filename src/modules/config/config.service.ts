import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { cloneDeep, mergeWith } from 'lodash';
import { ReturnModelType } from '@typegoose/typegoose';

import { InjectModel } from '~/transformers/model.transformer';
import { ConfigOptionModel } from './config.model';
import { generateDefaultConfig } from './configs.default';
import { IConfig, configDtoMapping } from './configs.interface';
import { CacheService } from '~/processors/redis/cache.service';
import { getRedisKey } from '~/utils/redis.util';
import { RedisKeys } from '~/constants/cache.constants';
import { isDev } from '~/global/env.global';

const configsKeySet = new Set(Object.keys(configDtoMapping));

@Injectable()
export class ConfigService {
  configInitd: boolean = false;
  constructor(
    @InjectModel(ConfigOptionModel)
    private readonly configoptionModel: ReturnModelType<
      typeof ConfigOptionModel
    >,
    private readonly redis: CacheService,
  ) {
    this.configInit().then(() => {
      Logger.log('Config 已经加载完毕！', 'config');
    });
  }

  async configInit() {
    const configs = await this.configoptionModel.find().lean();
    const defaultConfig = generateDefaultConfig();
    configs.forEach((field) => {
      const name = field.name as keyof IConfig;

      if (!configsKeySet.has(name)) {
        return;
      }
      if (isDev && name === 'url') {
        return;
      }
      const value = field.value;
      defaultConfig[name] = { ...defaultConfig[name], ...value };
    });

    await this.setConfig(defaultConfig);
    this.configInitd = true;
  }

  public get defaultConfig() {
    return generateDefaultConfig();
  }

  private async setConfig(config: IConfig) {
    const redis = this.redis.getClient();
    await redis.set(getRedisKey(RedisKeys.ConfigCache), JSON.stringify(config));
  }

  public async getConfig(errorRetryCount = 3): Promise<Readonly<IConfig>> {
    const redis = this.redis.getClient();
    const configCache = await redis.get(getRedisKey(RedisKeys.ConfigCache));

    if (configCache) {
      try {
        const instanceConfigsValue = plainToInstance<IConfig, any>(
          IConfig as any,
          JSON.parse(configCache) as any,
        ) as any as IConfig;

        return instanceConfigsValue;
      } catch (error) {
        await this.configInit();
        if (errorRetryCount > 0) {
          return await this.getConfig(--errorRetryCount);
        }
        Logger.error('获取配置失败', 'config');
        throw error;
      }
    } else {
      await this.configInit();

      return await this.getConfig();
    }
  }

  async updata<T extends keyof IConfig>(
    key: T,
    data: Partial<IConfig[T]>,
  ): Promise<IConfig[T]> {
    const config = await this.getConfig();
    const updatedConfigRow = await this.configoptionModel
      .findOneAndUpdate(
        { name: key as string },
        {
          value: mergeWith(cloneDeep(config[key]), data, (old, newer) => {
            // 数组不合并
            if (Array.isArray(old)) {
              return newer;
            }
            // 对象合并
            if (typeof old === 'object' && typeof newer === 'object') {
              return { ...old, ...newer };
            }
          }),
        },
      )
      .lean();
    const newData = updatedConfigRow.value;
    const mergedFullConfig = Object.assign({}, config, { [key]: newData });

    await this.setConfig(mergedFullConfig);

    return newData;
  }
}
