import { Module } from '@nestjs/common';

import { ReadBooksController } from './readbooks.controller';
import { ReadBooksService } from './readbooks.service';

@Module({
  controllers: [ReadBooksController],
  providers: [ReadBooksService],
  exports: [ReadBooksService],
})
export class ReadBooksModule {}
