import { Schema, model, Types, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  xp: number;
  level: number;
  prestige: number;
  verified: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    prestige: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    avatar: { type: String, default: '' },
  },
  { timestamps: true },
);

export default model<IUser>('User', UserSchema);
