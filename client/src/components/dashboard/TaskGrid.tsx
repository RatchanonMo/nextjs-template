"use client";
import { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import TaskCard from "@/components/TaskCard";
import { useTaskStore } from "@/stores/useTaskStore";
import { HiDotsVertical, HiPlus } from "react-icons/hi";

interface TaskGridProps {
  todoTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
  onEditTask: (task: Task) => void;
  onCreateTask: () => void;
}

const COLUMNS = [
  {
    key: "todo" as const,
    label: "To Do",
    accentColor: "#3b82f6",
    emptyMessage: "Drop tasks here",
  },
  {
    key: "in-progress" as const,
    label: "In Progress",
    accentColor: "#ec4899",
    emptyMessage: "Drop tasks here",
  },
  {
    key: "done" as const,
    label: "Done",
    accentColor: "#22c55e",
    emptyMessage: "Drop tasks here",
  },
];

export default function TaskGrid({
  todoTasks,
  inProgressTasks,
  doneTasks,
  onEditTask,
}: TaskGridProps) {
  const { optimisticUpdateTaskAsync } = useTaskStore();
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const tasksByStatus: Record<TaskStatus, Task[]> = {
    todo: todoTasks,
    "in-progress": inProgressTasks,
    done: doneTasks,
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedId(taskId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(status);
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedId) {
      void optimisticUpdateTaskAsync(draggedId, { status } as Partial<Task>, { status });
    }
    setDraggedId(null);
    setDragOverCol(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverCol(null);
  };

  return (
    <>
      {COLUMNS.map((col) => {
        const tasks = tasksByStatus[col.key];
        const isOver = dragOverCol === col.key;
        return (
          <div
            key={col.key}
            className="flex flex-col flex-1 min-w-[260px] max-w-none"
            onDragOver={(e) => handleDragOver(e, col.key)}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={(e) => handleDrop(e, col.key)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700 text-sm">{col.label}</span>
                <span className="text-xs font-bold text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                  {tasks.length}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white">
                <HiDotsVertical className="w-4 h-4" />
              </button>
            </div>

            {/* Drop Zone */}
            <div
              className={`flex flex-col gap-3 flex-1 overflow-y-auto pr-0.5 rounded-2xl transition-all ${
                isOver
                  ? "bg-gray-100/80 ring-2 ring-dashed ring-gray-300 p-2"
                  : "p-0"
              }`}
            >
              {tasks.map((task) => (
                (() => {
                  const taskId = task._id ?? task.id;
                  return (
                    <div
                      key={taskId}
                      draggable
                      onDragStart={(e) => handleDragStart(e, taskId)}
                      onDragEnd={handleDragEnd}
                      className={`transition-opacity ${draggedId === taskId ? "opacity-40" : "opacity-100"}`}
                    >
                      <TaskCard
                        task={task}
                        onEdit={onEditTask}
                        accentColor={col.accentColor}
                      />
                    </div>
                  );
                })()
              ))}

              {tasks.length === 0 && (
                <div
                  className={`flex flex-col items-center justify-center py-10 rounded-xl border-2 border-dashed transition-colors ${
                    isOver ? "border-current opacity-60" : "border-gray-200 text-gray-400"
                  }`}
                  style={isOver ? { color: col.accentColor, borderColor: col.accentColor } : undefined}
                >
                  <HiPlus className="w-6 h-6 mb-2 opacity-50" />
                  <p className="text-xs font-medium">{col.emptyMessage}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}
