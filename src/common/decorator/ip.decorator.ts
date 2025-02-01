import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';

import { getIp } from '~/utils/ip.utol';

export type IpRecord = {
  ip: string;
  agent: string;
};

export const IpLocation = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const ip = getIp(request);
    const agent = request.headers['user-agent'];
    return {
      ip,
      agent,
    };
  },
);
