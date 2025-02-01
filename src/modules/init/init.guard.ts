import type { CanActivate } from '@nestjs/common';

import { checkInit } from '~/utils/checkInit.util';

export class InitGuard implements CanActivate {
  async canActivate() {
    return !(await checkInit());
  }
}
