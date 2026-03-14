import { User, UserAccountStatus, UserRole } from "@/types/auth";
import { Task, TaskStatus } from "@/types/task";

export interface AdminUserSummary extends User {
  taskCount: number;
  projectCount: number;
}

export interface AdminUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole | "all";
  status?: UserAccountStatus | "all";
}

export interface AdminTaskFilters {
  taskPage?: number;
  taskLimit?: number;
  taskStatus?: TaskStatus | "all";
  taskSearch?: string;
}

export interface AdminUserOverview {
  user: User;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    icon: string;
    accentColor: string;
  }>;
  labels: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  tasks: Task[];
  taskStats: {
    total: number;
    byStatus: Record<string, number>;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
}
