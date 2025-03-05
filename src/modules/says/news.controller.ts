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

import { NewsModel } from './news.model';
import { MongoIdDto } from '~/shared/dto/id.dto';
// import { Auth } from '~/common/decorator/auth.decorator';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('/all')
  async getAll() {
    return await this.newsService.model.find({}).sort({ created: -1 }).lean();
  }

  @Get('/random')
  async getRandomOne() {
    const res = await this.newsService.model.find({}).lean();
    if (res.length === 0) {
      return { data: null };
    }
    return { data: sample(res) };
  }

  @Get('/:id')
  async get(@Param() param: MongoIdDto) {
    const { id } = param;
    return await this.newsService.model.findById(id).lean();
  }

  @Post('/add')
  // @Auth()
  async create(@Body() body: NewsModel) {
    const findres = await this.newsService.model.find(body);
    if (findres.length) {
      throw new BadRequestException('已经存在');
    }
    return await this.newsService.model.create({
      ...body,
      created: new Date(),
    });
  }

  @Patch('/:id')
  // @Auth()
  async patch(@Body() body: NewsModel, @Param() param: MongoIdDto) {
    await this.newsService.model
      .findOneAndUpdate({ _id: param.id as any }, {
        ...body,
      } as any)
      .lean();
    return;
  }

  @Delete('/:id')
  // @Auth()
  async delete(@Param() param: MongoIdDto) {
    await this.newsService.model.deleteOne({ _id: param.id as any });
    return;
  }
}
