import {
  CallHandler,
  Injectable,
  NestInterceptor,
  ExecutionContext,
} from '@nestjs/common';
import { map, type Observable } from 'rxjs';

import { getInfoFromReq } from '~/utils/getInfoFromReq.util';
import { LoggerService } from '~/processors/logger/logger.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        this.logger.info('response interceptor', 'response', {
          code: 200,
          responseData: data,
          req: getInfoFromReq(context.switchToHttp().getRequest()),
        });
        return {
          code: 200,
          data,
        };
      }),
    );
  }
}
