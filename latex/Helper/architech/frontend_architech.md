# Frontend Belső Felépítés – BSc Szakdolgozat

## Architektúra Áttekintés

```
┌─────────────────────────────────────────────────────────────────────┐
│                          main.tsx                                   │
│                                                                     │
│   <GlobalProvider>          ← AppReducer, initialState              │
│     <ViewProvider>          ← ViewReducer, initialViewState         │
│       <App />                                                       │
│     </ViewProvider>                                                 │
│   </GlobalProvider>                                                 │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                            App.tsx                                  │
│                                                                     │
│  useGlobalContext()  →  state.token → fetchProjects()               │
│  useViewContext()   →  activeView  → renderView()                   │
│                                                                     │
│  ┌──────────┐  ┌─────────────────────────────────────────────────┐ │
│  │ Sidebar  │  │ Topbar                                          │ │
│  │          │  │  PlanTab · TasksTab · SubtasksTab · LogTab      │ │
│  │ MainIcon │  │  HeroLogo · ProjectSelect · UserMenu            │ │
│  │ Kanban   │  └─────────────────────────────────────────────────┘ │
│  │ Scrum    │                                                       │
│  │ Gamif.   │  ┌─────────────────────────────────────────────────┐ │
│  │ Wiki     │  │ MainContent (renderView switch)                 │ │
│  └──────────┘  │                                                 │ │
│                │  main · kanban · scrum · gamification · wiki    │ │
│                │  plan · tasks · subtasks · log                  │ │
│                │  account · mails · create · sign                │ │
│                └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                               │
               ┌───────────────┼───────────────┐
               ▼               ▼               ▼
      ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
      │ GlobalContext│ │ ViewContext │ │   Actions    │
      │              │ │             │ │  (axios)     │
      │  AppReducer  │ │ ViewReducer │ │              │
      │  state:      │ │  activeView │ │ loginUser    │
      │  - user      │ │  = ViewState│ │ registerUser │
      │  - token     │ └─────────────┘ │ fetchProjects│
      │  - projects  │                 │ addProject   │
      │  - tasks     │                 │ fetchTasks   │
      │  - subtasks  │                 │ addTask      │
      │  - loading   │                 │ fetchSubtasks│
      │  - error     │                 │ addSubtask   │
      │  - selected  │                 └──────┬───────┘
      │    Project   │                        │
      └──────────────┘                        ▼
                                    ┌──────────────────┐
                                    │   Backend API    │
                                    │ localhost:5000   │
                                    │ /api/auth        │
                                    │ /api/projects    │
                                    │ /api/tasks       │
                                    │ /api/subtasks    │
                                    │ /api/github      │
                                    └──────────────────┘
```

---

## Könyvtárszerkezet

```
frontend/src/
├── main.tsx                    ← Belépési pont, Provider-ek felcsatolása
├── App.tsx                     ← Fő layout: Sidebar, Topbar, renderView()
│
├── Context/
│   ├── GlobalContext.tsx        ← GlobalProvider + useGlobalContext hook
│   ├── ViewContext.tsx          ← ViewProvider + useViewContext hook
│   ├── Reducer.tsx              ← AppReducer + initialState
│   ├── ViewReducer.tsx          ← ViewReducer + ViewState típus
│   └── Actions.ts              ← Axios API hívások, dispatch trigger
│
├── components/
│   ├── Sidebar/
│   │   ├── Sidebar.tsx          ← 5 ikon gomb egymás alatt
│   │   ├── MainIcon.tsx
│   │   ├── KanbanIcon.tsx
│   │   ├── ScrumIcon.tsx
│   │   ├── GamificationIcon.tsx
│   │   └── WikiIcon.tsx
│   │
│   ├── Topbar/
│   │   ├── Topbar.tsx           ← Bal: tabek | Közép: logo | Jobb: select+user
│   │   ├── PlanTab.tsx
│   │   ├── TasksTab.tsx
│   │   ├── SubtasksTab.tsx
│   │   ├── LogTab.tsx
│   │   ├── HeroLogo.tsx
│   │   ├── ProjectSelect.tsx    ← Projektválasztó dropdown
│   │   └── UserMenu.tsx         ← Legördülő: Account, Create, Mails, Sign/Logout
│   │
│   ├── Views/
│   │   ├── MainView.tsx         ← Projekt áttekintés (placeholder)
│   │   ├── KanbanView.tsx       ← Kanban tábla (placeholder)
│   │   ├── ScrumView.tsx        ← Scrum board (placeholder)
│   │   ├── GamificationView.tsx ← XP / jutalmak (placeholder)
│   │   ├── WikiView.tsx         ← Dokumentáció (placeholder)
│   │   ├── PlanView.tsx         ← Tervezés (placeholder)
│   │   ├── LogView.tsx          ← Eseménynapló (placeholder)
│   │   ├── TasksView.tsx        ← Task lista, API-ból töltve
│   │   └── SubTasksView.tsx     ← Subtask lista, API-ból töltve
│   │
│   ├── CreateProject/
│   │   └── CreateProject.tsx    ← 3-lépéses wizard (manual + GitHub import)
│   │
│   ├── Sign/
│   │   └── Sign.tsx             ← Register + Login form egy oldalon
│   │
│   ├── UserMenu/
│   │   └── User.tsx             ← Felhasználói profil (placeholder)
│   │
│   └── Mails/
│       └── Mails.tsx            ← Üzenetek (placeholder)
│
└── test/
    ├── setup.ts                 ← @testing-library/jest-dom import
    ├── Context/
    │   ├── Actions.test.ts      ← fetchTasks, addTask, hiba-kezelés
    │   ├── GlobalContext.test.tsx← Provider render + dispatch teszt
    │   ├── Reducer.test.tsx     ← AppReducer unit tesztek
    │   ├── ViewContext.test.tsx ← ViewProvider + activeView váltás
    │   └── ViewReducer.test.tsx ← ViewReducer unit tesztek
    ├── CreateProject/
    │   └── CreateProject.test.tsx← Wizard lépések, contributor hozzáadás
    ├── Sidebar/
    │   └── Sidebar.test.tsx    ← 5 gomb megjelenése
    ├── Sign/
    │   └── Sign.test.tsx       ← Login/register form, submit, hibák
    ├── Topbar/
    │   └── Topbar.test.tsx     ← Header elem megjelenése
    └── Views/
        ├── TasksView.test.tsx  ← Task lista renderelés mock state-tel
        └── SubTasksView.test.tsx← Subtask lista renderelés mock state-tel
```

---

## State menedzsment

A frontend két egymástól független Context-et használ.

### GlobalContext – alkalmazás állapot

```
initialState
├── user: null | User         ← bejelentkezett felhasználó adatai
├── token: null | string      ← JWT token (localStorage-ba mentve logout előtt)
├── projects: Project[]       ← összes lekért projekt
├── selectedProject: null | Project ← aktív projekt (ProjectSelect-ből)
├── tasks: Task[]             ← aktív projekthez tartozó taskok
├── subtasks: Subtask[]       ← aktív taskokhoz tartozó subtaskok
├── loading: boolean          ← API hívás folyamatban
└── error: null | string      ← legutóbbi hiba üzenete
```

#### AppReducer akciók

| Akció                  | Hatás                                    |
| ---------------------- | ---------------------------------------- |
| `SET_USER`             | user + token beállítása (login/register) |
| `LOGOUT`               | user + token nullázása                   |
| `SET_PROJECTS`         | projektek listájának felülírása          |
| `ADD_PROJECT`          | új projekt hozzáadása a listához         |
| `UPDATE_PROJECT`       | meglévő projekt frissítése ID alapján    |
| `DELETE_PROJECT`       | projekt eltávolítása ID alapján          |
| `SET_TASKS`            | taskok listájának felülírása             |
| `ADD_TASK`             | új task hozzáadása                       |
| `UPDATE_TASK`          | meglévő task frissítése ID alapján       |
| `DELETE_TASK`          | task eltávolítása ID alapján             |
| `SET_SUBTASKS`         | subtaskok listájának felülírása          |
| `ADD_SUBTASK`          | új subtask hozzáadása                    |
| `UPDATE_SUBTASK`       | meglévő subtask frissítése ID alapján    |
| `DELETE_SUBTASK`       | subtask eltávolítása ID alapján          |
| `SET_LOADING`          | loading flag állítása                    |
| `SET_ERROR`            | hibaüzenet tárolása                      |
| `SET_SELECTED_PROJECT` | kiválasztott projekt beállítása          |

### ViewContext – navigáció

Egyetlen értéket tárol: `activeView: ViewState`. A `SET_VIEW` akció váltja.

```
ViewState lehetséges értékei:
'main' | 'kanban' | 'scrum' | 'gamification' | 'wiki'
'plan' | 'tasks' | 'subtasks' | 'log'
'account' | 'create' | 'mails' | 'sign' | 'quit'
```

---

## Útvonal-logika (renderView)

Az `App.tsx` nem React Router-t használ, hanem `activeView` alapján renderel:

```
activeView
├── 'main'          → <MainView />
├── 'kanban'        → !user ? <Sign /> : <KanbanView />
├── 'scrum'         → !user ? <Sign /> : <ScrumView />
├── 'gamification'  → !user ? <Sign /> : <GamificationView />
├── 'wiki'          → <WikiView />          (nyilvános)
├── 'plan'          → !user ? <Sign /> : <PlanView />
├── 'tasks'         → !user ? <Sign /> : <TasksView />
├── 'subtasks'      → !user ? <Sign /> : <SubTasksView />
├── 'log'           → !user ? <Sign /> : <LogView />
├── 'account'       → !user ? <Sign /> : <User />
├── 'mails'         → !user ? <Sign /> : <Mails />
├── 'create'        → !user ? <Sign /> : <CreateProject />
├── 'sign'          → <Sign />              (nyilvános)
└── default         → <MainView />
```

---

## Komponens-leírások

### Sidebar

Vertikális ikonsor 5 gombbal. Minden gomb a ViewContext `SET_VIEW` akcióját hívja:
`Main → Kanban → Scrum → Gamification → Wiki`

### Topbar

Három szekciója van:

- **Bal**: PlanTab, TasksTab, SubtasksTab, LogTab gombjai
- **Közép**: HeroLogo (brand kép)
- **Jobb**: ProjectSelect (dropdown a projektekhez) + UserMenu (legördülő)

### UserMenu

Legördülő menü négy opcióval: Account, Create Project, Mails, és bejelentkezési állapottól függően Sign In / Log Out. Kijelentkezéskor `LOGOUT` dispatch + localStorage törlés + `sign` view.

### ProjectSelect

A `state.projects` listájából legördülő. Változáskor `SET_SELECTED_PROJECT` akciót dispatch-ol, ami kiváltja a TasksView-ban az `useEffect`-et.

### CreateProject – Wizard folyamata

```
Step 0: Típusválasztás
   ├── GitHub → GitHub token + username megadása → handleFetchRepos()
   │     Step 1: Repo kiválasztása (lista)
   │     Step 2: Contributors hozzáadása → handleSubmitGithub()
   │              (issues → tasks konverzió)
   └── Manual → kézi kitöltés
         Step 1: Projekt neve, leírás, contributors
         Step 2: TaskGroup-ok (name, deadline, tasks, subtasks)
                  → handleSubmitManual()
```

### TasksView / SubTasksView

Mindkettő `useEffect`-tel tölt adatot:

- `TasksView`: `selectedProject._id` változásakor `fetchTasks()` hívás
- `SubTasksView`: `state.tasks` változásakor minden task-ra `fetchSubtasks()` hívás

---

## Actions – API hívások

Minden action függvény: `(dispatch, token, ...args) → void`

| Függvény        | Metódus | Végpont                  | Dispatch       |
| --------------- | ------- | ------------------------ | -------------- |
| `registerUser`  | POST    | `/api/auth/register`     | `SET_USER`     |
| `loginUser`     | POST    | `/api/auth/login`        | `SET_USER`     |
| `fetchProjects` | GET     | `/api/projects`          | `SET_PROJECTS` |
| `addProject`    | POST    | `/api/projects`          | `ADD_PROJECT`  |
| `fetchTasks`    | GET     | `/api/tasks/project/:id` | `SET_TASKS`    |
| `addTask`       | POST    | `/api/tasks`             | `ADD_TASK`     |
| `fetchSubtasks` | GET     | `/api/subtasks/task/:id` | `SET_SUBTASKS` |
| `addSubtask`    | POST    | `/api/subtasks`          | `ADD_SUBTASK`  |

Minden action `SET_LOADING` / `SET_ERROR` dispatch-t is kezel.

---

## Tesztelési stratégia

A frontend **Vitest + React Testing Library** kombinációt használ. A context-ek `vi.spyOn`-nal vagy `vi.mock`-kal mockhatók.

| Tesztfájl            | Lefedett területek                                       |
| -------------------- | -------------------------------------------------------- |
| `Actions.test.ts`    | axios mock, dispatch hívások, hiba-kezelés               |
| `GlobalContext.test` | Provider render, dispatch → state frissítés              |
| `Reducer.test`       | AppReducer unit tesztek (SET_SUBTASKS, SET_LOADING, stb) |
| `ViewContext.test`   | ViewProvider, activeView váltás dispatch-szel            |
| `ViewReducer.test`   | SET_VIEW, default ág, több ViewState érték               |
| `CreateProject.test` | Wizard lépések, contributor hozzáadás, üres input guard  |
| `Sidebar.test`       | 5 gomb megjelenése                                       |
| `Sign.test`          | Login/register form, submit, loading/error üzenet        |
| `Topbar.test`        | `<header>` elem megjelenése                              |
| `TasksView.test`     | Taskok renderelése mock state-ből                        |
| `SubTasksView.test`  | Subtaskok renderelése mock state-ből                     |

---

## Technológiai stack

| Technológia                | Szerepe                                      |
| -------------------------- | -------------------------------------------- |
| React 18 + TypeScript      | UI keretrendszer, típusbiztonság             |
| Vite                       | Build tool, dev szerver                      |
| Tailwind CSS               | Utility-first stílusozás                     |
| React Context + useReducer | Globális state menedzsment (Redux nélkül)    |
| axios                      | HTTP kérések a backend felé                  |
| react-icons                | Sidebar ikonok (ai, bs, pi, fa, tb csomagok) |
| Vitest                     | Unit és integrációs tesztelési keretrendszer |
| React Testing Library      | Komponens renderelés és interakció tesztelés |
| @testing-library/jest-dom  | DOM assertion-ök (toBeInTheDocument stb.)    |
