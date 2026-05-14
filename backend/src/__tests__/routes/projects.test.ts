/*
 * Acxor Projektmenedzsment Rendszer
 * Szerző: Sándor János, 2026
 * Miskolci Egyetem — Szakdolgozat
 *
 * Megjegyzés: a tesztesetek kidolgozásához, hibakereséshez
 * és javításhoz Claude (Anthropic) MI-alapú eszköz
 * segítségével történt, minden esetben kritikus szakmai
 * felülvizsgálattal párosulva.
 */

import request from 'supertest';
import app from '../../app';
import Task from '../../models/Task';
import Subtask from '../../models/Subtask';

//Segédfüggvény

let userCounter = 0;

const registerAndLogin = async (
  username?: string,
  email?: string,
  password = 'Jelszo123!',
) => {
  userCounter++;
  const u = username ?? `user${userCounter}`;
  const e = email ?? `user${userCounter}@example.com`;

  const res = await request(app)
    .post('/api/auth/register')
    .send({ username: u, email: e, password });

  return { token: res.body.token as string, user: res.body.user };
};

// Tesztek

describe('Projects API – /api/projects', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const auth = await registerAndLogin();
    token = auth.token;
    userId = auth.user._id;
  });

  // POST /api/projects

  describe('POST /api/projects', () => {
    it('létrehoz egy projektet bejelentkezett felhasználóként (201)', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Teszt Projekt', description: 'Ez egy tesztprojekt' });

      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Teszt Projekt');
      expect(res.body.createdBy).toBe(userId);
    });

    it('visszautasítja a kérést token nélkül (401)', async () => {
      const res = await request(app)
        .post('/api/projects')
        .send({ name: 'Jogosulatlan Projekt' });

      expect(res.status).toBe(401);
    });

    it('visszautasítja, ha a name mező hiányzik (400)', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Nincs neve' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Name is required');
    });

    it('a létrehozó automatikusan admin és member lesz', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Admin teszt' });

      expect(res.body.admin).toBe(userId);
      expect(res.body.members).toContain(userId);
    });

    it('taskGroup-okkal együtt létrehozza a task-okat és subtask-okat', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Komplex Projekt',
          taskGroups: [
            {
              name: 'Sprint 1',
              deadline: '2025-06-01',
              tasks: [
                {
                  description: 'Bejelentkezési oldal',
                  subtasks: ['Form megvalósítása', 'Validáció'],
                },
              ],
            },
          ],
        });

      expect(res.status).toBe(201);

      const tasksRes = await request(app)
        .get(`/api/tasks/project/${res.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(tasksRes.body).toHaveLength(1);
      expect(tasksRes.body[0].title).toBe('Bejelentkezési oldal');

      const subtasksRes = await request(app)
        .get(`/api/subtasks/task/${tasksRes.body[0]._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(subtasksRes.body).toHaveLength(2);
    });

    it('érvénytelen tokennel 401-et ad vissza', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer érvénytelen.token.xyz')
        .send({ name: 'Hamis Token Projekt' });

      expect(res.status).toBe(401);
    });
  });

  // GET /api/projects

  describe('GET /api/projects', () => {
    it('visszaadja a bejelentkezett felhasználó projektjeit', async () => {
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Első projekt' });

      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Második projekt' });

      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(2);
    });

    it('nem adja vissza más felhasználó projektjeit', async () => {
      const other = await registerAndLogin();

      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${other.token}`)
        .send({ name: 'Másik projekt' });

      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body).toHaveLength(0);
    });

    it('üres tömböt ad vissza, ha nincs projekt', async () => {
      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('populálja az admin mezőt (jelszó nélkül)', async () => {
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Populate teszt' });

      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body[0].admin).toHaveProperty('username');
      expect(res.body[0].admin).not.toHaveProperty('password');
    });
  });

  // GET /api/projects/:id

  describe('GET /api/projects/:id', () => {
    it('visszaadja a projektet ID alapján', async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'ID teszt projekt' });

      const res = await request(app)
        .get(`/api/projects/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('ID teszt projekt');
    });

    it('404-et ad vissza, ha a projekt nem létezik', async () => {
      const res = await request(app)
        .get('/api/projects/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  //PUT /api/projects/:id

  describe('PUT /api/projects/:id', () => {
    it('frissíti a projekt nevét és leírását', async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Eredeti név' });

      const res = await request(app)
        .put(`/api/projects/${createRes.body._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Módosított név', description: 'Új leírás' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Módosított név');
      expect(res.body.description).toBe('Új leírás');
    });

    it('más felhasználó nem módosíthatja a projektet (403)', async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Védett projekt' });

      const other = await registerAndLogin();

      const res = await request(app)
        .put(`/api/projects/${createRes.body._id}`)
        .set('Authorization', `Bearer ${other.token}`)
        .send({ name: 'Eltérített név' });

      expect(res.status).toBe(403);
    });
  });

  // DELETE /api/projects/:id

  describe('DELETE /api/projects/:id', () => {
    it('törli a projektet és az összes kapcsolódó task-ot és subtask-ot', async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Törlendő projekt',
          taskGroups: [
            {
              name: 'Sprint 1',
              deadline: '2025-07-01',
              tasks: [{ description: 'Törlendő task', subtasks: ['Sub 1'] }],
            },
          ],
        });

      const projectId = createRes.body._id;

      const deleteRes = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);

      // Task-ok törlődtek
      const remainingTasks = await Task.find({ project: projectId });
      expect(remainingTasks).toHaveLength(0);
    });

    it('más felhasználó nem törölheti a projektet (403)', async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Védett projekt' });

      const other = await registerAndLogin();

      const res = await request(app)
        .delete(`/api/projects/${createRes.body._id}`)
        .set('Authorization', `Bearer ${other.token}`);

      expect(res.status).toBe(403);
    });

    it('404-et ad vissza, ha a projekt nem létezik', async () => {
      const res = await request(app)
        .delete('/api/projects/000000000000000000000000')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
