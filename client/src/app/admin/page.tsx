"use client";

import AdminDetailsPanel from "@/components/admin/AdminDetailsPanel";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminUsersPanel from "@/components/admin/AdminUsersPanel";
import Sidebar from "@/components/Sidebar";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { adminAPI } from "@/lib/api/adminAPI";
import { AdminUserOverview, AdminUserSummary, PaginationMeta } from "@/types/admin";
import { UserAccountStatus, UserRole } from "@/types/auth";
import { TaskStatus } from "@/types/task";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const DEFAULT_PAGINATION: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 1,
  hasPrevPage: false,
  hasNextPage: false,
};

const toPositiveInt = (value: string | null, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export default function AdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = toPositiveInt(searchParams.get("page"), 1);
  const search = searchParams.get("search") ?? "";
  const role = (searchParams.get("role") ?? "all") as UserRole | "all";
  const status = (searchParams.get("status") ?? "all") as UserAccountStatus | "all";
  const userId = searchParams.get("userId") ?? "";

  const taskPage = toPositiveInt(searchParams.get("taskPage"), 1);
  const taskSearch = searchParams.get("taskSearch") ?? "";
  const taskStatus = (searchParams.get("taskStatus") ?? "all") as TaskStatus | "all";

  const [searchDraft, setSearchDraft] = useState(search);
  const [taskSearchDraft, setTaskSearchDraft] = useState(taskSearch);
  const debouncedSearch = useDebouncedValue(searchDraft, 300);
  const debouncedTaskSearch = useDebouncedValue(taskSearchDraft, 300);

  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [usersPagination, setUsersPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [usersLoading, setUsersLoading] = useState(false);

  const [overview, setOverview] = useState<AdminUserOverview | null>(null);
  const [tasksPagination, setTasksPagination] = useState<PaginationMeta>(DEFAULT_PAGINATION);
  const [overviewLoading, setOverviewLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);

  const updateQuery = (patch: Record<string, string | number | null | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value === null || value === undefined || value === "" || value === "all") {
        next.delete(key);
        return;
      }
      next.set(key, String(value));
    });
    router.replace(`/admin?${next.toString()}`);
  };

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    setTaskSearchDraft(taskSearch);
  }, [taskSearch]);

  useEffect(() => {
    if (debouncedSearch === search) return;
    updateQuery({ search: debouncedSearch || null, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    if (debouncedTaskSearch === taskSearch) return;
    updateQuery({ taskSearch: debouncedTaskSearch || null, taskPage: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedTaskSearch]);

  useEffect(() => {
    let active = true;
    setUsersLoading(true);
    setError(null);

    void adminAPI
      .getUsers({ page, limit: 10, search, role, status })
      .then((result) => {
        if (!active) return;
        setUsers(result.users);
        setUsersPagination(result.pagination);

        if (!userId && result.users.length > 0) {
          updateQuery({ userId: result.users[0].id, taskPage: 1 });
        }
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        const message = requestError instanceof Error ? requestError.message : "Unable to load users";
        setError(message);
      })
      .finally(() => {
        if (!active) return;
        setUsersLoading(false);
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, role, status]);

  useEffect(() => {
    if (!userId) {
      setOverview(null);
      return;
    }

    let active = true;
    setOverviewLoading(true);
    setError(null);

    void adminAPI
      .getUserOverview(userId, {
        taskPage,
        taskLimit: 8,
        taskStatus,
        taskSearch,
      })
      .then((result) => {
        if (!active) return;
        setOverview(result.overview);
        setTasksPagination(result.taskPagination);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        const message = requestError instanceof Error ? requestError.message : "Unable to load user overview";
        setError(message);
      })
      .finally(() => {
        if (!active) return;
        setOverviewLoading(false);
      });

    return () => {
      active = false;
    };
  }, [taskPage, taskSearch, taskStatus, userId]);

  const refreshUsers = async () => {
    const usersResponse = await adminAPI.getUsers({ page, limit: 10, search, role, status });
    setUsers(usersResponse.users);
    setUsersPagination(usersResponse.pagination);
  };

  const refreshOverview = async (targetUserId: string) => {
    const detailsResponse = await adminAPI.getUserOverview(targetUserId, {
      taskPage,
      taskLimit: 8,
      taskStatus,
      taskSearch,
    });
    setOverview(detailsResponse.overview);
    setTasksPagination(detailsResponse.taskPagination);
  };

  const updateRole = async (targetUserId: string, nextRole: UserRole) => {
    try {
      setSavingUserId(targetUserId);
      await adminAPI.updateUserRole(targetUserId, nextRole);
      await refreshUsers();
      if (targetUserId === userId) {
        await refreshOverview(targetUserId);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update role");
    } finally {
      setSavingUserId(null);
    }
  };

  const updateStatus = async (targetUserId: string, nextStatus: UserAccountStatus) => {
    try {
      setSavingUserId(targetUserId);
      await adminAPI.updateUserStatus(targetUserId, nextStatus);
      await refreshUsers();
      if (targetUserId === userId) {
        await refreshOverview(targetUserId);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to update account status");
    } finally {
      setSavingUserId(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f4f5]">
      <Sidebar inboxCount={0} />

      <main className="flex min-w-0 flex-1 flex-col overflow-hidden px-8 py-6">
        <AdminHeader error={error} />

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <AdminUsersPanel
            users={users}
            usersLoading={usersLoading}
            usersPagination={usersPagination}
            selectedUserId={userId}
            page={page}
            searchDraft={searchDraft}
            role={role}
            status={status}
            onSearchDraftChange={setSearchDraft}
            onRoleChange={(value) => updateQuery({ role: value, page: 1 })}
            onStatusChange={(value) => updateQuery({ status: value, page: 1 })}
            onSelectUser={(selectedId) => updateQuery({ userId: selectedId, taskPage: 1, taskSearch: null, taskStatus: null })}
            onPageChange={(nextPage) => updateQuery({ page: nextPage })}
          />

          <AdminDetailsPanel
            selectedUserId={userId}
            overview={overview}
            overviewLoading={overviewLoading}
            savingUserId={savingUserId}
            taskStatus={taskStatus}
            taskSearchDraft={taskSearchDraft}
            taskPage={taskPage}
            tasksPagination={tasksPagination}
            onTaskSearchDraftChange={setTaskSearchDraft}
            onTaskStatusChange={(value) => updateQuery({ taskStatus: value, taskPage: 1 })}
            onRoleChange={(targetUserId, nextRole) => {
              void updateRole(targetUserId, nextRole);
            }}
            onStatusChange={(targetUserId, nextStatus) => {
              void updateStatus(targetUserId, nextStatus);
            }}
            onTaskPageChange={(nextPage) => updateQuery({ taskPage: nextPage })}
          />
        </div>
      </main>
    </div>
  );
}
