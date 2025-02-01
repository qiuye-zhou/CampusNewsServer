import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { isDev } from '~/global/env.global';

@Injectable()
export class SpiderGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (isDev) return true;

    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const user_agent: string = headers['user-agent'] || '';
    const isSpiderUA =
      !user_agent.match(/(qy-space|baidu|rss|google|bing)/gi) &&
      user_agent.match(/(Scrapy|HttpClient|axios|python|requests)/i);

    if (user_agent && !isSpiderUA) {
      return true;
    }
    throw new ForbiddenException(`不可以使用爬虫哦，user-agent: ${user_agent}`);
  }
}
