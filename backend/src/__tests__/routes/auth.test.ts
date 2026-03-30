import request from 'supertest';
import app from '../../app';

describe('Auth API – /api/auth', () => {
  const validUser = {
    username: 'ujfelhasznalo',
    email: 'uj@example.com',
    password: 'Jelszo123!',
  };

  // ─── POST /api/auth/register ─────────────────────────────────────────────────

  describe('POST /api/auth/register', () => {
    it('sikeresen regisztrál egy új felhasználót (201)', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(validUser.email);
      expect(res.body.user.username).toBe(validUser.username);
    });

    it('a jelszó nem kerül vissza a válaszban', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.body.user).not.toHaveProperty('password');
    });

    it('visszautasítja a duplikált e-mailt (400)', async () => {
      await request(app).post('/api/auth/register').send(validUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('a visszaadott token érvényes JWT formátumú', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      // JWT = három pont által elválasztott Base64 szegmens
      const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      expect(res.body.token).toMatch(jwtPattern);
    });

    it('az alapértelmezett XP és level értékek helyesek', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect(res.body.user.xp).toBe(0);
      expect(res.body.user.level).toBe(1);
    });
  });

  // ─── POST /api/auth/login ────────────────────────────────────────────────────

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send(validUser);
    });

    it('sikeres bejelentkezés helyes adatokkal (200)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user.email).toBe(validUser.email);
    });

    it('visszautasítja a helytelen jelszót (400)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: 'rosszjelszo' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('visszautasítja a nem létező e-mailt (400)', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nemletezik@example.com', password: validUser.password });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('a jelszó nem kerül vissza bejelentkezéskor sem', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      expect(res.body.user).not.toHaveProperty('password');
    });

    it('érvényes JWT tokent ad vissza', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: validUser.email, password: validUser.password });

      const jwtPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
      expect(res.body.token).toMatch(jwtPattern);
    });
  });
});
