import {
  envMONGO_DB,
  isDev,
  envPORT,
  JWTConfig,
  envREDIS,
  envURL_CORS_Arr,
} from './global/env.global';

export const PORT = envPORT || 3000;

export const MONGO_DB = envMONGO_DB;

export const REDIS = { ...envREDIS, disableApiCache: isDev };

export const CROSS_LIST = envURL_CORS_Arr;

export const SECURITY = {
  jwtSecret: JWTConfig.jwt_secret,
  jwtExpire: +JWTConfig.jwt_expire || 14,
};
