"use client";
import { Task } from "@/types/task";
import { useTaskStore } from "@/stores/useTaskStore";
import { HiCheck, HiClock } from "react-icons/hi";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  accentColor?: string;
}

const CATEGORY_STYLES: Record<string, { text: string; bg: string }> = {
  MARKETING: { text: "#f97316", bg: "#fff7ed" },
  DESIGN: { text: "#e91e8c", bg: "#fdf2f8" },
  DEVELOPMENT: { text: "#3b82f6", bg: "#eff6ff" },
  OPERATIONS: { text: "#14b8a6", bg: "#f0fdfa" },
};

export default function TaskCard({ task, onEdit, accentColor = "#3b82f6" }: TaskCardProps) {
  // delete is handled via the modal's "Delete Task" button
  const isDone = task.status === "done";
  const categoryStyle = CATEGORY_STYLES[task.category] || { text: "#6b7280", bg: "#f9fafb" };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[d.getMonth()]} ${d.getDate()}`;
  };

  const formatDateTime = (date: Date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    const h = hours % 12 || 12;
    return `Today, ${h}:${minutes}${ampm}`;
  };

  const isToday = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer relative overflow-hidden group"
      style={{ borderLeft: `3px solid ${accentColor}` }}
      onClick={() => onEdit(task)}
    >
      {/* Done checkmark */}
      {isDone && (
        <div className="absolute top-3 right-3 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <HiCheck className="w-3 h-3 text-white" />
        </div>
      )}

      <div className="p-4">
        {/* Top Row: Category + Drag Handle */}
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
            style={{ color: categoryStyle.text, backgroundColor: categoryStyle.bg }}
          >
            {task.category}
          </span>
          {/* Drag handle */}
          <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 -mr-1">
            {[0, 1].map((row) => (
              <div key={row} className="flex gap-0.5">
                {[0, 1].map((col) => (
                  <div key={col} className="w-1 h-1 rounded-full bg-gray-300" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Title */}
        <h4
          className={`font-semibold text-sm mb-1 leading-snug ${
            isDone ? "text-gray-400 line-through" : "text-gray-800"
          }`}
        >
          {task.title}
        </h4>

        {/* Description */}
        <p
          className={`text-xs leading-relaxed mb-3 line-clamp-2 ${
            isDone ? "text-gray-300 line-through" : "text-gray-400"
          }`}
        >
          {task.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Assignee Avatars */}
          <div className="flex -space-x-1.5">
            {(task.assignees ?? []).slice(0, 3).map((assignee, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                style={{ backgroundColor: assignee.color }}
                title={assignee.name}
              >
                {assignee.name[0]}
              </div>
            ))}
          </div>

          {/* Date / Overdue */}
          {task.isOverdue ? (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-orange-500">
              <HiClock className="w-3 h-3" />
              In 2 hours
            </span>
          ) : task.dueDate ? (
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <HiClock className="w-3 h-3" />
              {isToday(task.dueDate) ? formatDateTime(task.dueDate) : formatDate(task.dueDate)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

