import { PROJECT_CATALOG } from "@/config/projects";
import { Project, Task, TaskAssignee } from "@/types/task";
import { WorkspaceProject } from "@/stores/useWorkspaceStore";

const TODAY_SECTIONS = [
  { section: "Morning", emoji: "🌤️", range: "08:00 — 12:00", startHour: 8 },
  { section: "Afternoon", emoji: "☀️", range: "12:00 — 17:00", startHour: 12 },
  { section: "Evening", emoji: "🌙", range: "17:00 — 22:00", startHour: 17 },
] as const;

export type TodaySection = {
  section: string;
  emoji: string;
  range: string;
  tasks: Task[];
};

export type UpcomingDay = {
  date: number;
  label: string;
  isoDate: string;
  tasks: Task[];
};

export const toLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const dayLabel = (date: Date) => date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase().slice(0, 3);

const getTaskHour = (task: Task): number => {
  if (!task.startTime) return 9;
  const [hour] = task.startTime.split(":").map(Number);
  return Number.isFinite(hour) ? hour : 9;
};

export const getSectionDefaults = (sectionName: string): { startTime: string; endTime: string } => {
  switch (sectionName) {
    case "Morning":
      return { startTime: "09:00", endTime: "10:00" };
    case "Afternoon":
      return { startTime: "14:00", endTime: "15:00" };
    case "Evening":
      return { startTime: "18:00", endTime: "19:00" };
    default:
      return { startTime: "09:00", endTime: "10:00" };
  }
};

export const buildTodaySections = (tasks: Task[], baseDate = new Date()): TodaySection[] => {
  const todayIso = toLocalDateKey(baseDate);
  const todaysTasks = tasks.filter((task) => task.dueDate && toLocalDateKey(new Date(task.dueDate)) === todayIso);

  return TODAY_SECTIONS.map((section) => ({
    ...section,
    tasks: todaysTasks.filter((task) => {
      const hour = getTaskHour(task);
      if (section.section === "Morning") return hour < 12;
      if (section.section === "Afternoon") return hour >= 12 && hour < 17;
      return hour >= 17;
    }),
  }));
};

export const buildUpcomingDays = (tasks: Task[], numberOfDays = 8, baseDate = new Date()): UpcomingDay[] => {
  const start = new Date(baseDate);
  start.setHours(0, 0, 0, 0);

  return Array.from({ length: numberOfDays }).map((_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    const isoDate = toLocalDateKey(day);
    return {
      date: day.getDate(),
      label: dayLabel(day),
      isoDate,
      tasks: tasks.filter((task) => task.dueDate && toLocalDateKey(new Date(task.dueDate)) === isoDate),
    };
  });
};

const uniqueAssignees = (tasks: Task[]): TaskAssignee[] => {
  const seen = new Set<string>();
  return tasks.flatMap((task) => task.assignees ?? []).filter((assignee) => {
    const key = `${assignee.name}:${assignee.color}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const buildProjectsFromTasks = (tasks: Task[], projectCatalog: WorkspaceProject[] = PROJECT_CATALOG): Project[] => {
  return projectCatalog.map((meta) => {
    const projectId = meta._id ?? meta.id;
    const projectTasks = tasks.filter((task) => task.projectId === projectId);
    const completedTaskCount = projectTasks.filter((task) => task.status === "done").length;
    const progress = projectTasks.length === 0 ? 0 : Math.round((completedTaskCount / projectTasks.length) * 100);

    return {
      ...meta,
      id: projectId,
      _id: meta._id,
      taskCount: projectTasks.length,
      completedTaskCount,
      progress,
      assignees: uniqueAssignees(projectTasks),
      subtasks: projectTasks.slice(0, 2).map((task) => ({ id: task._id ?? task.id, title: task.title, done: task.status === "done" })),
    };
  });
};
