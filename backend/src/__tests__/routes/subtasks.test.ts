import request from 'supertest';
import app from '../../app';

let userCounter = 0;

const registerAndLogin = async () => {
  userCounter++;
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: `subuser${userCounter}`,
      email: `subuser${userCounter}@example.com`,
      password: 'Jelszo123!',
    });
  return { token: res.body.token as string, user: res.body.user };
};

describe('Subtasks API – /api/subtasks', () => {
  let token: string;
  let taskId: string;

  beforeEach(async () => {
    const auth = await registerAndLogin();
    token = auth.token;

    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Subtask teszt projekt' });

    const taskRes = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Szülő task', project: projectRes.body._id });

    taskId = taskRes.body._id;
  });

  // ─── POST /api/subtasks ────────────────────────────────────────────────────

  describe('POST /api/subtasks', () => {
    it('létrehoz egy subtask-ot (201)', async () => {
      const res = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Teszt subtask', task: taskId });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('Teszt subtask');
      expect(res.body.task).toBe(taskId);
    });

    it('az alapértelmezett státusz "Open"', async () => {
      const res = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Státusz subtask', task: taskId });

      expect(res.body.status).toBe('Open');
    });

    it('visszautasítja token nélkül (401)', async () => {
      const res = await request(app)
        .post('/api/subtasks')
        .send({ title: 'Jogosulatlan subtask', task: taskId });

      expect(res.status).toBe(401);
    });

    it('xpReward alapértéke 0', async () => {
      const res = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'XP subtask', task: taskId });

      expect(res.body.xpReward).toBe(0);
    });
  });

  // ─── GET /api/subtasks/task/:taskId ───────────────────────────────────────

  describe('GET /api/subtasks/task/:taskId', () => {
    it('visszaadja a task-hoz tartozó subtask-okat', async () => {
      await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Sub 1', task: taskId });

      await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Sub 2', task: taskId });

      const res = await request(app)
        .get(`/api/subtasks/task/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('üres tömböt ad vissza, ha nincs subtask', async () => {
      const res = await request(app)
        .get(`/api/subtasks/task/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.body).toEqual([]);
    });
  });

  // ─── PUT /api/subtasks/:id ─────────────────────────────────────────────────

  describe('PUT /api/subtasks/:id', () => {
    it('frissíti a subtask státuszát "Done"-ra', async () => {
      const createRes = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Elvégzendő sub', task: taskId });

      const res = await request(app)
        .put(`/api/subtasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'Done' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('Done');
    });

    it('frissíti a subtask xpReward értékét', async () => {
      const createRes = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'XP subtask', task: taskId });

      const res = await request(app)
        .put(`/api/subtasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ xpReward: 25 });

      expect(res.body.xpReward).toBe(25);
    });
  });

  // ─── DELETE /api/subtasks/:id ──────────────────────────────────────────────

  describe('DELETE /api/subtasks/:id', () => {
    it('törli a subtask-ot (200)', async () => {
      const createRes = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Törlendő sub', task: taskId });

      const res = await request(app)
        .delete(`/api/subtasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Subtask deleted');
    });

    it('a törölt subtask már nem jelenik meg a listában', async () => {
      const createRes = await request(app)
        .post('/api/subtasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Eltűnő sub', task: taskId });

      await request(app)
        .delete(`/api/subtasks/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      const listRes = await request(app)
        .get(`/api/subtasks/task/${taskId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(listRes.body).toHaveLength(0);
    });
  });
});
