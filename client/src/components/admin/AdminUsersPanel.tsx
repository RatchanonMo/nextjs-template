import { AdminUserSummary, PaginationMeta } from "@/types/admin";
import { UserAccountStatus, UserRole } from "@/types/auth";
import { HiOutlineSearch } from "react-icons/hi";

interface AdminUsersPanelProps {
  users: AdminUserSummary[];
  usersLoading: boolean;
  usersPagination: PaginationMeta;
  selectedUserId: string;
  page: number;
  searchDraft: string;
  role: UserRole | "all";
  status: UserAccountStatus | "all";
  onSearchDraftChange: (value: string) => void;
  onRoleChange: (value: UserRole | "all") => void;
  onStatusChange: (value: UserAccountStatus | "all") => void;
  onSelectUser: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export default function AdminUsersPanel({
  users,
  usersLoading,
  usersPagination,
  selectedUserId,
  page,
  searchDraft,
  role,
  status,
  onSearchDraftChange,
  onRoleChange,
  onStatusChange,
  onSelectUser,
  onPageChange,
}: AdminUsersPanelProps) {
  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <HiOutlineSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchDraft}
            onChange={(event) => onSearchDraftChange(event.target.value)}
            placeholder="Search name or email"
            className="w-full rounded-xl border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary/40"
          />
        </div>
        <select
          value={role}
          onChange={(event) => onRoleChange(event.target.value as UserRole | "all")}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as UserAccountStatus | "all")}
          className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none"
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deactivated">Deactivated</option>
        </select>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        {usersLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-20 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 p-5 text-sm text-gray-500">No users found.</div>
        ) : (
          <div className="space-y-2">
            {users.map((item) => {
              const selected = item.id === selectedUserId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectUser(item.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left transition ${
                    selected
                      ? "border-primary/40 bg-primary/5"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.email}</p>
                    </div>
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                      {item.role}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                    <span>{item.taskCount} tasks</span>
                    <span>{item.projectCount} projects</span>
                    <span className="capitalize">{item.accountStatus}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          Page {usersPagination.page} / {usersPagination.totalPages}
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!usersPagination.hasPrevPage}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-gray-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={!usersPagination.hasNextPage}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-gray-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
