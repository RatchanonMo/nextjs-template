interface TodayHeaderProps {
  totalTasks: number;
  completedTasks: number;
}

export default function TodayHeader({ totalTasks, completedTasks }: TodayHeaderProps) {
  const progressPct = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progressPct / 100);

  return (
    <div className="flex items-center gap-5">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="6" />
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
          {progressPct}%
        </span>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Today</h1>
        <p className="text-gray-400 text-sm mt-0.5">
          You have{" "}
          <span className="text-primary font-semibold">{totalTasks} tasks</span> to finish today.
        </p>
      </div>
    </div>
  );
}
