import { Request, Response } from 'express';
import Task from '../models/Task';
import { addXP } from '../services/xpService';
import { logEvent } from '../services/logService';

// Új Task létrehozása
export const createTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Task frissítése
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Task törlése
export const deleteTask = async (req: Request, res: Response) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

// Task befejezése (XP + log)
export const completeTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    task.status = 'Done';
    await task.save();

    if (task.assignedTo && task.project) {
      await addXP(task.assignedTo.toString(), task.xpReward);
      await logEvent(
        task.project.toString(),
        `Task completed: ${task.title}`,
        task.assignedTo.toString(),
      );
    }

    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
