import { TaskCategory } from "./task";

export interface WorkspaceProject {
  _id?: string;
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  icon: string;
  accentColor: string;
}

export interface WorkspaceLabel {
  id: string;
  name: string;
  color: string;
}

export interface WorkspacePayload {
  projects: WorkspaceProject[];
  labels: WorkspaceLabel[];
}
