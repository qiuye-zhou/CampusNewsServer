import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { compareSync } from 'bcryptjs';
import { ReturnModelType } from '@typegoose/typegoose';

import { AuthService } from '../auth/auth.service';
import { InjectModel } from '~/transformers/model.transformer';
import { UserDocument, UserModel } from './user.model';
import { sleep } from '~/utils/tool.util';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
    private readonly authservice: AuthService,
  ) {}

  public async hasuser(username: string) {
    const user = await this.userModel.findOne({ username });
    if (user) {
      throw new BadRequestException('该用户名已存在');
    }
    return user;
  }

  public async getuser(username: string) {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async hasMaster() {
    return !!(await this.userModel.countDocuments());
  }

  async createUser(
    model: Pick<UserModel, 'username' | 'name' | 'password'> &
      Partial<UserModel>,
  ) {
    await this.hasuser(model.username);
    const res = await this.userModel.create({ ...model });
    const token = await this.authservice.jwtServicePublic.sign(res.id);
    return { token, username: res.username };
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username }).select('+password');
    if (!user) {
      await sleep(3000);
      throw new ForbiddenException('用户名不正确');
    }
    if (!compareSync(password, user.password)) {
      await sleep(3000);
      throw new ForbiddenException('密码不正确');
    }

    return user;
  }

  /**
   * 记录登陆的 (ip, 时间)
   *
   * @async
   * @param {string} ip - string
   * @return {Promise<Record<string, Date|string>>} 返回上次登入IP
   */
  async recordFootstep(ip: string): Promise<Record<string, Date | string>> {
    const master = await this.userModel.findOne();
    if (!master) {
      throw new HttpException(
        HttpException.createBody({
          code: 9999,
          message: '当前不存在Master',
        }),
        500,
      );
    }
    const PrevFootstep = {
      lastLoginTime:
        master.lastLoginTime?.toString() || new Date(1600000000000),
      lastLoginIp: master.lastLoginIp || null,
    };
    await master.updateOne({
      lastLoginTime: new Date(),
      lastLoginIp: ip,
    });

    Logger.warn(`已登录，IP: ${ip}`, 'user');
    return PrevFootstep as any;
  }

  /**
   * 修改密码等User信息
   *
   * @async
   * @param {UserDocument} user - 用户查询结果，已经挂载在 req.user
   * @param {Partial<UserModel>} data - 部分修改数据
   */
  async updataUserData(user: UserDocument, data: Partial<UserModel>) {
    const { password } = data;
    const docum = { ...data };

    await this.hasuser(data.username);

    if (password !== undefined) {
      const { id } = user;
      const currentUser = await this.userModel
        .findById(id)
        .select('+password +apiToken');
      if (!currentUser) {
        throw new HttpException(
          HttpException.createBody({
            code: 9999,
            message: '当前不存在此用户',
          }),
          500,
        );
      }
      const isSame = compareSync(password, currentUser.password);
      if (isSame) {
        throw new UnprocessableEntityException('密码可不能和原来的一样哦!');
      }
      await this.authservice.jwtServicePublic.revokeAll();
    }
    return await this.userModel.updateOne({ _id: user.id }, docum);
  }

  signout(token: string) {
    return this.authservice.jwtServicePublic.revokeToken(token);
  }
}
