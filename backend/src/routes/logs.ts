import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Log from '../models/Log';

const router = Router();

// GET logs for a project (newest first, max 100)
router.get(
  '/project/:projectId',
  protect,
  async (req: Request, res: Response) => {
    try {
      const logs = await Log.find({ project: req.params.projectId })
        .populate('user', 'username')
        .sort({ createdAt: -1 })
        .limit(100);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

export default router;
