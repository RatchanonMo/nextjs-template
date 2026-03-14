import { UpcomingDay } from "@/lib/taskViews";

interface UpcomingDayPickerProps {
  week: UpcomingDay[];
  selectedDate: string;
  dragOverDate: string | null;
  onSelectDate: (isoDate: string) => void;
  onDragOver: (isoDate: string) => void;
  onDragLeave: () => void;
  onDrop: (isoDate: string) => void;
}

export default function UpcomingDayPicker({
  week,
  selectedDate,
  dragOverDate,
  onSelectDate,
  onDragOver,
  onDragLeave,
  onDrop,
}: UpcomingDayPickerProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
      {week.map((day) => {
        const isOver = dragOverDate === day.isoDate;
        const isSelected = selectedDate === day.isoDate;
        const isWeekend = day.label === "SAT" || day.label === "SUN";

        return (
          <button
            key={day.isoDate}
            onClick={() => onSelectDate(day.isoDate)}
            onDragOver={(e) => { e.preventDefault(); onDragOver(day.isoDate); }}
            onDragLeave={onDragLeave}
            onDrop={() => onDrop(day.isoDate)}
            className={`relative flex flex-col items-center gap-1 px-4 py-3 rounded-2xl min-w-[64px] transition-all font-medium text-sm ${
              isOver
                ? "bg-primary/20 ring-2 ring-dashed ring-primary scale-105"
                : isSelected
                  ? "bg-primary text-white shadow-md shadow-primary/30"
                  : isWeekend
                    ? "bg-white text-gray-300 hover:bg-gray-50"
                    : "bg-white text-gray-700 hover:bg-gray-50 shadow-sm"
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{day.label}</span>
            <span className="text-lg font-bold leading-none">{day.date}</span>
            {day.tasks.length > 0 && !isSelected && !isOver && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {day.tasks.length}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
