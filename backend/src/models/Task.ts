import { Schema, model, Types, Document } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';
import { ISprint } from './Sprint';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'Open' | 'InProgress' | 'Done';
  assignedTo?: IUser | Types.ObjectId;
  project?: IProject | Types.ObjectId;
  sprint?: ISprint | Types.ObjectId;
  dependencies: Types.ObjectId[];
  xpReward: number;
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['Open', 'InProgress', 'Done'],
      default: 'Open',
    },
    assignedTo: { type: Types.ObjectId, ref: 'User' },
    project: { type: Types.ObjectId, ref: 'Project' },
    sprint: { type: Types.ObjectId, ref: 'Sprint' },
    dependencies: [{ type: Types.ObjectId, ref: 'Task' }],
    xpReward: { type: Number, default: 0 },
    deadline: { type: Date },
  },
  { timestamps: true },
);

export default model<ITask>('Task', TaskSchema);
