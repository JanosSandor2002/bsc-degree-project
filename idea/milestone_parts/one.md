# 1. Célkitűzés és témamegjelölés

A szakdolgozat központi témája a **JavaScript alapú webalkalmazások karbantarthatóságának vizsgálata**, különös tekintettel egy olyan projektmenedzsment rendszer fejlesztésére, amely főként szoftverfejlesztési projektek kezelésére alkalmas. Az alkalmazás fejlesztése során a modern JavaScript ökoszisztéma eszközeit használjuk, többek között:

- **React** a webes front-end komponensekhez,
- **React Native** a mobilalkalmazás platformfüggetlen felületéhez,
- **Express.js** a szerveroldali API-k és backend logika kezelésére.

A cél egy olyan rendszer létrehozása, amely nem csupán a funkcionalitás szempontjából teljes értékű, hanem a **forráskód karbantarthatóságát** és a **szoftverfejlesztési jó gyakorlatok követését** is biztosítja. A dolgozat ezért kettős fókuszú:

1. **Alkalmazásfejlesztés és prototípus-készítés:**

   - Hierarchikus projektstruktúra: TaskGroup → Task → Subtask
   - Valós idejű szinkronizáció a csapat minden tagja között
   - Gamifikáció beépítése (XP, badge, szint, prestige)
   - Kommunikációs és automatizációs funkciók (chat, log, bot)
   - GitHub integráció (issue létrehozás, státusz szinkronizáció)

2. **Karbantarthatósági vizsgálat és elemzés:**
   - A forráskód szerkezetének és modularitásának vizsgálata
   - React/React Native komponens- és állapotkezelési stratégiák elemzése
   - Express.js alapú backend architektúra áttekintése
   - A karbantarthatóság mérése és javítása a szoftverfejlesztési módszerek alkalmazásával (pl. moduláris monolit, REST/GraphQL API, tesztelhetőség)

A szakdolgozat részletesen elemzi a **projektmenedzsment rendszerek működését és típusait**, valamint összehasonlítja a piacon elérhető alternatívákat, különös tekintettel arra, hogy milyen mértékben támogatják a karbantarthatóságot és a fejlesztői workflow-t.

A dolgozat célja, hogy bemutassa, miként lehet **modern JavaScript-eszközökkel** (React, React Native, Express.js) létrehozni egy karbantartható, jól szervezett, skálázható és felhasználóbarát webalkalmazást, amely képes a **valós idejű együttműködésre és motivációs mechanizmusok beépítésére** a szoftverfejlesztési projektek menedzselése során.

A kutatás és a fejlesztés eredményeként elkészült MVP prototípus lehetővé teszi, hogy a karbantarthatóság elveit és a modern webes architektúrák gyakorlatban történő alkalmazását bemutassuk, miközben a rendszer funkcionalitása is tesztelhető, és a felhasználói élmény demonstrálható.

# Kutatási kérdések

### K1 — Hogyan integrálható a gamifikáció úgy, hogy növelje a motivációt, de ne váljon zavaróvá?

- Milyen XP görbe támogatja a hosszú távú elköteleződést?
- Hogyan kerülhető el az extrinzikus motiváció túlsúlya?
- Miként marad átlátható a gamifikáció egy komplex projektstruktúrában?

### K2 — Mely rendszerpontokon érdemes gamifikációs visszajelzést alkalmazni?

- Task státuszváltás → XP gain
- Sprint lezárása → badge, achievement
- Napi/heti aktivitás → streak rendszer
- Visszajelzési pontok gyakorisága → UX és pszichológiai hatás

### K3 — Hogyan jeleníthető meg egy többszintű projekt-hierarchia anélkül, hogy túlterhelnénk a felhasználót?

- Milyen vizuális elemek segítenek a fókusz megtartásában?
- Hogyan lehet egy nézetben kezelni mind a TaskGroup, mind a Task elemeket?
- Milyen interakciók (drag & drop, hover, expand/collapse) támogatják a gyors áttekintést?

### K4 — Hogyan biztosítható valós idejű többfelhasználós együttműködés konfliktus nélkül?

- Optimista/pesszimista frissítés
- Konfliktuskezelés → diff alapú összevetés
- Node, WebSocket, Socket.IO megoldások vizsgálata
- Mi történik hálózati késés esetén?

### K5 — Milyen architekturális modell támogatja a skálázható működést?

- Modular monolith vs microservices
- REST vs GraphQL kommunikáció
- Adatmodell (relációs vagy dokumentum alapú?)
- Mely komponensek igénylik valós idejű frissítést és melyek nem?

### K6 — Hogyan valósítható meg a GitHub szinkronizáció inkonzisztencia nélkül?

- Mely irányban áramlik az adat? (Acxor → GitHub / GitHub → Acxor)
- Hogyan történik az issue-k generálása?
- Mi történik, ha törlődik a GitHub repository?
- Hogyan marad a státusz mindig konzisztens?

### K7 — Milyen UX elemek és designelvek támogatják a használhatóságot?

- Bézier-alapú ikonrendszer
- Reszponzív grid layout
- Fókuszált nézetek, paneles elrendezés
- Minimalista vizuális hierarchia

### K8 — Hogyan mérhető a gamifikáció és a rendszer használhatósága?

- Felhasználói tesztek (A/B teszt)
- Aktivációs, megtartási és visszatérési mutatók
- Funkcióhasználati analitika
- Visszajelzés-alapú finomhangolás

# 1.2. A rendszer koncepciója (részletes, idea.md alapján kibővített)

Az Acxor három fő funkcionális pillérre épül, kiegészítve egy fejlesztői workflow modullal (GitHub integráció):

## 1. Projektkezelés

A rendszer logikája a következő hierarchiát követi:

- **TaskGroup** (Sprint vagy modul)
- **Task** (feladat)
- **Subtask** (feladat elem)

A projektkezelés fókusza:

- átlátható struktúra
- státuszkezelés (To Do / In Progress / Review / Done)
- határidők
- felelősök hozzárendelése
- real-time frissítés minden módosításra

A kezelőfelület minimalista, vizuálisan tiszta, drag & drop-képes, gyors navigációt biztosít.

## 2. Gamifikáció

A gamifikáció célja motiváció növelése és pozitív visszajelzési rendszer kialakítása:

- **XP rendszer** → minden tevékenység gazdagítható XP-vel  
  (feladat elvégzése, sprint lezárása, aktivitás)
- **Badge-ek és szintek** → vizuális reprezentáció
- **Prestige rendszer** → hosszú távú haladás
- **Értesítési forma** → non-intrusive, minimalista pop-up / panel

A gamifikáció úgy épül be, hogy ne szakítsa meg a flow élményt.

## 3. Kommunikáció és automatizáció

A rendszer kommunikációs moduljai:

- **Chat** → projekt/sprint/task szintű beszélgetések
- **Log** → minden fontos esemény naplózása
- **Bot** → automatikus értesítések és visszajelzések

Bot funkciók például:

- „Anna closed task login-ui”
- „Sprint 3 completed, XP distributed”
- „GitHub issue #14 updated”

Minden kommunikációs elem valós időben frissül.

## 4. GitHub integráció

A fejlesztői csapatok számára az Acxor összeköti a projektmenedzsment és a forráskódkezelés világát:

- Acxorban létrehozott Task → GitHub issue
- Subtask → issue
- Admin módosítások visszaszinkronizálnak GitHubra
- GitHubon állapotváltozás esetén automatikus visszaimport Acxorba
- Repository törlése esetén a projekt „lezáródik”, így biztosított a konzisztencia

A szinkronizáció alapelvei:

- **egyirányú adatáramlás feladatkapcsolatban** (Acxor → GitHub)
- **kétirányú státuszszinkron** (GitHub ↔ Acxor)
- automatikus issue név struktúra:
