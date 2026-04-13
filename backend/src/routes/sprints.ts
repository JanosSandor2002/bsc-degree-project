import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Sprint from '../models/Sprint';
import Task from '../models/Task';

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
    res.status(201).json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/:id', protect, async (req: Request, res: Response) => {
  try {
    const sprint = await Sprint.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(sprint);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.delete('/:id', protect, async (req: Request, res: Response) => {
  try {
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
  async (req: Request, res: Response) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.taskId,
        { sprint: req.params.sprintId },
        { new: true },
      );
      if (!task) return res.status(404).json({ message: 'Task not found' });
      res.json(task);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

export default router;
