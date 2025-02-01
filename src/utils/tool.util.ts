import { createHash } from 'crypto';

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const md5 = (text: string) =>
  createHash('md5').update(text).digest('hex') as string;
