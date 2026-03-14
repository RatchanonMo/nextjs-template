"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import UpcomingDayPicker from "@/components/upcoming/UpcomingDayPicker";
import UpcomingDayView from "@/components/upcoming/UpcomingDayView";
import { buildUpcomingDays, toLocalDateKey } from "@/lib/taskViews";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { Task } from "@/types/task";

const getTaskId = (task: Task) => task._id ?? task.id;

export default function UpcomingPage() {
  const { user } = useAuthStore();
  const { tasks, isLoading, fetchTasks, optimisticUpdateTaskAsync } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  const week = useMemo(() => buildUpcomingDays(tasks), [tasks]);
  const [selectedDate, setSelectedDate] = useState(() => week[0]?.isoDate ?? toLocalDateKey(new Date()));

  useEffect(() => {
    if (week.length > 0 && !week.some((day) => day.isoDate === selectedDate)) {
      setSelectedDate(week[0].isoDate);
    }
  }, [selectedDate, week]);

  const selectedDay = week.find((day) => day.isoDate === selectedDate) ?? week[0];

  const handleDrop = (targetDate: string) => {
    if (!draggedTask) {
      setDragOverDate(null);
      return;
    }

    const nextDueDate = new Date(targetDate);
    const taskId = getTaskId(draggedTask);
    void optimisticUpdateTaskAsync(taskId, { dueDate: nextDueDate }, { dueDate: targetDate });

    setSelectedDate(targetDate);
    setDraggedTask(null);
    setDragOverDate(null);
  };

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar onNewTask={() => setIsModalOpen(true)} inboxCount={tasks.filter((task) => task.status !== "done").length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-7 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Upcoming Schedule</h1>
            <p className="text-gray-400 text-sm mt-0.5">Drag tasks onto a date to reschedule them.</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          <UpcomingDayPicker
            week={week}
            selectedDate={selectedDate}
            dragOverDate={dragOverDate}
            onSelectDate={setSelectedDate}
            onDragOver={(isoDate) => setDragOverDate(isoDate)}
            onDragLeave={() => setDragOverDate(null)}
            onDrop={handleDrop}
          />
          {selectedDay && (
            <UpcomingDayView
              selectedDay={selectedDay}
              isLoading={isLoading}
              draggedTask={draggedTask}
              dragOverDate={dragOverDate}
              onDragStart={(task) => setDraggedTask(task)}
              onDragEnd={() => { setDraggedTask(null); setDragOverDate(null); }}
              onDragOver={(isoDate) => setDragOverDate(isoDate)}
              onDragLeave={() => setDragOverDate(null)}
              onDrop={handleDrop}
            />
          )}
        </div>
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} task={null} />
    </div>
  );
}
