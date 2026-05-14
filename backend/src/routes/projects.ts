/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: egyes kódrészletek generálása, hibakeresése
 * és javítása Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import { Router, Request, Response } from 'express';
import protect from '../middleware/auth';
import Project from '../models/Project';
import User from '../models/User';
import Task from '../models/Task';
import Subtask from '../models/Subtask';

const router = Router();

// GET ALL PROJECTS
router.get('/', protect, async (req: any, res: Response) => {
  try {
    const projects = await Project.find({ createdBy: req.user._id }).populate(
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
    const {
      name,
      description,
      contributors = [],
      viewers = [],
      taskGroups = [],
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const adminId = req.user._id;

    const contributorUsers = await User.find({
      username: { $in: contributors },
    });
    const contributorIds = contributorUsers.map((u) => u._id);

    const viewerUsers = await User.find({
      username: { $in: viewers },
    });
    const viewerIds = viewerUsers.map((u) => u._id);

    const project = await Project.create({
      name,
      description,
      admin: adminId,
      contributors: contributorIds,
      viewers: viewerIds,
      members: [adminId, ...contributorIds, ...viewerIds],
      createdBy: adminId,
    });

    for (const group of taskGroups) {
      if (!group.tasks) continue;

      for (const taskData of group.tasks) {
        const task = await Task.create({
          title: taskData.description,
          project: project._id,
          deadline: group.deadline,
        });

        if (taskData.subtasks) {
          for (const sub of taskData.subtasks) {
            await Subtask.create({
              title: sub,
              task: task._id,
            });
          }
        }
      }
    }

    res.status(201).json(project);
  } catch (error: any) {
    console.error('PROJECT CREATE ERROR:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
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

    if (project.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const tasks = await Task.find({ project: project._id });
    for (const task of tasks) {
      await Subtask.deleteMany({ task: task._id });
    }

    await Task.deleteMany({ project: project._id });

    await project.deleteOne();

    res.json({ message: 'Project and all associated tasks/subtasks removed' });
  } catch (error) {
    console.error('DELETE PROJECT ERROR:', error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
