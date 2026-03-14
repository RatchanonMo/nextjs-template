import Task from '../models/Task';
import { config } from '../config/env';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const runCleanupOnce = async () => {
  const cutoff = new Date(Date.now() - config.softDeleteRetentionDays * MS_PER_DAY);

  const result = await Task.deleteMany({
    isDeleted: true,
    deletedAt: { $lte: cutoff },
  });

  if (result.deletedCount && result.deletedCount > 0) {
    console.log(`🧹 Cleanup job: hard-deleted ${result.deletedCount} soft-deleted tasks older than ${config.softDeleteRetentionDays} days`);
  }
};

export const startTaskCleanupJob = () => {
  const run = async () => {
    try {
      await runCleanupOnce();
    } catch (error) {
      console.error('Cleanup job failed:', (error as Error).message);
    }
  };

  void run();
  const timer = setInterval(run, config.softDeleteCleanupIntervalMs);
  timer.unref();
};
