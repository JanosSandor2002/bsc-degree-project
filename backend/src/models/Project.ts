import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  admin: mongoose.Types.ObjectId;
  contributors: mongoose.Types.ObjectId[];
  viewers: mongoose.Types.ObjectId[];
  startDate?: Date;
  endDate?: Date;
}

const ProjectSchema: Schema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contributors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    viewers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model<IProject>('Project', ProjectSchema);
