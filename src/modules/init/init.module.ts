import { Module } from '@nestjs/common';

import { BackupModule } from '../backup/backup.module';
import { ConfigModule } from '../Config/Config.module';
import { UserModule } from '../user/user.module';
import { InitController } from './init.controller';
import { InitService } from './init.service';

@Module({
  providers: [InitService],
  exports: [InitService],
  controllers: [InitController],
  imports: [UserModule, ConfigModule, BackupModule],
})
export class InitModule {}
