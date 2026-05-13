import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Subtask from '../models/Subtask';
import Task from '../models/Task';
import { addXP } from '../services/xpService';
import { logEvent } from '../services/logService';

const getProjectId = async (taskId: any): Promise<string | null> => {
  const task = await Task.findById(taskId);
  return task?.project ? task.project.toString() : null;
};

const router = Router();

// CREATE SUBTASK
router.post('/', protect, async (req: any, res: Response) => {
  try {
    const subtask = await Subtask.create({ ...req.body });
    const projectId = await getProjectId(subtask.task);
    if (projectId) {
      await logEvent(
        projectId,
        `Subtask created: "${subtask.title}"`,
        req.user._id.toString(),
      );
    }
    res.status(201).json(subtask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET SUBTASKS BY TASK
router.get('/task/:taskId', protect, async (req: Request, res: Response) => {
  try {
    const subtasks = await Subtask.find({ task: req.params.taskId }).populate(
      'assignedTo',
      '-password',
    );
    res.json(subtasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE SUBTASK
router.put('/:id', protect, async (req: any, res: Response) => {
  try {
    const before = await Subtask.findById(req.params.id);
    const subtask = await Subtask.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
    });
    if (subtask) {
      const projectId = await getProjectId(subtask.task);
      if (projectId) {
        const changes: string[] = [];
        if (req.body.title && req.body.title !== before?.title)
          changes.push(`title → "${req.body.title}"`);
        if (req.body.status && req.body.status !== before?.status)
          changes.push(`status → ${req.body.status}`);
        if (changes.length) {
          await logEvent(
            projectId,
            `Subtask updated: "${subtask.title}" (${changes.join(', ')})`,
            req.user._id.toString(),
          );
        }
      }
    }
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// COMPLETE SUBTASK
router.put('/:id/complete', protect, async (req: any, res: Response) => {
  try {
    const subtask = await Subtask.findById(req.params.id);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found' });

    const alreadyDone = subtask.status === 'Done';
    if (req.body.title) subtask.title = req.body.title;
    subtask.status = 'Done';
    await subtask.save();

    if (!alreadyDone) {
      const recipientId = subtask.assignedTo
        ? subtask.assignedTo.toString()
        : req.user._id.toString();
      const xpAmount =
        subtask.xpReward && subtask.xpReward > 0 ? subtask.xpReward : 3;
      await addXP(recipientId, xpAmount);
      const projectId = await getProjectId(subtask.task);
      if (projectId) {
        await logEvent(
          projectId,
          `Subtask completed: "${subtask.title}" (+${xpAmount} XP)`,
          recipientId,
        );
      }
    }
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE SUBTASK
router.delete('/:id', protect, async (req: any, res: Response) => {
  try {
    const subtask = await Subtask.findById(req.params.id);
    if (subtask) {
      const projectId = await getProjectId(subtask.task);
      if (projectId) {
        await logEvent(
          projectId,
          `Subtask deleted: "${subtask.title}"`,
          req.user._id.toString(),
        );
      }
    }
    await Subtask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subtask deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
