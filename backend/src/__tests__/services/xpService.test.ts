import { addXP } from '../../services/xpService';
import User from '../../models/User';

describe('xpService – addXP', () => {
  const createUser = async (xp = 0, level = 1) => {
    return await User.create({
      username: 'tesztelo',
      email: 'teszt@example.com',
      password: 'hashedpassword123',
      xp,
      level,
    });
  };

  it('növeli a felhasználó XP értékét', async () => {
    const user = await createUser(0, 1);
    const updated = await addXP(user._id.toString(), 50);

    expect(updated.xp).toBe(50);
    expect(updated.level).toBe(1);
  });

  it('szintet lép, ha az XP eléri a küszöbértéket (1. szint = 100 XP)', async () => {
    const user = await createUser(90, 1);
    const updated = await addXP(user._id.toString(), 20);

    // 90 + 20 = 110, küszöb 100 → szintlépés, maradék: 10
    expect(updated.level).toBe(2);
    expect(updated.xp).toBe(10);
  });

  it('több szintet lép egyszerre, ha sok XP érkezik', async () => {
    const user = await createUser(0, 1);
    // 1. szint: 100 XP, 2. szint: 200 XP → 300 XP kell a 3. szinthez
    const updated = await addXP(user._id.toString(), 350);

    expect(updated.level).toBe(3);
    expect(updated.xp).toBe(50);
  });

  it('0 XP hozzáadásakor nem változik az állapot', async () => {
    const user = await createUser(50, 1);
    const updated = await addXP(user._id.toString(), 0);

    expect(updated.xp).toBe(50);
    expect(updated.level).toBe(1);
  });

  it('hibát dob, ha a felhasználó nem létezik', async () => {
    const fakeId = '000000000000000000000000';
    await expect(addXP(fakeId, 100)).rejects.toThrow('User not found');
  });

  it('az XP érték az adatbázisban is perzisztálódik', async () => {
    const user = await createUser(0, 1);
    await addXP(user._id.toString(), 30);

    const fromDb = await User.findById(user._id);
    expect(fromDb?.xp).toBe(30);
  });

  it('pontosan a küszöbön lévő XP-nél is szintet lép', async () => {
    const user = await createUser(0, 1);
    const updated = await addXP(user._id.toString(), 100);

    // Pontosan 100 XP = szintlépés, maradék 0
    expect(updated.level).toBe(2);
    expect(updated.xp).toBe(0);
  });

  it('a szint és XP az adatbázisban is helyesen tárolódik szintlépés után', async () => {
    const user = await createUser(90, 1);
    await addXP(user._id.toString(), 20);

    const fromDb = await User.findById(user._id);
    expect(fromDb?.level).toBe(2);
    expect(fromDb?.xp).toBe(10);
  });
});
