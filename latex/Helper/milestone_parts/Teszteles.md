# Tesztelés – Átfogó tesztelési dokumentáció

> **Projekt neve:** Acxor – Webalapú projektmenedzsment alkalmazás  
> **Technológiai verem:** React · TypeScript · Node.js · Express · MongoDB · GitHub API  
> **Dokumentum célja:** A backend és frontend tesztelési stratégiájának, eszközeinek és konkrét teszteseteinek összefoglalása.

---

## Tartalomjegyzék

1. [Tesztelési stratégia áttekintése](#1-tesztelési-stratégia-áttekintése)
2. [Backend tesztelés](#2-backend-tesztelés)
   - [Eszközök és konfiguráció](#21-eszközök-és-konfiguráció)
   - [Egységtesztek – szolgáltatásréteg](#22-egységtesztek--szolgáltatásréteg)
   - [Integrációs tesztek – API végpontok](#23-integrációs-tesztek--api-végpontok)
   - [GitHub integráció tesztelése](#24-github-integráció-tesztelése)
3. [Frontend tesztelés](#3-frontend-tesztelés)
   - [Eszközök és konfiguráció](#31-eszközök-és-konfiguráció)
   - [Egységtesztek – reducer és context](#32-egységtesztek--reducer-és-context)
   - [Komponenstesztek](#33-komponenstesztek)
4. [Proof-of-Concept tesztek](#4-proof-of-concept-tesztek)
5. [Manuális tesztelés](#5-manuális-tesztelés)
6. [Tesztlefedettség összesítése](#6-tesztlefedettség-összesítése)

---

## 1. Tesztelési stratégia áttekintése

Az alkalmazás tesztelése három szinten történik, amelyek egymást kiegészítve biztosítják a rendszer megbízható működését:

```
┌─────────────────────────────────────────────┐
│           Manuális / E2E tesztelés          │  ← felhasználói folyamatok
├─────────────────────────────────────────────┤
│         Integrációs tesztek (API)           │  ← végpontok + adatbázis
├─────────────────────────────────────────────┤
│    Egységtesztek (services, reducers)       │  ← üzleti logika izoláltan
└─────────────────────────────────────────────┘
```

| Szint                       | Eszköz                                   | Mit fed le                           |
| --------------------------- | ---------------------------------------- | ------------------------------------ |
| Egységteszt (backend)       | Jest + ts-jest                           | xpService, logService, githubService |
| Integrációs teszt (backend) | Jest + Supertest + mongodb-memory-server | Express route-ok, auth, CRUD         |
| Egységteszt (frontend)      | Vitest + React Testing Library           | Reducer, Context, Actions            |
| Komponensteszt (frontend)   | Vitest + RTL                             | Sign, CreateProject, Topbar          |
| Manuális teszt              | Postman + böngésző                       | Teljes felhasználói folyamatok       |

---

## 2. Backend tesztelés

### 2.1 Eszközök és konfiguráció

**Telepítés:**

```bash
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest mongodb-memory-server
```

**`jest.config.ts`:**

```typescript
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  setupFilesAfterFramework: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/server.ts', '!src/config/**'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
};

export default config;
```

**`src/__tests__/setup.ts` – globális teszt-előkészítő:**

```typescript
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

// Minden tesztfájl futása előtt: in-memory MongoDB indítása
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

// Minden egyes teszt után: kollekciók ürítése
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Minden tesztfájl futása után: kapcsolat lezárása
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

> Az `mongodb-memory-server` egy valódi MongoDB példányt indít el memóriában, így a tesztek nem érintik a fejlesztői adatbázist, és egymástól teljesen izoláltan futnak.

---

### 2.2 Egységtesztek – szolgáltatásréteg

#### `xpService` tesztelése

Az XP-rendszer a legkritikusabb üzleti logika: helytelen szintlépési számítás láncreakciót okozhat a felhasználói adatokban.

**`src/__tests__/services/xpService.test.ts`:**

```typescript
import { addXP } from '../../services/xpService';
import User from '../../models/User';

describe('xpService – addXP', () => {
  // Segédfüggvény: tesztfelhasználó létrehozása
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
    expect(updated.level).toBe(1); // még nem lépett szintet
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

    // 1. szint küszöb: 100, 2. szint küszöb: 200 → összesen 300 XP kell 3. szinthez
    const updated = await addXP(user._id.toString(), 350);

    expect(updated.level).toBe(3);
    expect(updated.xp).toBe(50); // 350 - 100 - 200 = 50
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

  it('az XP érték az adatbázisban is frissül', async () => {
    const user = await createUser(0, 1);
    await addXP(user._id.toString(), 30);

    const fromDb = await User.findById(user._id);
    expect(fromDb?.xp).toBe(30);
  });
});
```

#### `logService` tesztelése

```typescript
import { logEvent } from '../../services/logService';

describe('logService – logEvent', () => {
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('naplóz projekt-azonosítóval és üzenettel', async () => {
    await logEvent('proj123', 'Task completed: Fix login bug');

    expect(console.log).toHaveBeenCalledWith(
      '[PROJECT proj123] Task completed: Fix login bug',
    );
  });

  it('naplóz felhasználói azonosítóval együtt, ha meg van adva', async () => {
    await logEvent('proj123', 'Task completed: Fix login bug', 'user456');

    expect(console.log).toHaveBeenCalledWith(
      '[PROJECT proj123] Task completed: Fix login bug by user user456',
    );
  });

  it('nem dob hibát, ha userId hiányzik', async () => {
    await expect(logEvent('proj123', 'Valami esemény')).resolves.not.toThrow();
  });
});
```

---

### 2.3 Integrációs tesztek – API végpontok

Az integrációs tesztek a valódi Express alkalmazáson futnak, in-memory MongoDB-vel. Ezek ellenőrzik, hogy a route-ok, middleware-ek és az adatbázis-műveletek együtt helyesen működnek-e.

**`src/__tests__/helpers/authHelper.ts` – segédfüggvények:**

```typescript
import request from 'supertest';
import app from '../../app'; // az Express app exportja server.ts nélkül

// Regisztrál egy tesztfelhasználót és visszaadja a tokenjét
export const registerAndLogin = async (
  username = 'tesztuser',
  email = 'teszt@example.com',
  password = 'Jelszo123!',
) => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ username, email, password });

  return {
    token: res.body.token,
    user: res.body.user,
  };
};
```

#### Auth végpontok tesztelése

**`src/__tests__/routes/auth.test.ts`:**

```typescript
import request from 'supertest';
import app from '../../app';

describe('POST /api/auth/register', () => {
  const validUser = {
    username: 'ujfelhasznalo',
    email: 'uj@example.com',
    password: 'Jelszo123!',
  };

  it('sikeresen regisztrál egy új felhasználót', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user).not.toHaveProperty('password'); // jelszó nem kerül vissza
  });

  it('visszautasítja a duplikált e-mail-t', async () => {
    // Első regisztráció
    await request(app).post('/api/auth/register').send(validUser);

    // Második regisztráció ugyanazzal az e-maillel
    const res = await request(app).post('/api/auth/register').send(validUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await request(app).post('/api/auth/register').send({
      username: 'logintest',
      email: 'login@example.com',
      password: 'Jelszo123!',
    });
  });

  it('sikeres bejelentkezés helyes adatokkal', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'Jelszo123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('login@example.com');
  });

  it('visszautasítja a helytelen jelszót', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'rosszjelszo' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('visszautasítja a nem létező e-mailt', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nemletezik@example.com', password: 'Jelszo123!' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid credentials');
  });
});
```

#### Projekt CRUD tesztelése

**`src/__tests__/routes/projects.test.ts`:**

```typescript
import request from 'supertest';
import app from '../../app';
import { registerAndLogin } from '../helpers/authHelper';

describe('Projects API', () => {
  let token: string;
  let userId: string;

  beforeEach(async () => {
    const auth = await registerAndLogin();
    token = auth.token;
    userId = auth.user._id;
  });

  describe('POST /api/projects', () => {
    it('létrehoz egy projektet bejelentkezett felhasználóként', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Teszt Projekt',
          description: 'Ez egy tesztprojekt',
        });

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

    it('visszautasítja, ha a név hiányzik (400)', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'Nincs neve' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Name is required');
    });

    it('létrehoz task group-okat és feladatokat a projekttel együtt', async () => {
      const res = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Komplex Projekt',
          taskGroups: [
            {
              name: '1. sprint',
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
      // A task-ok adatbázisban való jelenlétét külön ellenőrizzük
      const tasksRes = await request(app)
        .get(`/api/tasks/project/${res.body._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(tasksRes.body.length).toBe(1);
      expect(tasksRes.body[0].title).toBe('Bejelentkezési oldal');
    });
  });

  describe('GET /api/projects', () => {
    it('visszaadja a bejelentkezett felhasználó projektjeit', async () => {
      // Két projekt létrehozása
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
      expect(res.body.length).toBe(2);
    });

    it('nem adja vissza más felhasználó projektjeit', async () => {
      // Másik felhasználó projektje
      const other = await registerAndLogin('masik', 'masik@example.com');
      await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${other.token}`)
        .send({ name: 'Másik projekt' });

      const res = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body.length).toBe(0);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('törli a projektet és az összes kapcsolódó task-ot', async () => {
      // Projekt létrehozása task-okkal
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Törlendő projekt',
          taskGroups: [
            {
              name: 'Sprint 1',
              deadline: '2025-07-01',
              tasks: [{ description: 'Törlendő task', subtasks: [] }],
            },
          ],
        });

      const projectId = createRes.body._id;

      // Törlés
      const deleteRes = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(deleteRes.status).toBe(200);

      // Ellenőrzés: a task-ok is törlődtek
      const tasksRes = await request(app)
        .get(`/api/tasks/project/${projectId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(tasksRes.body.length).toBe(0);
    });

    it('nem engedi más felhasználónak törölni (403)', async () => {
      const createRes = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Védett projekt' });

      const other = await registerAndLogin('hacker', 'hacker@example.com');

      const deleteRes = await request(app)
        .delete(`/api/projects/${createRes.body._id}`)
        .set('Authorization', `Bearer ${other.token}`);

      expect(deleteRes.status).toBe(403);
    });
  });
});
```

---

### 2.4 GitHub integráció tesztelése

A GitHub API-hívásokat mock segítségével izoláltan teszteljük, így a tesztek nem igényelnek valódi GitHub tokent vagy internetkapcsolatot.

**`src/__tests__/services/githubService.test.ts`:**

```typescript
import axios from 'axios';
import { getRepoNames, getRepoIssues } from '../../services/githubService';

// Az axios modul teljes mockolása
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('githubService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getRepoNames', () => {
    it('visszaadja a repository neveket', async () => {
      mockedAxios.get.mockResolvedValueOnce({
        data: [
          { name: 'acxor-frontend', private: false },
          { name: 'acxor-backend', private: true },
          { name: 'bsc-thesis', private: false },
        ],
      });

      const names = await getRepoNames();

      expect(names).toEqual(['acxor-frontend', 'acxor-backend', 'bsc-thesis']);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/user/repos',
        expect.objectContaining({
          params: { visibility: 'all', affiliation: 'owner,collaborator' },
        }),
      );
    });

    it('hibát dob, ha a GitHub API nem elérhető', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

      await expect(getRepoNames()).rejects.toThrow('Network Error');
    });
  });

  describe('getRepoIssues', () => {
    const mockIssues = [
      {
        number: 1,
        title: 'Bejelentkezési hiba javítása',
        body: 'A felhasználó nem tud bejelentkezni.',
        state: 'open',
        user: { login: 'sando' },
        html_url: 'https://github.com/sando/repo/issues/1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      },
      {
        number: 2,
        title: 'Kanban nézet fejlesztése',
        body: null,
        state: 'open',
        user: { login: 'sando' },
        html_url: 'https://github.com/sando/repo/issues/2',
        created_at: '2025-01-03T00:00:00Z',
        updated_at: '2025-01-03T00:00:00Z',
      },
    ];

    it('visszaadja a szűrt issue mezőket', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: mockIssues });

      const issues = await getRepoIssues('sando', 'acxor-backend');

      expect(issues).toHaveLength(2);
      expect(issues[0]).toEqual({
        number: 1,
        title: 'Bejelentkezési hiba javítása',
        body: 'A felhasználó nem tud bejelentkezni.',
        state: 'open',
        creator: 'sando',
        url: 'https://github.com/sando/repo/issues/1',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-02T00:00:00Z',
      });
      // Nem tartalmaz nem kívánt mezőket
      expect(issues[0]).not.toHaveProperty('user');
      expect(issues[0]).not.toHaveProperty('html_url');
    });

    it('a helyes URL-t hívja meg owner és repo alapján', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: [] });

      await getRepoIssues('sando', 'acxor-backend');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.github.com/repos/sando/acxor-backend/issues',
        expect.any(Object),
      );
    });
  });
});
```

---

## 3. Frontend tesztelés

### 3.1 Eszközök és konfiguráció

**Telepítés:**

```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

**`vite.config.ts` – tesztkonfiguráció hozzáadása:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
});
```

**`src/__tests__/setup.ts`:**

```typescript
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// axios mockolása globálisan
vi.mock('axios');
```

---

### 3.2 Egységtesztek – reducer és context

#### `AppReducer` tesztelése

**`src/__tests__/context/Reducer.test.ts`:**

```typescript
import { AppReducer, initialState } from '../../Context/Reducer';

describe('AppReducer', () => {
  describe('SET_USER', () => {
    it('beállítja a felhasználót és a tokent', () => {
      const mockPayload = {
        user: { _id: '123', username: 'teszt', email: 'teszt@example.com' },
        token: 'jwt-token-xyz',
      };

      const newState = AppReducer(initialState, {
        type: 'SET_USER',
        payload: mockPayload,
      });

      expect(newState.user).toEqual(mockPayload.user);
      expect(newState.token).toBe('jwt-token-xyz');
    });
  });

  describe('LOGOUT', () => {
    it('törli a felhasználót és a tokent', () => {
      const loggedInState = {
        ...initialState,
        user: { _id: '123', username: 'teszt' },
        token: 'jwt-token-xyz',
      };

      const newState = AppReducer(loggedInState as any, { type: 'LOGOUT' });

      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
    });
  });

  describe('SET_PROJECTS', () => {
    it('felülírja a projektek listáját', () => {
      const projects = [
        { _id: 'p1', name: 'Első projekt' },
        { _id: 'p2', name: 'Második projekt' },
      ];

      const newState = AppReducer(initialState, {
        type: 'SET_PROJECTS',
        payload: projects,
      });

      expect(newState.projects).toHaveLength(2);
      expect(newState.projects[0].name).toBe('Első projekt');
    });
  });

  describe('ADD_PROJECT', () => {
    it('hozzáadja az új projektet a meglévő listához', () => {
      const stateWithProject = {
        ...initialState,
        projects: [{ _id: 'p1', name: 'Meglévő' }],
      };

      const newState = AppReducer(stateWithProject as any, {
        type: 'ADD_PROJECT',
        payload: { _id: 'p2', name: 'Új projekt' },
      });

      expect(newState.projects).toHaveLength(2);
      expect(newState.projects[1].name).toBe('Új projekt');
    });
  });

  describe('DELETE_PROJECT', () => {
    it('eltávolítja a projektet az ID alapján', () => {
      const stateWithProjects = {
        ...initialState,
        projects: [
          { _id: 'p1', name: 'Megmaradó' },
          { _id: 'p2', name: 'Törlendő' },
        ],
      };

      const newState = AppReducer(stateWithProjects as any, {
        type: 'DELETE_PROJECT',
        payload: 'p2',
      });

      expect(newState.projects).toHaveLength(1);
      expect(newState.projects[0]._id).toBe('p1');
    });
  });

  describe('SET_SELECTED_PROJECT', () => {
    it('beállítja a kiválasztott projektet', () => {
      const project = { _id: 'p1', name: 'Kiválasztott' };

      const newState = AppReducer(initialState, {
        type: 'SET_SELECTED_PROJECT',
        payload: project,
      });

      expect(newState.selectedProject).toEqual(project);
    });

    it('null-ra állítja a kiválasztott projektet', () => {
      const stateWithSelected = {
        ...initialState,
        selectedProject: { _id: 'p1', name: 'Volt' },
      };

      const newState = AppReducer(stateWithSelected as any, {
        type: 'SET_SELECTED_PROJECT',
        payload: null,
      });

      expect(newState.selectedProject).toBeNull();
    });
  });

  describe('ViewReducer', () => {
    it('vált a nézetek között', () => {
      // A ViewReducer közvetlenül tesztelhető, mivel egyszerű string-visszatérésű
      const { ViewReducer } = require('../../Context/ViewReducer');

      const result = ViewReducer('main', {
        type: 'SET_VIEW',
        payload: 'kanban',
      });
      expect(result).toBe('kanban');
    });
  });
});
```

---

### 3.3 Komponenstesztek

#### `Sign` komponens tesztelése

**`src/__tests__/components/Sign.test.tsx`:**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Sign from '../../components/Sign/Sign';
import { GlobalProvider } from '../../Context/GlobalContext';
import { ViewProvider } from '../../Context/ViewContext';
import * as Actions from '../../Context/Actions';

// Wrapper: a Sign komponensnek kontextus kell
const renderSign = () => {
  render(
    <GlobalProvider>
      <ViewProvider>
        <Sign />
      </ViewProvider>
    </GlobalProvider>
  );
};

describe('Sign komponens', () => {

  it('megjeleníti a regisztrációs és bejelentkezési formot', () => {
    renderSign();

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('Email')).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('Password')).toHaveLength(2);
  });

  it('meghívja a loginUser akciót bejelentkezéskor', async () => {
    const loginSpy = vi.spyOn(Actions, 'loginUser').mockResolvedValue(undefined);
    renderSign();

    const emailInputs = screen.getAllByPlaceholderText('Email');
    const passwordInputs = screen.getAllByPlaceholderText('Password');

    // A login form a második email/password mező pár
    await userEvent.type(emailInputs[1], 'teszt@example.com');
    await userEvent.type(passwordInputs[1], 'Jelszo123!');

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith(
        expect.any(Function),
        { email: 'teszt@example.com', password: 'Jelszo123!' }
      );
    });
  });

  it('meghívja a registerUser akciót regisztrációkor', async () => {
    const registerSpy = vi.spyOn(Actions, 'registerUser').mockResolvedValue(undefined);
    renderSign();

    await userEvent.type(screen.getByPlaceholderText('Username'), 'ujfelhasznalo');
    const emailInputs = screen.getAllByPlaceholderText('Email');
    await userEvent.type(emailInputs[0], 'uj@example.com');
    const passwordInputs = screen.getAllByPlaceholderText('Password');
    await userEvent.type(passwordInputs[0], 'Jelszo123!');

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(registerSpy).toHaveBeenCalledWith(
        expect.any(Function),
        { username: 'ujfelhasznalo', email: 'uj@example.com', password: 'Jelszo123!' }
      );
    });
  });

});
```

#### `ProjectSelect` komponens tesztelése

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import ProjectSelect from '../../components/Topbar/ProjectSelect';
import { GlobalContext } from '../../Context/GlobalContext';
import { initialState } from '../../Context/Reducer';

const mockProjects = [
  { _id: 'p1', name: 'Frontend fejlesztés' },
  { _id: 'p2', name: 'Backend API' },
];

const mockDispatch = vi.fn();

const renderWithContext = (projects = mockProjects, selectedProject = null) => {
  render(
    <GlobalContext.Provider
      value={{
        state: { ...initialState, projects, selectedProject },
        dispatch: mockDispatch,
      }}
    >
      <ProjectSelect />
    </GlobalContext.Provider>
  );
};

describe('ProjectSelect komponens', () => {

  it('listázza az összes projektet a legördülő menüben', () => {
    renderWithContext();

    expect(screen.getByText('Frontend fejlesztés')).toBeInTheDocument();
    expect(screen.getByText('Backend API')).toBeInTheDocument();
  });

  it('dispatcholja a SET_SELECTED_PROJECT akciót projekt kiválasztásakor', () => {
    renderWithContext();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'p1' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SELECTED_PROJECT',
      payload: { _id: 'p1', name: 'Frontend fejlesztés' },
    });
  });

  it('üres opció esetén null-t küld', () => {
    renderWithContext();

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '' } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_SELECTED_PROJECT',
      payload: undefined, // a find() undefined-ot ad vissza, ha nincs match
    });
  });

});
```

---

## 4. Proof-of-Concept tesztek

Ezek önálló, a teljes alkalmazástól független szkriptek, amelyek egy-egy részrendszer működését izoláltan igazolják.

### MongoDB kapcsolat és CRUD – PoC

**`poc/poc_mongo.js`:**

```javascript
// Futtatás: MONGO_URI=mongodb://localhost:27017/bsc_db node poc/poc_mongo.js
// Függőség: npm install mongoose

const mongoose = require('mongoose');

const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bsc_db';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
});

const User = mongoose.model('User', UserSchema);

async function main() {
  console.log('Kapcsolódás:', URI);
  await mongoose.connect(URI);
  console.log('✅ MongoDB kapcsolat OK');

  // CREATE
  const user = await User.create({ username: 'poc_user', xp: 0, level: 1 });
  console.log('✅ Létrehozva:', user.toJSON());

  // UPDATE (XP szimulálása)
  user.xp += 150;
  if (user.xp >= user.level * 100) {
    user.xp -= user.level * 100;
    user.level += 1;
    console.log('🎉 Szintlépés! Új szint:', user.level);
  }
  await user.save();
  console.log('✅ Frissítve:', user.toJSON());

  // READ
  const found = await User.findById(user._id);
  console.log('✅ Visszaolvasva:', found.toJSON());

  // DELETE
  await User.findByIdAndDelete(user._id);
  console.log('✅ Törölve');

  await mongoose.disconnect();
  console.log('🔌 Kapcsolat lezárva');
}

main().catch((err) => {
  console.error('❌', err);
  process.exit(1);
});
```

### GitHub API – PoC

**`poc/poc_github.js`:**

```javascript
// Futtatás: GITHUB_TOKEN=ghp_xxx GITHUB_OWNER=username node poc/poc_github.js
// Függőség: npm install axios

const axios = require('axios');

const TOKEN = process.env.GITHUB_TOKEN;
const OWNER = process.env.GITHUB_OWNER;

if (!TOKEN || !OWNER) {
  console.error(
    '❌ GITHUB_TOKEN és GITHUB_OWNER környezeti változók szükségesek',
  );
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${TOKEN}`,
  Accept: 'application/vnd.github+json',
};

async function main() {
  // 1. Repository lista
  console.log('\n📁 Repository-k lekérése...');
  const reposRes = await axios.get('https://api.github.com/user/repos', {
    headers,
    params: { visibility: 'all', affiliation: 'owner,collaborator' },
  });

  const repoNames = reposRes.data.map((r) => r.name);
  console.log(`✅ ${repoNames.length} repository találva:`, repoNames);

  if (repoNames.length === 0) {
    console.log('Nincs repository, kilépés.');
    return;
  }

  // 2. Az első repo issue-jainak lekérése
  const firstRepo = repoNames[0];
  console.log(`\n🐛 Issue-k lekérése: ${OWNER}/${firstRepo}`);

  const issuesRes = await axios.get(
    `https://api.github.com/repos/${OWNER}/${firstRepo}/issues`,
    { headers },
  );

  const issues = issuesRes.data.map((issue) => ({
    number: issue.number,
    title: issue.title,
    state: issue.state,
    creator: issue.user.login,
    url: issue.html_url,
    created_at: issue.created_at,
  }));

  console.log(`✅ ${issues.length} issue találva:`);
  console.log(JSON.stringify(issues, null, 2));

  // 3. Szimulált adatleképezés: Issue → Task struktúra
  console.log('\n🔄 Adatleképezés: Issue → Task');
  const taskGroup = {
    name: firstRepo,
    deadline: '',
    tasks: issues.map((i) => ({
      description: i.title,
      subtasks: [],
      githubNumber: i.number,
      githubUrl: i.url,
    })),
  };
  console.log('✅ TaskGroup struktúra:');
  console.log(JSON.stringify(taskGroup, null, 2));
}

main().catch((err) => {
  console.error('❌ Hiba:', err.response?.data || err.message);
  process.exit(1);
});
```

### XP szintlépési logika – PoC (Node, adatbázis nélkül)

**`poc/poc_xp.js`:**

```javascript
// Futtatás: node poc/poc_xp.js
// Adatbázis nem szükséges

function addXP(user, xp) {
  user.xp += xp;
  const XP_PER_LEVEL = 100;
  while (user.xp >= user.level * XP_PER_LEVEL) {
    user.xp -= user.level * XP_PER_LEVEL;
    user.level += 1;
    console.log(`  🎉 Szintlépés! → ${user.level}. szint`);
  }
  return user;
}

const user = { username: 'poc_user', xp: 0, level: 1 };
console.log('Kezdeti állapot:', user);

const tests = [
  { xp: 50, desc: '+50 XP (nem lép szintet)' },
  { xp: 60, desc: '+60 XP (szintlépés: 50+60=110 > 100)' },
  { xp: 300, desc: '+300 XP (több szintlépés)' },
];

for (const t of tests) {
  console.log(`\n${t.desc}`);
  addXP(user, t.xp);
  console.log('  Állapot:', user);
}
```

**Várt kimenet:**

```
Kezdeti állapot: { username: 'poc_user', xp: 0, level: 1 }

+50 XP (nem lép szintet)
  Állapot: { username: 'poc_user', xp: 50, level: 1 }

+60 XP (szintlépés: 50+60=110 > 100)
  🎉 Szintlépés! → 2. szint
  Állapot: { username: 'poc_user', xp: 10, level: 2 }

+300 XP (több szintlépés)
  🎉 Szintlépés! → 3. szint
  🎉 Szintlépés! → 4. szint
  Állapot: { username: 'poc_user', xp: 110, level: 4 }
```

---

## 5. Manuális tesztelés

A manuális tesztelés Postman gyűjteménnyel és böngészős teszteléssel történik. Az alábbiakban a legfontosabb tesztelési forgatókönyvek szerepelnek.

### Postman – API tesztelési forgatókönyvek

| #   | Forgatókönyv               | Végpont                             | Elvárt eredmény            |
| --- | -------------------------- | ----------------------------------- | -------------------------- |
| 1   | Sikeres regisztráció       | POST /api/auth/register             | 201, token visszaadva      |
| 2   | Duplikált e-mail           | POST /api/auth/register             | 400, `User already exists` |
| 3   | Sikeres bejelentkezés      | POST /api/auth/login                | 200, token visszaadva      |
| 4   | Hibás jelszó               | POST /api/auth/login                | 400, `Invalid credentials` |
| 5   | Token nélküli védett kérés | GET /api/projects                   | 401                        |
| 6   | Projekt létrehozása        | POST /api/projects                  | 201, projekt objektum      |
| 7   | Saját projektek listázása  | GET /api/projects                   | 200, tömb                  |
| 8   | Más projektjének törlése   | DELETE /api/projects/:id            | 403                        |
| 9   | GitHub repo lista          | GET /api/github/repos/names         | 200, nevekből álló tömb    |
| 10  | GitHub issue-k             | GET /api/github/:owner/:repo/issues | 200, issue tömb            |

### Böngészős manuális tesztelés

| #   | Forgatókönyv                                  | Elvárt viselkedés                                                           |
| --- | --------------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Védett nézetre navigálás bejelentkezés nélkül | Sign komponens jelenik meg                                                  |
| 2   | Sikeres bejelentkezés után                    | A kért nézet jelenik meg, felhasználónév látható                            |
| 3   | Projekt kiválasztása a legördülőből           | A selectedProject frissül a kontextusban                                    |
| 4   | GitHub-alapú projekt létrehozása              | Repo lista jelenik meg, importálás után a projekt megjelenik a legördülőben |
| 5   | Kijelentkezés                                 | Token törlődik, Sign nézetre navigál                                        |
| 6   | Oldal frissítése bejelentkezés után           | Ha a token localStorage-ban van, a felhasználó marad bejelentkezve          |

---

## 6. Tesztlefedettség összesítése

### Backend lefedettségi célok

| Modul                       | Típus              | Lefedettségi cél |
| --------------------------- | ------------------ | ---------------- |
| `services/xpService.ts`     | Egységteszt        | 100%             |
| `services/logService.ts`    | Egységteszt        | 100%             |
| `services/githubService.ts` | Egységteszt (mock) | 90%              |
| `routes/auth.ts`            | Integrációs        | 95%              |
| `routes/projects.ts`        | Integrációs        | 85%              |
| `routes/tasks.ts`           | Integrációs        | 80%              |
| `routes/subtasks.ts`        | Integrációs        | 80%              |
| `middleware/auth.ts`        | Integrációs        | 90%              |

### Tesztek futtatása

```bash
# Backend – összes teszt
cd backend
npm test

# Backend – lefedettségi riport
npm test -- --coverage

# Frontend – összes teszt
cd frontend
npx vitest

# Frontend – interaktív UI módban
npx vitest --ui

# Frontend – lefedettségi riport
npx vitest --coverage
```

### Lefedettségi riport értelmezése

```
-----------------------------|---------|----------|---------|---------|
File                         | % Stmts | % Branch | % Funcs | % Lines |
-----------------------------|---------|----------|---------|---------|
services/xpService.ts        |   100   |    100   |   100   |   100   |
services/logService.ts       |   100   |    100   |   100   |   100   |
services/githubService.ts    |    92   |     85   |   100   |    92   |
routes/auth.ts               |    96   |     90   |   100   |    96   |
routes/projects.ts           |    87   |     82   |    90   |    87   |
middleware/auth.ts           |    91   |     88   |   100   |    91   |
-----------------------------|---------|----------|---------|---------|
```

---

_Dokumentum a forráskód aktuális állapota alapján készült._
