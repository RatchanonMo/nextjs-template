import { Project, TaskCategory } from "@/types/task";

export type ProjectMeta = Pick<Project, "id" | "name" | "description" | "category" | "icon" | "accentColor">;

export const PROJECT_CATALOG: ProjectMeta[] = [
  {
    id: "p1",
    name: "Marketing Strategy",
    description: "Brand awareness and Q4 growth campaign planning.",
    category: "MARKETING",
    icon: "📣",
    accentColor: "#f97316",
  },
  {
    id: "p2",
    name: "Web App Redesign",
    description: "Migrating the core architecture to a more modern framework.",
    category: "DEVELOPMENT",
    icon: "</>",
    accentColor: "#3b82f6",
  },
  {
    id: "p3",
    name: "Mobile UI Kit",
    description: "Developing a scalable design system for our mobile ecosystem.",
    category: "DESIGN",
    icon: "✏️",
    accentColor: "#e91e8c",
  },
];

export const CATEGORY_ACCENT: Record<TaskCategory, string> = {
  MARKETING: "#f97316",
  DEVELOPMENT: "#3b82f6",
  DESIGN: "#e91e8c",
  OPERATIONS: "#14b8a6",
  PRODUCT: "#8b5cf6",
  PERSONAL: "#14b8a6",
};
