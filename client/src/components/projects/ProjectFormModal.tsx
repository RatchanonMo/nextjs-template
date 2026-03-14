import { WorkspaceProject } from "@/stores/useWorkspaceStore";

export interface ProjectFormValues {
  name: string;
  description: string;
  icon: string;
  category: WorkspaceProject["category"];
  accentColor: string;
}

interface ProjectFormModalProps {
  editingProject: WorkspaceProject | null;
  onSubmit: (values: ProjectFormValues) => void;
  onClose: () => void;
}

const CATEGORIES: WorkspaceProject["category"][] = [
  "DEVELOPMENT",
  "DESIGN",
  "MARKETING",
  "OPERATIONS",
  "PRODUCT",
  "PERSONAL",
];

import { useState } from "react";

export default function ProjectFormModal({ editingProject, onSubmit, onClose }: ProjectFormModalProps) {
  const [name, setName] = useState(editingProject?.name ?? "");
  const [description, setDescription] = useState(editingProject?.description ?? "");
  const [icon, setIcon] = useState(editingProject?.icon ?? "📁");
  const [category, setCategory] = useState<WorkspaceProject["category"]>(
    editingProject?.category ?? "DEVELOPMENT",
  );
  const [accentColor, setAccentColor] = useState(editingProject?.accentColor ?? "#3b82f6");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      description: description.trim() || "No description provided.",
      icon: icon || "📁",
      category,
      accentColor,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900">
          {editingProject ? "Edit Project" : "Create New Project"}
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          {editingProject
            ? "Update the project details below."
            : "This project will be available in the project list and task editor."}
        </p>

        <div className="mt-4 space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Project description"
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              placeholder="Icon (e.g. 🚀)"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary/50"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as WorkspaceProject["category"])}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            Accent color
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              className="h-7 w-8 rounded border border-gray-200"
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white"
          >
            {editingProject ? "Update Project" : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}
