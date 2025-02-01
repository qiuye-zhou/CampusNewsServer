import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { LoginDto, UserDto, UserUpdataDto } from './user.dto';
import { UserDocument, UserModel } from './user.model';
import { HttpCache } from '~/common/decorator/cache.decorator';
import { IpLocation, IpRecord } from '~/common/decorator/ip.decorator';
import { Auth } from '~/common/decorator/auth.decorator';
import {
  GetRequestUser,
  GetRequestUserToken,
} from '~/common/decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userservice: UserService,
    private readonly authservice: AuthService,
  ) {}

  @Post('/register')
  async register(@Body() userDto: UserDto) {
    userDto.name = userDto.name ?? userDto.username;
    return await this.userservice.createMaster(userDto as UserModel);
  }

  @Patch('/updata')
  @Auth()
  @HttpCache.disable
  async updataMasterData(
    @GetRequestUser() user: UserDocument,
    @Body() body: UserUpdataDto,
  ) {
    return await this.userservice.updataUserData(user, body);
  }

  @Post('/login')
  @HttpCache({ disable: true })
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @IpLocation() ipLocation: IpRecord) {
    const user = await this.userservice.login(dto.username, dto.password);
    const footstep = await this.userservice.recordFootstep(ipLocation.ip);
    const { name, username, created, mail, id } = user;
    const createdTime = new Date(created).toString();
    const avatar = user.avatar;
    return {
      token: await this.authservice.jwtServicePublic.sign(user.id, {
        ip: ipLocation.ip,
        ua: ipLocation.agent,
      }),
      ...footstep,
      name,
      username,
      createdTime,
      mail,
      avatar,
      id,
    };
  }

  @Post('/logout')
  @Auth()
  singout(@GetRequestUserToken() token: string) {
    return this.userservice.signout(token);
  }

  @Get('/sessionall')
  @Auth()
  getAllSession(@GetRequestUserToken() token: string) {
    return this.authservice.jwtServicePublic.getAllSession(token);
  }

  @Delete('/deleteAllSession')
  @Auth()
  deleteAllSession(@GetRequestUserToken() currentToken: string) {
    return this.authservice.jwtServicePublic.revokeAll([currentToken]);
  }
}
