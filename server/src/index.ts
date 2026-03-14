import express from 'express';
import cors from 'cors';
import { config } from './config/env';
import { connectDB } from './config/database';


import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import workspaceRoutes from './routes/workspaceRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';
import { createIpCircuitBreaker } from './middleware/circuitBreaker';
import { startTaskCleanupJob } from './jobs/taskCleanupJob';

const app = express();

connectDB();
startTaskCleanupJob();

app.disable('x-powered-by');
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: config.requestJsonLimit }));
app.use(express.urlencoded({ extended: true, limit: config.requestUrlEncodedLimit }));

app.use((req, _res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (_req, res) => {
  res.status(200).json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

app.use(
  '/api',
  createIpCircuitBreaker({
    maxRequests: config.circuitBreakerMaxRequests,
    windowMs: config.circuitBreakerWindowMs,
    cooldownMs: config.circuitBreakerCooldownMs,
  }),
);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/workspace', workspaceRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = config.port;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

server.keepAliveTimeout = config.serverKeepAliveTimeoutMs;
server.headersTimeout = config.serverHeadersTimeoutMs;

process.on('unhandledRejection', (err: Error) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  process.exit(1);
});
