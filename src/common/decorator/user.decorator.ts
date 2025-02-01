import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer';

export const GetRequestUserToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const token = getNestExecutionContextRequest(ctx).token;
    return token;
  },
);

export const GetRequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return getNestExecutionContextRequest(ctx).user;
  },
);
