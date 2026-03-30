# AUTH ROUTES

**Base:** /api/auth

| Method | Endpoint           | Leírás                     |
| ------ | ------------------ | -------------------------- |
| POST   | /api/auth/register | Felhasználó regisztrációja |
| POST   | /api/auth/login    | Felhasználó bejelentkezése |

# PROJECT ROUTES

**Base:** /api/projects  
**Middleware:** protect (JWT)

| Method | Endpoint          | Leírás                          |
| ------ | ----------------- | ------------------------------- |
| GET    | /api/projects/    | Összes projekt lekérése         |
| POST   | /api/projects/    | Új projekt létrehozása          |
| GET    | /api/projects/:id | Egy projekt lekérése ID alapján |
| PUT    | /api/projects/:id | Projekt frissítése (csak admin) |
| DELETE | /api/projects/:id | Projekt törlése (csak admin)    |

# TASK ROUTES

**Base:** /api/tasks  
**Middleware:** protect (JWT)

| Method | Endpoint                      | Leírás                         |
| ------ | ----------------------------- | ------------------------------ |
| POST   | /api/tasks/                   | Új task létrehozása            |
| GET    | /api/tasks/project/:projectId | Taskek lekérése egy projekthez |
| PUT    | /api/tasks/:id                | Task frissítése                |
| DELETE | /api/tasks/:id                | Task törlése                   |

> Megjegyzés: Van `completeTask` controller, de route nincs létrehozva, így jelenleg nem elérhető API-n keresztül.

# SUBTASK ROUTES

**Base:** /api/subtasks  
**Middleware:** protect (JWT)

| Method | Endpoint                   | Leírás                          |
| ------ | -------------------------- | ------------------------------- |
| POST   | /api/subtasks/             | Új subtask létrehozása          |
| GET    | /api/subtasks/task/:taskId | Subtaskek lekérése task alapján |
| PUT    | /api/subtasks/:id          | Subtask frissítése              |
| DELETE | /api/subtasks/:id          | Subtask törlése                 |

# HIÁNYZÓ / JAVASOLT EXTRA ROUTE-OK

| Method | Endpoint                | Leírás                                 |
| ------ | ----------------------- | -------------------------------------- |
| PATCH  | /api/tasks/:id/complete | Task befejezése (XP és log hozzáadása) |
| GET    | /api/tasks/:id          | Egyedi task lekérése                   |
| GET    | /api/subtasks/:id       | Egyedi subtask lekérése                |
| \*     | Sprint route-ok         | Sprint model van, de route nincs       |
