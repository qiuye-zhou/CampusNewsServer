import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { isJWT } from 'class-validator';

import { AuthService } from '~/modules/auth/auth.service';
import { UserModel } from '~/modules/user/user.model';
import { RequestBizRequest } from '~/transformers/get-req.transformer';
import { UserService } from '~/modules/user/user.service';

/**
 * JWT auth guard
 */

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected readonly authService: AuthService,
    protected readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const query = request.query as any;
    const headers = request.headers;
    const Authorization: string =
      headers.authorization || headers.Authorization || query.token;

    if (!Authorization) {
      throw new UnauthorizedException('未登录');
    }

    if (!isJWT(Authorization)) {
      throw new UnauthorizedException('令牌无效');
    }

    const ok = await this.authService.jwtServicePublic.verify(Authorization);
    if (!ok) {
      throw new UnauthorizedException('身份过期');
    }
    this.attachUserAndToken(
      request,
      await this.userService.getuser(query.username),
      Authorization,
    );
    return true;
  }

  attachUserAndToken(
    request: RequestBizRequest,
    user: UserModel,
    token: string,
  ) {
    request.user = user;
    request.token = token;

    Object.assign(request.res, {
      user,
      token,
    });
  }
}
