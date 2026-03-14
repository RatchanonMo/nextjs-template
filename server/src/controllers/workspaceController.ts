import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Workspace, { IWorkspaceLabel, IWorkspaceProject } from '../models/Workspace';
import { WorkspaceQueryParams } from '../middleware/queryParams';
import Task from '../models/Task';
import { HTTP_STATUS } from '../constants/httpStatus';

const DEFAULT_PROJECTS: IWorkspaceProject[] = [
  {
    id: 'p1',
    name: 'Marketing Strategy',
    description: 'Brand awareness and Q4 growth campaign planning.',
    category: 'MARKETING',
    icon: '📣',
    accentColor: '#f97316',
  },
  {
    id: 'p2',
    name: 'Web App Redesign',
    description: 'Migrating the core architecture to a more modern framework.',
    category: 'DEVELOPMENT',
    icon: '</>',
    accentColor: '#3b82f6',
  },
  {
    id: 'p3',
    name: 'Mobile UI Kit',
    description: 'Developing a scalable design system for our mobile ecosystem.',
    category: 'DESIGN',
    icon: '✏️',
    accentColor: '#e91e8c',
  },
];

const DEFAULT_LABELS: IWorkspaceLabel[] = [
  { id: 'label-design', name: 'Design', color: '#e91e8c' },
  { id: 'label-development', name: 'Development', color: '#3b82f6' },
  { id: 'label-marketing', name: 'Marketing', color: '#f97316' },
];

const ensureWorkspace = async (userId: string) => {
  let workspace = await Workspace.findOne({ userId });
  if (!workspace) {
    workspace = await Workspace.create({
      userId,
      projects: DEFAULT_PROJECTS,
      labels: DEFAULT_LABELS,
    });
  }
  return workspace;
};

export const getWorkspace = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const workspace = await ensureWorkspace(req.user!.id);
    const { projectSearch, category, sortBy, page, limit, skip } =
      (res.locals.workspaceQuery as WorkspaceQueryParams | undefined) ?? {
        sortBy: 'created',
        page: 1,
        limit: workspace.projects.length || 1,
        skip: 0,
      };

    const filteredProjects = workspace.projects.filter((project) => {
      const byCategory = !category || project.category === category;
      const bySearch =
        !projectSearch ||
        project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
        project.description.toLowerCase().includes(projectSearch.toLowerCase());
      return byCategory && bySearch;
    });

    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === '-name') return b.name.localeCompare(a.name);
      return 0;
    });

    const pagedProjects = sortedProjects.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: {
        projects: pagedProjects,
        labels: workspace.labels,
        meta: {
          totalProjects: sortedProjects.length,
          page,
          limit,
          totalPages: Math.max(1, Math.ceil(sortedProjects.length / limit)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const workspace = await ensureWorkspace(req.user!.id);
    const project = {
      id: `p-${Date.now()}`,
      name: req.body.name as string,
      description: (req.body.description as string) ?? '',
      category: req.body.category as IWorkspaceProject['category'],
      icon: (req.body.icon as string) ?? '📁',
      accentColor: (req.body.accentColor as string) ?? '#3b82f6',
    };

    workspace.projects.push(project);
    await workspace.save();

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const createLabel = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const workspace = await ensureWorkspace(req.user!.id);
    const label = {
      id: `label-${Date.now()}`,
      name: req.body.name as string,
      color: req.body.color as string,
    };

    workspace.labels.push(label);
    await workspace.save();

    res.status(201).json({ success: true, data: label });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ success: false, errors: errors.array() });
      return;
    }

    const workspace = await ensureWorkspace(req.user!.id);
    const { projectId } = req.params;
    const projectIndex = workspace.projects.findIndex((project) => project.id === projectId);

    if (projectIndex === -1) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const currentProject = workspace.projects[projectIndex];
    const updatedProject = {
      ...currentProject,
      name: (req.body.name as string | undefined) ?? currentProject.name,
      description: (req.body.description as string | undefined) ?? currentProject.description,
      category: (req.body.category as IWorkspaceProject['category'] | undefined) ?? currentProject.category,
      icon: (req.body.icon as string | undefined) ?? currentProject.icon,
      accentColor: (req.body.accentColor as string | undefined) ?? currentProject.accentColor,
    };

    workspace.projects[projectIndex] = updatedProject;
    await workspace.save();

    res.status(200).json({ success: true, data: updatedProject });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await mongoose.startSession();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, errors: errors.array() });
      return;
    }

    const { projectId } = req.params;
    let deletedProject: IWorkspaceProject | null = null;
    let unlinkedTasksCount = 0;

    await session.withTransaction(async () => {
      const workspace = await Workspace.findOne({ userId: req.user!.id }).session(session);

      if (!workspace) {
        const created = await Workspace.create([
          {
            userId: req.user!.id,
            projects: DEFAULT_PROJECTS,
            labels: DEFAULT_LABELS,
          },
        ], { session });

        const freshWorkspace = created[0];
        const projectIndex = freshWorkspace.projects.findIndex((project) => project.id === projectId);

        if (projectIndex === -1) {
          const err = new Error('Project not found') as Error & { statusCode?: number };
          err.statusCode = HTTP_STATUS.NOT_FOUND;
          throw err;
        }

        deletedProject = freshWorkspace.projects[projectIndex];
        freshWorkspace.projects.splice(projectIndex, 1);
        await freshWorkspace.save({ session });
      } else {
        const projectIndex = workspace.projects.findIndex((project) => project.id === projectId);

        if (projectIndex === -1) {
          const err = new Error('Project not found') as Error & { statusCode?: number };
          err.statusCode = HTTP_STATUS.NOT_FOUND;
          throw err;
        }

        deletedProject = workspace.projects[projectIndex];
        workspace.projects.splice(projectIndex, 1);
        await workspace.save({ session });
      }

      const updateResult = await Task.updateMany(
        { userId: req.user!.id, projectId },
        { $unset: { projectId: '' } },
        { session },
      );

      unlinkedTasksCount = updateResult.modifiedCount;
    });

    if (!deletedProject) {
      res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: 'Project not found' });
      return;
    }

    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: deletedProject,
      meta: {
        unlinkedTasksCount,
        atomic: true,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    await session.endSession();
  }
};
