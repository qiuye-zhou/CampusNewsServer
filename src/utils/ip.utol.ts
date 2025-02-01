import type { Request } from 'express';
import type { IncomingMessage } from 'node:http';

export const getIp = (request: Request | IncomingMessage) => {
  const req = request as any;

  const headers = request.headers;

  let ip: string =
    req?.ip ||
    req?.ips?.[0] ||
    req?.raw?.connection?.remoteAddress ||
    req?.raw?.socket?.remoteAddress ||
    headers['True-Client-IP'] ||
    headers['true-client-ip'] ||
    headers['CF-Connecting-IP'] ||
    headers['cf-connecting-ip'] ||
    headers['cf-connecting-ipv6'] ||
    headers['CF-Connecting-IPv6'] ||
    headers['x-forwarded-for'] ||
    headers['X-Forwarded-For'] ||
    headers['X-Real-IP'] ||
    headers['x-real-ip'] ||
    undefined;
  if (ip && ip.split(',').length > 0) {
    ip = ip.split(',')[0];
  }
  return ip;
};
