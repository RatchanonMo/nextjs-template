"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import { useAuthStore } from "@/stores/useAuthStore";
import { ProjectSortOption, ProjectStatusFilter, useTaskStore } from "@/stores/useTaskStore";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { Task } from "@/types/task";
import { HiArrowLeft, HiClock, HiOutlineSearch } from "react-icons/hi";

const normalizeRouteParam = (value: string | string[] | undefined) => {
  if (!value) return "";
  return Array.isArray(value) ? value[0] : value;
};

const getProjectId = (project: { id: string; _id?: string }) => project._id ?? project.id;
const getTaskId = (task: Task) => task._id ?? task.id;

const formatTimeRange = (task: Task) => {
  const start = task.startTime || "--:--";
  const end = task.endTime || "--:--";
  return `${start} - ${end}`;
};

const formatDueDate = (dueDate?: Date) => {
  if (!dueDate) return "No due date";
  return new Date(dueDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function ProjectDetailPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = normalizeRouteParam(params?.projectId);

  const { user } = useAuthStore();
  const {
    tasks,
    isLoading,
    fetchTasks,
    hydrateProjectView,
    setProjectView,
    getProjectView,
    getVisibleProjectTasks,
    getProjectTaskMetrics,
  } = useTaskStore();
  const { projects, hydrate } = useWorkspaceStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (user) {
      void fetchTasks();
    }
  }, [fetchTasks, user]);

  useEffect(() => {
    if (!projectId) return;
    hydrateProjectView(projectId);
  }, [hydrateProjectView, projectId]);

  const project = useMemo(() => projects.find((item) => getProjectId(item) === projectId), [projectId, projects]);

  const view = getProjectView(projectId);
  const visibleTasks = useMemo(() => getVisibleProjectTasks(projectId), [getVisibleProjectTasks, projectId, tasks]);
  const metrics = useMemo(() => getProjectTaskMetrics(projectId), [getProjectTaskMetrics, projectId, tasks]);

  if (!projectId) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-500">
        Invalid project route.
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar
        onNewTask={() => setIsModalOpen(true)}
        inboxCount={tasks.filter((task) => task.status !== "done").length}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="px-8 pt-7 pb-4 border-b border-gray-100 bg-white/70 backdrop-blur-sm">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-3">
            <HiArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                {project?.icon ? `${project.icon} ` : ""}{project?.name || "Project"}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {project?.description || "Project details and task list"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {metrics.done}/{metrics.total} completed ({metrics.completionPct}%)
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600"
            >
              New Task
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="relative">
              <HiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={view.searchQuery}
                onChange={(e) => setProjectView(projectId, { searchQuery: e.target.value })}
                placeholder="Search tasks..."
                className="bg-white pl-9 pr-3 py-2 rounded-xl text-sm border border-gray-200 outline-none focus:border-primary/50 w-56"
              />
            </div>

            <select
              value={view.statusFilter}
              onChange={(e) => setProjectView(projectId, { statusFilter: e.target.value as ProjectStatusFilter })}
              className="bg-white px-3 py-2 rounded-xl text-sm border border-gray-200 outline-none focus:border-primary/50"
            >
              <option value="all">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={view.sortOption}
              onChange={(e) => setProjectView(projectId, { sortOption: e.target.value as ProjectSortOption })}
              className="bg-white px-3 py-2 rounded-xl text-sm border border-gray-200 outline-none focus:border-primary/50"
            >
              <option value="updated">Sort: Updated</option>
              <option value="due">Sort: Due Date</option>
              <option value="title">Sort: Title</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          {!project && !isLoading ? (
            <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow-sm">
              Project not found.
            </div>
          ) : isLoading ? (
            <div className="space-y-3 max-w-3xl">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 rounded-2xl bg-white/70 animate-pulse" />
              ))}
            </div>
          ) : visibleTasks.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-gray-400 bg-white">
              No tasks match current filters.
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {visibleTasks.map((task) => (
                <article key={getTaskId(task)} className="bg-white rounded-2xl px-5 py-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-800">{task.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description || "No description"}</p>
                    </div>
                    <span className="rounded-full px-2.5 py-1 text-[11px] font-semibold bg-gray-100 text-gray-600 capitalize">
                      {task.status}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-500">
                    <span>{formatDueDate(task.dueDate)}</span>
                    <span className="inline-flex items-center gap-1">
                      <HiClock className="w-3.5 h-3.5" />
                      {formatTimeRange(task)}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={null} />
    </div>
  );
}
