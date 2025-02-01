import { Injectable } from '@nestjs/common';
import { Logger, createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

import { LOG_DIR } from '~/constants/path.constants';

@Injectable()
export class LoggerService {
  private context?: string;
  private logger: Logger;

  public setContext(context: string): void {
    this.context = context;
  }

  constructor() {
    this.logger = createLogger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.prettyPrint(),
      ),
      transports: [
        // new transports.Console(),
        new transports.DailyRotateFile({
          dirname: LOG_DIR,
          filename: '%DATE%.info.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.printf(
              (info) =>
                `${info.timestamp} [${info.level}] : ${info.type} ${
                  Object.keys(info).length ? JSON.stringify(info, null, 2) : ''
                }`,
            ),
          ),
          level: 'info',
        }),
        new transports.DailyRotateFile({
          dirname: LOG_DIR,
          filename: '%DATE%.error.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.printf(
              (info) =>
                `${info.timestamp} [${info.level}] : ${info.type} ${
                  Object.keys(info).length ? JSON.stringify(info, null, 2) : ''
                }`,
            ),
          ),
          level: 'error',
        }),
      ],
    });
  }

  // 错误日志记录
  error(
    type: string,
    message: string,
    ctx?: any,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.error({
      type,
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  // 警告日志记录
  warn(
    type: string,
    message: string,
    ctx?: any,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.warn({
      type,
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }

  // 基本日志记录
  info(
    type: string,
    message: string,
    ctx?: any,
    meta?: Record<string, any>,
  ): Logger {
    return this.logger.info({
      type,
      message,
      contextNmae: this.context,
      ctx,
      ...meta,
    });
  }
}
