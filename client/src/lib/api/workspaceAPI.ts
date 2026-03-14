import { apiClient } from "@/lib/api/client";
import { WorkspaceLabel, WorkspaceProject } from "@/stores/useWorkspaceStore";

type ApiResponse<T> = { success: boolean; data: T; message?: string };

type WorkspacePayload = {
  projects: WorkspaceProject[];
  labels: WorkspaceLabel[];
};

const toWorkspaceProject = (raw: WorkspaceProject & { _id?: string; id?: string }): WorkspaceProject => {
  const resolvedId = raw._id ?? raw.id;
  return {
    ...raw,
    id: resolvedId,
    _id: raw._id,
  } as WorkspaceProject;
};

export const workspaceAPI = {
  async getWorkspace(): Promise<WorkspacePayload> {
    const { data } = await apiClient.get<ApiResponse<WorkspacePayload>>("/workspace");
    return {
      ...data.data,
      projects: data.data.projects.map((project) => toWorkspaceProject(project)),
    };
  },

  async createProject(project: Omit<WorkspaceProject, "id">): Promise<WorkspaceProject> {
    const { data } = await apiClient.post<ApiResponse<WorkspaceProject>>("/workspace/projects", project);
    return toWorkspaceProject(data.data);
  },

  async updateProject(projectId: string, project: Partial<Omit<WorkspaceProject, "id">>): Promise<WorkspaceProject> {
    const { data } = await apiClient.put<ApiResponse<WorkspaceProject>>(`/workspace/projects/${projectId}`, project);
    return toWorkspaceProject(data.data);
  },

  async deleteProject(projectId: string): Promise<WorkspaceProject> {
    const { data } = await apiClient.delete<ApiResponse<WorkspaceProject>>(`/workspace/projects/${projectId}`);
    return data.data;
  },

  async createLabel(label: Omit<WorkspaceLabel, "id">): Promise<WorkspaceLabel> {
    const { data } = await apiClient.post<ApiResponse<WorkspaceLabel>>("/workspace/labels", label);
    return data.data;
  },
};
