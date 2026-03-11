import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'GlobalAdmin' | 'ProjectAdmin' | 'Contributor' | 'Viewer';
  xp: number;
  level: number;
  prestige: number;
  badges: string[];
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ['GlobalAdmin', 'ProjectAdmin', 'Contributor', 'Viewer'],
      default: 'Contributor',
    },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    prestige: { type: Number, default: 0 },
    badges: [{ type: String }],
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
