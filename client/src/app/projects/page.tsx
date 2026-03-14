"use client";

import Sidebar from "@/components/Sidebar";
import TaskModal from "@/components/TaskModal";
import ProjectCard from "@/components/projects/ProjectCard";
import ProjectFormModal, {
  ProjectFormValues,
} from "@/components/projects/ProjectFormModal";
import { buildProjectsFromTasks } from "@/lib/taskViews";
import { useAuthStore } from "@/stores/useAuthStore";
import { useTaskStore } from "@/stores/useTaskStore";
import {
  useWorkspaceStore,
  WorkspaceProject,
} from "@/stores/useWorkspaceStore";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { HiOutlineSearch, HiPlus } from "react-icons/hi";

const PROJECTS_SEARCH_KEY = "flowtask_projects_search";
const getProjectId = (project: Pick<WorkspaceProject, "id" | "_id">) =>
  project._id ?? project.id;

export default function ProjectsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const {
    projects: projectCatalog,
    addProject,
    updateProject,
    deleteProject,
    hydrate,
  } = useWorkspaceStore();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<WorkspaceProject | null>(
    null,
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);
  useEffect(() => {
    if (user) fetchTasks();
  }, [fetchTasks, user]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(PROJECTS_SEARCH_KEY);
    if (stored) setSearch(stored);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PROJECTS_SEARCH_KEY, search);
  }, [search]);

  const projects = useMemo(
    () => buildProjectsFromTasks(tasks, projectCatalog),
    [tasks, projectCatalog],
  );

  const filtered = projects.filter((project) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.category.toLowerCase().includes(query) ||
      project.subtasks.some((subtask) =>
        subtask.title.toLowerCase().includes(query),
      )
    );
  });

  const openEditProject = (project: WorkspaceProject) => {
    setEditingProject(project);
    setIsProjectFormOpen(true);
  };

  const openCreateProject = () => {
    setEditingProject(null);
    setIsProjectFormOpen(true);
  };

  const handleFormSubmit = async (values: ProjectFormValues) => {
    if (editingProject) {
      await updateProject(getProjectId(editingProject), values);
    } else {
      await addProject(values);
    }
    setEditingProject(null);
    setIsProjectFormOpen(false);
  };

  const handleDeleteProject = async (projectId: string) => {
    await deleteProject(projectId);
  };

  const openProjectDetail = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="flex h-screen bg-[#f4f4f5] overflow-hidden">
      <Sidebar
        onNewTask={() => setIsModalOpen(true)}
        inboxCount={tasks.filter((task) => task.status !== "done").length}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-start justify-between px-8 pt-7 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Projects
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Manage and track your active project folders.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <div className="relative">
              <HiOutlineSearch className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white pl-9 pr-4 py-2 rounded-xl text-sm text-gray-700 border border-gray-200 outline-none focus:border-primary/50 w-48 shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-72 rounded-2xl bg-white/70 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((project) => (
                <ProjectCard
                  key={project._id ?? project.id}
                  project={project}
                  onEdit={openEditProject}
                  onDelete={(id) => void handleDeleteProject(id)}
                  onOpen={openProjectDetail}
                />
              ))}

              <button
                type="button"
                onClick={openCreateProject}
                className="bg-white rounded-2xl p-5 shadow-sm border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 min-h-[280px] text-gray-400 hover:text-primary"
              >
                <div className="w-11 h-11 rounded-full border-2 border-current flex items-center justify-center">
                  <HiPlus className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">Create New Project</p>
                  <p className="text-xs mt-0.5">
                    Start a new folder to organize tasks
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={null}
      />

      {isProjectFormOpen && (
        <ProjectFormModal
          editingProject={editingProject}
          onSubmit={(values) => void handleFormSubmit(values)}
          onClose={() => {
            setIsProjectFormOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}
