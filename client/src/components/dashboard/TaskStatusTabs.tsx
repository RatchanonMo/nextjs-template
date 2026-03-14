import { TaskStatus } from "@/types/task";
import { Tabs, Tab } from "@heroui/react";

interface TaskStatusTabsProps {
  activeTab: TaskStatus | "all";
  onTabChange: (tab: TaskStatus | "all") => void;
  getTaskCountByStatus: (status: TaskStatus | "all") => number;
}

export default function TaskStatusTabs({
  activeTab,
  onTabChange,
  getTaskCountByStatus,
}: TaskStatusTabsProps) {
  return (
    <div className="mb-6">
      <Tabs
        aria-label="Task status tabs"
        color="primary"
        variant="bordered"
        selectedKey={activeTab}
        onSelectionChange={(key) => onTabChange(key as TaskStatus | "all")}
      >
        <Tab
          key="all"
          title={
            <div className="flex items-center gap-2">
              <span>All Tasks</span>
              <span className="bg-default-200 text-default-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {getTaskCountByStatus("all")}
              </span>
            </div>
          }
        />
        <Tab
          key="todo"
          title={
            <div className="flex items-center gap-2">
              <span>To Do</span>
              <span className="bg-default-200 text-default-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {getTaskCountByStatus("todo")}
              </span>
            </div>
          }
        />
        <Tab
          key="in-progress"
          title={
            <div className="flex items-center gap-2">
              <span>In Progress</span>
              <span className="bg-primary-100 text-primary-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {getTaskCountByStatus("in-progress")}
              </span>
            </div>
          }
        />
        <Tab
          key="done"
          title={
            <div className="flex items-center gap-2">
              <span>Done</span>
              <span className="bg-success-100 text-success-700 rounded-full px-2 py-0.5 text-xs font-semibold">
                {getTaskCountByStatus("done")}
              </span>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}
