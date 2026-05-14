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

import { Router, Response } from 'express';
import protect, { AuthRequest } from '../middleware/auth';
import Mail from '../models/Mail';
import User from '../models/User';

const router = Router();

router.get('/inbox', protect, async (req: AuthRequest, res: Response) => {
  try {
    const mails = await Mail.find({ to: req.user!._id })
      .populate('from', 'username email')
      .sort({ createdAt: -1 });
    res.json(mails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.get('/sent', protect, async (req: AuthRequest, res: Response) => {
  try {
    const mails = await Mail.find({ from: req.user!._id })
      .populate('to', 'username email')
      .sort({ createdAt: -1 });
    res.json(mails);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET unread count szamlalo
router.get(
  '/unread-count',
  protect,
  async (req: AuthRequest, res: Response) => {
    try {
      const count = await Mail.countDocuments({
        to: req.user!._id,
        read: false,
      });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

// POST send a mail
router.post('/send', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { toUsername, subject, body } = req.body;

    if (!toUsername || !subject || !body) {
      return res
        .status(400)
        .json({ message: 'toUsername, subject and body are required' });
    }

    const recipient = await User.findOne({ username: toUsername });
    if (!recipient) {
      return res
        .status(404)
        .json({ message: `User "${toUsername}" not found` });
    }

    if (recipient._id.toString() === req.user!._id.toString()) {
      return res
        .status(400)
        .json({ message: 'You cannot send a mail to yourself' });
    }

    const mail = await Mail.create({
      from: req.user!._id,
      to: recipient._id,
      subject: subject.trim(),
      body: body.trim(),
    });

    const populated = await mail.populate([
      { path: 'from', select: 'username email' },
      { path: 'to', select: 'username email' },
    ]);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT mark as read
router.put('/:id/read', protect, async (req: AuthRequest, res: Response) => {
  try {
    const mail = await Mail.findById(req.params.id);
    if (!mail) return res.status(404).json({ message: 'Mail not found' });

    if (mail.to.toString() !== req.user!._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    mail.read = true;
    await mail.save();
    res.json(mail);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// DELETE a mail
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const mail = await Mail.findOne({
      _id: req.params.id,
      $or: [{ from: req.user!._id }, { to: req.user!._id }],
    });
    if (!mail) return res.status(404).json({ message: 'Mail not found' });
    await mail.deleteOne();
    res.json({ message: 'Mail deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
