import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
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
import { MongoIdDto } from '~/shared/dto/id.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userservice: UserService,
    private readonly authservice: AuthService,
  ) {}

  @Get('/alladmin')
  @Auth()
  async getAllAdmin() {
    const res = await this.userservice.model.find({ grade: true }).lean();
    if (res.length === 0) {
      return { data: [] };
    }
    return res;
  }

  @Get('/alledit')
  @Auth()
  async getAlledit() {
    const res = await this.userservice.model.find({ grade: false }).lean();
    if (res.length === 0) {
      return { data: [] };
    }
    return res;
  }

  @Post('/register')
  async register(@Body() userDto: UserDto) {
    userDto.name = userDto.name ?? userDto.username;
    return await this.userservice.createUser(userDto as UserModel);
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

  @Delete('/:id')
  @Auth()
  async delete(@Param() param: MongoIdDto) {
    await this.userservice.model.deleteOne({ _id: param.id as any });
    return;
  }

  @Post('/login')
  @HttpCache({ disable: true })
  @HttpCode(200)
  async login(@Body() dto: LoginDto, @IpLocation() ipLocation: IpRecord) {
    const user = await this.userservice.login(dto.username, dto.password);
    const footstep = await this.userservice.recordFootstep(
      user._id,
      ipLocation.ip,
    );
    const { name, username, created, id, grade } = user;
    const createdTime = new Date(created).toString();
    return {
      token: await this.authservice.jwtServicePublic.sign(user.id, user.grade, {
        ip: ipLocation.ip,
        ua: ipLocation.agent,
      }),
      ...footstep,
      name,
      username,
      createdTime,
      id,
      grade,
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
