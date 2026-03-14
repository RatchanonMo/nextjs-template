import { TaskCategory } from "@/types/task";

export const CATEGORY_STYLES: Record<TaskCategory, { text: string; bg: string }> = {
  MARKETING: { text: "#f97316", bg: "#fff7ed" },
  DESIGN: { text: "#e91e8c", bg: "#fdf2f8" },
  DEVELOPMENT: { text: "#3b82f6", bg: "#eff6ff" },
  OPERATIONS: { text: "#14b8a6", bg: "#f0fdfa" },
  PRODUCT: { text: "#8b5cf6", bg: "#f5f3ff" },
  PERSONAL: { text: "#14b8a6", bg: "#f0fdfa" },
};
