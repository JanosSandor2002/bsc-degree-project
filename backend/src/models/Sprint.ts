import { Schema, model, Types, Document } from 'mongoose';
import { IProject } from './Project';

export interface ISprint extends Document {
  name: string;
  project: IProject | Types.ObjectId;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SprintSchema = new Schema<ISprint>(
  {
    name: { type: String, required: true },
    project: { type: Types.ObjectId, ref: 'Project', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true },
);

export default model<ISprint>('Sprint', SprintSchema);
