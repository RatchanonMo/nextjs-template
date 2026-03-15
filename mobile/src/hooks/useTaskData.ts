import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { taskAPI } from "../api/taskAPI";
import { queryKeys } from "../constants/queryKeys";
import { queueStore } from "../offline/queueStore";
import { OfflineTaskMutation } from "../offline/queueTypes";
import { useAppStore } from "../store/appStore";
import { Task, TaskFormData } from "../types/task";
import { isToday, isUpcoming } from "../utils/date";

const newQueueId = () => `q-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

const addOrReplaceTask = (tasks: Task[], task: Task): Task[] => {
  const index = tasks.findIndex((item) => (item._id ?? item.id) === (task._id ?? task.id));
  if (index === -1) {
    return [task, ...tasks];
  }
  const next = [...tasks];
  next[index] = task;
  return next;
};

export const useTaskData = () => {
  const queryClient = useQueryClient();
  const isOnline = useAppStore((state) => state.isOnline);

  const tasksQuery = useQuery({
    queryKey: queryKeys.tasks(),
    queryFn: () => taskAPI.getTasks(),
  });

  const deletedTasksQuery = useQuery({
    queryKey: queryKeys.deletedTasks,
    queryFn: () => taskAPI.getDeletedTasks(),
  });

  const createMutation = useMutation({
    mutationFn: async (payload: TaskFormData) => {
      if (isOnline) {
        return taskAPI.createTask(payload);
      }

      const queued: OfflineTaskMutation = {
        id: newQueueId(),
        type: "create",
        payload,
        createdAt: new Date().toISOString(),
      };

      await queueStore.enqueue(queued);

      return {
        _id: queued.id,
        id: queued.id,
        title: payload.title,
        description: payload.description,
        status: payload.status,
        priority: payload.priority,
        category: payload.category,
        tags: payload.tags,
        dueDate: payload.dueDate,
        startTime: payload.startTime,
        endTime: payload.endTime,
        assignees: payload.assignees,
        projectId: payload.projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Task;
    },
    onSuccess: (task) => {
      queryClient.setQueryData<Task[]>(queryKeys.tasks(), (prev = []) => [task, ...prev]);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<TaskFormData> }) => {
      if (isOnline) {
        return taskAPI.updateTask(id, patch);
      }

      await queueStore.enqueue({
        id: newQueueId(),
        type: "update",
        taskId: id,
        payload: patch,
        createdAt: new Date().toISOString(),
      });

      const current = queryClient.getQueryData<Task[]>(queryKeys.tasks()) ?? [];
      const target = current.find((item) => (item._id ?? item.id) === id);
      if (!target) return null;
      return { ...target, ...patch, updatedAt: new Date().toISOString() } as Task;
    },
    onSuccess: (task) => {
      if (!task) return;
      queryClient.setQueryData<Task[]>(queryKeys.tasks(), (prev = []) => addOrReplaceTask(prev, task));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isOnline) {
        await taskAPI.deleteTask(id);
        return id;
      }

      await queueStore.enqueue({
        id: newQueueId(),
        type: "delete",
        taskId: id,
        createdAt: new Date().toISOString(),
      });

      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<Task[]>(queryKeys.tasks(), (prev = []) =>
        prev.filter((item) => (item._id ?? item.id) !== id)
      );
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isOnline) {
        return taskAPI.restoreTask(id);
      }

      await queueStore.enqueue({
        id: newQueueId(),
        type: "restore",
        taskId: id,
        createdAt: new Date().toISOString(),
      });

      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.deletedTasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks() });
    },
  });

  const todayTasks = useMemo(
    () => (tasksQuery.data ?? []).filter((task) => isToday(task.dueDate)),
    [tasksQuery.data]
  );

  const upcomingTasks = useMemo(
    () => (tasksQuery.data ?? []).filter((task) => isUpcoming(task.dueDate)),
    [tasksQuery.data]
  );

  return {
    tasksQuery,
    deletedTasksQuery,
    todayTasks,
    upcomingTasks,
    createMutation,
    updateMutation,
    deleteMutation,
    restoreMutation,
  };
};
