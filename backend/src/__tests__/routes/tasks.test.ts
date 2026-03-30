import request from 'supertest';
import app from '../../app';

let userCounter = 0;

const registerAndLogin = async () => {
  userCounter++;
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: `taskuser${userCounter}`,
      email: `taskuser${userCounter}@example.com`,
      password: 'Jelszo123!',
    });
  return { token: res.body.token as string, user: res.body.user };
};

describe('Tasks API – /api/tasks', () => {
  let token: string;
  let projectId: string;

  beforeEach(async () => {
    const auth = await registerAndLogin();
    token = auth.token;

    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Task teszt projekt' });

    projectId = projectRes.body._id;
  });

  // ─── POST /api/tasks ───────────────────────────────────────────────────────

  describe('POST /api/tasks', () => {
    it('létrehoz egy task-ot (201)', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Teszt task', project: projectId });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Teszt task');
      expect(res.body.project).toBe(projectId);
    });

    it('az alapértelmezett státusz "Open"', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Státusz teszt', project: projectId });

      expect(res.body.status).toBe('Open');
    });

    it('visszautasítja token nélkül (401)', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ title: 'Token nélkül', project: projectId });

      expect(res.status).toBe(401);
    });

    it('deadline-t is el lehet menteni', async () => {
      const deadline = '2025-12-31T00:00:00.000Z';

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Határidős task', project: projectId, deadline });

      expect(res.body.deadline).toBe(deadline);
    });
  });

  // ─── GET /api/tasks/project/:projectId ────────────────────────────────────

  describe('GET /api/tasks/project/:projectId', () => {
    it('visszaadja a projekthez tartozó task-okat', async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 1', project: projectId });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task 2', project: projectId });

      const res = await request(app)
        .get(`/api/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('üres tömböt ad vissza, ha nincs task a projektben', async () => {
      const res = await request(app)
        .get(`/api/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.body).toEqual([]);
    });
  });

  // ─── PUT /api/tasks/:id ────────────────────────────────────────────────────

  describe('PUT /api/tasks/:id', () => {
    it('frissíti a task státuszát', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Frissítendő task', project: projectId });

      const res = await request(app)
        .put(`/api/tasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'InProgress' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('InProgress');
    });

    it('frissíti a task címét', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Régi cím', project: projectId });

      const res = await request(app)
        .put(`/api/tasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Új cím' });

      expect(res.body.title).toBe('Új cím');
    });
  });

  // ─── DELETE /api/tasks/:id ─────────────────────────────────────────────────

  describe('DELETE /api/tasks/:id', () => {
    it('törli a task-ot (200)', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Törlendő task', project: projectId });

      const res = await request(app)
        .delete(`/api/tasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted');
    });

    it('a törölt task már nem jelenik meg a projekt listájában', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Eltűnő task', project: projectId });

      await request(app)
        .delete(`/api/tasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      const listRes = await request(app)
        .get(`/api/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(listRes.body).toHaveLength(0);
    });
  });
});
