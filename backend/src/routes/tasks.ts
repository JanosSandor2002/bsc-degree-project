import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Task from '../models/Task';
import { addXP } from '../services/xpService';
import { logEvent } from '../services/logService';

const router = Router();

// CREATE TASK
router.post('/', protect, async (req: any, res: Response) => {
  try {
    const task = await Task.create({ ...req.body });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET TASKS BY PROJECT
router.get(
  '/project/:projectId',
  protect,
  async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.params.projectId }).populate(
        'assignedTo',
        '-password',
      );
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

// UPDATE TASK (generic — title, deadline, status — no XP triggered)
router.put('/:id', protect, async (req: any, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// COMPLETE TASK — marks Done AND awards XP in one call
// Also accepts optional title/deadline in body so frontend only needs one request
router.put('/:id/complete', protect, async (req: any, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const alreadyDone = task.status === 'Done';

    // Apply any field updates sent alongside (title, deadline)
    if (req.body.title) task.title = req.body.title;
    if (req.body.deadline) task.deadline = req.body.deadline;
    task.status = 'Done';
    await task.save();

    // Only award XP if it wasn't already Done
    if (!alreadyDone) {
      const recipientId = task.assignedTo
        ? task.assignedTo.toString()
        : req.user._id.toString();

      const xpAmount = task.xpReward && task.xpReward > 0 ? task.xpReward : 5;
      await addXP(recipientId, xpAmount);

      if (task.project) {
        await logEvent(
          task.project.toString(),
          `Task completed: "${task.title}" (+${xpAmount} XP)`,
          recipientId,
        );
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE TASK
router.delete('/:id', protect, async (req, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
