# Szakdolgozat Terv – Acxor Projektmenedzsment Rendszer (javított változat)

## 1. Célkitűzés és témamegjelölés

### Cél

Egy közepes komplexitású, sprint-alapú, gamifikált projektmenedzsment rendszer (Acxor) megtervezése és prototípusának megvalósítása, amely ötvözi a Jira funkcionalitását és a Trello egyszerűségét.

A cél elsődlegesen egy működőképes prototípus (MVP) létrehozása, amely a fő funkciók egy részét demonstrálja (projektkezelés, feladatok, XP-rendszer), és később fokozatosan bővíthető. A dolgozat során a hangsúly a rendszer koncepcióján és működési logikáján lesz, nem pedig a véglegesített formázáson vagy designon.

### Mérföldkő

Dolgozattéma elfogadtatása a konzulenssel, a projekt céljainak és hatókörének meghatározása.  
**Kimenet:** Téma-leírás dokumentum, kutatási kérdések.

## 2. Irodalmi áttekintés és háttérkutatás

Ebben a fejezetben a kapcsolódó háttérismeretek kerülnek bemutatásra.

**Fő témák:**

- Projektmenedzsment rendszerek (Jira, Trello, Asana, Redmine stb.)
- Gamifikációs elméletek és motivációs modellek
- Felhőalapú rendszerek és valós idejű szinkronizáció (WebSocket, Firebase)
- Modern webes és mobil technológiák (React, Node.js, Flutter, GraphQL, REST API)
- UI/UX trendek (minimalizmus, reszponzivitás, drag & drop)

### Mérföldkő

Elméleti háttér kidolgozása, hivatkozások összegyűjtése.  
**Kimenet:** Irodalmi áttekintés fejezet, összehasonlító táblázat.

## 3. Rendszerkövetelmények és specifikáció

Ebben a részben kerül rögzítésre, mit tudjon az Acxor, milyen funkcionális és nem-funkcionális követelmények vonatkoznak rá.

### Funkcionális követelmények

- Projektkezelés (Sprint, Task, Subtask)
- Státuszkezelés és függőségek
- Gamifikáció (XP, szint, badge, prestige)
- Chat és bot funkció
- Wiki modul
- Jogosultsági szintek (Admin, Contributor, Viewer, Global Admin)

### Nem-funkcionális követelmények

- Felhőalapú működés, valós idejű szinkronizáció
- Platformfüggetlenség (web és mobil)
- Biztonságos hozzáférés (authentikáció)
- Skálázhatóság
- Felhasználóbarát UX

### Mérföldkő

Rendszerspecifikáció elkészítése.  
**Kimenet:** Követelmény specifikáció dokumentum, use-case diagramok, funkcionális táblázat.

## 4. Rendszertervezés (architektúra és adatmodell)

A rendszer logikai és technikai felépítésének kidolgozása.

### Architektúra

- MVC vagy MVVM modell
- Backend–Frontend kommunikáció (REST API / GraphQL)
- Realtime update megoldás (WebSocket, Firebase, Socket.IO)
- Adatbázis-struktúra (PostgreSQL vagy MongoDB)
- Gamifikációs XP-logika (képlet, XP táblázat, szintlépés algoritmus)
- Biztonság (JWT auth, role-based access control)

### Tervezési dokumentáció

- ER diagram (Project, Task, User, XP, Badge, Message, Sprint stb.)
- Komponensdiagram (Frontend modulok, Backend szolgáltatások)
- Szekvenciadiagram (pl. Task státuszváltás → Bot értesítés → XP frissítés)

### Mérföldkő

Architektúra és adatmodell véglegesítése.  
**Kimenet:** Rendszerterv dokumentum, ER és UML diagramok.

## 5. Megvalósítás (prototípus / MVP fejlesztés)

A fejlesztési folyamat, technológiai választások és a működő prototípus bemutatása.

A fejlesztés iteratív módon történik: kezdetben egy nagyon egyszerű MVP készül (pl. bejelentkezés + projekt + feladat létrehozása), majd fokozatosan bővül az új funkciókkal. A cél nem a teljes rendszer, hanem a koncepció validálása.

### Technológiai stack

- Frontend: React + Tailwind + shadcn/ui
- Backend: Node.js + Express
- Adatbázis: PostgreSQL vagy MongoDB
- Realtime: Socket.IO
- Auth: JWT vagy Firebase Authentication
- Deployment: Vercel + Render / Railway / AWS
- Konténerizálás: Docker (fejlesztés közben is)

### Fejlesztési modulok (iterációkban)

1. Alap UI és login modul – Felhasználó kezelés
2. Projektkezelő + Task/Subtask rendszer – Sprint struktúra
3. Chat + Log + Bot modul – Kommunikációs réteg
4. Gamifikációs rendszer – XP, szintek, badge-ek
5. Saját Wiki + jogosultság – Tudásbázis
6. Frontend finomítás, valós idejű szinkron – Realtime UX

### Mérföldkő

MVP működő prototípus, backend–frontend integráció.  
**Kimenet:** Prototípus (demo verzió), fejlesztési napló / Git commit log, tesztadatokkal bemutatott képernyőképek.

## 6. Tesztelés és értékelés

A fejlesztés során a "Test First" megközelítés kerül előtérbe, tehát az egységtesztek már az implementáció előtt készülnek. A fejezet a felhasználói és használhatósági tesztekre is kitér.

### Tesztelési típusok

- Egységteszt (XP számítás, státuszváltás logika)
- Integrációs teszt (bot + státusz + XP)
- Felhasználói teszt (admin, contributor, viewer)
- Használhatósági teszt (UX / UI értékelés)

### Mérföldkő

Tesztelési dokumentáció elkészítése.  
**Kimenet:** Tesztelési terv és eredmények, felhasználói visszajelzések.

## 7. Telepítés és üzembe helyezés

A rendszer fejlesztés közbeni és végső üzembe helyezésének dokumentálása.  
Kiemelt cél a fejlesztői és futtatási környezet egyszerű újratelepíthetősége konténerizálással.

### Tartalom

- Docker konténerbe csomagolás (frontend, backend, adatbázis)
- Deployment pipeline bemutatása (CI/CD, pl. GitHub Actions)
- Alapvető üzemeltetési szempontok (backup, frissítés, biztonság)

### Mérföldkő

Konténerizált, futtatható rendszer előállítása.  
**Kimenet:** Telepítési dokumentáció, Docker Compose fájl.

## 8. Összegzés és jövőbeli fejlesztések

A dolgozat lezárása és jövőbeli bővítési irányok meghatározása.

### Tartalom

- A rendszer értékelése a célokhoz képest
- Összevetés a versenytársakkal (Jira, Trello stb.)
- Fejlesztési lehetőségek:
  - Mobil app natív verzió (React Native / Flutter)
  - API integráció (GitHub, Slack stb.)
  - Automatikus projekt-riportok és statisztikák
  - Open source vagy SaaS modell véglegesítése

**Kimenet:** Zárófejezet, jövőbeli roadmap.

## Mérföldkövek röviden (6 hónapos ütemterv)

1. hónap – Téma kiválasztás, konzulenssel egyeztetés (elfogadott téma)
2. hónap – Irodalmi kutatás, versenytársak elemzése (irodalmi fejezet)
3. hónap – Rendszerkövetelmények és UML (specifikáció kész)
4. hónap – Architektúra és adatmodell kidolgozása (rendszerterv kész)
5. hónap – Fejlesztés és prototípus (MVP működik)
6. hónap – Tesztelés, dokumentálás, telepítés, lezárás (végleges dolgozat)

## Javasolt fejezetszerkezet

1. Bevezetés
2. Irodalmi áttekintés és piaci kontextus
3. Követelmények és célok
4. Rendszerterv (architektúra, adatmodell, folyamatábrák)
5. Megvalósítás és technológiai leírás
6. Tesztelés és értékelés
7. Telepítés és üzembe helyezés
8. Összegzés és jövőbeli fejlesztések
9. Forrásjegyzék
10. Mellékletek (képernyőképek, kódrészletek, UML-diagramok)
