import type { Provider } from '@nestjs/common';
import { Global, Module } from '@nestjs/common';

import { JWTService } from './helper.jwt.service';

const providers: Provider<any>[] = [JWTService];

@Module({
  imports: [],
  providers,
  exports: providers,
})
@Global()
export class HelperModule {}
