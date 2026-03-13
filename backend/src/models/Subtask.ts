import { Schema, model, Types, Document } from 'mongoose';
import { ITask } from './Task';
import { IUser } from './User';

export interface ISubtask extends Document {
  title: string;
  status: 'Open' | 'InProgress' | 'Done';
  task: ITask | Types.ObjectId;
  assignedTo?: IUser | Types.ObjectId;
  xpReward: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['Open', 'InProgress', 'Done'],
      default: 'Open',
    },
    task: { type: Types.ObjectId, ref: 'Task', required: true },
    assignedTo: { type: Types.ObjectId, ref: 'User' },
    xpReward: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default model<ISubtask>('Subtask', SubtaskSchema);
