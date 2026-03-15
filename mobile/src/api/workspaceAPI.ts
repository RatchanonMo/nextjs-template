import { ApiResponse } from "../types/api";
import { WorkspaceLabel, WorkspacePayload, WorkspaceProject } from "../types/workspace";
import { apiClient } from "./client";

type WorkspaceResponse = WorkspacePayload & {
  meta?: {
    totalProjects: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

const toWorkspaceProject = (raw: WorkspaceProject): WorkspaceProject => {
  const resolvedId = String(raw._id ?? raw.id ?? "");
  return {
    ...raw,
    id: resolvedId,
    _id: String(raw._id ?? resolvedId),
  };
};

export const workspaceAPI = {
  async getWorkspace(): Promise<WorkspacePayload> {
    const { data } = await apiClient.get<ApiResponse<WorkspaceResponse>>("/workspace");
    if (!data.success) {
      throw new Error(data.message ?? "Unable to fetch workspace");
    }

    return {
      labels: data.data.labels,
      projects: data.data.projects.map(toWorkspaceProject),
    };
  },

  async createProject(project: Omit<WorkspaceProject, "id" | "_id">): Promise<WorkspaceProject> {
    const { data } = await apiClient.post<ApiResponse<WorkspaceProject>>("/workspace/projects", project);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to create project");
    }
    return toWorkspaceProject(data.data);
  },

  async createLabel(label: Omit<WorkspaceLabel, "id">): Promise<WorkspaceLabel> {
    const { data } = await apiClient.post<ApiResponse<WorkspaceLabel>>("/workspace/labels", label);
    if (!data.success) {
      throw new Error(data.message ?? "Unable to create label");
    }
    return data.data;
  },
};
