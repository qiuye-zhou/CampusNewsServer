import { Module } from '@nestjs/common';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
  imports: [UserModule],
})
export class NewsModule {}
