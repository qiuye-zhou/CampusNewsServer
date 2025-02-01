import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { mkdirp } from 'mkdirp';
import { join, resolve } from 'node:path';
import * as archiver from 'archiver';
import { createWriteStream, existsSync } from 'fs';
import { readdir, rename, rm } from 'node:fs/promises';

import { MONGO_DB } from '~/app.config';
import { execCommand } from '~/utils/execCommandSync.util';
import { getMediumDateTime } from '~/utils/time.util';
import { ASSET_DIR, BACKUP_DIR, STATIC_DIR } from '~/constants/path.constants';
import { getFileSize } from '~/utils/system.util';

// const excludeFolders = ['log'];

@Injectable()
export class BackupService {
  constructor() {}

  async list() {
    const backupPath = BACKUP_DIR;
    if (!existsSync(backupPath)) {
      return [];
    }
    const backupFilenames = await readdir(backupPath);
    const backups: { filename: string; path: string }[] = [];

    for (const filename of backupFilenames) {
      const path = resolve(backupPath, filename);
      backups.push({
        filename,
        path,
      });
    }
    return Promise.all(
      backups.map(async (item) => {
        const size = getFileSize(item.path);
        delete item.path;
        return { ...item, size };
      }),
    );
  }

  async getFile(dirname: string) {
    const path = join(BACKUP_DIR, dirname);
    if (!existsSync(path)) {
      throw new BadRequestException('文件不存在');
    }
    return path;
  }

  async backup() {
    Logger.log('备份数据中', 'backup');
    const dateDir = getMediumDateTime(new Date());
    const backupDirPath = join(BACKUP_DIR, dateDir);
    mkdirp.sync(backupDirPath);

    const command = `mongodump --uri ${MONGO_DB.uri} -d ${MONGO_DB.dbName} -o "${backupDirPath}"`;
    await execCommand(command);

    // 打包 DB
    const archivezip = archiver('zip', {
      zlib: { level: 9 }, // 设置压缩级别
    });
    const output = createWriteStream(`${BACKUP_DIR}\\backup-${dateDir}.zip`);
    archivezip.pipe(output);
    archivezip.directory(backupDirPath, 'db');
    archivezip.directory(ASSET_DIR, 'asset');
    archivezip.directory(STATIC_DIR, 'static');
    // 等待压缩完成
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      archivezip.on('error', reject);
      archivezip.finalize();
    });
    Logger.log('备份成功', 'backup');
    const path = join(BACKUP_DIR, `backup-${dateDir}.zip`);
    // 删除临时文件夹
    await rm(backupDirPath, { recursive: true, force: true });
    return path;
  }

  async deleteBackupAll() {
    try {
      const files = await this.list();
      for (const file of files) {
        rm(join(BACKUP_DIR, file.filename), { recursive: true });
      }
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  async deleteBackup(filename: string) {
    const path = join(BACKUP_DIR, filename);
    if (!existsSync(path)) {
      throw new BadRequestException('文件不存在');
    }
    await rm(path, { recursive: true });
    return true;
  }

  async saveBackupByUpload(oldPath: string) {
    const newPath = join(BACKUP_DIR, `${getMediumDateTime(new Date())}.zip`);
    await rename(oldPath, newPath);

    return;
  }

  async restore(restoreFilePath: string) {
    const isExist = existsSync(restoreFilePath);
    if (!isExist) {
      throw new InternalServerErrorException('该备份文件不存在');
    }

    // 解压
    Logger.error('待写');
  }
}
