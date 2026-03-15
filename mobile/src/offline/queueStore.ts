import AsyncStorage from "@react-native-async-storage/async-storage";

import { OfflineTaskMutation } from "./queueTypes";
import { useAppStore } from "../store/appStore";

const QUEUE_KEY = "rn-offline-task-queue";

export const queueStore = {
  async read(): Promise<OfflineTaskMutation[]> {
    const raw = await AsyncStorage.getItem(QUEUE_KEY);
    if (!raw) {
      useAppStore.getState().setPendingQueueCount(0);
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as OfflineTaskMutation[];
      const queue = Array.isArray(parsed) ? parsed : [];
      useAppStore.getState().setPendingQueueCount(queue.length);
      return queue;
    } catch {
      useAppStore.getState().setPendingQueueCount(0);
      return [];
    }
  },

  async write(queue: OfflineTaskMutation[]): Promise<void> {
    await AsyncStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    useAppStore.getState().setPendingQueueCount(queue.length);
  },

  async enqueue(mutation: OfflineTaskMutation): Promise<void> {
    const queue = await this.read();
    queue.push(mutation);
    await this.write(queue);
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(QUEUE_KEY);
    useAppStore.getState().setPendingQueueCount(0);
  },
};
