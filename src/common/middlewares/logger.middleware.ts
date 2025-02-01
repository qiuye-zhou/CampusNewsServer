import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { getInfoFromReq } from '~/utils/getInfoFromReq.util';
import { LoggerService } from '~/processors/logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.info('route', 'route', {
      req: getInfoFromReq(req),
    });
    next();
  }
}
