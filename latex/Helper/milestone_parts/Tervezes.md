# Tervezés – Rendszerterv összesítő

> **Projekt neve:** Acxor – Webalapú projektmenedzsment alkalmazás  
> **Technológiai verem:** React · TypeScript · Node.js · Express · MongoDB · GitHub API  
> **Dokumentum célja:** A frontend és backend tervezési döntéseinek, architektúrájának és adatmodelljeinek összesített leírása.

---

## Tartalomjegyzék

1. [Rendszerarchitektúra áttekintése](#1-rendszerarchitektúra-áttekintése)
2. [Backend tervezés](#2-backend-tervezés)
   - [Szerver és middleware](#21-szerver-és-middleware)
   - [Adatmodellek](#22-adatmodellek)
   - [API végpontok](#23-api-végpontok)
   - [Szolgáltatásréteg](#24-szolgáltatásréteg)
   - [GitHub-integráció](#25-github-integráció)
3. [Frontend tervezés](#3-frontend-tervezés)
   - [Állapotkezelés](#31-állapotkezelés)
   - [Nézetek és navigáció](#32-nézetek-és-navigáció)
   - [Komponensstruktúra](#33-komponensstruktúra)
4. [Gamifikációs rendszer](#4-gamifikációs-rendszer)
5. [Biztonsági megfontolások](#5-biztonsági-megfontolások)
6. [Adatfolyam-diagram](#6-adatfolyam-diagram)

---

## 1. Rendszerarchitektúra áttekintése

Az alkalmazás klasszikus **kliens–szerver** architektúrát követ, ahol a frontend és a backend egymástól teljesen elválasztva, önálló egységként működik.

```
┌─────────────────────────────────────────────────────────────────┐
│                        BÖNGÉSZŐ (kliens)                        │
│                                                                 │
│   ┌──────────────┐   ┌──────────────────────────────────────┐   │
│   │   Sidebar    │   │           Főnézet terület            │   │
│   │  (ikonok)    │   │  KanbanView / ScrumView / PlanView   │   │
│   └──────────────┘   │  TasksView / GamificationView / ...  │   │
│                      └──────────────────────────────────────┘   │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │  Topbar: PlanTab · TasksTab · SubtasksTab · LogTab       │   │
│   │          ProjectSelect · UserMenu · HeroLogo             │   │
│   └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│   GlobalContext (user, token, projects, tasks, subtasks)        │
│   ViewContext   (activeView)                                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTP / REST (JSON)
                            │ Authorization: Bearer <JWT>
┌───────────────────────────▼─────────────────────────────────────┐
│                    BACKEND (Node.js / Express)                  │
│                                                                 │
│  /api/auth       →  Regisztráció, bejelentkezés                 │
│  /api/projects   →  CRUD projektek                              │
│  /api/tasks      →  CRUD feladatok                              │
│  /api/subtasks   →  CRUD alfeladatok                            │
│  /api/github     →  GitHub API proxy                            │
│                                                                 │
│  Middleware: protect (JWT ellenőrzés)                           │
│  Szolgáltatások: xpService · logService · githubService         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼─────────────────────────────────────┐
│                    MongoDB – Adatbázis                          │
│                                                                 │
│  Kollekciók: users · projects · tasks · subtasks · sprints      │
└─────────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────────┐
│                    GitHub REST API v3                           │
│   GET /user/repos  ·  GET /repos/{owner}/{repo}/issues          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend tervezés

### 2.1 Szerver és middleware

A belépési pont a `server.ts`, amely:

- betölti a környezeti változókat (`dotenv`),
- csatlakozik a MongoDB-hez (`connectDB`),
- inicializálja az Express alkalmazást `cors` és `express.json` middlewarekkel,
- regisztrálja a route-okat a megfelelő útvonal-előtagokkal.

```
PORT 5000
  ├── /api/auth       → routes/auth.ts
  ├── /api/projects   → routes/projects.ts
  ├── /api/tasks      → routes/tasks.ts
  ├── /api/subtasks   → routes/subtasks.ts
  └── /api/github     → routes/github.ts
```

**Hitelesítési middleware (`protect`):**

Minden védett végpont előtt fut. Lépései:

1. Kiolvassa az `Authorization: Bearer <token>` fejlécet.
2. Verifikálja a JWT tokent a `JWT_SECRET` kulccsal.
3. Lekéri a felhasználói rekordot az adatbázisból (jelszó nélkül).
4. Csatolja a felhasználói objektumot a requesthez (`req.user`).
5. Hiba esetén `401 Unauthorized` választ küld.

---

### 2.2 Adatmodellek

#### User

| Mező       | Típus   | Alapértelmezett | Leírás                    |
| ---------- | ------- | --------------- | ------------------------- |
| `username` | String  | –               | Egyedi felhasználónév     |
| `email`    | String  | –               | Egyedi e-mail-cím         |
| `password` | String  | –               | Bcrypt-kivonat            |
| `role`     | String  | `'user'`        | Jogosultsági szint        |
| `xp`       | Number  | `0`             | Tapasztalatipont-egyenleg |
| `level`    | Number  | `1`             | Aktuális szint            |
| `prestige` | Number  | `0`             | Prestige-szám             |
| `verified` | Boolean | `false`         | E-mail-megerősítés        |
| `avatar`   | String  | `''`            | Profilkép URL             |

#### Project

| Mező           | Típus             | Leírás                                          |
| -------------- | ----------------- | ----------------------------------------------- |
| `name`         | String            | Projekt neve (kötelező)                         |
| `description`  | String            | Opcionális leírás                               |
| `createdBy`    | ObjectId → User   | Létrehozó felhasználó                           |
| `admin`        | ObjectId → User   | Adminisztrátor                                  |
| `contributors` | ObjectId[] → User | Közreműködők listája                            |
| `viewers`      | ObjectId[] → User | Megtekintők listája                             |
| `members`      | ObjectId[] → User | Összes tag (admin + közreműködők + megtekintők) |
| `startDate`    | Date              | Kezdési dátum                                   |
| `endDate`      | Date              | Befejezési dátum                                |

#### Task

| Mező           | Típus              | Alapértelmezett | Leírás                         |
| -------------- | ------------------ | --------------- | ------------------------------ |
| `title`        | String             | –               | Feladatcím (kötelező)          |
| `description`  | String             | –               | Részletes leírás               |
| `status`       | Enum               | `'Open'`        | `Open` · `InProgress` · `Done` |
| `assignedTo`   | ObjectId → User    | –               | Felelős felhasználó            |
| `project`      | ObjectId → Project | –               | Szülőprojekt                   |
| `sprint`       | ObjectId → Sprint  | –               | Sprint-hozzárendelés           |
| `dependencies` | ObjectId[] → Task  | `[]`            | Függő feladatok                |
| `xpReward`     | Number             | `0`             | Befejezéskor kapott XP         |
| `deadline`     | Date               | –               | Határidő                       |

#### Subtask

| Mező         | Típus           | Alapértelmezett | Leírás                         |
| ------------ | --------------- | --------------- | ------------------------------ |
| `title`      | String          | –               | Alfeladatcím (kötelező)        |
| `status`     | Enum            | `'Open'`        | `Open` · `InProgress` · `Done` |
| `task`       | ObjectId → Task | –               | Szülőfeladat (kötelező)        |
| `assignedTo` | ObjectId → User | –               | Felelős felhasználó            |
| `xpReward`   | Number          | `0`             | Befejezéskor kapott XP         |

#### Sprint

| Mező        | Típus              | Leírás                    |
| ----------- | ------------------ | ------------------------- |
| `name`      | String             | Sprint neve (kötelező)    |
| `project`   | ObjectId → Project | Szülőprojekt (kötelező)   |
| `startDate` | Date               | Sprint kezdete (kötelező) |
| `endDate`   | Date               | Sprint vége (kötelező)    |

**Modellkapcsolatok:**

```
User ◄────────────── Project (createdBy, admin, contributors, viewers)
User ◄────────────── Task    (assignedTo)
User ◄────────────── Subtask (assignedTo)

Project ◄─────────── Task    (project)
Project ◄─────────── Sprint  (project)

Task ◄────────────── Subtask (task)
Task ◄────────────── Task    (dependencies – önreferencia)

Sprint ◄──────────── Task    (sprint)
```

---

### 2.3 API végpontok

#### Auth – `/api/auth`

| Metódus | Végpont     | Védett | Leírás                         |
| ------- | ----------- | ------ | ------------------------------ |
| POST    | `/register` | ✗      | Regisztráció, JWT visszaadása  |
| POST    | `/login`    | ✗      | Bejelentkezés, JWT visszaadása |

#### Projects – `/api/projects`

| Metódus | Végpont | Védett | Leírás                                           |
| ------- | ------- | ------ | ------------------------------------------------ |
| GET     | `/`     | ✓      | Bejelentkezett felhasználó projektjei            |
| POST    | `/`     | ✓      | Új projekt létrehozása (task group-okkal együtt) |
| GET     | `/:id`  | ✓      | Egy projekt lekérése ID alapján                  |
| PUT     | `/:id`  | ✓      | Projekt frissítése (csak admin)                  |
| DELETE  | `/:id`  | ✓      | Projekt és kapcsolódó task-ok/subtask-ok törlése |

#### Tasks – `/api/tasks`

| Metódus | Végpont               | Védett | Leírás                  |
| ------- | --------------------- | ------ | ----------------------- |
| POST    | `/`                   | ✓      | Új feladat létrehozása  |
| GET     | `/project/:projectId` | ✓      | Projekt összes feladata |
| PUT     | `/:id`                | ✓      | Feladat frissítése      |
| DELETE  | `/:id`                | ✓      | Feladat törlése         |

#### Subtasks – `/api/subtasks`

| Metódus | Végpont         | Védett | Leírás                    |
| ------- | --------------- | ------ | ------------------------- |
| POST    | `/`             | ✓      | Új alfeladat létrehozása  |
| GET     | `/task/:taskId` | ✓      | Feladat összes alfeladata |
| PUT     | `/:id`          | ✓      | Alfeladat frissítése      |
| DELETE  | `/:id`          | ✓      | Alfeladat törlése         |

#### GitHub – `/api/github`

| Metódus | Végpont                | Védett | Leírás                                             |
| ------- | ---------------------- | ------ | -------------------------------------------------- |
| GET     | `/repos/names`         | ✗      | Felhasználó repository-neveinek listája            |
| GET     | `/:owner/:repo/issues` | ✗      | Egy repo issue-jainak listája                      |
| POST    | `/issues`              | ✗      | Kiválasztott repo issue-jainak lekérése (body-ból) |

---

### 2.4 Szolgáltatásréteg

#### `xpService` – tapasztalatipont-kezelés

```
addXP(userId, xp)
  │
  ├── User lekérése adatbázisból
  ├── user.xp += xp
  ├── while (user.xp >= user.level * 100):
  │     user.xp   -= user.level * 100
  │     user.level += 1
  └── user.save()
```

Szintlépési küszöb: `szint × 100 XP`. Az aktuális szint mindig befolyásolja a következő szint eléréséhez szükséges pontmennyiséget, ezáltal a haladás fokozatosan egyre több munkát igényel.

#### `logService` – eseménynaplózás

Jelenlegi állapotában konzolra írja az eseményeket projekt-azonosítóval, üzenettel és felhasználói azonosítóval. A rendszer bővítésre tervezett: adatbázis-alapú eseménynapló bevezetésével a `LogView` nézetben megjeleníthető lesz a teljes projekttörténet.

#### `githubService` – GitHub API proxy

Két függvényt exportál:

- `getRepoNames()` – lekéri az összes repositoryt (publikus + privát, owner + collaborator), és csak a neveket adja vissza.
- `getRepoIssues(owner, repo)` – lekéri a megadott repository issue-jait, és csak a releváns mezőket adja vissza szűrve.

---

### 2.5 GitHub-integráció

A GitHub-integráció célja, hogy a fejlesztők meglévő issue-kezelési munkamenetét zökkenőmentesen bevezesse a projektmenedzsment alkalmazásba.

**Folyamat:**

```
Frontend                         Backend                    GitHub API
   │                                │                           │
   │  GET /api/github/repos/names   │                           │
   ├───────────────────────────────►│  GET /user/repos          │
   │                                ├──────────────────────────►│
   │                                │◄──────────────────────────┤
   │◄───────────────────────────────┤  ["repo1", "repo2", ...]  │
   │                                │                           │
   │  Felhasználó kiválaszt egyet   │                           │
   │                                │                           │
   │  GET /api/github/{owner}/{repo}/issues                     │
   ├───────────────────────────────►│  GET /repos/.../issues    │
   │                                ├──────────────────────────►│
   │                                │◄──────────────────────────┤
   │◄───────────────────────────────┤  [{number,title,...}, ...]│
   │                                │                           │
   │  POST /api/projects  ──────────┤                           │
   │  (issue-k → TaskGroup)         │                           │
```

**Adatleképezés – GitHub Issue → Task:**

| GitHub mező      | Task mező                            |
| ---------------- | ------------------------------------ |
| `issue.title`    | `task.title`                         |
| –                | `task.project` (az új projekt ID-ja) |
| `group.deadline` | `task.deadline`                      |
| –                | `task.status = 'Open'`               |

---

## 3. Frontend tervezés

### 3.1 Állapotkezelés

A frontend állapotát két egymástól független React Context látja el.

#### GlobalContext + AppReducer

Az alkalmazás teljes adatállapotát kezeli.

**Állapot mezők:**

| Mező              | Típus          | Leírás                            |
| ----------------- | -------------- | --------------------------------- |
| `user`            | object \| null | Bejelentkezett felhasználó adatai |
| `token`           | string \| null | JWT token                         |
| `projects`        | array          | Felhasználó projektjei            |
| `tasks`           | array          | Aktuális projekt feladatai        |
| `subtasks`        | array          | Aktuális feladat alfeladatai      |
| `selectedProject` | object \| null | Kiválasztott projekt              |
| `loading`         | boolean        | Betöltési állapot                 |
| `error`           | string \| null | Hibaüzenet                        |

**Akciótípusok:**

```
Felhasználó:  SET_USER · LOGOUT
Projektek:    SET_PROJECTS · ADD_PROJECT · UPDATE_PROJECT · DELETE_PROJECT
Feladatok:    SET_TASKS · ADD_TASK · UPDATE_TASK · DELETE_TASK
Alfeladatok:  SET_SUBTASKS · ADD_SUBTASK · UPDATE_SUBTASK · DELETE_SUBTASK
UI:           SET_LOADING · SET_ERROR · SET_SELECTED_PROJECT
```

#### ViewContext + ViewReducer

Kizárólag az aktív nézetet tárolja egyetlen string értékként, és a `SET_VIEW` akcióra reagál.

**Lehetséges nézetek:**

```
main · kanban · scrum · gamification · wiki
plan · tasks · subtasks · log
account · create · mails · sign · quit
```

#### Actions réteg (`Actions.ts`)

A kontextusokhoz tartozó aszinkron műveletek egy különálló fájlban kaptak helyet, elválasztva az üzleti logikát a komponensektől. Minden action:

1. `SET_LOADING: true` küldése,
2. axios HTTP-hívás végrehajtása a megfelelő Authorization fejléccel,
3. sikeres válasz esetén a megfelelő dispatch akcióküldése,
4. hiba esetén `SET_ERROR` küldése,
5. `SET_LOADING: false` küldése (finally blokk).

---

### 3.2 Nézetek és navigáció

#### Navigáció védelme

Az `App.tsx` `renderView()` függvénye minden védett nézetnél ellenőrzi, hogy `state.user` létezik-e. Ha nem, a `<Sign />` komponenst rendereli a kért nézet helyett.

```
Védett nézetek:
  kanban · scrum · gamification · plan
  tasks · subtasks · log · account · mails · create

Nyilvános nézetek:
  main · wiki · sign
```

#### Nézetek összefoglalása

| Nézet          | Komponens          | Állapot          | Leírás                       |
| -------------- | ------------------ | ---------------- | ---------------------------- |
| `main`         | `MainView`         | Kész             | Projekt áttekintő főoldal    |
| `kanban`       | `KanbanView`       | Fejlesztés alatt | Kanban-tábla oszlopnézettel  |
| `scrum`        | `ScrumView`        | Fejlesztés alatt | Scrum sprint nézet           |
| `gamification` | `GamificationView` | Fejlesztés alatt | XP, szint, jutalmak          |
| `wiki`         | `WikiView`         | Fejlesztés alatt | Projekt dokumentáció         |
| `plan`         | `PlanView`         | Fejlesztés alatt | Tervezési nézet              |
| `tasks`        | `TasksView`        | Fejlesztés alatt | Feladatlista                 |
| `subtasks`     | `SubTasksView`     | Fejlesztés alatt | Alfeladatlista               |
| `log`          | `LogView`          | Fejlesztés alatt | Eseménynapló                 |
| `account`      | `User`             | Fejlesztés alatt | Felhasználói profil          |
| `mails`        | `Mails`            | Fejlesztés alatt | Értesítések / levelek        |
| `create`       | `CreateProject`    | **Kész**         | Projekt létrehozása          |
| `sign`         | `Sign`             | **Kész**         | Bejelentkezés / regisztráció |

---

### 3.3 Komponensstruktúra

```
App
├── Sidebar
│   ├── MainIcon          → 'main'
│   ├── KanbanIcon        → 'kanban'
│   ├── ScrumIcon         → 'scrum'
│   ├── GamificationIcon  → 'gamification'
│   └── WikiIcon          → 'wiki'
│
├── Topbar
│   ├── HeroLogo
│   ├── PlanTab           → 'plan'
│   ├── TasksTab          → 'tasks'
│   ├── SubtasksTab       → 'subtasks'
│   ├── LogTab            → 'log'
│   ├── ProjectSelect     → SET_SELECTED_PROJECT
│   └── UserMenu
│       ├── → 'account'
│       ├── → 'create'
│       ├── → 'mails'
│       ├── → 'sign'
│       └── LOGOUT
│
└── MainView / KanbanView / ScrumView / ...  (aktív nézet)
```

#### CreateProject – lépéses projekt-létrehozás

A `CreateProject` komponens egy többlépéses (wizard) folyamatot valósít meg, kétféle projekt-létrehozási módot támogatva:

**Manuális mód (lépések):**

```
0. Típusválasztás
   └─► 1. Projekt adatai (név, leírás, közreműködők)
           └─► 2. Task group-ok és feladatok szerkesztése
                   └─► Mentés (POST /api/projects)
```

**GitHub-alapú mód (lépések):**

```
0. GitHub username + Personal Token megadása
   └─► [API hívás: GET /api/github/repos/names]
       └─► 1. Repository kiválasztása listából
               └─► 2. Közreműködők hozzáadása
                       └─► [API hívás: GET /api/github/{owner}/{repo}/issues]
                           └─► Mentés (POST /api/projects)
```

---

## 4. Gamifikációs rendszer

Az alkalmazás egy XP-alapú motivációs rendszert alkalmaz a felhasználói elkötelezettség fenntartása érdekében.

### Szintlépési logika

```
Szintküszöb = aktuális_szint × 100

Pl.:
  1. szint →  100 XP szükséges a 2. szinthez
  2. szint →  200 XP szükséges a 3. szinthez
  3. szint →  300 XP szükséges a 4. szinthez
  ...
```

### XP-szerzési alkalmak

| Esemény              | XP forrása         |
| -------------------- | ------------------ |
| Feladat befejezése   | `task.xpReward`    |
| Alfeladat befejezése | `subtask.xpReward` |

### Jövőbeli bővítési lehetőségek

- Napi belépési jutalom
- Sorozatos feladat-befejezési bónusz (streak)
- Csapatszintű ranglétra (leaderboard)
- Prestige-rendszer (szint-visszaállítás különleges jelvényért)
- Egyedi avatárok XP-vel feloldhatók

---

## 5. Biztonsági megfontolások

| Terület                 | Megvalósítás                                                            |
| ----------------------- | ----------------------------------------------------------------------- |
| Jelszótárolás           | `bcryptjs` – 10 salt round                                              |
| Hitelesítés             | JWT, `7d` lejárattal                                                    |
| Token tárolása (kliens) | `localStorage`                                                          |
| API védelem             | `protect` middleware minden érzékeny végponton                          |
| Jogosultság-ellenőrzés  | Projekt szerkesztésnél admin-ellenőrzés, törlésnél createdBy-ellenőrzés |
| Környezeti változók     | `.env` fájl – `MONGO_URI`, `JWT_SECRET`, `GITHUB_TOKEN`                 |
| GitHub token            | Soha nem kerül a frontendre, csak a backend tárolja env-ben             |

---

## 6. Adatfolyam-diagram

### Bejelentkezési folyamat

```
Felhasználó     Sign.tsx          Actions.ts         Backend          MongoDB
    │               │                  │                 │               │
    │  form submit  │                  │                 │               │
    ├──────────────►│  loginUser()     │                 │               │
    │               ├─────────────────►│  POST /auth/login               │
    │               │                  ├────────────────►│               │
    │               │                  │                 │  User.findOne │
    │               │                  │                 ├──────────────►│
    │               │                  │                 │◄──────────────┤
    │               │                  │                 │  bcrypt.compare
    │               │                  │                 │  jwt.sign     │
    │               │                  │◄────────────────┤  {user, token}
    │               │◄─────────────────┤  SET_USER       │               │
    │◄──────────────┤  UI frissítés    │                 │               │
```

### Projekt létrehozása GitHub-ból

```
CreateProject.tsx                Backend              GitHub API      MongoDB
       │                            │                     │              │
       │  GET /api/github/repos/names                     │              │
       ├───────────────────────────►│  GET /user/repos    │              │
       │                            ├────────────────────►│              │
       │◄───────────────────────────┤◄────────────────────┤              │
       │  ["repo-A", "repo-B", ...]  │                     │              │
       │                            │                     │              │
       │  GET /github/{owner}/{repo}/issues               │              │
       ├───────────────────────────►│  GET /repos/.../issues             │
       │                            ├────────────────────►│              │
       │◄───────────────────────────┤◄────────────────────┤              │
       │  [{title, state, ...}, ...]│                     │              │
       │                            │                     │              │
       │  POST /api/projects        │                     │              │
       │  (issues → taskGroups)     │                     │              │
       ├───────────────────────────►│  Project.create()   │              │
       │                            ├─────────────────────┼─────────────►│
       │                            │  Task.create() × N  │              │
       │                            ├─────────────────────┼─────────────►│
       │◄───────────────────────────┤  {project}          │              │
       │  ADD_PROJECT dispatch       │                     │              │
```

---

_Dokumentum utoljára frissítve: a forráskód aktuális állapota alapján._
