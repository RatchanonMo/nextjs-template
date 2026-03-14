"use client";
import { Task, TaskFormData, TaskPriority, TaskStatus, TaskCategory } from "@/types/task";
import { useTaskStore } from "@/stores/useTaskStore";
import { useState, useEffect } from "react";
import { HiX, HiChevronDown, HiPlus, HiCalendar, HiClock } from "react-icons/hi";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { toLocalDateKey } from "@/lib/taskViews";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultDueDate?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

const CATEGORY_OPTIONS: TaskCategory[] = ["MARKETING", "DESIGN", "DEVELOPMENT", "OPERATIONS", "PRODUCT", "PERSONAL"];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const today = new Date().getDay(); // 0=Sun, 1=Mon, ...

function padTime(h: number, m: number) {
  const ampm = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function TaskModal({
  isOpen,
  onClose,
  task,
  defaultDueDate,
  defaultStartTime,
  defaultEndTime,
}: TaskModalProps) {
  const { createTaskAsync, updateTaskAsync, deleteTaskAsync } = useTaskStore();
  const { projects, labels, hydrate, addLabel } = useWorkspaceStore();
  const taskId = task?._id ?? task?.id;

  const [title, setTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("p1");
  const [selectedLabel, setSelectedLabel] = useState<string>("");
  const [showNewLabel, setShowNewLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#22c55e");
  const [selectedDay, setSelectedDay] = useState(today);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority] = useState<TaskPriority>("medium");
  const [category, setCategory] = useState<TaskCategory>("DEVELOPMENT");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isOpen) return;
    if (task) {
      setTitle(task.title);
      setStatus(task.status);
      setSelectedProject(task.projectId || "p1");
      setSelectedLabel(task.tags?.[0] || labels[0]?.id || "");
      setCategory(task.category);
      setStartTime(task.startTime || "09:00");
      setEndTime(task.endTime || "10:30");
      setDueDate(task.dueDate ? toLocalDateKey(new Date(task.dueDate)) : "");
    } else {
      setTitle("");
      setStatus("todo");
      setSelectedProject(projects[0]?.id || "p1");
      setSelectedLabel(labels[0]?.id || "");
      setCategory("DEVELOPMENT");
      setSelectedDay(today);
      setStartTime(defaultStartTime ?? "09:00");
      setEndTime(defaultEndTime ?? "10:30");
      setDueDate(defaultDueDate ?? "");
    }
  }, [task, isOpen, labels, projects, defaultDueDate, defaultStartTime, defaultEndTime]);

  const handleSave = async () => {
    if (!title.trim()) return;

    const formData: TaskFormData = {
      title,
      description: task?.description ?? "",
      status,
      priority,
      category,
      tags: selectedLabel ? [selectedLabel, ...(task?.tags ?? []).filter((t) => t !== selectedLabel)] : task?.tags ?? [],
      assignees: task?.assignees ?? [],
      startTime,
      endTime,
      dueDate: dueDate || undefined,
      projectId: selectedProject,
    };

    if (task) {
      await updateTaskAsync(taskId as string, formData);
    } else {
      await createTaskAsync(formData);
    }
    onClose();
  };

  const formatDueDate = () => {
    if (!dueDate) {
      const d = new Date();
      return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    }
    const d = new Date(dueDate);
    return `${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return padTime(h, m);
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    const id = await addLabel({ name: newLabelName.trim(), color: newLabelColor });
    setSelectedLabel(id);
    setNewLabelName("");
    setShowNewLabel(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[500px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-5">
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"
          >
            <HiX className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
            {task ? "Edit Task" : "Create New Task"}
          </span>
          <button
            onClick={handleSave}
            className="bg-primary hover:bg-primary-600 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors shadow-sm shadow-primary/30"
          >
            Save
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {/* Task Name */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Task Name</p>
            <div className="bg-primary/10 rounded-2xl px-4 py-3.5 flex items-center gap-3">
              <span className="text-xl shrink-0">🚀</span>
              <input
                type="text"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 placeholder:font-normal"
                autoFocus
              />
            </div>
          </div>

          {/* Project + Label Row */}
          <div className="flex gap-3">
            {/* Select Project */}
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Select Project</p>
              <div className="relative">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none appearance-none cursor-pointer focus:border-primary/50"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <HiChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Add Label */}
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Add Label</p>
              <div className="flex items-center gap-1.5 py-2">
                {labels.map((label) => (
                  <button
                    key={label.id}
                    onClick={() => setSelectedLabel(label.id)}
                    className="w-7 h-7 rounded-full transition-all flex items-center justify-center"
                    style={{
                      backgroundColor: label.color,
                      boxShadow: selectedLabel === label.id ? `0 0 0 3px white, 0 0 0 5px ${label.color}` : "none",
                      transform: selectedLabel === label.id ? "scale(1.15)" : "scale(1)",
                    }}
                    title={label.name}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setShowNewLabel((prev) => !prev)}
                  className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-400 transition-colors"
                >
                  <HiPlus className="w-3 h-3" />
                </button>
              </div>
              {showNewLabel && (
                <div className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={newLabelName}
                    onChange={(e) => setNewLabelName(e.target.value)}
                    placeholder="Label name"
                    className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs outline-none focus:border-primary/50"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                      className="h-7 w-8 rounded border border-gray-200 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        void handleCreateLabel();
                      }}
                      className="rounded-lg bg-primary px-2 py-1 text-[11px] font-semibold text-white"
                    >
                      Save Label
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Task Category</p>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none appearance-none cursor-pointer focus:border-primary/50"
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <HiChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Set Date */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <HiCalendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Set Date</p>
            </div>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
              {/* Day Picker */}
              <div className="flex gap-1">
                {DAYS.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(i)}
                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                      selectedDay === i
                        ? "bg-primary text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
              {/* Due Date */}
              <div className="text-right shrink-0 ml-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Due Date</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer w-28 text-right"
                />
              </div>
            </div>
          </div>

          {/* Time */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <HiClock className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Time</p>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">From</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{parseTime(startTime)}</span>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  />
                </div>
              </div>
              <div className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">To</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{parseTime(endTime)}</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Discard / Delete */}
          <button
            onClick={task ? () => { deleteTaskAsync(taskId as string); onClose(); } : onClose}
            className="text-center text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors py-1"
          >
            {task ? "Delete Task" : "Discard Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

