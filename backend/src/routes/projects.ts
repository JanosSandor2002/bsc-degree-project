import { Router, Request, Response } from 'express';
import { protect } from '../middleware/auth';
import Project from '../models/Project';

const router = Router();

// GET ALL PROJECTS
router.get('/', protect, async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().populate(
      'admin contributors viewers',
      '-password',
    );
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// CREATE PROJECT
router.post('/', protect, async (req: any, res: Response) => {
  try {
    const { name, description, contributors, viewers, startDate, endDate } =
      req.body;
    const project = await Project.create({
      name,
      description,
      admin: req.user._id,
      contributors,
      viewers,
      startDate,
      endDate,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET PROJECT BY ID
router.get('/:id', protect, async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      'admin contributors viewers',
      '-password',
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// UPDATE PROJECT
router.put('/:id', protect, async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE PROJECT
router.delete('/:id', protect, async (req: any, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (project.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await project.deleteOne();
    res.json({ message: 'Project removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
