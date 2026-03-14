import mongoose, { Document, Schema } from 'mongoose';

type TaskCategory = 'MARKETING' | 'DESIGN' | 'DEVELOPMENT' | 'OPERATIONS' | 'PRODUCT' | 'PERSONAL';

export interface IWorkspaceProject {
  id: string;
  name: string;
  description: string;
  category: TaskCategory;
  icon: string;
  accentColor: string;
}

export interface IWorkspaceLabel {
  id: string;
  name: string;
  color: string;
}

export interface IWorkspace extends Document {
  userId: mongoose.Types.ObjectId;
  projects: IWorkspaceProject[];
  labels: IWorkspaceLabel[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IWorkspaceProject>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    category: {
      type: String,
      enum: ['MARKETING', 'DESIGN', 'DEVELOPMENT', 'OPERATIONS', 'PRODUCT', 'PERSONAL'],
      required: true,
    },
    icon: { type: String, required: true, default: '📁' },
    accentColor: { type: String, required: true, default: '#3b82f6' },
  },
  { _id: false },
);

const labelSchema = new Schema<IWorkspaceLabel>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    color: { type: String, required: true },
  },
  { _id: false },
);

const workspaceSchema = new Schema<IWorkspace>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    projects: { type: [projectSchema], default: [] },
    labels: { type: [labelSchema], default: [] },
  },
  { timestamps: true },
);

workspaceSchema.set('toJSON', {
  virtuals: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc, ret: any) => {
    ret.id = String(ret._id);
    ret._id = undefined;
    ret.__v = undefined;
    return ret;
  },
});

const Workspace = mongoose.model<IWorkspace>('Workspace', workspaceSchema);
export default Workspace;
