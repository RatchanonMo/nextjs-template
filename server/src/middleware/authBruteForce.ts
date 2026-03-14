import { NextFunction, Request, Response } from 'express';
import { config } from '../config/env';

type AttemptRecord = {
  firstAttemptAt: number;
  failedCount: number;
  lockUntil: number | null;
};

const attemptStore = new Map<string, AttemptRecord>();

const buildLoginAttemptKey = (req: Request) => {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown-ip';
  const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : 'unknown-email';
  return `${ip}:${email}`;
};

const cleanupExpiredRecords = (now: number) => {
  for (const [key, value] of attemptStore.entries()) {
    const lockExpired = value.lockUntil !== null && value.lockUntil <= now;
    const windowExpired = now - value.firstAttemptAt > config.authBruteForceWindowMs;

    if (lockExpired || windowExpired) {
      attemptStore.delete(key);
    }
  }
};

const getOrCreateRecord = (key: string, now: number): AttemptRecord => {
  const existing = attemptStore.get(key);
  if (!existing) {
    const created: AttemptRecord = { firstAttemptAt: now, failedCount: 0, lockUntil: null };
    attemptStore.set(key, created);
    return created;
  }

  if (now - existing.firstAttemptAt > config.authBruteForceWindowMs) {
    existing.firstAttemptAt = now;
    existing.failedCount = 0;
    existing.lockUntil = null;
  }

  return existing;
};

export const loginBruteForceGuard = (req: Request, res: Response, next: NextFunction): void => {
  const now = Date.now();
  cleanupExpiredRecords(now);

  const key = buildLoginAttemptKey(req);
  const record = getOrCreateRecord(key, now);

  if (record.lockUntil && record.lockUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockUntil - now) / 1000);
    res.setHeader('Retry-After', String(retryAfterSeconds));
    res.status(429).json({
      success: false,
      message: `Too many failed login attempts. Try again in ${retryAfterSeconds} seconds.`,
    });
    return;
  }

  next();
};

export const recordFailedLoginAttempt = (req: Request): { remainingAttempts: number; locked: boolean } => {
  const now = Date.now();
  const key = buildLoginAttemptKey(req);
  const record = getOrCreateRecord(key, now);

  record.failedCount += 1;

  if (record.failedCount >= config.authBruteForceMaxAttempts) {
    record.lockUntil = now + config.authBruteForceLockMs;
    return { remainingAttempts: 0, locked: true };
  }

  return {
    remainingAttempts: Math.max(0, config.authBruteForceMaxAttempts - record.failedCount),
    locked: false,
  };
};

export const clearLoginAttemptRecord = (req: Request): void => {
  const key = buildLoginAttemptKey(req);
  attemptStore.delete(key);
};
