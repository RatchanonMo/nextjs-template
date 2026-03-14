import { PROJECT_CATALOG } from "@/config/projects";
import { workspaceAPI } from "@/lib/api/workspaceAPI";
import { create } from "zustand";

export interface WorkspaceProject {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: "MARKETING" | "DESIGN" | "DEVELOPMENT" | "OPERATIONS" | "PRODUCT" | "PERSONAL";
  icon: string;
  accentColor: string;
}

const getProjectId = (project: Pick<WorkspaceProject, "id" | "_id">) => project._id ?? project.id;

export interface WorkspaceLabel {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_LABELS: WorkspaceLabel[] = [
  { id: "label-design", name: "Design", color: "#e91e8c" },
  { id: "label-development", name: "Development", color: "#3b82f6" },
  { id: "label-marketing", name: "Marketing", color: "#f97316" },
];

interface WorkspaceState {
  isHydrated: boolean;
  isLoading: boolean;
  error: string | null;
  projects: WorkspaceProject[];
  labels: WorkspaceLabel[];
  hydrate: () => Promise<void>;
  addProject: (project: Omit<WorkspaceProject, "id">) => Promise<string>;
  updateProject: (projectId: string, project: Partial<Omit<WorkspaceProject, "id">>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  addLabel: (label: Omit<WorkspaceLabel, "id">) => Promise<string>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  isHydrated: false,
  isLoading: false,
  error: null,
  projects: PROJECT_CATALOG,
  labels: DEFAULT_LABELS,

  hydrate: async () => {
    if (get().isHydrated || get().isLoading) return;
    try {
      set({ isLoading: true, error: null });
      const data = await workspaceAPI.getWorkspace();
      set({
        projects: data.projects?.length ? data.projects : PROJECT_CATALOG,
        labels: data.labels?.length ? data.labels : DEFAULT_LABELS,
        isHydrated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isHydrated: true,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unable to load workspace",
        projects: PROJECT_CATALOG,
        labels: DEFAULT_LABELS,
      });
    }
  },

  addProject: async (project) => {
    const created = await workspaceAPI.createProject(project);
    set({ projects: [...get().projects, created] });
    return getProjectId(created);
  },

  updateProject: async (projectId, project) => {
    const updated = await workspaceAPI.updateProject(projectId, project);
    set({
      projects: get().projects.map((item) => (getProjectId(item) === projectId ? updated : item)),
    });
  },

  deleteProject: async (projectId) => {
    await workspaceAPI.deleteProject(projectId);
    set({
      projects: get().projects.filter((item) => getProjectId(item) !== projectId),
    });
  },

  addLabel: async (label) => {
    const created = await workspaceAPI.createLabel(label);
    set({ labels: [...get().labels, created] });
    return created.id;
  },
}));
