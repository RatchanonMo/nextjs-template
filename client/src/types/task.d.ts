export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskCategory = "MARKETING" | "DESIGN" | "DEVELOPMENT" | "OPERATIONS" | "PRODUCT" | "PERSONAL";

export interface TaskAssignee {
  name: string;
  color: string;
}

export interface Task {
  _id?: string;
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  startTime?: string;
  endTime?: string;
  tags: string[];
  assignees?: TaskAssignee[];
  isOverdue?: boolean;
  projectId?: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface TaskFormData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  dueDate?: string;
  startTime?: string;
  endTime?: string;
  tags: string[];
  assignees?: TaskAssignee[];
  projectId?: string;
}

export interface TaskAnalyticsBucket {
  _id: string;
  count: number;
}

export interface TaskAnalyticsOverview {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  overdue: number;
  completionRate: number;
}

export interface TaskAnalytics {
  generatedAt: string;
  overview: TaskAnalyticsOverview;
  byStatus: TaskAnalyticsBucket[];
  byPriority: TaskAnalyticsBucket[];
  byCategory: TaskAnalyticsBucket[];
  dueTimeline: TaskAnalyticsBucket[];
  topTags: TaskAnalyticsBucket[];
}

export interface Project {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  icon: string;
  accentColor: string;
  progress: number;
  taskCount: number;
  completedTaskCount: number;
  assignees: TaskAssignee[];
  subtasks: { id: string; title: string; done: boolean }[];
}

