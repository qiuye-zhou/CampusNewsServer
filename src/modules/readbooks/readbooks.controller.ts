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

import { MongoIdDto } from '~/shared/dto/id.dto';
import { Auth } from '~/common/decorator/auth.decorator';
import { ReadBooksService } from './readbooks.service';
import { ReadBooksModel } from './readbooks.model';

@Controller('readbooks')
export class ReadBooksController {
  constructor(private readonly readBooksService: ReadBooksService) {}

  @Get('/all')
  async getAll() {
    return await this.readBooksService.model.find({}).sort({ date: -1 }).lean();
  }

  @Get('/:id')
  async get(@Param() param: MongoIdDto) {
    const { id } = param;
    return await this.readBooksService.model.findById(id).lean();
  }

  @Post('/add')
  @Auth()
  async create(@Body() body: ReadBooksModel) {
    const findres = await this.readBooksService.model.find(body);
    if (findres.length) {
      throw new BadRequestException('已经存在');
    }
    return await this.readBooksService.model.create({
      ...body,
      created: new Date(),
    });
  }

  @Patch('/:id')
  @Auth()
  async patch(@Body() body: ReadBooksModel, @Param() param: MongoIdDto) {
    await this.readBooksService.model
      .findOneAndUpdate({ _id: param.id as any }, {
        ...body,
      } as any)
      .lean();
    return;
  }

  @Delete('/:id')
  @Auth()
  async delete(@Param() param: MongoIdDto) {
    await this.readBooksService.model.deleteOne({ _id: param.id as any });
    return;
  }
}
