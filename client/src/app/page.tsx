"use client";
import TaskEmptyState from "@/components/dashboard/TaskEmptyState";
import TaskGrid from "@/components/dashboard/TaskGrid";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { Task } from "@/types/task";
import { sampleTasks } from "@/utils/sampleData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { HiCog, HiLogout, HiOutlineSearch, HiUser } from "react-icons/hi";

export default function Home() {
  const { tasks, fetchTasks, createTaskAsync, isLoading, error } = useTaskStore();
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const debouncedSearch = useDebouncedValue(search, 350);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      const controller = new AbortController();
      void fetchTasks(
        { search: debouncedSearch.trim().length > 0 ? debouncedSearch.trim() : undefined },
        controller.signal,
      );

      return () => controller.abort();
    }
  }, [debouncedSearch, fetchTasks, user]);

  const todoTasks = useMemo(
    () => tasks.filter((t) => t.status === "todo"),
    [tasks],
  );
  const inProgressTasks = useMemo(
    () => tasks.filter((t) => t.status === "in-progress"),
    [tasks],
  );
  const doneTasks = useMemo(
    () => tasks.filter((t) => t.status === "done"),
    [tasks],
  );

  const inboxCount = useMemo(
    () => tasks.filter((task) => task.status !== "done").length,
    [tasks],
  );

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleLoadSampleData = async () => {
    for (const task of sampleTasks) {
      await createTaskAsync({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : undefined,
        startTime: task.startTime,
        endTime: task.endTime,
        tags: task.tags,
        assignees: task.assignees,
        projectId: task.projectId,
      });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const inProgressCount = inProgressTasks.length;

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar onNewTask={handleCreateTask} inboxCount={inboxCount} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-8 pt-7 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              {getGreeting()}, {user?.name ?? "there"}
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              You have{" "}
              <span className="text-primary font-semibold">
                {inProgressCount} tasks
              </span>{" "}
              in progress today.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="relative">
              <HiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="bg-white pl-9 pr-4 py-2 rounded-xl text-sm text-gray-700 border border-gray-200 outline-none focus:border-primary/50 w-52 shadow-sm"
              />
              {search !== debouncedSearch && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-gray-400">
                  Searching...
                </span>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-primary/30 transition-all"
              >
                <HiUser className="w-5 h-5 text-gray-500" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 overflow-hidden z-50">
                  {/* User info */}
                  <div className="px-4 py-3.5 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-900">
                      {user?.name ?? "FlowTask User"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user?.email ?? ""}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiUser className="w-4 h-4 text-gray-400" />
                      My Profile
                    </Link>
                    <Link
                      href={ROUTES.SETTINGS}
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <HiCog className="w-4 h-4 text-gray-400" />
                      Settings
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href={ROUTES.ADMIN}
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <HiCog className="w-4 h-4 text-gray-400" />
                        Admin Dashboard
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-100 py-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                        router.push("/login");
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <HiLogout className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden px-8 pb-6">
          {isLoading ? (
            <div className="flex gap-5 h-full min-w-[700px]">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex-1 bg-white/60 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="max-w-xl rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-600">
              Failed to load tasks: {error}
            </div>
          ) : tasks.length === 0 ? (
            <TaskEmptyState
              searchQuery={debouncedSearch}
              filterPriority="all"
              onCreateTask={handleCreateTask}
              onLoadSampleData={() => {
                void handleLoadSampleData();
              }}
            />
          ) : (
            <div className="flex gap-5 h-full min-w-[700px]">
              <TaskGrid
                todoTasks={todoTasks}
                inProgressTasks={inProgressTasks}
                doneTasks={doneTasks}
                onEditTask={handleEditTask}
                onCreateTask={handleCreateTask}
              />
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
      />
    </div>
  );
}
