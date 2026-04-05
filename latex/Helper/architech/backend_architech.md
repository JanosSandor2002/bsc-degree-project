# Backend Belső Felépítés – BSc Szakdolgozat

## Architektúra Áttekintés

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Frontend)                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTP kérések
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Express.js App                              │
│                           (app.ts)                                  │
│                                                                     │
│   cors()  ·  express.json()  ·  Route regisztráció                  │
└────┬───────────┬──────────┬────────────┬──────────────┬─────────────┘
     │           │          │            │              │
     ▼           ▼          ▼            ▼              ▼
/api/auth  /api/projects /api/tasks /api/subtasks /api/github
     │           │          │            │              │
     ▼           ▼          ▼            ▼              ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Middleware: protect (JWT)                     │
│                         (auth.ts)                                │
│  – Authorization header ellenőrzés                               │
│  – jwt.verify() → User.findById()                                │
│  – req.user = user  →  next()                                    │
└──────────────────────────────────────────────────────────────────┘
     │           │          │            │              │
     ▼           ▼          ▼            ▼              ▼
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────────┐
│  auth    │ │projects│ │ tasks  │ │ subtasks │ │   github     │
│  route   │ │ route  │ │ route  │ │  route   │ │   route      │
└──────────┘ └────┬───┘ └───┬────┘ └────┬─────┘ └──────┬───────┘
                  │         │           │               │
                  ▼         ▼           ▼               ▼
           ┌──────────────────────────────────────────────────┐
           │               Controllers / Route Handlers        │
           │  Task.ts controller  ·  githubController.ts       │
           └──────────────────────┬───────────────────────────┘
                                  │
                    ┌─────────────┼──────────────┐
                    ▼             ▼               ▼
             ┌────────────┐ ┌──────────┐ ┌───────────────┐
             │  Services  │ │  Models  │ │ GitHub API    │
             │            │ │(Mongoose)│ │  (axios)      │
             │ xpService  │ │ User     │ │               │
             │ logService │ │ Project  │ └───────────────┘
             │ githubSvc  │ │ Task     │
             └────────────┘ │ Subtask  │
                            │ Sprint   │
                            └────┬─────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │        MongoDB           │
                    │  (mongoose.connect)      │
                    └─────────────────────────┘
```

---

## Könyvtárszerkezet

```
backend/src/
├── app.ts                  ← Express app, middleware, route regisztráció
├── server.ts               ← Belépési pont: dotenv, DB kapcsolat, port
│
├── config/
│   └── db.ts               ← MongoDB kapcsolat (mongoose.connect)
│
├── middleware/
│   └── auth.ts             ← JWT védelem (protect RequestHandler)
│
├── models/
│   ├── User.ts             ← Felhasználó séma (xp, level, prestige)
│   ├── Project.ts          ← Projekt séma (members, roles, dátumok)
│   ├── Task.ts             ← Feladat séma (status, xpReward, deadline)
│   ├── Subtask.ts          ← Alfeladat séma (task referencia)
│   └── Sprint.ts           ← Sprint séma (projekt, dátumok)
│
├── routes/
│   ├── auth.ts             ← /api/auth (register, login)
│   ├── projects.ts         ← /api/projects (CRUD)
│   ├── tasks.ts            ← /api/tasks (CRUD)
│   ├── subtasks.ts         ← /api/subtasks (CRUD)
│   └── github.ts           ← /api/github (repo nevek, issue-k)
│
├── controllers/
│   ├── Task.ts             ← createTask, updateTask, deleteTask, completeTask
│   └── githubController.ts ← fetchRepoNames, fetchIssues, fetchSelectedRepoIssues
│
├── services/
│   ├── xpService.ts        ← addXP (szintlépés logika)
│   ├── logService.ts       ← logEvent (eseménynapló, bővítés folyamatban)
│   └── githubService.ts    ← getRepoNames, getRepoIssues (axios → GitHub API)
│
└── __tests__/
    ├── setup.ts            ← MongoMemoryServer (in-memory DB tesztekhez)
    ├── app.test.ts         ← Alap route teszt
    └── routes/
    │   ├── auth.test.ts    ← Register + login tesztek
    │   ├── projects.test.ts← Projekt CRUD tesztek
    │   ├── tasks.test.ts   ← Task CRUD tesztek
    │   └── subtasks.test.ts← Subtask CRUD tesztek
    └── services/
        ├── xpService.test.ts    ← XP és szintlépés unit tesztek
        ├── logService.test.ts   ← Log esemény unit tesztek
        └── githubService.test.ts← GitHub API mock tesztek
```

---

## Réteg-leírások

### 1. Belépési pont – `server.ts`

Betölti a környezeti változókat (`dotenv`), csatlakozik a MongoDB-hez (`connectDB`), majd elindítja az Express szervert a megadott porton (alapértelmezett: 5000).

### 2. Alkalmazás réteg – `app.ts`

Az Express alkalmazás konfigurációja: CORS engedélyezés, JSON body parser, és az összes route felcsatolása a megfelelő prefix alá.

### 3. Middleware – `protect`

JWT-alapú autentikáció. Az `Authorization: Bearer <token>` headert ellenőrzi, dekódolja, majd az adatbázisból betölti a felhasználót. Hiba esetén `401`-et ad vissza, sikeres esetén `req.user`-be helyezi a felhasználót.

### 4. Route-ok

| Route prefix    | Fájl                 | Védett? | Funkciók                          |
| --------------- | -------------------- | ------- | --------------------------------- |
| `/api/auth`     | `routes/auth.ts`     | ✗       | Regisztráció, bejelentkezés (JWT) |
| `/api/projects` | `routes/projects.ts` | ✓       | Projekt CRUD, cascading törlés    |
| `/api/tasks`    | `routes/tasks.ts`    | ✓       | Task CRUD, szűrés projekt szerint |
| `/api/subtasks` | `routes/subtasks.ts` | ✓       | Subtask CRUD, szűrés task szerint |
| `/api/github`   | `routes/github.ts`   | ✗/✓     | Repo nevek, issue-k lekérdezése   |

### 5. Modellek (Mongoose)

| Model     | Kapcsolatok                           | Főbb mezők                                      |
| --------- | ------------------------------------- | ----------------------------------------------- |
| `User`    | –                                     | username, email, password, xp, level, prestige  |
| `Project` | → User (admin, contributors, viewers) | name, members, startDate, endDate               |
| `Task`    | → Project, User, Sprint               | title, status, xpReward, deadline, dependencies |
| `Subtask` | → Task, User                          | title, status, xpReward                         |
| `Sprint`  | → Project                             | name, startDate, endDate                        |

### 6. Services

#### `xpService.ts` – XP és szintlépés

Minden szinten `szint × 100 XP` kell a következő szinthez. Szintlépés ciklikusan történik (több szint is átléphető egyszerre), és a maradék XP megmarad.

```
xpHatár(szint) = szint × 100
pl.: 1. szint → 100 XP, 2. szint → 200 XP, 3. szint → 300 XP
```

#### `logService.ts` – Eseménynapló

Jelenleg `console.log`-ra ír (bővítés folyamatban). Formátum:  
`[PROJECT <id>] <üzenet> by user <userId>`

#### `githubService.ts` – GitHub integráció

Az `axios` könyvtáron keresztül kommunikál a GitHub REST API-val. Visszaadja a szűrt repository neveket és issue adatokat (number, title, body, state, creator, url, dátumok).

---

## Adatfolyam – Task befejezése

```
PUT /api/tasks/:id/complete
         │
         ▼
    protect (JWT)
         │
         ▼
  Task.findById(id)
         │
    task.status = 'Done'
    task.save()
         │
    ┌────┴─────┐
    ▼          ▼
addXP(...)  logEvent(...)
  │              │
User.xp +=    console.log
szintlépés?
```

---

## Tesztelési stratégia

A tesztek **in-memory MongoDB** (`MongoMemoryServer`) segítségével futnak, így nem szükséges éles adatbázis-kapcsolat. Minden teszt-fájl futása előtt a szerver csatlakozik az in-memory DB-hez, minden egyes teszt után az összes kollekcióból törlődnek az adatok (izoláció), majd a fájl végén a kapcsolat bezárul.

| Tesztfajta      | Lefedett területek                                              |
| --------------- | --------------------------------------------------------------- |
| Route tesztek   | Auth, Projects, Tasks, Subtasks – CRUD + jogosultság-ellenőrzés |
| Service tesztek | XP logika, log formátum, GitHub API (axios mock)                |
| Alap teszt      | Ismeretlen route → 404                                          |

---

## Technológiai stack

| Technológia          | Szerepe                            |
| -------------------- | ---------------------------------- |
| Node.js + TypeScript | Futtatókörnyezet és típusbiztonság |
| Express.js           | HTTP szerver és routing            |
| MongoDB + Mongoose   | Adatbázis és ODM                   |
| JWT (`jsonwebtoken`) | Autentikáció                       |
| bcryptjs             | Jelszó hashelés                    |
| axios                | GitHub API HTTP kérések            |
| Jest + Supertest     | Tesztelési keretrendszer           |
| MongoMemoryServer    | In-memory DB teszteléshez          |
| dotenv               | Környezeti változók kezelése       |
