import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'Starting' | 'To Do' | 'Help Needed' | 'Review' | 'Done';
  project: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
}

const TaskSchema: Schema = new Schema<ITask>(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: {
      type: String,
      enum: ['Starting', 'To Do', 'Help Needed', 'Review', 'Done'],
      default: 'Starting',
    },
    project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default mongoose.model<ITask>('Task', TaskSchema);
