import { HiPlus } from "react-icons/hi";
import { Task } from "@/types/task";
import { TodaySection as TodaySectionType } from "@/lib/taskViews";
import TodayTaskCard from "./TodayTaskCard";

const getTaskId = (task: Task) => task._id ?? task.id;

interface TodaySectionProps {
  section: TodaySectionType;
  draggedTask: Task | null;
  dragOverSection: string | null;
  onDragOver: (sectionName: string) => void;
  onDragLeave: () => void;
  onDrop: (sectionName: string) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onAddTask: (sectionName: string) => void;
}

export default function TodaySection({
  section,
  draggedTask,
  dragOverSection,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onAddTask,
}: TodaySectionProps) {
  const isOver = dragOverSection === section.section;

  return (
    <div
      className="mb-8"
      onDragOver={(e) => { e.preventDefault(); onDragOver(section.section); }}
      onDragLeave={onDragLeave}
      onDrop={() => onDrop(section.section)}
    >
      <div
        className={`flex items-center gap-2 mb-4 px-3 py-2 rounded-xl transition-all ${
          isOver ? "bg-primary/10 ring-2 ring-dashed ring-primary/40" : ""
        }`}
      >
        <span className="text-xl">{section.emoji}</span>
        <span className="font-semibold text-gray-700">{section.section}</span>
        <span className="text-gray-400 text-sm">{section.range}</span>
        {isOver && <span className="ml-auto text-xs font-bold text-primary">Drop here</span>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {section.tasks.map((task) => (
          <TodayTaskCard
            key={getTaskId(task)}
            task={task}
            isDragging={draggedTask ? getTaskId(draggedTask) === getTaskId(task) : false}
            onDragStart={() => onDragStart(task)}
            onDragEnd={onDragEnd}
          />
        ))}

        <button
          onClick={() => onAddTask(section.section)}
          className="bg-white rounded-2xl p-4 shadow-sm border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 min-h-[120px] text-gray-400 hover:text-primary"
        >
          <HiPlus className="w-6 h-6" />
          <span className="text-xs font-medium">Add Task</span>
        </button>
      </div>
    </div>
  );
}
