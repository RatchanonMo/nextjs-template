import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

interface CircuitRecord {
  windowStart: number;
  requestCount: number;
  openUntil: number;
}

interface CircuitBreakerOptions {
  maxRequests: number;
  windowMs: number;
  cooldownMs: number;
}

const ipRecords = new Map<string, CircuitRecord>();

const getClientIp = (req: Request): string => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return forwardedFor[0].split(',')[0].trim();
  }
  return req.ip || 'unknown';
};

const cleanupStaleRecords = (now: number, windowMs: number, cooldownMs: number) => {
  for (const [ip, record] of ipRecords.entries()) {
    const expiredWindow = now - record.windowStart > windowMs;
    const cooledDown = record.openUntil > 0 && now >= record.openUntil;
    if (expiredWindow && (record.openUntil === 0 || cooledDown) && record.requestCount === 0) {
      ipRecords.delete(ip);
    }
  }
};

export const createIpCircuitBreaker = (options: CircuitBreakerOptions) => {
  const { maxRequests, windowMs, cooldownMs } = options;

  return (req: Request, res: Response, next: NextFunction): void => {
    const now = Date.now();
    const clientIp = getClientIp(req);

    const current = ipRecords.get(clientIp) ?? {
      windowStart: now,
      requestCount: 0,
      openUntil: 0,
    };

    if (current.openUntil > now) {
      const retryAfterSec = Math.max(1, Math.ceil((current.openUntil - now) / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: 'Circuit breaker is open for this IP. Please retry later.',
        retryAfter: retryAfterSec,
      });
      return;
    }

    if (now - current.windowStart >= windowMs) {
      current.windowStart = now;
      current.requestCount = 0;
      current.openUntil = 0;
    }

    current.requestCount += 1;

    if (current.requestCount > maxRequests) {
      current.openUntil = now + cooldownMs;
      current.requestCount = 0;
      ipRecords.set(clientIp, current);

      const retryAfterSec = Math.max(1, Math.ceil(cooldownMs / 1000));
      res.setHeader('Retry-After', String(retryAfterSec));
      res.status(HTTP_STATUS.TOO_MANY_REQUESTS).json({
        success: false,
        message: 'Too many requests from this IP. Connection is temporarily blocked.',
        retryAfter: retryAfterSec,
      });
      return;
    }

    ipRecords.set(clientIp, current);
    cleanupStaleRecords(now, windowMs, cooldownMs);
    next();
  };
};
