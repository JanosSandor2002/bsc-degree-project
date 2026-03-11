import mongoose, { Document, Schema } from 'mongoose';

export interface ISubtask extends Document {
  title: string;
  status: 'Starting' | 'To Do' | 'Help Needed' | 'Review' | 'Done';
  task: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId;
}

const SubtaskSchema: Schema = new Schema<ISubtask>(
  {
    title: { type: String, required: true },
    status: {
      type: String,
      enum: ['Starting', 'To Do', 'Help Needed', 'Review', 'Done'],
      default: 'Starting',
    },
    task: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default mongoose.model<ISubtask>('Subtask', SubtaskSchema);
