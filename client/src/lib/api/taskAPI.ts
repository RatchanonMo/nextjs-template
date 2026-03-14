import { apiClient } from "@/lib/api/client";
import { Task, TaskAnalytics, TaskFormData } from "@/types/task";

type ApiResponse<T> = { success: boolean; data: T; count?: number };

const parseDueDate = (value: unknown): Date | undefined => {
  if (!value) return undefined;
  const raw = String(value);
  const [year, month, day] = raw.slice(0, 10).split("-").map(Number);
  if ([year, month, day].every(Number.isFinite)) {
    return new Date(year, month - 1, day);
  }
  return new Date(raw);
};

/** Convert raw date strings returned from the server to Date objects */
const toTask = (raw: Record<string, unknown>): Task => {
  const resolvedId = String(raw._id ?? raw.id ?? "");
  return {
    ...raw,
    id: resolvedId,
    _id: String(raw._id ?? resolvedId),
    createdAt: new Date(raw.createdAt as string),
    updatedAt: new Date(raw.updatedAt as string),
    dueDate: parseDueDate(raw.dueDate),
    deletedAt: parseDueDate(raw.deletedAt),
  } as Task;
};

export interface TaskStats {
  total: number;
  byStatus: { todo: number; "in-progress": number; done: number };
  byPriority: { low: number; medium: number; high: number };
}

export interface TaskQueryOptions {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
}

export const taskAPI = {
  /** GET /api/tasks — optionally filtered */
  async getTasks(params?: TaskQueryOptions, signal?: AbortSignal): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<Record<string, unknown>[]>>("/tasks", { params, signal });
    return data.data.map(toTask);
  },

  /** GET /api/tasks/deleted */
  async getDeletedTasks(params?: {
    status?: string;
    priority?: string;
    search?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<Task[]> {
    const { data } = await apiClient.get<ApiResponse<Record<string, unknown>[]>>("/tasks/deleted", { params });
    return data.data.map(toTask);
  },

  /** GET /api/tasks/:id */
  async getTask(id: string): Promise<Task> {
    const { data } = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/tasks/${id}`);
    return toTask(data.data);
  },

  /** POST /api/tasks */
  async createTask(task: TaskFormData): Promise<Task> {
    const { data } = await apiClient.post<ApiResponse<Record<string, unknown>>>("/tasks", task);
    return toTask(data.data);
  },

  /** PUT /api/tasks/:id */
  async updateTask(id: string, task: Partial<TaskFormData>): Promise<Task> {
    const { data } = await apiClient.put<ApiResponse<Record<string, unknown>>>(`/tasks/${id}`, task);
    return toTask(data.data);
  },

  /** DELETE /api/tasks/:id */
  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`);
  },

  /** DELETE /api/tasks/:id?hard=true */
  async hardDeleteTask(id: string): Promise<void> {
    await apiClient.delete(`/tasks/${id}`, { params: { hard: true } });
  },

  /** PATCH /api/tasks/:id/restore */
  async restoreTask(id: string): Promise<Task> {
    const { data } = await apiClient.patch<ApiResponse<Record<string, unknown>>>(`/tasks/${id}/restore`);
    return toTask(data.data);
  },

  /** GET /api/tasks/stats */
  async getStats(): Promise<TaskStats> {
    const { data } = await apiClient.get<ApiResponse<TaskStats>>("/tasks/stats");
    return data.data;
  },

  /** GET /api/tasks/analytics */
  async getAnalytics(): Promise<TaskAnalytics> {
    const { data } = await apiClient.get<ApiResponse<TaskAnalytics>>("/tasks/analytics");
    return data.data;
  },
};
