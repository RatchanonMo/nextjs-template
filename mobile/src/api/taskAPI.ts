import { ApiResponse, PaginatedPayload } from "../types/api";
import { Task, TaskAnalytics, TaskFormData, TaskStats } from "../types/task";
import { apiClient } from "./client";

export interface TaskQueryOptions {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
}

const toTask = (raw: Task): Task => {
  const resolvedId = String(raw._id ?? raw.id ?? "");
  return {
    ...raw,
    id: resolvedId,
    _id: String(raw._id ?? resolvedId),
  };
};

export const taskAPI = {
  async getTasks(params?: TaskQueryOptions): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedPayload<Task> | Task[]>>("/tasks", { params });
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch tasks");
    }

    const items = Array.isArray(data.data) ? data.data : data.data.data;
    return items.map(toTask);
  },

  async getDeletedTasks(): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<PaginatedPayload<Task> | Task[]>>("/tasks/deleted");
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch deleted tasks");
    }
    const items = Array.isArray(data.data) ? data.data : data.data.data;
    return items.map(toTask);
  },

  async createTask(task: TaskFormData): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<Task>>("/tasks", task);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to create task");
    }
    return toTask(data.data);
  },

  async updateTask(id: string, task: Partial<TaskFormData>): Promise<Task> {
    const { data } = await apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, task);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to update task");
    }
    return toTask(data.data);
  },

  async deleteTask(id: string): Promise<void> {
    const { data } = await apiClient.delete<ApiResponse<unknown>>(`/tasks/${id}`);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to delete task");
    }
  },

  async getTask(id: string): Promise<Task> {
    const { data } = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch task");
    }
    return toTask(data.data);
  },

  async restoreTask(id: string): Promise<Task> {
    const { data } = await apiClient.patch<ApiResponse<Task>>(`/tasks/${id}/restore`);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to restore task");
    }
    return toTask(data.data);
  },

  async getStats(): Promise<TaskStats> {
    const { data } = await apiClient.get<ApiResponse<TaskStats>>("/tasks/stats");
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch task stats");
    }
    return data.data;
  },

  async getAnalytics(): Promise<TaskAnalytics> {
    const { data } = await apiClient.get<ApiResponse<TaskAnalytics>>("/tasks/analytics");
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch analytics");
    }
    return data.data;
  },
};
