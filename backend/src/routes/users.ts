import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import protect from '../middleware/auth';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

const router = Router();

// bejelentkezett felhasznalo GET
router.get('/me', protect, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// adatok szerkesztése
router.put('/me', protect, async (req: AuthRequest, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findById(req.user!._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check username uniqueness if changing
    if (username && username !== user.username) {
      const exists = await User.findOne({ username });
      if (exists)
        return res.status(400).json({ message: 'Username already taken' });
      user.username = username;
    }

    // email check hogy hasznalatban van-e
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists)
        return res.status(400).json({ message: 'Email already in use' });
      user.email = email;
    }

    // jelszo vizsgalat
    if (password) {
      if (password.length < 6)
        return res
          .status(400)
          .json({ message: 'Password must be at least 6 characters' });
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // jelszo nélkuli visszatérés
    const updated = await User.findById(user._id).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
