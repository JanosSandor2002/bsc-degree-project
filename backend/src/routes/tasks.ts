import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Task from '../models/Task';

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

// UPDATE TASK
router.put('/:id', protect, async (req, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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
