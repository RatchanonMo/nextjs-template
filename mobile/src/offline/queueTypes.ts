import { TaskFormData } from "../types/task";

export type OfflineTaskMutationType = "create" | "update" | "delete" | "restore";

export interface OfflineTaskMutation {
  id: string;
  type: OfflineTaskMutationType;
  taskId?: string;
  payload?: TaskFormData | Partial<TaskFormData>;
  createdAt: string;
}
