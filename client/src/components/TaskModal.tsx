"use client";
import { Task, TaskFormData, TaskPriority, TaskStatus, TaskCategory } from "@/types/task";
import { useTaskStore } from "@/stores/useTaskStore";
import { useEffect, useMemo, useState } from "react";
import { HiX, HiChevronDown, HiPlus, HiCalendar, HiClock } from "react-icons/hi";
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { toLocalDateKey } from "@/lib/taskViews";
import { z } from "zod";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultDueDate?: string;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

type ToastState = {
  tone: "success" | "error";
  message: string;
} | null;

type ValidationRules = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
};

type ShowIfRule = {
  field: string;
  equals: string | number | boolean;
};

type OptionSource = "projects" | "categories" | "statuses";

type DynamicFieldNode = {
  kind: "field";
  key: string;
  label: string;
  type: "text" | "select" | "date" | "time" | "label-picker" | "day-picker";
  placeholder?: string;
  optionsSource?: OptionSource;
  validation_rules?: ValidationRules;
  show_if?: ShowIfRule;
};

type DynamicGroupNode = {
  kind: "group";
  key: string;
  label: string;
  ui: "task-name" | "meta-row" | "single" | "date" | "time" | "stack";
  fields: DynamicNode[];
  show_if?: ShowIfRule;
};

type DynamicNode = DynamicFieldNode | DynamicGroupNode;

type FormValues = Record<string, unknown>;
type ErrorMap = Record<string, string>;

const CATEGORY_OPTIONS: TaskCategory[] = ["MARKETING", "DESIGN", "DEVELOPMENT", "OPERATIONS", "PRODUCT", "PERSONAL"];
const STATUS_OPTIONS: TaskStatus[] = ["todo", "in-progress", "done"];

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const today = new Date().getDay(); // 0=Sun, 1=Mon, ...

const TASK_MODAL_SCHEMA: DynamicNode[] = [
  {
    kind: "group",
    key: "task",
    label: "Task Name",
    ui: "task-name",
    fields: [
      {
        kind: "field",
        key: "title",
        label: "Task Name",
        type: "text",
        placeholder: "What needs to be done?",
        validation_rules: { required: true, min: 2 },
      },
    ],
  },
  {
    kind: "group",
    key: "meta",
    label: "Meta",
    ui: "meta-row",
    fields: [
      {
        kind: "field",
        key: "projectId",
        label: "Select Project",
        type: "select",
        optionsSource: "projects",
        validation_rules: { required: true },
      },
      {
        kind: "field",
        key: "labelId",
        label: "Add Label",
        type: "label-picker",
      },
    ],
  },
  {
    kind: "group",
    key: "settings",
    label: "Settings",
    ui: "stack",
    fields: [
      {
        kind: "field",
        key: "category",
        label: "Task Category",
        type: "select",
        optionsSource: "categories",
        validation_rules: { required: true },
      },
      {
        kind: "field",
        key: "status",
        label: "Task Status",
        type: "select",
        optionsSource: "statuses",
        validation_rules: { required: true },
      },
      {
        kind: "field",
        key: "doneNote",
        label: "Done Note",
        type: "text",
        placeholder: "Write completion note",
        show_if: { field: "settings.status", equals: "done" },
        validation_rules: { required: true, min: 3 },
      },
    ],
  },
  {
    kind: "group",
    key: "schedule",
    label: "Schedule",
    ui: "stack",
    fields: [
      {
        kind: "group",
        key: "date",
        label: "Set Date",
        ui: "date",
        fields: [
          {
            kind: "field",
            key: "dayIndex",
            label: "Day",
            type: "day-picker",
          },
          {
            kind: "field",
            key: "dueDate",
            label: "Due Date",
            type: "date",
          },
        ],
      },
      {
        kind: "group",
        key: "time",
        label: "Time",
        ui: "time",
        fields: [
          {
            kind: "field",
            key: "start",
            label: "From",
            type: "time",
            validation_rules: { required: true },
          },
          {
            kind: "field",
            key: "end",
            label: "To",
            type: "time",
            validation_rules: { required: true },
          },
        ],
      },
    ],
  },
];

const toPath = (parentPath: string, key: string) => (parentPath ? `${parentPath}.${key}` : key);

const getByPath = (source: FormValues, path: string): unknown => {
  if (!path) return undefined;
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, source);
};

const setByPath = (source: FormValues, path: string, value: unknown): FormValues => {
  const keys = path.split(".");
  const next: FormValues = { ...source };
  let cursor: Record<string, unknown> = next;

  keys.forEach((key, index) => {
    const isLeaf = index === keys.length - 1;
    if (isLeaf) {
      cursor[key] = value;
      return;
    }

    const current = cursor[key];
    if (!current || typeof current !== "object") {
      cursor[key] = {};
    }
    cursor = cursor[key] as Record<string, unknown>;
  });

  return next;
};

const shouldDisplay = (node: DynamicNode, values: FormValues): boolean => {
  if (!node.show_if) return true;
  return getByPath(values, node.show_if.field) === node.show_if.equals;
};

const buildLeafSchema = (field: DynamicFieldNode) => {
  if (field.type === "day-picker") {
    return z.number().min(0).max(6);
  }

  let schema = z.string();

  if (field.validation_rules?.required) {
    schema = schema.refine((value) => value.trim().length > 0, `${field.label} is required`);
  }
  if (typeof field.validation_rules?.min === "number") {
    schema = schema.min(field.validation_rules.min, `${field.label} must be at least ${field.validation_rules.min} characters`);
  }
  if (typeof field.validation_rules?.max === "number") {
    schema = schema.max(field.validation_rules.max, `${field.label} must be at most ${field.validation_rules.max} characters`);
  }
  if (field.validation_rules?.pattern) {
    try {
      const regex = new RegExp(field.validation_rules.pattern);
      schema = schema.regex(regex, `${field.label} format is invalid`);
    } catch {
      // Keep schema usable even if pattern config is invalid.
    }
  }

  return schema;
};

const collectValidationErrors = (
  nodes: DynamicNode[],
  values: FormValues,
  parentPath = "",
  output: ErrorMap = {},
) => {
  nodes.forEach((node) => {
    const path = toPath(parentPath, node.key);
    if (!shouldDisplay(node, values)) return;

    if (node.kind === "group") {
      collectValidationErrors(node.fields, values, path, output);
      return;
    }

    const result = buildLeafSchema(node).safeParse(getByPath(values, path));
    if (!result.success) {
      output[path] = result.error.issues[0]?.message ?? `${node.label} is invalid`;
    }
  });

  return output;
};

const createInitialValues = (
  task: Task | null | undefined,
  projectId: string,
  labelId: string,
  defaultDueDate?: string,
  defaultStartTime?: string,
  defaultEndTime?: string,
): FormValues => {
  const values: FormValues = {
    task: {
      title: task?.title ?? "",
    },
    meta: {
      projectId: task?.projectId || projectId,
      labelId,
    },
    settings: {
      category: task?.category ?? "DEVELOPMENT",
      status: task?.status ?? "todo",
      doneNote: "",
    },
    schedule: {
      date: {
        dayIndex: today,
        dueDate: task?.dueDate ? toLocalDateKey(new Date(task.dueDate)) : defaultDueDate ?? "",
      },
      time: {
        start: task?.startTime || defaultStartTime || "09:00",
        end: task?.endTime || defaultEndTime || "10:30",
      },
    },
  };

  return values;
};

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

  const [formValues, setFormValues] = useState<FormValues>({});
  const [errors, setErrors] = useState<ErrorMap>({});
  const [showNewLabel, setShowNewLabel] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#22c55e");
  const [priority] = useState<TaskPriority>("medium");
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const selectedLabel = (getByPath(formValues, "meta.labelId") as string | undefined) ?? "";
  const dynamicSchema = useMemo(() => TASK_MODAL_SCHEMA, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isOpen) return;
    setFormValues(
      createInitialValues(
        task,
        projects[0]?.id || "p1",
        task?.tags?.[0] || labels[0]?.id || "",
        defaultDueDate,
        defaultStartTime,
        defaultEndTime,
      ),
    );
    setErrors({});
  }, [task, isOpen, labels, projects, defaultDueDate, defaultStartTime, defaultEndTime]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const handleSave = async () => {
    if (isSaving) return;

    const validationErrors = collectValidationErrors(dynamicSchema, formValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setToast({ tone: "error", message: "Please fix validation errors before saving" });
      return;
    }

    const title = String(getByPath(formValues, "task.title") ?? "").trim();
    const status = String(getByPath(formValues, "settings.status") ?? "todo") as TaskStatus;
    const category = String(getByPath(formValues, "settings.category") ?? "DEVELOPMENT") as TaskCategory;
    const projectId = String(getByPath(formValues, "meta.projectId") ?? "");
    const selectedTag = String(getByPath(formValues, "meta.labelId") ?? "");
    const startTime = String(getByPath(formValues, "schedule.time.start") ?? "");
    const endTime = String(getByPath(formValues, "schedule.time.end") ?? "");
    const dueDate = String(getByPath(formValues, "schedule.date.dueDate") ?? "");
    const doneNote = String(getByPath(formValues, "settings.doneNote") ?? "").trim();

    if (!title) {
      setToast({ tone: "error", message: "Task title is required" });
      return;
    }

    const descriptionParts = [task?.description?.trim() ?? ""];
    if (doneNote) {
      descriptionParts.push(`Done note: ${doneNote}`);
    }

    const formData: TaskFormData = {
      title,
      description: descriptionParts.filter(Boolean).join("\n"),
      status,
      priority,
      category,
      tags: selectedTag ? [selectedTag, ...(task?.tags ?? []).filter((t) => t !== selectedTag)] : task?.tags ?? [],
      assignees: task?.assignees ?? [],
      startTime,
      endTime,
      dueDate: dueDate || undefined,
      projectId: projectId || undefined,
    };

    setIsSaving(true);
    try {
      if (task) {
        await updateTaskAsync(taskId as string, formData);
        setToast({ tone: "success", message: "Task updated successfully" });
      } else {
        await createTaskAsync(formData);
        setToast({ tone: "success", message: "Task created successfully" });
      }
      onClose();
    } catch {
      setToast({ tone: "error", message: task ? "Failed to update task" : "Failed to create task" });
    } finally {
      setIsSaving(false);
    }
  };

  const parseTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return padTime(h, m);
  };

  const setFieldValue = (path: string, value: unknown) => {
    setFormValues((prev) => setByPath(prev, path, value));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;
    const id = await addLabel({ name: newLabelName.trim(), color: newLabelColor });
    setFieldValue("meta.labelId", id);
    setNewLabelName("");
    setShowNewLabel(false);
  };

  const selectOptions = (source?: OptionSource) => {
    if (source === "projects") {
      return projects.map((project) => ({ value: project.id, label: project.name }));
    }
    if (source === "categories") {
      return CATEGORY_OPTIONS.map((option) => ({ value: option, label: option }));
    }
    if (source === "statuses") {
      return STATUS_OPTIONS.map((option) => ({ value: option, label: option }));
    }
    return [];
  };

  const renderField = (field: DynamicFieldNode, path: string) => {
    const value = getByPath(formValues, path);
    const error = errors[path];

    if (!shouldDisplay(field, formValues)) return null;

    if (field.type === "label-picker") {
      return (
        <div key={path}>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{field.label}</p>
          <div className="flex items-center gap-1.5 py-2">
            {labels.map((label) => (
              <button
                key={label.id}
                type="button"
                onClick={() => setFieldValue(path, label.id)}
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
          {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
        </div>
      );
    }

    if (field.type === "day-picker") {
      return (
        <div key={path} className="flex gap-1">
          {DAYS.map((day, index) => {
            const isSelected = Number(value ?? today) === index;
            return (
              <button
                key={`${path}-${day}-${index}`}
                type="button"
                onClick={() => setFieldValue(path, index)}
                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                  isSelected ? "bg-primary text-white shadow-sm" : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      );
    }

    if (field.type === "select") {
      const options = selectOptions(field.optionsSource);
      return (
        <div key={path} className="flex-1">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{field.label}</p>
          <div className="relative">
            <select
              value={String(value ?? "")}
              onChange={(e) => setFieldValue(path, e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 outline-none appearance-none cursor-pointer focus:border-primary/50"
            >
              {options.map((option) => (
                <option key={`${path}-${option.value}`} value={option.value}>{option.label}</option>
              ))}
            </select>
            <HiChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
        </div>
      );
    }

    if (field.type === "date") {
      return (
        <div key={path} className="text-right shrink-0 ml-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{field.label}</p>
          <input
            type="date"
            value={String(value ?? "")}
            onChange={(e) => setFieldValue(path, e.target.value)}
            className="text-xs font-semibold text-gray-700 bg-transparent outline-none cursor-pointer w-28 text-right"
          />
          {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
        </div>
      );
    }

    if (field.type === "time") {
      return (
        <div key={path} className="flex-1 bg-gray-50 rounded-2xl px-4 py-3">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{field.label}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-800">{parseTime(String(value || "09:00"))}</span>
            <input
              type="time"
              value={String(value ?? "")}
              onChange={(e) => setFieldValue(path, e.target.value)}
              className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
            />
          </div>
          {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
        </div>
      );
    }

    return (
      <div key={path}>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{field.label}</p>
        <div className="bg-primary/10 rounded-2xl px-4 py-3.5 flex items-center gap-3">
          <span className="text-xl shrink-0">🚀</span>
          <input
            type="text"
            placeholder={field.placeholder ?? ""}
            value={String(value ?? "")}
            onChange={(e) => setFieldValue(path, e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-gray-700 outline-none placeholder:text-gray-400 placeholder:font-normal"
            autoFocus={path === "task.title"}
          />
        </div>
        {error ? <p className="mt-1 text-[11px] text-red-500">{error}</p> : null}
      </div>
    );
  };

  const renderGroup = (group: DynamicGroupNode, path: string) => {
    if (!shouldDisplay(group, formValues)) return null;

    if (group.ui === "task-name") {
      return <div key={path}>{group.fields.map((node) => renderNode(node, path))}</div>;
    }

    if (group.ui === "meta-row") {
      return <div key={path} className="flex gap-3">{group.fields.map((node) => renderNode(node, path))}</div>;
    }

    if (group.ui === "single") {
      return <div key={path}>{group.fields.map((node) => renderNode(node, path))}</div>;
    }

    if (group.ui === "date") {
      return (
        <div key={path}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <HiCalendar className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.label}</p>
          </div>
          <div className="bg-gray-50 rounded-2xl px-4 py-3 flex items-center justify-between">
            {group.fields.map((node) => renderNode(node, path))}
          </div>
        </div>
      );
    }

    if (group.ui === "time") {
      return (
        <div key={path}>
          <div className="flex items-center gap-1.5 mb-2.5">
            <HiClock className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.label}</p>
          </div>
          <div className="flex gap-3">{group.fields.map((node) => renderNode(node, path))}</div>
        </div>
      );
    }

    return (
      <div key={path} className="space-y-4">
        {group.fields.map((node) => renderNode(node, path))}
      </div>
    );
  };

  const renderNode = (node: DynamicNode, parentPath = "") => {
    const path = toPath(parentPath, node.key);
    if (!shouldDisplay(node, formValues)) return null;

    if (node.kind === "group") {
      return renderGroup(node, path);
    }

    return renderField(node, path);
  };

  if (!isOpen && !toast) return null;

  return (
    <>
      {toast ? (
        <div className="fixed right-6 top-6 z-[60]">
          <div
            className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-lg ${
              toast.tone === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        </div>
      ) : null}

      {isOpen ? (
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
            disabled={isSaving}
            className="bg-primary hover:bg-primary-600 text-white text-sm font-bold px-5 py-2 rounded-full transition-colors shadow-sm shadow-primary/30"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>

        <div className="px-6 pb-6 flex flex-col gap-4">
          {dynamicSchema.map((node) => renderNode(node))}

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
      ) : null}
    </>
  );
}

