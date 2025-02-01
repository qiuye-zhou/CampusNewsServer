import { NotFoundException } from '@nestjs/common';
import { sample } from 'lodash';

export const NotFoundMessage = [
  '404, 这也不是我的问题啦',
  '真不巧，内容走丢了',
  '嘿，这里什么也没有，不如别处看看？',
];

export class CannotFindException extends NotFoundException {
  constructor() {
    super(sample(NotFoundMessage));
  }
}
