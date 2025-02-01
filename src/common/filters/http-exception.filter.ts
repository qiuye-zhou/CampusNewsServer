import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { getInfoFromReq } from '~/utils/getInfoFromReq.util';
import { LoggerService } from '~/processors/logger/logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const res = (exception as any).response;
    const message = res?.message || (exception as any)?.message || '未知错误';
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error('filter', message, {
      code: status,
      req: getInfoFromReq(ctx.getRequest()),
    });

    response.status(status).type('application/json').send({
      code: status,
      message,
    });
  }
}
