import { taskAPI } from "../api/taskAPI";
import { OfflineTaskMutation } from "./queueTypes";
import { queueStore } from "./queueStore";

const processMutation = async (mutation: OfflineTaskMutation): Promise<void> => {
  if (mutation.type === "create" && mutation.payload) {
    await taskAPI.createTask(mutation.payload as Parameters<typeof taskAPI.createTask>[0]);
    return;
  }

  if (mutation.type === "update" && mutation.taskId && mutation.payload) {
    await taskAPI.updateTask(mutation.taskId, mutation.payload);
    return;
  }

  if (mutation.type === "delete" && mutation.taskId) {
    await taskAPI.deleteTask(mutation.taskId);
    return;
  }

  if (mutation.type === "restore" && mutation.taskId) {
    await taskAPI.restoreTask(mutation.taskId);
  }
};

export const syncOfflineQueue = async (): Promise<void> => {
  const queue = await queueStore.read();
  if (!queue.length) return;

  const remaining: OfflineTaskMutation[] = [];

  for (const item of queue) {
    try {
      await processMutation(item);
    } catch {
      remaining.push(item);
    }
  }

  await queueStore.write(remaining);
};
