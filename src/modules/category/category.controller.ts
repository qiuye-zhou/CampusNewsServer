import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { CategoryService } from './category.service';
import { Auth } from '~/common/decorator/auth.decorator';
import { CategoryTypeEnum } from './category.model';
import { MongoIdDto } from '~/shared/dto/id.dto';
import {
  BodyCategoryModel,
  QueryTagAndCategoryDto,
  SignOrIdDto,
} from './category.dto';
import { CannotFindException } from '~/common/exceptions/cantfind.exceptions';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  async getCategories(@Query() query: QueryTagAndCategoryDto) {
    return query.istag
      ? await this.categoryService.model
          .find({ type: CategoryTypeEnum.Tag })
          .lean()
      : await this.categoryService.model
          .find({
            type: CategoryTypeEnum.Category,
          })
          .lean();
  }

  @Get('/:query')
  async getCategoryById(@Param() { query }: SignOrIdDto) {
    if (!query) {
      throw new BadRequestException();
    }
    const isId = isValidObjectId(query);
    const res = isId
      ? await this.categoryService.model
          .findById(query)
          .sort({ created: -1 })
          .lean()
      : await this.categoryService.model
          .findOne({ sign: query })
          .sort({ created: -1 })
          .lean();

    if (!res) {
      throw new CannotFindException();
    }
    return { data: { ...res, children: '待写：属于该分类或tag的文章' } };
  }

  @Post('/add')
  @Auth()
  async create(@Body() body: BodyCategoryModel) {
    const { name, type, sign } = body;
    return this.categoryService.create(name, type, sign);
  }

  @Patch('/:id')
  @HttpCode(204)
  @Auth()
  async patch(@Param() params: MongoIdDto, @Body() body: BodyCategoryModel) {
    const { id } = params;
    await this.categoryService.update(id, body);
    return;
  }

  @Delete('/:id')
  @Auth()
  async deleteCategory(@Param() params: MongoIdDto) {
    const { id } = params;

    return await this.categoryService.deleteById(id);
  }
}
