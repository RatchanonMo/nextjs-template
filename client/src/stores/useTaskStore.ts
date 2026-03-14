import { AxiosError } from "axios";
import { Task, TaskAnalytics, TaskStatus, TaskFormData } from "@/types/task";
import { taskAPI, TaskQueryOptions } from "@/lib/api/taskAPI";
import { create } from "zustand";

export type ProjectStatusFilter = "all" | TaskStatus;
export type ProjectSortOption = "updated" | "due" | "title";

export interface ProjectTaskViewState {
  searchQuery: string;
  statusFilter: ProjectStatusFilter;
  sortOption: ProjectSortOption;
}

export interface ProjectTaskMetrics {
  total: number;
  done: number;
  inProgress: number;
  todo: number;
  overdue: number;
  completionPct: number;
  nextDueDate: Date | null;
}

const DEFAULT_PROJECT_VIEW: ProjectTaskViewState = {
  searchQuery: "",
  statusFilter: "all",
  sortOption: "updated",
};

const projectStorageKey = (projectId: string, suffix: "search" | "status" | "sort") =>
  `flowtask_project_${projectId}_${suffix}`;

const getTaskId = (task: Pick<Task, "id" | "_id">) => task._id ?? task.id;

interface TaskState {
  tasks: Task[];
  deletedTasks: Task[];
  analytics: TaskAnalytics | null;
  analyticsLoading: boolean;
  analyticsError: string | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: TaskStatus | "all";
  filterPriority: string;
  projectViews: Record<string, ProjectTaskViewState>;

  // ── Async actions (talk to the backend) ──────────────────────────────────
  fetchTasks: (params?: TaskQueryOptions, signal?: AbortSignal) => Promise<void>;
  fetchDeletedTasks: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  createTaskAsync: (data: TaskFormData) => Promise<Task>;
  updateTaskAsync: (id: string, data: Partial<TaskFormData>) => Promise<void>;
  optimisticUpdateTaskAsync: (id: string, optimisticPatch: Partial<Task>, data: Partial<TaskFormData>) => Promise<void>;
  deleteTaskAsync: (id: string) => Promise<void>;
  restoreTaskAsync: (id: string) => Promise<void>;
  hardDeleteTaskAsync: (id: string) => Promise<void>;
  clearTasks: () => void;

  // ── Sync helpers (optimistic / drag-and-drop) ────────────────────────────
  updateTask: (id: string, patch: Partial<Task>) => void;

  // ── Filter / search ───────────────────────────────────────────────────────
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: TaskStatus | "all") => void;
  setFilterPriority: (priority: string) => void;
  getFilteredTasks: () => Task[];

  // ── Project detail state + computed selectors ───────────────────────────
  hydrateProjectView: (projectId: string) => void;
  setProjectView: (projectId: string, patch: Partial<ProjectTaskViewState>) => void;
  getProjectView: (projectId: string) => ProjectTaskViewState;
  getVisibleProjectTasks: (projectId: string) => Task[];
  getProjectTaskMetrics: (projectId: string) => ProjectTaskMetrics;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  deletedTasks: [],
  analytics: null,
  analyticsLoading: false,
  analyticsError: null,
  isLoading: false,
  error: null,
  searchQuery: "",
  filterStatus: "all",
  filterPriority: "all",
  projectViews: {},

  // ────────────────────────────────────────────────────────────────────────
  fetchTasks: async (params, signal) => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskAPI.getTasks(params, signal);
      set({ tasks, isLoading: false });
    } catch (err) {
      if (err instanceof AxiosError && err.code === "ERR_CANCELED") {
        return;
      }

      set({ isLoading: false, error: (err as Error).message });
    }
  },

  fetchDeletedTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const deletedTasks = await taskAPI.getDeletedTasks({ sortBy: '-deletedAt' });
      set({ deletedTasks, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  fetchAnalytics: async () => {
    set({ analyticsLoading: true, analyticsError: null });
    try {
      const analytics = await taskAPI.getAnalytics();
      set({ analytics, analyticsLoading: false });
    } catch (err) {
      set({ analyticsLoading: false, analyticsError: (err as Error).message });
    }
  },

  createTaskAsync: async (data) => {
    const task = await taskAPI.createTask(data);
    set((state) => ({ tasks: [task, ...state.tasks] }));
    return task;
  },

  updateTaskAsync: async (id, data) => {
    const updated = await taskAPI.updateTask(id, data);
    set((state) => ({
      tasks: state.tasks.map((t) => (getTaskId(t) === id ? updated : t)),
    }));
  },

  optimisticUpdateTaskAsync: async (id, optimisticPatch, data) => {
    const previousTask = get().tasks.find((task) => getTaskId(task) === id);
    if (!previousTask) return;

    set((state) => ({
      tasks: state.tasks.map((task) =>
        getTaskId(task) === id ? { ...task, ...optimisticPatch, updatedAt: new Date() } : task,
      ),
    }));

    try {
      const updated = await taskAPI.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((task) => (getTaskId(task) === id ? updated : task)),
      }));
    } catch (error) {
      set((state) => ({
        tasks: state.tasks.map((task) => (getTaskId(task) === id ? previousTask : task)),
      }));
      throw error;
    }
  },

  deleteTaskAsync: async (id) => {
    await taskAPI.deleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((t) => getTaskId(t) !== id) }));
  },

  restoreTaskAsync: async (id) => {
    const restored = await taskAPI.restoreTask(id);
    set((state) => ({
      deletedTasks: state.deletedTasks.filter((t) => getTaskId(t) !== id),
      tasks: [restored, ...state.tasks.filter((t) => getTaskId(t) !== getTaskId(restored))],
    }));
  },

  hardDeleteTaskAsync: async (id) => {
    await taskAPI.hardDeleteTask(id);
    set((state) => ({ deletedTasks: state.deletedTasks.filter((t) => getTaskId(t) !== id) }));
  },

  clearTasks: () => set({
    tasks: [],
    deletedTasks: [],
    analytics: null,
    error: null,
    analyticsError: null,
    isLoading: false,
    analyticsLoading: false,
  }),

  // Local patch helper used for quick UI-only state updates.
  updateTask: (id, patch) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        getTaskId(t) === id ? { ...t, ...patch, updatedAt: new Date() } : t,
      ),
    })),

  // ────────────────────────────────────────────────────────────────────────
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setFilterPriority: (priority) => set({ filterPriority: priority }),

  getFilteredTasks: () => {
    const { tasks, searchQuery, filterStatus, filterPriority } = get();
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || task.status === filterStatus;
      const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  },

  hydrateProjectView: (projectId) => {
    if (!projectId) return;
    if (typeof window === "undefined") return;

    const search = window.localStorage.getItem(projectStorageKey(projectId, "search"));
    const status = window.localStorage.getItem(projectStorageKey(projectId, "status"));
    const sort = window.localStorage.getItem(projectStorageKey(projectId, "sort"));

    set((state) => ({
      projectViews: {
        ...state.projectViews,
        [projectId]: {
          searchQuery: search ?? "",
          statusFilter:
            status === "all" || status === "todo" || status === "in-progress" || status === "done"
              ? status
              : "all",
          sortOption: sort === "updated" || sort === "due" || sort === "title" ? sort : "updated",
        },
      },
    }));
  },

  setProjectView: (projectId, patch) => {
    if (!projectId) return;

    const current = get().projectViews[projectId] ?? DEFAULT_PROJECT_VIEW;
    const next = { ...current, ...patch };

    set((state) => ({
      projectViews: {
        ...state.projectViews,
        [projectId]: next,
      },
    }));

    if (typeof window !== "undefined") {
      window.localStorage.setItem(projectStorageKey(projectId, "search"), next.searchQuery);
      window.localStorage.setItem(projectStorageKey(projectId, "status"), next.statusFilter);
      window.localStorage.setItem(projectStorageKey(projectId, "sort"), next.sortOption);
    }
  },

  getProjectView: (projectId) => get().projectViews[projectId] ?? DEFAULT_PROJECT_VIEW,

  getVisibleProjectTasks: (projectId) => {
    const { tasks, projectViews } = get();
    const view = projectViews[projectId] ?? DEFAULT_PROJECT_VIEW;

    const query = view.searchQuery.trim().toLowerCase();
    const filtered = tasks.filter((task) => {
      if (task.projectId !== projectId) return false;

      const matchesQuery =
        query.length === 0 ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);
      const matchesStatus = view.statusFilter === "all" || task.status === view.statusFilter;
      return matchesQuery && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      if (view.sortOption === "title") {
        return a.title.localeCompare(b.title);
      }

      if (view.sortOption === "due") {
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.MAX_SAFE_INTEGER;
        return aDue - bDue;
      }

      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  },

  getProjectTaskMetrics: (projectId) => {
    const projectTasks = get().tasks.filter((task) => task.projectId === projectId);
    const now = new Date();

    const done = projectTasks.filter((task) => task.status === "done").length;
    const inProgress = projectTasks.filter((task) => task.status === "in-progress").length;
    const todo = projectTasks.filter((task) => task.status === "todo").length;
    const overdue = projectTasks.filter(
      (task) => task.status !== "done" && Boolean(task.dueDate) && new Date(task.dueDate as Date).getTime() < now.getTime(),
    ).length;

    const dueCandidates = projectTasks
      .filter((task) => Boolean(task.dueDate))
      .map((task) => new Date(task.dueDate as Date))
      .sort((a, b) => a.getTime() - b.getTime());

    const nextDueDate = dueCandidates.length > 0 ? dueCandidates[0] : null;

    return {
      total: projectTasks.length,
      done,
      inProgress,
      todo,
      overdue,
      completionPct: projectTasks.length === 0 ? 0 : Math.round((done / projectTasks.length) * 100),
      nextDueDate,
    };
  },
}));
