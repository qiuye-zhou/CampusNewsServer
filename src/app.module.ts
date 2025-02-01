import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AppController } from './app.controller';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { DatebaseModule } from './processors/database/database.module';
import { LoggerModule } from './processors/logger/logger.module';
import { HelperModule } from './processors/helper/helper.module';
import { RedisModule } from './processors/redis/redis.module';
import { GatewayModule } from './processors/gateway/gateway.module';
import { AuthModule } from './modules/auth/auth.module';
import { HttpCacheInterceptor } from './common/interceptors/cache.interceptor';
import { UserModule } from './modules/user/user.module';
import { LinkModule } from './modules/link/link.module';
import { ConfigModule } from './modules/config/config.module';
import { SaysModule } from './modules/says/says.module';
import { ReadBooksModule } from './modules/readbooks/readbooks.module';
import { ProjectModule } from './modules/project/project.module';
import { CategoryModule } from './modules/category/category.module';
import { BackupModule } from './modules/backup/backup.module';
import { InitModule } from './modules/init/init.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    DatebaseModule,
    LoggerModule,
    RedisModule,
    GatewayModule,

    ConfigModule,
    UserModule,
    SaysModule,
    ReadBooksModule,
    ProjectModule,
    CategoryModule,
    LinkModule,

    BackupModule,
    InitModule,
    HealthModule,
    AuthModule,
    HelperModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
