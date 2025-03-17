import { Module } from '@nestjs/common';

import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { UserModule } from '../user/user.module';
import { AnalyzeModule } from '../analyze/analyze.module';

@Module({
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
  imports: [UserModule, AnalyzeModule],
})
export class NewsModule {}
