import { Button, Input, Select, SelectItem } from "@heroui/react";

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterPriority: string;
  onPriorityChange: (value: string) => void;
  onCreateTask: () => void;
}

export default function TaskFilters({
  searchQuery,
  onSearchChange,
  filterPriority,
  onPriorityChange,
  onCreateTask,
}: TaskFiltersProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            startContent={
              <svg
                className="w-5 h-5 text-default-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
        </div>

        <div className="w-full md:w-48">
          <Select
            label="Priority"
            labelPlacement="outside"
            selectedKeys={[filterPriority]}
            onChange={(e) => onPriorityChange(e.target.value)}
          >
            <SelectItem key="all">All Priorities</SelectItem>
            <SelectItem key="low">Low</SelectItem>
            <SelectItem key="medium">Medium</SelectItem>
            <SelectItem key="high">High</SelectItem>
          </Select>
        </div>

        <Button
          color="primary"
          size="lg"
          onPress={onCreateTask}
          startContent={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          }
        >
          New Task
        </Button>
      </div>
    </div>
  );
}
