# Irodalmi áttekintés és háttérkutatás

Ebben a fejezetben a szakdolgozat szempontjából releváns háttérismeretek kerülnek bemutatásra, különös tekintettel a projektmenedzsment rendszerekre, gamifikációs elméletekre, felhőalapú valós idejű szinkronizációra, modern webes és mobil technológiákra, valamint a UI/UX trendekre. A cél, hogy a szakdolgozatban kifejlesztett rendszer működése és a karbantarthatóság szempontjai megfelelő elméleti alapokra épüljenek.

## 1. Projektmenedzsment rendszerek

A projektmenedzsment rendszerek a szoftverfejlesztési folyamatok szervezésének és nyomon követésének alapvető eszközei. A legismertebb platformok közé tartozik a Jira, Trello, Asana, Redmine és Monday.com. Ezek a rendszerek különböző funkcionalitást és fejlesztési paradigma támogatást kínálnak.

### 1.1 Jira

- **Leírás**: Ipari szintű projektmenedzsment eszköz, amely támogatja az agilis, scrum és kanban módszertanokat.
- **Funkcionalitás**:
  - Részletes státusz- és workflow-kezelés
  - Backlog menedzsment, sprint planning
  - Issue tracking, bug tracking, riporting
  - Testreszabható dashboardok
- **Előnyök**: Magas szintű kontroll a komplex projektek felett, kiterjedt integrációk.
- **Hátrányok**: Kezdők számára komplex és tanulási görbéje meredek.
- **Karbantarthatóság szempontja**: Rendszer logikai modularitása segíti a fejlesztési folyamatok átláthatóságát és skálázhatóságát.

### 1.2 Trello

- **Leírás**: Vizuális drag & drop alapú projektmenedzsment, egyszerűbb workflow kezelés.
- **Funkcionalitás**:
  - Board-ok, Listák és Kártyák
  - Drag & drop státuszváltás
  - Könnyen integrálható külső szolgáltatásokkal
- **Előnyök**: Intuitív felület, gyors onboarding.
- **Hátrányok**: Nagyobb projektek esetén hiányzik a komplex státuszkezelés.
- **Karbantarthatóság szempontja**: Egyszerű, de kevésbé strukturált kód és konfiguráció; könnyű prototípus készítéshez.

### 1.3 Asana

- **Leírás**: Feladat- és projektmenedzsment rendszer, amely főleg workflow és riporting orientált.
- **Funkcionalitás**:
  - Task és Subtask kezelés
  - Határidők, felelősök hozzárendelése
  - Timeline és Dashboard nézetek
- **Előnyök**: Átlátható felület, integrált analitika
- **Hátrányok**: Gamifikáció nem beépített, csak kiegészítőkkel érhető el
- **Karbantarthatóság szempontja**: Strukturált adatmodell támogatja a kód modularitását.

### 1.4 Redmine

- **Leírás**: Nyílt forráskódú projektmenedzsment eszköz.
- **Funkcionalitás**:
  - Issue tracking
  - Gantt diagramok
  - Testreszabható workflow
- **Előnyök**: Rugalmas, bővíthető, nyílt forráskódú.
- **Hátrányok**: UI kevésbé modern, onboarding nehezebb
- **Karbantarthatóság szempontja**: Könnyen módosítható és integrálható saját backend logikával.

### 1.5 Összehasonlítás

| Rendszer | Komplexitás | Intuitivitás | Skálázhatóság | Gamifikáció támogatás | Karbantarthatóság |
| -------- | ----------- | ------------ | ------------- | --------------------- | ----------------- |
| Jira     | Nagy        | Közepes      | Nagy          | Korlátozott pluginok  | Jó                |
| Trello   | Kicsi       | Nagy         | Közepes       | Plugin-alapú          | Közepes           |
| Asana    | Közepes     | Közepes      | Közepes       | Plugin-alapú          | Jó                |
| Redmine  | Közepes     | Kicsi        | Közepes       | Egyedi bővítés        | Nagy              |

---

## 2. Gamifikációs elméletek és motivációs modellek

A gamifikáció a játékmechanizmusok alkalmazása a felhasználói aktivitás ösztönzésére nem játék környezetben.

### 2.1 Motivációs modellek

- **Intrinzik motiváció**: Belső elégedettség, szakmai fejlődés
- **Extrinzik motiváció**: Külső jutalmak (pont, badge, szint)
- **Flow elmélet**: A gamifikáció akkor hatékony, ha nem szakítja meg a munkafolyamatot

### 2.2 Gamifikációs elemek

- **XP és szintek**: Feladat teljesítéséért pontok, szintlépések
- **Badge-ek**: Vizualizált achievement-ek
- **Prestige rendszer**: Hosszú távú motiváció
- **Streak rendszerek**: Napi/heti aktivitás jutalmazása

### 2.3 Alkalmazás a szoftverfejlesztésben

- Státuszváltás (Task Done → XP)
- Sprint lezárás → Badge
- Visszajelzés → értesítések, bot üzenetek

---

## 3. Felhőalapú rendszerek és valós idejű szinkronizáció

### 3.1 WebSocket

- Állandó kapcsolat kliens és szerver között
- Azonnali frissítés minden feladatmódosításnál
- Konfliktuskezelés: optimista vs pesszimista frissítés

### 3.2 Firebase

- Backend as a Service (BaaS)
- Valós idejű adatbázis, autentikáció
- Egyszerű implementáció, de költséges nagy projektnél

### 3.3 Valós idejű szinkronizáció kihívásai

- Többszereplős adatkonzisztencia
- Diff alapú frissítés
- Hálózati késés és offline kezelés

---

## 4. Modern webes és mobil technológiák

### 4.1 React

- Komponens-alapú frontend
- Állapotkezelés: Redux, Zustand, Context API
- Virtual DOM → gyors renderelés
- Előny: moduláris kód, könnyen karbantartható
- Hátrány: Nagy projektben komplex állapotmenedzsment

### 4.2 React Native

- Mobil platformfüggetlen fejlesztés
- Natív komponensek Android és iOS
- Kód újrafelhasználás web és mobil között
- Előny: Költséghatékony, gyors prototípus
- Hátrány: Teljes natív funkcionalitás korlátozott

### 4.3 Express.js

- Minimalista Node.js backend
- REST és GraphQL API támogatás
- Middleware alapú modularitás
- Előny: Könnyen karbantartható, skálázható
- Hátrány: Nagyobb projektben szükséges architektúra tervezés

### 4.4 GraphQL / REST

- REST: egyszerű, jól ismert, URI alapú erőforrás kezelés
- GraphQL: kliens által definiált adatlekérés, csökkenti a felesleges adatforgalmat
- Skálázhatóság és API modularitás

### 4.5 Integrációk

- GitHub: issue létrehozás, státusz szinkron
- CI/CD pipeline: automatizált tesztelés, build, deploy
- Valós idejű értesítések és bot integráció

---

## 5. UI/UX trendek

### 5.1 Minimalista design

- Letisztult felületek
- Bézier alapú ikonok
- Kontrasztos, egységes színpaletta

### 5.2 Reszponzivitás

- Desktop, tablet, mobil optimalizálás
- Media queries, rugalmas grid rendszer

### 5.3 Interaktív elemek

- Drag & Drop
- Expand/collapse nézetek
- Fókuszált panelek

### 5.4 Értesítési rendszerek

- Minimalista, non-intrusive pop-up
- Gamifikációs események vizualizálása

---

## 6. Összegzés

A modern projektmenedzsment rendszerek fejlesztése a következő alapelvekre épül:

- Skálázható, moduláris architektúra
- Valós idejű együttműködés és adatkonzisztencia
- Gamifikációs mechanizmusok a motiváció növelésére
- Platformfüggetlen, karbantartható frontend és backend megoldások
- Minimalista, reszponzív és felhasználóbarát UI/UX design

Az Acxor rendszer ezekre az elvekre épül, integrálva a React, React Native, Express.js, WebSocket, Firebase, GraphQL/REST technológiákat, valamint a gamifikációs és UI/UX legjobb gyakorlatokat.
