import User from '../models/User';

export const addXP = async (userId: string, xp: number) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  user.xp += xp;

  // Level up logic
  const xpPerLevel = 100;
  while (user.xp >= user.level * xpPerLevel) {
    user.xp -= user.level * xpPerLevel;
    user.level += 1;
  }

  await user.save();
  return user;
};
