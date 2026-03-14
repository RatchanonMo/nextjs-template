import { AdminUserOverview, PaginationMeta } from "@/types/admin";
import { UserAccountStatus, UserRole } from "@/types/auth";
import { TaskStatus } from "@/types/task";
import { HiOutlineSearch } from "react-icons/hi";

interface AdminDetailsPanelProps {
  selectedUserId: string;
  overview: AdminUserOverview | null;
  overviewLoading: boolean;
  savingUserId: string | null;
  taskStatus: TaskStatus | "all";
  taskSearchDraft: string;
  taskPage: number;
  tasksPagination: PaginationMeta;
  onTaskSearchDraftChange: (value: string) => void;
  onTaskStatusChange: (value: TaskStatus | "all") => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  onStatusChange: (userId: string, status: UserAccountStatus) => void;
  onTaskPageChange: (page: number) => void;
}

const dateLabel = (value?: string) => (value ? new Date(value).toLocaleDateString() : "-");

export default function AdminDetailsPanel({
  selectedUserId,
  overview,
  overviewLoading,
  savingUserId,
  taskStatus,
  taskSearchDraft,
  taskPage,
  tasksPagination,
  onTaskSearchDraftChange,
  onTaskStatusChange,
  onRoleChange,
  onStatusChange,
  onTaskPageChange,
}: AdminDetailsPanelProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      {!selectedUserId ? (
        <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">
          Select a user to inspect tasks and projects.
        </div>
      ) : overviewLoading || !overview ? (
        <div className="space-y-3">
          <div className="h-20 animate-pulse rounded-xl bg-gray-100" />
          <div className="h-52 animate-pulse rounded-xl bg-gray-100" />
        </div>
      ) : (
        <>
          <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-gray-900">{overview.user.name}</p>
                <p className="text-sm text-gray-500">{overview.user.email}</p>
                <p className="mt-1 text-xs text-gray-500">Created: {dateLabel(overview.user.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={overview.user.role}
                  disabled={savingUserId === overview.user.id}
                  onChange={(event) => onRoleChange(overview.user.id, event.target.value as UserRole)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
                >
                  <option value="user">Role: user</option>
                  <option value="admin">Role: admin</option>
                </select>
                <select
                  value={overview.user.accountStatus}
                  disabled={savingUserId === overview.user.id}
                  onChange={(event) => onStatusChange(overview.user.id, event.target.value as UserAccountStatus)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm"
                >
                  <option value="active">Status: active</option>
                  <option value="suspended">Status: suspended</option>
                  <option value="deactivated">Status: deactivated</option>
                </select>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-gray-600 sm:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">Total tasks: {overview.taskStats.total}</div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">Todo: {overview.taskStats.byStatus.todo ?? 0}</div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">In progress: {overview.taskStats.byStatus["in-progress"] ?? 0}</div>
              <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">Done: {overview.taskStats.byStatus.done ?? 0}</div>
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <div className="relative w-full flex-1 min-w-[220px]">
              <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={taskSearchDraft}
                onChange={(event) => onTaskSearchDraftChange(event.target.value)}
                placeholder="Search user tasks"
                className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/40"
              />
            </div>
            <select
              value={taskStatus}
              onChange={(event) => onTaskStatusChange(event.target.value as TaskStatus | "all")}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <option value="all">All task status</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-h-0 overflow-auto rounded-xl border border-gray-200">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-3 py-2">Task</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Priority</th>
                    <th className="px-3 py-2">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.tasks.length === 0 ? (
                    <tr>
                      <td className="px-3 py-4 text-gray-500" colSpan={4}>
                        No tasks match current filters.
                      </td>
                    </tr>
                  ) : (
                    overview.tasks.map((task, index) => (
                      <tr key={task._id ?? `task-row-${index}`} className="border-t border-gray-100">
                        <td className="px-3 py-2">
                          <p className="font-medium text-gray-900">{task.title}</p>
                          <p className="line-clamp-1 text-xs text-gray-500">{task.description || "-"}</p>
                        </td>
                        <td className="px-3 py-2 capitalize text-gray-700">{task.status}</td>
                        <td className="px-3 py-2 capitalize text-gray-700">{task.priority}</td>
                        <td className="px-3 py-2 text-gray-500">{dateLabel(task.updatedAt ? String(task.updatedAt) : undefined)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="min-h-0 overflow-auto rounded-xl border border-gray-200 p-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Projects</p>
              {overview.projects.length === 0 ? (
                <p className="text-sm text-gray-500">No projects in workspace.</p>
              ) : (
                <div className="space-y-2">
                  {overview.projects.map((project) => (
                    <div key={project.id} className="rounded-lg border border-gray-200 px-3 py-2">
                      <p className="text-sm font-semibold text-gray-900">{project.name}</p>
                      <p className="line-clamp-2 text-xs text-gray-500">{project.description || "No description"}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2 text-xs text-gray-600">
            <button
              type="button"
              disabled={!tasksPagination.hasPrevPage}
              onClick={() => onTaskPageChange(taskPage - 1)}
              className="rounded-lg border border-gray-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Prev tasks
            </button>
            <span>
              {tasksPagination.page} / {tasksPagination.totalPages}
            </span>
            <button
              type="button"
              disabled={!tasksPagination.hasNextPage}
              onClick={() => onTaskPageChange(taskPage + 1)}
              className="rounded-lg border border-gray-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next tasks
            </button>
          </div>
        </>
      )}
    </section>
  );
}
