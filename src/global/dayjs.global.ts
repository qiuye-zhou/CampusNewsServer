/**
 * dayjs 插件注册
 */
import * as dayjs from 'dayjs';

import 'dayjs/locale/zh-cn';

import * as duration from 'dayjs/plugin/duration';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import * as relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('zh-cn');
dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);
