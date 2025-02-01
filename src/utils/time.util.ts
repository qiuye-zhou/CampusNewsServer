import * as dayjs from 'dayjs';

export const getMediumDateTime = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD-HH-mm-ss');
};
