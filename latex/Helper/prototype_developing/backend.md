## Fájlok áttekintése és funkcióik

### `src/server.ts`

Ez a szerver belépési pontja.

- Inicializálja az **Express** szervert.
- Betölti a környezeti változókat (`dotenv`).
- Csatlakozik a MongoDB adatbázishoz (`connectDB`).
- Beállítja a middleware-eket: `cors` és JSON body parser.
- Beköti az útvonalakat (`auth`, `projects`, `tasks`, `subtasks`).
- Elindítja a szervert a megadott porton.

### `src/config/db.ts`

- A MongoDB-hez való kapcsolódást kezeli.
- `connectDB` függvény csatlakozik az adatbázishoz és hibát dob, ha nem sikerül.

### `src/controllers/Task.ts`

- Taskok kezeléséért felel: létrehozás, frissítés, törlés, befejezés.
- A `completeTask` automatikusan ad XP-t a felhasználónak és naplózza az eseményt.

### `src/middleware/auth.ts`

- JWT alapú hitelesítést valósít meg.
- A `protect` middleware ellenőrzi a token érvényességét és beállítja a `req.user`-t.

### `src/models/User.ts`

- Felhasználói modell Mongoose-szal.
- Tárolja az alapvető adatokat: felhasználónév, email, jelszó, XP, level, prestige, avatar és státusz.

### `src/models/Project.ts`

- Projekt modell, tartalmazza a projekt adatait, tagokat, admin-t, hozzájárulókat és nézőket.
- Időbélyegzőket és opcionális kezdő- és végdátumot kezel.

### `src/models/Task.ts`

- Task modell, amely kapcsolódhat sprinthez, projekthez, felhasználóhoz.
- Tartalmaz státuszt, XP jutalmat, határidőt és függőségeket más taskokra.

### `src/models/Subtask.ts`

- Subtask modell, kapcsolódik egy Taskhoz.
- Tartalmaz státuszt, XP jutalmat és opcionális hozzárendelt felhasználót.

### `src/models/Sprint.ts`

- Sprint modell, amely egy projekthez tartozik.
- Kezdő és záró dátumot, valamint időbélyegeket kezel.

### `src/routes/auth.ts`

- Felhasználói regisztráció és bejelentkezés.
- Jelszó hash-elése `bcrypt`-szel és JWT token generálás.
- Hibakezelés regisztrációs és belépési folyamatoknál.

### `src/routes/projects.ts`

- Projektek létrehozása, módosítása, törlése, lekérdezése.
- Csak az admin tudja módosítani és törölni a projektet.
- Projekthez kapcsolódó felhasználói jogosultságok kezelése.

### `src/routes/tasks.ts`

- Taskok CRUD műveletei.
- Projekthez kapcsolódó taskok lekérése.
- Csak hitelesített felhasználók használhatják a végpontokat.

### `src/routes/subtasks.ts`

- Subtaskok CRUD műveletei.
- Taskhoz tartozó subtaskok lekérése.
- Hitelesítés `protect` middleware-en keresztül.

### `src/services/xpService.ts`

- Felhasználói XP kezelés.
- Task vagy subtask teljesítéskor növeli az XP-t.
- Szintlépés logikát is kezeli a felhasználói szintekhez.

### `src/services/logService.ts`

- Projekt események naplózása.
- Jelenleg konzolra ír, de bővíthető adatbázisba írással vagy értesítéssel.
