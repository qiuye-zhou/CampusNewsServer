import { Global, Module } from '@nestjs/common';

import { databaseProvider } from './database.provider';
import { datebaseModules } from './database.models';

@Module({
  providers: [databaseProvider, ...datebaseModules],
  exports: [databaseProvider, ...datebaseModules],
})
@Global()
export class DatebaseModule {}
