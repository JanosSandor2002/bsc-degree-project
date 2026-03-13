import { Schema, model, Types, Document } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  name: string;
  description?: string;
  members: (IUser | Types.ObjectId)[];
  createdBy: IUser | Types.ObjectId;
  admin: IUser | Types.ObjectId;
  contributors: (IUser | Types.ObjectId)[];
  viewers: (IUser | Types.ObjectId)[];
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    members: [{ type: Types.ObjectId, ref: 'User' }],
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    admin: { type: Types.ObjectId, ref: 'User', required: true },
    contributors: [{ type: Types.ObjectId, ref: 'User' }],
    viewers: [{ type: Types.ObjectId, ref: 'User' }],
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true },
);

export default model<IProject>('Project', ProjectSchema);
