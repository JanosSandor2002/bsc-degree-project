# MongoDB Séma és Adatmodell – BSc Szakdolgozat

## Kollekcióstruktúra – Kapcsolati térkép

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MongoDB adatbázis                                 │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  users                                                               │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  _id: ObjectId  (PK)                                        │    │   │
│  │  │  username: String  (unique, required)                       │    │   │
│  │  │  email: String     (unique, required)                       │    │   │
│  │  │  password: String  (bcrypt hash, required)                  │    │   │
│  │  │  role: String      (default: 'user')                        │    │   │
│  │  │  xp: Number        (default: 0)                             │    │   │
│  │  │  level: Number     (default: 1)                             │    │   │
│  │  │  prestige: Number  (default: 0)                             │    │   │
│  │  │  verified: Boolean (default: false)                         │    │   │
│  │  │  avatar: String    (default: '')                            │    │   │
│  │  │  createdAt: Date   (auto)                                   │    │   │
│  │  │  updatedAt: Date   (auto)                                   │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └──────────────────────────────┬───────────────────────────────────────┘   │
│            ▲                    │ ref (ObjectId)                             │
│            │         ┌──────────┴──────────────────────────────┐            │
│            │         │                                         │            │
│  ┌─────────┴────────────────────────┐   ┌──────────────────────▼─────────┐  │
│  │  projects                        │   │  sprints                       │  │
│  │  ┌────────────────────────────┐  │   │  ┌──────────────────────────┐  │  │
│  │  │  _id: ObjectId  (PK)       │  │   │  │  _id: ObjectId  (PK)     │  │  │
│  │  │  name: String  (required)  │  │   │  │  name: String (required) │  │  │
│  │  │  description: String       │  │   │  │  project: ObjectId → ◄───┼──┼──┤
│  │  │  createdBy: ObjectId → ▲  │  │   │  │  startDate: Date         │  │  │
│  │  │  admin: ObjectId    → ▲  │  │   │  │  endDate: Date           │  │  │
│  │  │  members: ObjectId[]→ ▲  │  │   │  │  createdAt: Date (auto)  │  │  │
│  │  │  contributors: OId[]→ ▲  │  │   │  │  updatedAt: Date (auto)  │  │  │
│  │  │  viewers: ObjectId[]→ ▲  │  │   │  └──────────────────────────┘  │  │
│  │  │  startDate: Date          │  │   └────────────────────────────────┘  │
│  │  │  endDate: Date            │  │              │ ref                     │
│  │  │  createdAt: Date (auto)   │  │              │                         │
│  │  │  updatedAt: Date (auto)   │  │   ┌──────────▼─────────────────────┐  │
│  │  └────────────────────────┘  │   │  tasks                         │  │
│  └─────────────────┬────────────┘   │  ┌──────────────────────────┐  │  │
│                    │ ref            │  │  _id: ObjectId (PK)      │  │  │
│                    │                │  │  title: String (required)│  │  │
│                    ▼                │  │  description: String     │  │  │
│  ┌──────────────────────────────┐  │  │  status: String          │  │  │
│  │            tasks              │  │  │    Open|InProgress|Done  │  │  │
│  │  ┌────────────────────────┐  │◄─┘  │  assignedTo: OId → ▲    │  │  │
│  │  │  project: ObjectId → ──┼──┘     │  project: ObjectId → ──  │  │  │
│  │  │  sprint: ObjectId  → ──┼─────►  │  sprint: ObjectId  → ──  │  │  │
│  │  │  assignedTo: OId  → ──┼──►▲    │  dependencies: OId[]     │  │  │
│  │  │  dependencies: OId[]   │       │  xpReward: Number        │  │  │
│  │  │  xpReward: Number      │       │  deadline: Date          │  │  │
│  │  │  deadline: Date        │       │  createdAt: Date (auto)  │  │  │
│  │  └────────────────────────┘  │   │  updatedAt: Date (auto)  │  │  │
│  └───────────────────┬──────────┘   └──────────────────────────┘  │  │
│                      │ ref           └────────────────────────────────┘  │
│                      ▼                           │ ref                    │
│  ┌───────────────────────────────┐               ▼                       │
│  │  subtasks                     │   ┌────────────────────────────────┐  │
│  │  ┌─────────────────────────┐  │   │  (task önmagára mutat:         │  │
│  │  │  _id: ObjectId  (PK)    │  │   │   dependencies: Task[]         │  │
│  │  │  title: String (req.)   │  │   │   → rekurzív feladat-függőség) │  │
│  │  │  status: String         │  │   └────────────────────────────────┘  │
│  │  │   Open|InProgress|Done  │  │                                        │
│  │  │  task: ObjectId → ──────┼──┘                                        │
│  │  │  assignedTo: OId → ──▲  │                                           │
│  │  │  xpReward: Number    │  │                                           │
│  │  │  createdAt: Date     │  │                                           │
│  │  │  updatedAt: Date     │  │                                           │
│  │  └──────────────────────┘  │                                           │
│  └───────────────────────────────┘                                         │
└─────────────────────────────────────────────────────────────────────────────┘

▲ = ref a users kollekcióra (ObjectId)
```

---

## Kollekciók részletes sémája

### `users`

```json
{
  "_id": "ObjectId",
  "username": "string  (unique, required)",
  "email": "string  (unique, required)",
  "password": "string  (bcrypt hash, required)",
  "role": "string  (default: 'user')",
  "xp": "number  (default: 0)",
  "level": "number  (default: 1)",
  "prestige": "number  (default: 0)",
  "verified": "boolean (default: false)",
  "avatar": "string  (default: '')",
  "createdAt": "Date    (auto)",
  "updatedAt": "Date    (auto)"
}
```

**XP / szintlépés logika** (xpService.ts):

```
szintlépési küszöb = aktuális_szint × 100 XP
pl.: 1. szint → 100 XP,  2. szint → 200 XP,  3. szint → 300 XP

szintlépéskor:
  xp  -= szint × 100
  szint += 1
  (ciklikusan, amíg xp >= küszöb)
```

---

### `projects`

```json
{
  "_id": "ObjectId",
  "name": "string       (required)",
  "description": "string       (optional)",
  "createdBy": "ObjectId     → users (required)",
  "admin": "ObjectId     → users (required)",
  "members": "ObjectId[]   → users",
  "contributors": "ObjectId[]   → users",
  "viewers": "ObjectId[]   → users",
  "startDate": "Date         (optional)",
  "endDate": "Date         (optional)",
  "createdAt": "Date         (auto)",
  "updatedAt": "Date         (auto)"
}
```

**Szerepkörök egy projekten belül:**

| Mező           | Leírás                                  |
| -------------- | --------------------------------------- |
| `createdBy`    | Létrehozó – törölhet projektet          |
| `admin`        | Adminisztrátor – módosíthat projektet   |
| `contributors` | Közreműködők – feladatokhoz rendelhetők |
| `viewers`      | Csak megtekintők                        |
| `members`      | Mindhárom fenti csoport uniója          |

---

### `sprints`

```json
{
  "_id": "ObjectId",
  "name": "string    (required)",
  "project": "ObjectId  → projects (required)",
  "startDate": "Date      (required)",
  "endDate": "Date      (required)",
  "createdAt": "Date      (auto)",
  "updatedAt": "Date      (auto)"
}
```

---

### `tasks`

```json
{
  "_id": "ObjectId",
  "title": "string      (required)",
  "description": "string      (optional)",
  "status": "string      (enum: Open | InProgress | Done, default: Open)",
  "assignedTo": "ObjectId    → users (optional)",
  "project": "ObjectId    → projects (optional)",
  "sprint": "ObjectId    → sprints (optional)",
  "dependencies": "ObjectId[]  → tasks (önreferencia)",
  "xpReward": "number      (default: 0)",
  "deadline": "Date        (optional)",
  "createdAt": "Date        (auto)",
  "updatedAt": "Date        (auto)"
}
```

**Megjegyzés:** A `dependencies` mező a `tasks` kollekcióra mutató önreferencia — ezzel feladat-függőségi láncok modellezhetők.

---

### `subtasks`

```json
{
  "_id": "ObjectId",
  "title": "string    (required)",
  "status": "string    (enum: Open | InProgress | Done, default: Open)",
  "task": "ObjectId  → tasks (required)",
  "assignedTo": "ObjectId  → users (optional)",
  "xpReward": "number    (default: 0)",
  "createdAt": "Date      (auto)",
  "updatedAt": "Date      (auto)"
}
```

---

## Kapcsolatok összefoglalója

```
users  ◄──────────── projects  (createdBy, admin, members, contributors, viewers)
users  ◄──────────── tasks     (assignedTo)
users  ◄──────────── subtasks  (assignedTo)

projects ◄─────────── sprints  (project)
projects ◄─────────── tasks    (project)

sprints  ◄─────────── tasks    (sprint)

tasks    ◄─────────── subtasks (task)
tasks    ◄─────────── tasks    (dependencies – önreferencia)
```

**Kardinalitás:**

| Kapcsolat           | Típus |
| ------------------- | ----- |
| project → users     | N → 1 |
| project ← tasks     | 1 → N |
| project ← sprints   | 1 → N |
| sprint ← tasks      | 1 → N |
| task → user         | N → 1 |
| task ← subtasks     | 1 → N |
| task ↔ tasks (dep.) | N → N |
| subtask → task      | N → 1 |
| subtask → user      | N → 1 |

---

## Cascade törlési logika

A projekt törlése (`DELETE /api/projects/:id`) manuálisan cascadel:

```
Project.deleteOne()
    │
    ├── Task.find({ project: id })
    │       │
    │       └── Subtask.deleteMany({ task: task._id })  ← minden taskhoz
    │
    └── Task.deleteMany({ project: id })
```

A Mongoose sémák **nem** tartalmaznak beépített `cascade` opciót — a törlési logika a route handler kódjában van implementálva (`routes/projects.ts`).

---

## Populate stratégia

A Mongoose `.populate()` metódus helyettesíti az ObjectId referenciákat a valódi dokumentumokkal. A backend mindig `'-password'` projection-nel populálja a user mezőket, hogy a jelszó hash ne kerüljön a válaszba.

| Végpont                   | Populált mezők               |
| ------------------------- | ---------------------------- |
| `GET /api/projects`       | admin, contributors, viewers |
| `GET /api/projects/:id`   | admin, contributors, viewers |
| `GET /api/tasks/project/` | assignedTo                   |
| `GET /api/subtasks/task/` | assignedTo                   |

---

## Adatbázis kapcsolat

```typescript
// config/db.ts
mongoose.connect(process.env.MONGO_URI);
```

A kapcsolat a `server.ts` indításakor egyszer jön létre. A `MONGO_URI` a `.env` fájlból töltődik be. Teszteléskor `MongoMemoryServer` helyettesíti az éles adatbázist (in-memory, izolált tesztkörnyezet).

---

## Mongoose séma jellemzők

| Jellemző     | Beállítás                                      |
| ------------ | ---------------------------------------------- |
| `timestamps` | Minden sémán: `createdAt` és `updatedAt` auto  |
| `ref`        | Populate-hoz szükséges kollekció-név string    |
| `enum`       | status mező: `['Open', 'InProgress', 'Done']`  |
| `default`    | xp: 0, level: 1, status: 'Open', role: 'user'  |
| `unique`     | users.username, users.email                    |
| `required`   | Kötelező mezőknél, validációs hiba ha hiányzik |
