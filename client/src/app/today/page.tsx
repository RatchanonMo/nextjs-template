"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import TodayHeader from "@/components/today/TodayHeader";
import TodaySection from "@/components/today/TodaySection";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import { buildTodaySections, getSectionDefaults, toLocalDateKey } from "@/lib/taskViews";
import { Task } from "@/types/task";

const getTaskId = (task: Task) => task._id ?? task.id;

export default function TodayPage() {
  const { user } = useAuthStore();
  const { tasks, isLoading, fetchTasks, optimisticUpdateTaskAsync } = useTaskStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultStartTime, setModalDefaultStartTime] = useState("09:00");
  const [modalDefaultEndTime, setModalDefaultEndTime] = useState("10:30");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [fetchTasks, user]);

  const sections = useMemo(() => buildTodaySections(tasks), [tasks]);
  const totalTasks = sections.reduce((sum, section) => sum + section.tasks.length, 0);
  const completedTasks = sections.reduce(
    (sum, section) => sum + section.tasks.filter((task) => task.status === "done").length,
    0,
  );

  const openCreateTaskForSection = (sectionName: string) => {
    const defaults = getSectionDefaults(sectionName);
    setModalDefaultStartTime(defaults.startTime);
    setModalDefaultEndTime(defaults.endTime);
    setIsModalOpen(true);
  };

  const openCreateTaskFromSidebar = () => {
    const hour = new Date().getHours();
    const sectionName = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
    openCreateTaskForSection(sectionName);
  };

  const handleDrop = (targetSection: string) => {
    if (!draggedTask) {
      setDragOverSection(null);
      return;
    }

    const defaults = getSectionDefaults(targetSection);
    const dueDate = new Date();
    dueDate.setHours(0, 0, 0, 0);

    const taskId = getTaskId(draggedTask);

    void optimisticUpdateTaskAsync(
      taskId,
      {
        startTime: defaults.startTime,
        endTime: defaults.endTime,
        dueDate,
      },
      {
        startTime: defaults.startTime,
        endTime: defaults.endTime,
        dueDate: toLocalDateKey(dueDate),
      },
    );

    setDraggedTask(null);
    setDragOverSection(null);
  };

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar onNewTask={openCreateTaskFromSidebar} inboxCount={tasks.filter((task) => task.status !== "done").length} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-7 pb-4">
          <TodayHeader totalTasks={totalTasks} completedTasks={completedTasks} />
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {isLoading ? (
            <div className="grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-32 rounded-2xl bg-white/70 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="max-w-2xl">
              {sections.map((section) => (
                <TodaySection
                  key={section.section}
                  section={section}
                  draggedTask={draggedTask}
                  dragOverSection={dragOverSection}
                  onDragOver={(name) => setDragOverSection(name)}
                  onDragLeave={() => setDragOverSection(null)}
                  onDrop={handleDrop}
                  onDragStart={(task) => setDraggedTask(task)}
                  onDragEnd={() => { setDraggedTask(null); setDragOverSection(null); }}
                  onAddTask={openCreateTaskForSection}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={null}
        defaultDueDate={toLocalDateKey(new Date())}
        defaultStartTime={modalDefaultStartTime}
        defaultEndTime={modalDefaultEndTime}
      />
    </div>
  );
}
