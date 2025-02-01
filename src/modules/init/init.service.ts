import { Injectable } from '@nestjs/common';

import { DATA_DIR } from '~/constants/path.constants';
import { UserService } from '../user/user.service';

@Injectable()
export class InitService {
  constructor(private readonly userService: UserService) {}

  getDatadir() {
    return DATA_DIR;
  }

  isInit(): Promise<boolean> {
    return this.userService.hasMaster();
  }
}
