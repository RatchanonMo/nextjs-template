import { HiCalendar } from "react-icons/hi";
import { Task } from "@/types/task";
import { UpcomingDay } from "@/lib/taskViews";
import UpcomingTaskItem from "./UpcomingTaskItem";

const getTaskId = (task: Task) => task._id ?? task.id;

interface UpcomingDayViewProps {
  selectedDay: UpcomingDay;
  isLoading: boolean;
  draggedTask: Task | null;
  dragOverDate: string | null;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (isoDate: string) => void;
  onDragLeave: () => void;
  onDrop: (isoDate: string) => void;
}

export default function UpcomingDayView({
  selectedDay,
  isLoading,
  draggedTask,
  dragOverDate,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: UpcomingDayViewProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">
          {new Date(selectedDay.isoDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </h2>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {selectedDay.tasks.length} TASK{selectedDay.tasks.length !== 1 ? "S" : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3 max-w-2xl">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-28 rounded-2xl bg-white/70 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {selectedDay.tasks.length === 0 ? (
            <div
              className={`text-center py-12 text-gray-400 rounded-2xl border-2 border-dashed transition-all ${dragOverDate === selectedDay.isoDate ? "border-primary/40 bg-primary/5" : "border-gray-200"}`}
              onDragOver={(e) => { e.preventDefault(); onDragOver(selectedDay.isoDate); }}
              onDragLeave={onDragLeave}
              onDrop={() => onDrop(selectedDay.isoDate)}
            >
              <HiCalendar className="w-12 h-12 mx-auto mb-3 text-gray-200" />
              <p className="text-sm font-medium">No tasks yet. Drag one here to schedule it.</p>
            </div>
          ) : (
            selectedDay.tasks.map((task) => (
              <UpcomingTaskItem
                key={getTaskId(task)}
                task={task}
                isDragging={draggedTask ? getTaskId(draggedTask) === getTaskId(task) : false}
                onDragStart={() => onDragStart(task)}
                onDragEnd={onDragEnd}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
