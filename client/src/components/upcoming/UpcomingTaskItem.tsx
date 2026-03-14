import { HiClock, HiDotsVertical } from "react-icons/hi";
import { Task } from "@/types/task";
import { CATEGORY_STYLES } from "@/constants/categoryStyles";

const formatTime = (value?: string) => {
  if (!value) return "--:--";
  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  return `${String(normalizedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${suffix}`;
};

interface UpcomingTaskItemProps {
  task: Task;
  isDragging: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default function UpcomingTaskItem({ task, isDragging, onDragStart, onDragEnd }: UpcomingTaskItemProps) {
  const style = CATEGORY_STYLES[task.category];

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={`bg-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all flex items-start gap-4 cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-40 scale-95" : ""
      }`}
    >
      <div className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-200 flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{task.description}</p>
            <div className="flex items-center gap-3 mt-2.5">
              <span className="flex items-center gap-1 text-[11px] text-gray-400">
                <HiClock className="w-3 h-3" />
                {`${formatTime(task.startTime)} - ${formatTime(task.endTime)}`}
              </span>
              <div className="flex -space-x-1.5">
                {(task.assignees ?? []).slice(0, 3).map((assignee, index) => (
                  <div
                    key={`${assignee.name}-${index}`}
                    className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ backgroundColor: assignee.color }}
                  >
                    {assignee.name[0]}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ color: style.text, backgroundColor: style.bg }}
            >
              {task.category}
            </span>
            <HiDotsVertical className="w-4 h-4 text-gray-300 hover:text-gray-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
