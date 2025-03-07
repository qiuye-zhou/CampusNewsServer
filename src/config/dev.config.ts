//**development 环境配置**/

export const devPORT_CONFIG = 2666;

export const devMONGO_DB = {
  dbName: 'newsbase',
  host: '127.0.0.1',
  port: 27017,
  user: '',
  password: '',
  get uri() {
    const userPassword =
      this.user && this.password ? `${this.user}:${this.password}@` : '';
    return `mongodb://${userPassword}${this.host}:${this.port}/${this.dbName}`;
  },
};

export const devREDIS = {
  host: 'localhost',
  port: 6379,
  password: null,
  ttl: null,
  httpCacheTTL: 15,
  max: 120,
  disableApiCache: true,
};

export const devJWTConfig = {
  jwt_secret: 'jwtsecretdev',
  jwt_expire: 14,
};

// 前端请求 源地址允许访问控制 CORS
export const devURL_CORS_Arr = [
  'http://localhost:3030',
  'http://localhost:3040',
];
