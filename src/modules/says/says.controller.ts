import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { sample } from 'lodash';

import { SaysModel } from './says.model';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { Auth } from '~/common/decorator/auth.decorator';
import { SaysService } from './says.service';

@Controller('says')
export class SaysController {
  constructor(private readonly saysService: SaysService) {}

  @Get('/all')
  async getAll() {
    return await this.saysService.model.find({}).sort({ created: -1 }).lean();
  }

  @Get('/random')
  async getRandomOne() {
    const res = await this.saysService.model.find({}).lean();
    if (res.length === 0) {
      return { data: null };
    }
    return { data: sample(res) };
  }

  @Get('/:id')
  async get(@Param() param: MongoIdDto) {
    const { id } = param;
    return await this.saysService.model.findById(id).lean();
  }

  @Post('/add')
  @Auth()
  async create(@Body() body: SaysModel) {
    const findres = await this.saysService.model.find(body);
    if (findres.length) {
      throw new BadRequestException('已经存在');
    }
    return await this.saysService.model.create({
      ...body,
      created: new Date(),
    });
  }

  @Patch('/:id')
  @Auth()
  async patch(@Body() body: SaysModel, @Param() param: MongoIdDto) {
    await this.saysService.model
      .findOneAndUpdate({ _id: param.id as any }, {
        ...body,
      } as any)
      .lean();
    return;
  }

  @Delete('/:id')
  @Auth()
  async delete(@Param() param: MongoIdDto) {
    await this.saysService.model.deleteOne({ _id: param.id as any });
    return;
  }
}
