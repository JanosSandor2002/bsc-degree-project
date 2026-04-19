import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Sprint from '../models/Sprint';
import Task from '../models/Task';
import { logEvent } from '../services/logService';

const router = Router();

router.get(
  '/project/:projectId',
  protect,
  async (req: Request, res: Response) => {
    try {
      const sprints = await Sprint.find({ project: req.params.projectId });
      res.json(sprints);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

router.post('/', protect, async (req: any, res: Response) => {
  try {
    const sprint = await Sprint.create({ ...req.body });
    if (sprint.project) {
      await logEvent(
        sprint.project.toString(),
        `Sprint created: "${sprint.name}" (${sprint.startDate.toISOString().slice(0, 10)} → ${sprint.endDate.toISOString().slice(0, 10)})`,
        req.user._id.toString(),
      );
    }
    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', protect, async (req: any, res: Response) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: 'after',
    });
    if (sprint?.project) {
      await logEvent(
        sprint.project.toString(),
        `Sprint updated: "${sprint.name}"`,
        req.user._id.toString(),
      );
    }
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', protect, async (req: any, res: Response) => {
  try {
    const sprint = await Sprint.findById(req.params.id);
    if (sprint?.project) {
      await logEvent(
        sprint.project.toString(),
        `Sprint deleted: "${sprint.name}"`,
        req.user._id.toString(),
      );
    }
    await Sprint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Sprint deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// ASSIGN task to sprint
router.post(
  '/:sprintId/tasks/:taskId',
  protect,
  async (req: any, res: Response) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.taskId,
        { sprint: req.params.sprintId },
        { returnDocument: 'after' },
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });

      const sprint = await Sprint.findById(req.params.sprintId);
      if (task.project && sprint) {
        await logEvent(
          task.project.toString(),
          `Task assigned to sprint: "${task.title}" → "${sprint.name}"`,
          req.user._id.toString(),
        );
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

export default router;
