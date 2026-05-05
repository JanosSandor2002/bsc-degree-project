// logService.test.ts - így kellene kinéznie
import { logEvent } from '../../services/logService';
import Log from '../../models/Log';
import mongoose from 'mongoose';

describe('logService – logEvent', () => {
  it('elmenti a log bejegyzést az adatbázisba', async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    await logEvent(projectId, 'Task completed: Fix login bug');

    const log = await Log.findOne({ message: 'Task completed: Fix login bug' });
    expect(log).not.toBeNull();
    expect(log?.message).toBe('Task completed: Fix login bug');
  });

  it('userId-t is elmenti, ha meg van adva', async () => {
    const projectId = new mongoose.Types.ObjectId().toString();
    const userId = new mongoose.Types.ObjectId().toString();
    await logEvent(projectId, 'Task completed', userId);

    const log = await Log.findOne({ message: 'Task completed' });
    expect(log?.user?.toString()).toBe(userId);
  });
});
