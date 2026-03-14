import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory =
  | 'MARKETING'
  | 'DESIGN'
  | 'DEVELOPMENT'
  | 'OPERATIONS'
  | 'PRODUCT'
  | 'PERSONAL';

export interface IAssignee {
  name: string;
  color: string;
}

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: TaskCategory;
  tags: string[];
  dueDate: Date | null;
  startTime?: string;
  endTime?: string;
  assignees: IAssignee[];
  projectId?: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [200, 'Title cannot be more than 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'],
      default: 'DEVELOPMENT',
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags: string[]) => tags.length <= 10,
        message: 'Cannot have more than 10 tags',
      },
    },
    dueDate: { type: Date, default: null },
    startTime: { type: String },
    endTime: { type: String },
    assignees: {
      type: [{ name: { type: String, required: true }, color: { type: String, required: true } }],
      default: [],
    },
    projectId: { type: String },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

taskSchema.virtual('isOverdue').get(function taskIsOverdue(this: ITask) {
  if (!this.dueDate) return false;
  if (this.status === 'done') return false;
  return this.dueDate.getTime() < Date.now();
});

taskSchema.virtual('assigneeCount').get(function taskAssigneeCount(this: ITask) {
  return Array.isArray(this.assignees) ? this.assignees.length : 0;
});

taskSchema.virtual('tagCount').get(function taskTagCount(this: ITask) {
  return Array.isArray(this.tags) ? this.tags.length : 0;
});

// Map _id → id, remove __v in JSON responses
taskSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    ret._id = undefined;
    ret.__v = undefined;
    return ret;
  },
});

taskSchema.set('toObject', {
  virtuals: true,
});

taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ category: 1 });
taskSchema.index({ userId: 1, dueDate: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' });

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;
