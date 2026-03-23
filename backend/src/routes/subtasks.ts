import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Subtask from '../models/Subtask';

const router = Router();

// CREATE SUBTASK
router.post('/', protect, async (req: any, res: Response) => {
  try {
    const subtask = await Subtask.create({ ...req.body });
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
router.put('/:id', protect, async (req, res: Response) => {
  try {
    const subtask = await Subtask.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(subtask);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE SUBTASK
router.delete('/:id', protect, async (req, res: Response) => {
  try {
    await Subtask.findByIdAndDelete(req.params.id);
    res.json({ message: 'Subtask deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
