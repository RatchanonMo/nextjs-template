import { HiClock, HiDotsVertical } from "react-icons/hi";
import { Task } from "@/types/task";
import { CATEGORY_STYLES } from "@/constants/categoryStyles";

const formatTime = (value?: string) => {
  if (!value) return "No time";
  const [hours, minutes] = value.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${String(normalizedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

interface TodayTaskCardProps {
  task: Task;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function TodayTaskCard({ task, isDragging, onDragStart, onDragEnd }: TodayTaskCardProps) {
  const style = CATEGORY_STYLES[task.category];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40 scale-95" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded"
          style={{ color: style.text, backgroundColor: style.bg }}
        >
          {task.category}
        </span>
        <HiDotsVertical className="w-4 h-4 text-gray-300 hover:text-gray-500 transition-colors" />
      </div>
      <h4 className="font-semibold text-sm text-gray-800 mb-1">{task.title}</h4>
      <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex -space-x-1.5">
          {(task.assignees ?? []).slice(0, 3).map((assignee, index) => (
            <div
              key={`${assignee.name}-${index}`}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
              style={{ backgroundColor: assignee.color }}
            >
              {assignee.name[0]}
            </div>
          ))}
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-gray-400">
          <HiClock className="w-3 h-3" />
          {formatTime(task.startTime)}
        </span>
      </div>
    </div>
  );
}
