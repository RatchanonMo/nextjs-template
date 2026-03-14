import { Button } from "@heroui/react";

interface TaskEmptyStateProps {
  searchQuery: string;
  filterPriority: string;
  onCreateTask: () => void;
  onLoadSampleData: () => void;
}

export default function TaskEmptyState({
  searchQuery,
  filterPriority,
  onCreateTask,
  onLoadSampleData,
}: TaskEmptyStateProps) {
  const hasFilters = searchQuery || filterPriority !== "all";

  return (
    <div className="rounded-2xl p-12 text-center">
      <div className="max-w-md mx-auto">
        <svg
          className="w-24 h-24 mx-auto mb-4 text-default-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="text-2xl font-semibold mb-2">No tasks found</h3>
        <p className="text-default-600 mb-6">
          {hasFilters
            ? "Try adjusting your filters"
            : "Get started by creating your first task"}
        </p>
        {!hasFilters && (
          <div className="flex gap-3 justify-center">
            <Button color="primary" size="lg" onPress={onCreateTask}>
              Create Your First Task
            </Button>
            <Button
              color="secondary"
              variant="flat"
              size="lg"
              onPress={onLoadSampleData}
            >
              Load Sample Data
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
