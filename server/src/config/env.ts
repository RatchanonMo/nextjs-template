import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env variable: ${key}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT) || 5001,
  mongoUri: required('MONGODB_URI'),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3001',
  jwtSecret: required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  requestJsonLimit: process.env.REQUEST_JSON_LIMIT ?? '512kb',
  requestUrlEncodedLimit: process.env.REQUEST_URLENCODED_LIMIT ?? '512kb',
  serverKeepAliveTimeoutMs: Number(process.env.SERVER_KEEP_ALIVE_TIMEOUT_MS) || 65_000,
  serverHeadersTimeoutMs: Number(process.env.SERVER_HEADERS_TIMEOUT_MS) || 66_000,
  mongoMaxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE) || 20,
  externalAdviceApiUrl: process.env.EXTERNAL_ADVICE_API_URL ?? 'https://api.adviceslip.com/advice',
  externalAdviceApiTimeoutMs: Number(process.env.EXTERNAL_ADVICE_API_TIMEOUT_MS) || 2_500,
  softDeleteRetentionDays: Number(process.env.SOFT_DELETE_RETENTION_DAYS) || 30,
  softDeleteCleanupIntervalMs: Number(process.env.SOFT_DELETE_CLEANUP_INTERVAL_MS) || 3_600_000,
  circuitBreakerMaxRequests: Number(process.env.CIRCUIT_BREAKER_MAX_REQUESTS) || 120,
  circuitBreakerWindowMs: Number(process.env.CIRCUIT_BREAKER_WINDOW_MS) || 60_000,
  circuitBreakerCooldownMs: Number(process.env.CIRCUIT_BREAKER_COOLDOWN_MS) || 30_000,
  authBruteForceMaxAttempts: Number(process.env.AUTH_BRUTE_FORCE_MAX_ATTEMPTS) || 5,
  authBruteForceWindowMs: Number(process.env.AUTH_BRUTE_FORCE_WINDOW_MS) || 15 * 60_000,
  authBruteForceLockMs: Number(process.env.AUTH_BRUTE_FORCE_LOCK_MS) || 15 * 60_000,
  tokenBlacklistRetentionMs: Number(process.env.TOKEN_BLACKLIST_RETENTION_MS) || 7 * 24 * 60 * 60_000,
};
