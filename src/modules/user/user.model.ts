import {
  Severity,
  modelOptions,
  prop,
  DocumentType,
} from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';

import { BaseModel } from '~/shared/model/base.model';

export type UserDocument = DocumentType<UserModel>;

@modelOptions({ options: { customName: 'User', allowMixed: Severity.ALLOW } })
export class UserModel extends BaseModel {
  @prop({ required: true, unique: true, trim: true })
  username!: string;

  @prop({ trim: true })
  name!: string;

  @prop({ required: true, trim: true })
  grade!: boolean;

  @prop({
    select: false,
    get(val) {
      return val;
    },
    set(val) {
      return hashSync(val, 6);
    },
    required: true,
  })
  password!: string;

  @prop()
  lastLoginTime?: Date;

  @prop()
  lastLoginIp?: string;
}
