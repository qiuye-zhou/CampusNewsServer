import { homedir } from 'os';
import { join } from 'path';

import { isDev, cwd } from '~/global/env.global';

export const HOME = homedir();

export const DATA_DIR = isDev ? join(cwd, './tmp') : join(HOME, '.qy-space');

export const ASSET_DIR = join(DATA_DIR, 'assets');

export const LOG_DIR = join(DATA_DIR, 'log');

export const STATIC_DIR = join(DATA_DIR, 'static');

export const BACKUP_DIR = join(DATA_DIR, 'backup');
