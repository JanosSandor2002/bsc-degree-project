import { Schema, model, Types, Document } from 'mongoose';
import { IUser } from './User';

export interface IMail extends Document {
  from: IUser | Types.ObjectId;
  to: IUser | Types.ObjectId;
  subject: string;
  body: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MailSchema = new Schema<IMail>(
  {
    from: { type: Types.ObjectId, ref: 'User', required: true },
    to: { type: Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default model<IMail>('Mail', MailSchema);
