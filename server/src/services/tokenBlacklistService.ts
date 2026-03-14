import crypto from 'crypto';
import TokenBlacklist from '../models/TokenBlacklist';
import { config } from '../config/env';

type BlacklistInput = {
  token: string;
  userId: string;
  exp?: number;
  reason?: string;
};

const hashToken = (token: string) =>
  crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

const resolveExpiryDate = (exp?: number): Date => {
  if (typeof exp === 'number' && Number.isFinite(exp)) {
    return new Date(exp * 1000);
  }

  return new Date(Date.now() + config.tokenBlacklistRetentionMs);
};

export const addTokenToBlacklist = async ({ token, userId, exp, reason = 'logout' }: BlacklistInput): Promise<void> => {
  const tokenHash = hashToken(token);
  const expiresAt = resolveExpiryDate(exp);

  await TokenBlacklist.updateOne(
    { tokenHash },
    {
      $set: {
        tokenHash,
        userId,
        expiresAt,
        reason,
      },
    },
    { upsert: true },
  );
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const tokenHash = hashToken(token);
  const now = new Date();

  const exists = await TokenBlacklist.exists({ tokenHash, expiresAt: { $gt: now } });
  return Boolean(exists);
};
