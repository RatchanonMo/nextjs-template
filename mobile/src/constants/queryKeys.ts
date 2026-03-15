export const queryKeys = {
  me: ["auth", "me"] as const,
  tasks: (filters?: string) => ["tasks", filters ?? "all"] as const,
  task: (id: string) => ["tasks", "detail", id] as const,
  deletedTasks: ["tasks", "deleted"] as const,
  taskStats: ["tasks", "stats"] as const,
  taskAnalytics: ["tasks", "analytics"] as const,
  workspace: ["workspace"] as const,
};
