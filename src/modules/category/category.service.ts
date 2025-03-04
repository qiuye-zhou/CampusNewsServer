import { BadRequestException, Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';

import { InjectModel } from '~/transformers/model.transformer';
import { CategoryModel } from './category.model';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryModel)
    private readonly categoryModel: ReturnModelType<typeof CategoryModel>,
  ) {
    this.createDefaultCategory();
  }

  get model() {
    return this.categoryModel;
  }

  async create(name: string, description?: string) {
    const res = await this.model.create({
      name,
      description: description ?? name,
    });
    return res;
  }

  async update(id: string, partialData: Partial<CategoryModel>) {
    const newData = await this.model.findOneAndUpdate(
      { _id: id },
      {
        ...partialData,
      },
    );
    return newData;
  }

  async deleteById(id: string): Promise<any> {
    const category = await this.model.findById(id);
    if (!category) {
      throw new BadRequestException('该分类不存在');
    }

    // 检查是否有关联的文章，有则无法删除
    // if (getpostsInCategory.length > 0) {
    //   throw new BadRequestException('该分类中有其他文章，无法被删除');
    // }
    const res = await this.model.deleteOne({
      _id: category._id,
    });
    if ((await this.model.countDocuments({})) === 0) {
      await this.createDefaultCategory();
    }
    return res;
  }

  async createDefaultCategory() {
    if ((await this.model.countDocuments()) === 0) {
      return await this.model.create({
        name: '默认分类',
        sign: 'default',
      });
    }
  }
}
