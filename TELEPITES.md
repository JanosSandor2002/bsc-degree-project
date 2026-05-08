# Projekt Telepítési és Használati Útmutató

## Rendszer áttekintése

A projekt három részből áll:

- **Backend** – Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Frontend** – React + Vite + TypeScript + Tailwind CSS
- **Mobile** – React Native + Expo

---

## Előfeltételek (globálisan szükséges eszközök)

Ezeket **egyszer kell telepíteni**, mielőtt bármelyik részhez hozzáfognál.

### 1. Node.js (v18 vagy újabb)

Töltsd le a hivatalos oldalról: https://nodejs.org

Ellenőrzés:

```bash
node -v
npm -v
```

### 2. MongoDB Community

- Töltsd le: https://www.mongodb.com/try/download/community
- Telepítés után indítsd el:

**Windows:**

```bash
mongod --dbpath "C:\data\db"
```

**macOS / Linux:**

```bash
mongod --dbpath /data/db
```

> Ha a `data/db` mappa nem létezik, hozd létre előtte: `mkdir -p /data/db`

A MongoDB alapértelmezetten a `mongodb://localhost:27017` címen fut.

### 3. Git

```bash
git --version
```

Ha nincs: https://git-scm.com/downloads

---

## Backend telepítése

### Lépések

```bash
cd backend
npm install
```

### Környezeti változók

Hozz létre egy `.env` fájlt a `backend/` mappában:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/<adatbázisnév>
JWT_SECRET=valami_titkos_kulcs
```

> **Fontos:** Az `<adatbázisnév>` helyére írd be a saját adatbázisod nevét (pl. `myapp`).

### Fejlesztői indítás

```bash
npm run dev
```

A szerver alapértelmezetten a `http://localhost:5000` címen fut.

### Tesztek futtatása

```bash
npm test
```

> A tesztek `mongodb-memory-server`-t használnak, tehát **nem kell** élő MongoDB kapcsolat a tesztek futtatásához.

---

## Frontend telepítése

### Lépések

```bash
cd frontend
npm install
```

### Fejlesztői indítás

```bash
npm run dev
```

Az alkalmazás alapértelmezetten a `http://localhost:5173` címen érhető el.

### Tesztek futtatása

```bash
npm run test        # Interaktív mód (watch)
npm run test:run    # Egyszeri futtatás
npm run test:ui     # Böngészős UI
```

### Build (éles verzió)

```bash
npm run build
```

A build kimenet a `dist/` mappába kerül.

---

## Mobil alkalmazás telepítése

### Előfeltétel: Expo CLI

```bash
npm install -g expo-cli
```

> Ha ez nem működik (jogosultság hiba), próbáld: `npx expo` paranccsal.

### Lépések

```bash
cd mobile
npm install
```

### Indítás

```bash
npm start
# vagy
npx expo start
```

Ezután az Expo Dev Tools megnyílik. Lehetőségek:

| Platform                    | Parancs                         |
| --------------------------- | ------------------------------- |
| Android emulátor            | `npm run android`               |
| iOS szimulátor (csak macOS) | `npm run ios`                   |
| Böngésző                    | `npm run web`                   |
| Fizikai eszköz              | Expo Go app + QR kód beolvasása |

> **Fizikai eszközön való teszteléshez:** Töltsd le az **Expo Go** appot (iOS App Store / Google Play), majd olvasd be a terminálban megjelenő QR-kódot.

---

## A teljes projekt indítási sorrendje

```
1. MongoDB Community fut (mongod)
2. cd backend && npm run dev
3. cd frontend && npm run dev
4. cd mobile && npx expo start
```

---

## Tipikus hibák és megoldásaik

### `MONGO_URI` nincs beállítva

**Hiba:** `MongooseError: The uri parameter to openUri() must be a string`  
**Megoldás:** Ellenőrizd a `.env` fájlt a `backend/` mappában, és győződj meg róla, hogy a `MONGO_URI` helyesen van beállítva.

### Port már foglalt

**Hiba:** `Error: listen EADDRINUSE :::5000`  
**Megoldás:** Állítsd le a másik folyamatot, vagy változtasd meg a portot a `.env` fájlban.

### Expo / Metro bundler hiba

**Hiba:** `Unable to resolve module...`  
**Megoldás:**

```bash
cd mobile
npx expo start --clear
```

### TypeScript fordítási hiba backendben

**Megoldás:**

```bash
cd backend
npx tsc --noEmit
```

### `cors` hiba a frontendnél

A backend `cors` middleware-t használ. Győződj meg róla, hogy az API hívások a frontendből a `http://localhost:5000` címre mutatnak.

---

## Könyvtárszerkezet áttekintés

```
projekt-gyökér/
├── backend/
│   ├── src/
│   │   └── server.ts       # Belépési pont
│   ├── .env                # Saját készítés!
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── mobile/
    ├── app/                # Expo Router alapú oldalak
    ├── package.json
    └── tsconfig.json
```

---

## Összefoglalás: első telepítés sorban

### Függőségek telepítése (egyszerre, a projekt gyökeréből)

```bash
npm run setup
```

Ez egyenértékű azzal, mintha kézzel mennél be mindhárom mappába és futtatnád az `npm install`-t.

Ha valamiért újra szeretnéd telepíteni az összeset (pl. verziókonfliktus esetén):

```bash
npm run reset
npm run setup
```

---

### Indítás (mindegyik külön terminálban)

```bash
# 1. MongoDB – indítsd el a mongod folyamatot (lásd fent)

# 2. Backend
cd backend
# .env fájl létrehozása (lásd fent), ha még nem tetted meg
npm run dev

# 3. Frontend
cd frontend
npm run dev

# 4. Mobil
cd mobile
npx expo start
```
