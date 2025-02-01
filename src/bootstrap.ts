import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';

import { PORT, CROSS_LIST } from './app.config';
import { AppModule } from './app.module';
import { SpiderGuard } from './common/guard/spider.guard';
import { RedisIoAdapter } from './constants/socket.adapter';
import { ExtendedValidationPipe } from './common/pipes/validation.pipe';

const Oring: false | string[] = Array.isArray(CROSS_LIST) ? CROSS_LIST : false;

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: Oring,
    credentials: true,
  });
  app.useGlobalPipes(ExtendedValidationPipe.shared);
  app.useGlobalGuards(new SpiderGuard());
  app.useWebSocketAdapter(new RedisIoAdapter(app));

  await app.listen(PORT, async () => {
    const url = await app.getUrl();
    Logger.log(`ENV: ${process.env.NODE_ENV}`, 'bootstrap');
    Logger.log(`Server listen on: ${url}`, 'bootstrap');
    Logger.log(`Server started with port ${PORT}`, 'bootstrap');
  });
}
