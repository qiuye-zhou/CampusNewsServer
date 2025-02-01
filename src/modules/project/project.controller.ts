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

import { ProjectService } from './project.service';
import { Auth } from '~/common/decorator/auth.decorator';
import { MongoIdDto } from '~/shared/dto/id.dto';
import { ProjectModel } from './project.model';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('/all')
  async getAll() {
    return await this.projectService.model
      .find({})
      .sort({ created: -1 })
      .lean();
  }

  @Get('/:id')
  async get(@Param() param: MongoIdDto) {
    const { id } = param;
    return await this.projectService.model.findById(id).lean();
  }

  @Post('/add')
  @Auth()
  async create(@Body() body: ProjectModel) {
    const findres = await this.projectService.model.find(body);
    if (findres.length) {
      throw new BadRequestException('已经存在');
    }
    return await this.projectService.model.create({
      ...body,
      created: new Date(),
    });
  }

  @Patch('/:id')
  @Auth()
  async patch(@Body() body: ProjectModel, @Param() param: MongoIdDto) {
    await this.projectService.model
      .findOneAndUpdate({ _id: param.id as any }, {
        ...body,
      } as any)
      .lean();
    return;
  }

  @Delete('/:id')
  @Auth()
  async delete(@Param() param: MongoIdDto) {
    await this.projectService.model.deleteOne({ _id: param.id as any });
    return;
  }
}
