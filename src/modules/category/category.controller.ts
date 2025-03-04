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
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

import { CategoryService } from './category.service';
import { Auth } from '~/common/decorator/auth.decorator';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { BodyCategoryModel, SignOrIdDto } from './category.dto';
import { CannotFindException } from '~/common/exceptions/cantfind.exceptions';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/all')
  async getCategories() {
    return this.categoryService.model.find();
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
          .findOne({ name: query })
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
    const { name, description } = body;
    return this.categoryService.create(name, description);
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
