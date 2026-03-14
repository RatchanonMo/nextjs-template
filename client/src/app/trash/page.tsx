"use client";

import { useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useTaskStore } from "@/stores/useTaskStore";
import { HiOutlineRefresh, HiTrash, HiReply } from "react-icons/hi";

const getTaskId = (task: { id: string; _id?: string }) => task._id ?? task.id;

const formatDeletedAt = (value?: Date) => {
  if (!value) return "Unknown";
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function TrashPage() {
  const {
    tasks,
    deletedTasks,
    isLoading,
    fetchDeletedTasks,
    restoreTaskAsync,
    hardDeleteTaskAsync,
  } = useTaskStore();

  useEffect(() => {
    void fetchDeletedTasks();
  }, [fetchDeletedTasks]);

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar inboxCount={tasks.filter((task) => task.status !== "done").length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-7 pb-4 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Trash</h1>
            <p className="text-gray-400 text-sm mt-0.5">Soft-deleted tasks. You can restore or permanently delete.</p>
          </div>
          <button
            type="button"
            onClick={() => { void fetchDeletedTasks(); }}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-600 border border-gray-200 hover:border-primary/40 hover:text-primary"
          >
            <HiOutlineRefresh className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {isLoading ? (
            <div className="space-y-3 max-w-3xl">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 rounded-2xl bg-white/70 animate-pulse" />
              ))}
            </div>
          ) : deletedTasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400 bg-white max-w-3xl">
              Trash is empty.
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {deletedTasks.map((task) => (
                <article key={getTaskId(task)} className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description || "No description"}</p>
                      <p className="text-[11px] text-gray-400 mt-2">
                        Deleted at: {formatDeletedAt(task.deletedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { void restoreTaskAsync(getTaskId(task)); }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 hover:border-primary/40 hover:text-primary"
                      >
                        <HiReply className="w-3.5 h-3.5" />
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => { void hardDeleteTaskAsync(getTaskId(task)); }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50"
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                        Delete Permanently
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
