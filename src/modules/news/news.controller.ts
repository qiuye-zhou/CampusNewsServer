import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { sampleSize } from 'lodash';

import { NewsModel } from './news.model';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { Auth } from '~/common/decorator/auth.decorator';
import { NewsService } from './news.service';
import { GetRequestUser } from '~/common/decorator/user.decorator';
import { UserDocument } from '../user/user.model';
import { UserService } from '../user/user.service';
import { countValues } from '~/utils/countArrObjValues';
import { AnalyzeService } from '../analyze/analyze.service';

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly userservice: UserService,
    private readonly analyzeService: AnalyzeService,
  ) {}

  @Get('/all')
  async getAll() {
    return await this.newsService.model.find({}).sort({ created: -1 }).lean();
  }

  @Get('/search')
  async getSearch(@Query() query: any) {
    return await this.newsService.model
      .find({ title: { $regex: query.title, $options: 'i' } })
      .sort({ created: -1 })
      .lean();
  }

  @Get('/random')
  async getRandomOne() {
    const res = await this.newsService.model.find({}).lean();
    if (res.length === 0) {
      return { data: null };
    }
    return sampleSize(res, 3);
  }

  @Get('/recently')
  async getRecentlyOne() {
    const res = await this.newsService.model
      .find({})
      .limit(3)
      .sort({ created: -1 })
      .lean();
    if (res.length === 0) {
      return null;
    }
    return res;
  }

  @Get('/reqtop')
  async getReqTop() {
    const res = await this.newsService.model
      .find({})
      .limit(3)
      .sort({ browsenum: -1 })
      .lean();
    if (res.length === 0) {
      return null;
    }
    const reslist = [];
    res.forEach((element) => {
      reslist.push({ count: element.browsenum, path: element.title });
    });
    return reslist;
  }

  @Get('/typetop')
  async getTypeTop() {
    const res = await this.newsService.model
      .find({})
      .limit(3)
      .sort({ browsenum: -1 })
      .lean();
    if (res.length === 0) {
      return null;
    }
    const reslist = [];
    const resMid = countValues(res, 'typename');
    for (const key in resMid) {
      if (resMid.hasOwnProperty(key)) {
        // 确保只遍历对象自身的属性
        reslist.push({ count: resMid[key], path: key });
      }
    }
    return reslist;
  }

  @Get('/timeline')
  async getTimeLine() {
    const res = await this.newsService.model
      .find({})
      .sort({ created: -1 })
      .lean();
    if (res.length === 0) {
      return null;
    }
    return res;
  }

  @Get('/:id')
  async get(@Param() param: MongoIdDto) {
    const { id } = param;
    const newdate = await this.newsService.model.findById(id).lean();
    const username = await await this.userservice.getuserbyid(newdate.editid);
    const time = new Date();
    await this.analyzeService.model.create({
      time: time,
      Day: time.getDay(),
      Hours: time.getHours(),
    });
    return {
      ...(await this.newsService.model
        .findOneAndUpdate({ _id: id as any }, {
          browsenum: newdate.browsenum + 1,
        } as any)
        .lean()),
      username: username.name,
    };
  }

  @Post('/add')
  @Auth()
  async create(@GetRequestUser() user: UserDocument, @Body() body: NewsModel) {
    const findres = await this.newsService.model.find(body);
    if (findres.length) {
      throw new BadRequestException('已经存在');
    }
    return await this.newsService.model.create({
      ...body,
      editid: user.id,
      created: new Date(),
    });
  }

  @Patch('/:id')
  @Auth()
  async patch(@Body() body: NewsModel, @Param() param: MongoIdDto) {
    await this.newsService.model
      .findOneAndUpdate({ _id: param.id as any }, {
        ...body,
      } as any)
      .lean();
    return;
  }

  @Delete('/:id')
  @Auth()
  async delete(@Param() param: MongoIdDto) {
    await this.newsService.model.deleteOne({ _id: param.id as any });
    return;
  }
}
