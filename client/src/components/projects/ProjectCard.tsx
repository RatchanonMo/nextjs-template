import { HiCheck, HiClipboardList, HiDotsVertical } from "react-icons/hi";
import { Project } from "@/types/task";
import { WorkspaceProject } from "@/stores/useWorkspaceStore";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: WorkspaceProject) => void;
  onDelete: (projectId: string) => void;
  onOpen: (projectId: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete, onOpen }: ProjectCardProps) {
  const projectId = project._id ?? project.id;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onOpen(projectId)}
    >
      <div className="h-1.5" style={{ backgroundColor: project.accentColor }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
            style={{ backgroundColor: `${project.accentColor}18` }}
          >
            {project.icon}
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(project as WorkspaceProject); }}
            className="text-gray-300 hover:text-gray-500 transition-colors"
            title="Edit project"
          >
            <HiDotsVertical className="w-4 h-4" />
          </button>
        </div>

        <h3 className="font-bold text-gray-800 text-base mb-1">{project.name}</h3>
        <p className="text-xs text-gray-400 mb-4 line-clamp-2">{project.description}</p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress</span>
            <span className="text-xs font-bold" style={{ color: project.accentColor }}>
              {project.progress}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${project.progress}%`, backgroundColor: project.accentColor }}
            />
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-1.5">
          {project.subtasks.length > 0 ? (
            project.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full shrink-0 flex items-center justify-center ${
                    subtask.done ? "bg-primary" : "border-2 border-gray-300"
                  }`}
                >
                  {subtask.done && <HiCheck className="w-2 h-2 text-white" />}
                </div>
                <span className={`text-xs truncate ${subtask.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                  {subtask.title}
                </span>
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No tasks yet for this project.</div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-1.5">
            {project.assignees.slice(0, 3).map((assignee, index) => (
              <div
                key={`${assignee.name}-${index}`}
                className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white shadow-sm"
                style={{ backgroundColor: assignee.color }}
              >
                {assignee.name[0]}
              </div>
            ))}
          </div>
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <HiClipboardList className="w-3.5 h-3.5" />
            {project.taskCount} Tasks
          </span>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(project as WorkspaceProject); }}
            className="rounded-lg border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 hover:border-primary/40 hover:text-primary"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(projectId); }}
            className="rounded-lg border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
