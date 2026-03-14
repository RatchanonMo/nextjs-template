import { apiClient } from "@/lib/api/client";
import {
  AdminTaskFilters,
  AdminUserOverview,
  AdminUsersFilters,
  AdminUserSummary,
  PaginationMeta,
} from "@/types/admin";
import { UserAccountStatus, UserRole } from "@/types/auth";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

type ListUsersResponse = ApiResponse<AdminUserSummary[]> & {
  pagination: PaginationMeta;
};

type UserOverviewResponse = ApiResponse<AdminUserOverview> & {
  taskPagination: PaginationMeta;
};

const normalizeRole = (role?: AdminUsersFilters["role"]) => (role && role !== "all" ? role : undefined);
const normalizeStatus = (status?: AdminUsersFilters["status"]) => (status && status !== "all" ? status : undefined);
const normalizeTaskStatus = (status?: AdminTaskFilters["taskStatus"]) => (status && status !== "all" ? status : undefined);

export const adminAPI = {
  async getUsers(filters: AdminUsersFilters): Promise<{ users: AdminUserSummary[]; pagination: PaginationMeta }> {
    const params = {
      page: filters.page,
      limit: filters.limit,
      search: filters.search || undefined,
      role: normalizeRole(filters.role),
      status: normalizeStatus(filters.status),
    };

    const { data } = await apiClient.get<ListUsersResponse>("/admin/users", { params });
    return { users: data.data, pagination: data.pagination };
  },

  async getUserOverview(
    userId: string,
    filters: AdminTaskFilters,
  ): Promise<{ overview: AdminUserOverview; taskPagination: PaginationMeta }> {
    const params = {
      taskPage: filters.taskPage,
      taskLimit: filters.taskLimit,
      taskStatus: normalizeTaskStatus(filters.taskStatus),
      taskSearch: filters.taskSearch || undefined,
    };

    const { data } = await apiClient.get<UserOverviewResponse>(`/admin/users/${userId}/overview`, { params });
    return { overview: data.data, taskPagination: data.taskPagination };
  },

  async updateUserRole(userId: string, role: UserRole): Promise<AdminUserSummary> {
    const { data } = await apiClient.patch<ApiResponse<AdminUserSummary>>(`/admin/users/${userId}/role`, { role });
    return data.data;
  },

  async updateUserStatus(userId: string, accountStatus: UserAccountStatus): Promise<AdminUserSummary> {
    const { data } = await apiClient.patch<ApiResponse<AdminUserSummary>>(`/admin/users/${userId}/status`, {
      accountStatus,
    });
    return data.data;
  },
};
