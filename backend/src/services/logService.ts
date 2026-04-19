import { Types } from 'mongoose';
import Log from '../models/Log';

export const logEvent = async (
  projectId: string,
  message: string,
  userId?: string,
) => {
  try {
    await Log.create({
      project: new Types.ObjectId(projectId),
      message,
      ...(userId ? { user: new Types.ObjectId(userId) } : {}),
    });
  } catch (err) {
    // Never let a log failure break the main flow
    console.error('[logService] Failed to save log:', err);
  }
};
