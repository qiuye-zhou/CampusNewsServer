import { Logger } from '@nestjs/common';
import { mkdirSync } from 'fs';

import './dayjs.global';
import {
  ASSET_DIR,
  BACKUP_DIR,
  DATA_DIR,
  LOG_DIR,
  STATIC_DIR,
} from '~/constants/path.constants';

// 建立数据存放目录
function mkdirs() {
  mkdirSync(DATA_DIR, { recursive: true });
  Logger.log(`数据目录已经建好：${DATA_DIR}`, 'register');
  mkdirSync(ASSET_DIR, { recursive: true });
  Logger.log(`资源目录已经建好：${ASSET_DIR}`, 'register');
  mkdirSync(LOG_DIR, { recursive: true });
  Logger.log(`日志目录已经建好：${LOG_DIR}`, 'register');
  mkdirSync(STATIC_DIR, { recursive: true });
  Logger.log(`文件存放目录已经建好：${STATIC_DIR}`, 'register');
  mkdirSync(BACKUP_DIR, { recursive: true });
  Logger.log(`备份目录已经建好：${BACKUP_DIR}`, 'register');
}

export function register() {
  mkdirs();
}
