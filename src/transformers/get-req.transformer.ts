import type { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

import type { UserModel } from '~/modules/user/user.model';

export type RequestBizRequest = Request & {
  user?: UserModel;

  isAuthenticated: boolean;
  token?: string;
};
export function getNestExecutionContextRequest(
  context: ExecutionContext,
): RequestBizRequest {
  return context.switchToHttp().getRequest<Request>() as any;
}
