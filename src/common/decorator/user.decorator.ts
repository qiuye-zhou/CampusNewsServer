import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { SECURITY } from '~/app.config';

import { getNestExecutionContextRequest } from '~/transformers/get-req.transformer';

export const GetRequestUserToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const token = getNestExecutionContextRequest(ctx).token;
    return token;
  },
);

export const GetRequestUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const verifyToken: any = verify(
      getNestExecutionContextRequest(ctx).token,
      SECURITY.jwtSecret,
    );
    return verifyToken;
  },
);
