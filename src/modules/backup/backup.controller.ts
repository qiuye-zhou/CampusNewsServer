import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { BackupService } from './backup.service';
import { Auth } from '~/common/decorator/auth.decorator';
import { getMediumDateTime } from '~/utils/time.util';
import { BACKUP_DIR } from '~/constants/path.constants';

@Controller('backup')
@Auth()
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Get('/new')
  @Header(
    'Content-Disposition',
    `attachment; filename="backup-${getMediumDateTime(new Date())}.zip"`,
  )
  @Header('Content-Type', 'application/zip')
  async createNewBackup(@Res() res) {
    const path = await this.backupService.backup();
    return res.sendFile(path);
  }

  @Get('/all')
  async get() {
    return this.backupService.list();
  }

  @Header('Content-Type', 'application/zip')
  @Get('/:dirname')
  async download(@Res() res, @Param('dirname') dirname: string) {
    const path = await this.backupService.getFile(dirname);
    return res.sendFile(path);
  }

  @Post('/uploadbackp')
  @UseInterceptors(FileInterceptor('file', { dest: BACKUP_DIR }))
  async uploadBackp(@UploadedFile() file: Express.Multer.File) {
    await this.backupService.saveBackupByUpload(file.path);
    return {
      message: 'File uploaded successfully',
    };
  }

  @Post('/restore')
  @Auth()
  async restore(@Body() body: { restoreFilePath: string }) {
    return await this.backupService.restore(body.restoreFilePath);
  }

  @Delete('/all')
  async deleteBackups() {
    return await this.backupService.deleteBackupAll();
  }

  @Delete('/:filename')
  async delete(@Param('filename') filename: string) {
    if (!filename) {
      return;
    }
    await this.backupService.deleteBackup(filename);
    return;
  }
}
