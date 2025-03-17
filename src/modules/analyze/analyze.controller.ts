import { Controller, Get } from '@nestjs/common';

import { Auth } from '~/common/decorator/auth.decorator';
import { AnalyzeService } from './analyze.service';
import { countValues } from '~/utils/countArrObjValues';

@Controller('analyze')
@Auth()
export class AnalyzeController {
  constructor(private readonly analyzeService: AnalyzeService) {}

  @Get('/hours')
  async getTimeHours() {
    const currentDate = new Date();
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
    const reslist = [];
    const res = await this.analyzeService.model.find({});
    if (res.length === 0) {
      return null;
    }
    res.forEach(async (element) => {
      const diff = currentDate.getTime() - element.time.getTime();
      if (diff >= 0 && diff <= oneWeekInMillis) {
        reslist.push(element);
      } else {
        await this.analyzeService.model.deleteOne({ _id: element.id as any });
      }
    });
    const resMid = countValues(reslist, 'Hours');
    const result = [
      { hour: '0时', num: 0 },
      { hour: '1时', num: 0 },
      { hour: '2时', num: 0 },
      { hour: '3时', num: 0 },
      { hour: '4时', num: 0 },
      { hour: '5时', num: 0 },
      { hour: '6时', num: 0 },
      { hour: '7时', num: 0 },
      { hour: '8时', num: 0 },
      { hour: '9时', num: 0 },
      { hour: '10时', num: 0 },
      { hour: '11时', num: 0 },
      { hour: '12时', num: 0 },
      { hour: '13时', num: 0 },
      { hour: '14时', num: 0 },
      { hour: '15时', num: 0 },
      { hour: '16时', num: 0 },
      { hour: '17时', num: 0 },
      { hour: '18时', num: 0 },
      { hour: '19时', num: 0 },
      { hour: '20时', num: 0 },
      { hour: '21时', num: 0 },
      { hour: '22时', num: 0 },
      { hour: '23时', num: 0 },
    ];
    for (const key in resMid) {
      if (resMid.hasOwnProperty(key)) {
        // 确保只遍历对象自身的属性
        result[Number(key)].num = resMid[key];
      }
    }
    return result;
  }

  @Get('/day')
  async getTimeday() {
    const currentDate = new Date();
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
    const reslist = [];
    const res = await this.analyzeService.model.find({});
    if (res.length === 0) {
      return null;
    }
    res.forEach(async (element) => {
      const diff = currentDate.getTime() - element.time.getTime();
      if (diff >= 0 && diff <= oneWeekInMillis) {
        reslist.push(element);
      } else {
        await this.analyzeService.model.deleteOne({ _id: element.id as any });
      }
    });
    const resMid = countValues(reslist, 'Day');
    const result = [
      { day: '周天', num: 0 },
      { day: '周一', num: 0 },
      { day: '周二', num: 0 },
      { day: '周三', num: 0 },
      { day: '周四', num: 0 },
      { day: '周五', num: 0 },
      { day: '周六', num: 0 },
    ];
    for (const key in resMid) {
      if (resMid.hasOwnProperty(key)) {
        // 确保只遍历对象自身的属性
        result[Number(key)].num = resMid[key];
      }
    }
    return result;
  }
}
