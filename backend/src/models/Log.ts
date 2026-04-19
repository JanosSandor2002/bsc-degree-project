import { Schema, model, Types, Document } from 'mongoose';
import { IProject } from './Project';
import { IUser } from './User';

export interface ILog extends Document {
  project: IProject | Types.ObjectId;
  message: string;
  user?: IUser | Types.ObjectId;
  createdAt: Date;
}

const LogSchema = new Schema<ILog>(
  {
    project: { type: Types.ObjectId, ref: 'Project', required: true },
    message: { type: String, required: true },
    user: { type: Types.ObjectId, ref: 'User' },
  },
  { timestamps: true },
);

export default model<ILog>('Log', LogSchema);
