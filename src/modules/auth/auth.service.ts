import { Injectable } from '@nestjs/common';

import { JWTService } from '~/processors/helper/helper.jwt.service';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JWTService) {}

  get jwtServicePublic() {
    return this.jwtService;
  }

  async signtoken(id: string, grade: boolean) {
    const token = await this.jwtService.sign(id, grade);
    return token;
  }

  async verifytoken(token: string) {
    const result = this.jwtService.verify(token);
    return result;
  }
}
