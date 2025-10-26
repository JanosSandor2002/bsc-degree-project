## Név

**Acxor** – Modern projektkezelő alkalmazás programozó csapatok számára.

## Leírás

Az **Acxor** egy **Jira-hoz hasonló, de egyszerűbb és felhasználóbarátabb** projektmenedzsment eszköz, amely **weben és mobilon egyaránt elérhető**.  
Kifejezetten a programozó csapatok munkájának támogatására készült, lehetővé téve a projektek áttekinthetőségét, a feladatok priorizálását és a csapatok közötti hatékony kommunikációt.

Az alkalmazásban a projektek **sprint-alapú struktúrában** szerveződnek, így a csapatok feloszthatják a munkát **taskokra és subtaskokra**, miközben a függőségi sorrend automatikusan biztosítja, hogy **egy feladat csak az előző teljesítése után kezdhető el**. A felhasználói felület egyszerű, de hatékony, így a csapat minden tagja gyorsan hozzáférhet a projektekhez, nyomon követheti a haladást, és valós időben értesülhet a változásokról. Kis-közép méretű projektekhez ideális, hol kulcsfontosságú lehet a flexibilitás a projekt-feladatok létrehozásában.

## Erősségek

- **Közepes komplexitás:** Többet tud, mint a Trello, de nem olyan bonyolult, mint a Jira.
- **Sprint-alapú munkafolyamat:** Minden projekt alapértelmezett sprint, amely strukturált feladatkezelést tesz lehetővé.
- **Task és Subtask kezelés:** Függőségi sorrend biztosítja a logikus haladást.
- **Web és mobil kompatibilitás:** Az alkalmazás minden eszközről elérhető.
- **Egyszerű, vizuális felület:** Drag & drop támogatás, gyors áttekinthetőség.
- **Valós idejű értesítések és státuszkövetés:** A csapat mindig naprakész marad.

## Kinézet

- Modern UI/UX kialakítás, ikonok használata, hover-nél pedig név mező kiírása
- Függőlegesen baloldalt és vízszintesen felül is helyezkednek el ikonok
- Hero Logo a két sáv találkozásánál

### Sávok elrendezése és alapvető információk

- A sávok (bal oldali + felső vízszintes menü) csak a kiválasztott projektre érvényesek, tehát projektspecifikusak,
  de maga a sávstruktúra és a navigációs logika globális, vagyis minden projekt esetén ugyanaz a felépítés.

#### Működés logikája

A Hero Logo és az általános információs lapok (pl. főoldal, wiki, sablonprojektek, kapcsolatfelvétel) minden projektre érvényesek, tehát globálisak.

Az alatta lévő funkcionális ikonok (Main, K, C, G) csak az aktívan kiválasztott projektre vonatkoznak.

A felhasználó projektváltáskor (pl. legördülőből másik projektet választ) a bal oldali ikonok ugyanazokat a nézeteket mutatják, de már az új projekt adataival.

### Függőleges sáv

#### Hero Logo ikon

Elsődleges oldal a weboldal/alkalmazás megnyitásakor. Itt helyezkednek a az alapvető információk az oldalról, külön lapok az oldal ismertetéséről, a bejelentkezés/regisztrációhoz, önálló wikihez, pár sablon projekthez ami majd ezzel a szoftverrel fog készülni, illetve a contact felület az oldal alján, ami minden résznél lesz.

![Koncepciós kép](./images/heromenu.png)

#### Főmenü ikon

Itt a majd kiválasztott projectről lesz minden információ, aminek elengedhetetlen része a bejelentkezett felhasználó és hogy a projekthez csatlakozva legyen. Felszínesebben átláthatóbb a projekt részei, mely feladatok vannak készen és melyeken dolgoznak, határidők, hatékonyság statisztika arról, ki mennyit foglalkozott eddig az adott feladatokkal esetleg.

![Koncepciós kép](./images/mainmenu.png)

#### K ikon

A Kanban táblázatos nézetet nyitja meg, ami abban a nézetben fogja felvázolni a projektet az egyes feladatokkal, hogy mi hogyan kapcsolódik egymáshoz kisebb relációs eljárásokkal, melyek jelzik a subtask hierarchiát is.

![Koncepciós kép](./images/kanban.png)

#### C ikon

Az előbb leírtak modelnézete, csak Scrumban

![Koncepciós kép](./images/scrum.png)

#### G ikon

A gamifikáció oldalát nyitja meg, ahol ránézhetünk a contributorok teljesítményére. Ki milyen szinten áll, mennyi xp-je van, milyen badge-jei, és kb. mennyi xp-t fog eddig bezsebelni a projektből(Versengést idézhet elő azért a plusz 10xp-ért a projekt végére motiválva a felhasználókat a munkára)

![Koncepciós kép](./images/gamification.png)

### Vízszintes sáv

#### Plan

Itt jelennek meg a határidők az egyes részekhez, ami segít jobban átlátni, hogy mely részt mikorra kell elvégezni. Látható ki mely feladatokhoz van rendelve, és hogy ki hogy halad a feladatokkal. Illetve majd itt lehet törölni a projektet admin által.

![Koncepciós kép](./images/plan.png)

#### Tasks

A saját feladatainkat láthatjuk itt és itt tudunk visszajelzést küldeni, hogy hogyan állunk a feladatainkkal. Visszajelzés lehet work in progress, ready, starting to do, need help. A feladatokat határidő alatt soroljuk fel látva, mely feladattal kell kezdeni.

![Koncepciós kép](./images/tasks.png)

Előnyös lehet, ha minden fő feladatunkkal készen vagyunk időben.

#### SubTasks

Ugyanaz, mint a Tasks fül csak a mellékfeladatokkal.

![Koncepciós kép](./images/subtasks.png)

#### Log

Külön fül egy globális chathez, amire a felhasználók tudnak írni szövegesen, illetve egy bot fogja ide beírni, hogy ki mit kezdett el csinálni és ha állapotváltozás van(pl:task ready lett) kiírja azt is dátummal együtt, hogy segítse nyomon követni a munkálatokat mindenki által.

![Koncepciós kép](./images/log.png)

##### Chat bot

A chatbot a következőkről ír visszajelzést:

- Elkészült a projekt a kezdésre
- Minden feladat ki lett adva
- Valaki started-nek/Work in Progress-nek/Need Help-nek/Ready-nek jelez valamilyen feladatot/mellékfeladatot
- Valaki kész van minden munkájával
- Admin visszadob egy feladatot, ami nem jó, hogy a feladat felelőse újból csinálja meg, javítsa
- Projekt összes feladata sikeresen elkészült(Csak akkor írja ki, ha az admin sikeresnek zárja le a projektet)

#### Project név

Itt található a projekt neve, leginkább kiválasztásra alkalmas legördülő fül jelenik meg a rákattintásnál.

![Koncepciós kép](./images/project.png)

#### User ikon

Itt több mindent tudunk megnyitni a legördülő listából:

- Karakter
- Projektlétrehozás
- Bejelentkezés/Regisztráció vagy Kijelentkezés

![Koncepciós kép](./images/user.png)

##### Karakter

Bejelentkezést követően elérhető a fül, itt a nevünket, Emailünket, jelszavunkat, karakter képünket és a badge alapján szerezhető kereteket állíthatjuk be

![Koncepciós kép](./images/character.png)

##### Projektlétrehozás

Ezen fülön tudjuk beállítani az új projekt nevét, határidejét, a contributorokat hozzáadni, a feladatokat létrehozni határidő alapján, maximum a sub task-oknál kell jelezni majd, melyik taskhoz kötődik, minden más automatikusan felépül majd az iterációban.

![Koncepciós kép](./images/newproject.png)

##### Mails (Levelek)

Ezen fülön tudjuk megnézni a bejövő leveleket, illetve írhatunk levelet másoknak.

![Koncepciós kép](./images/mails.png)

##### Bejelentkezés/Regisztráció

Alapvető főoldalon és ezen a fülön tudjuk magunkat oda írányítani, ahol regisztrálhatunk vagy bejelentkezhetünk. Alapvető email-felhasználó név-jelszó + hitelesítő kód emailre megoldás.

![Koncepciós kép](./images/login.png)

##### Kijelentkezés

A fiókból kijelentkezünk, hogy bejelentkezhessünk egy másikkal, vagy majd később újra a sajátunkba.

#### Feladat Státuszai

- **Starting:** A feladat létre lett hozva, de a munka még nem kezdődött el.
- **To Do:** A projekt elindulásakor kerül ebbe az állapotba; a feladat elkezdésre vár.
- **Help Needed:** A feladat elakadt, és a felhasználó segítséget kér.
- **Review:** A feladat elkészült, ellenőrzésre és jóváhagyásra vár.
- **Done:** A feladat teljesen elkészült és jóváhagyott.

![Koncepciós kép](./images/state.png)

### Saját Wiki

Az **Acxor Saját Wiki** modulja egy **beépített, zárt tudásbázis**, amely a rendszerhez és a projektekhez kapcsolódó dokumentációk, útmutatók és leírások központi tárhelyeként szolgál.  
A célja, hogy minden felhasználó számára **átlátható, egységes és hiteles információforrást** biztosítson, miközben a tartalom kezelése kizárólag a kijelölt adminisztrátorok hatáskörébe tartozik.

#### Fő jellemzők

- **Szerkesztési jogosultság:**  
  Csak a **Globális Admin** (rendszeradminisztrátor) jogosult a wiki tartalmának létrehozására, szerkesztésére és törlésére.  
  Minden más felhasználó (beleértve a Project Adminokat, Contributorokat és nézőket) **csak olvasási jogosultsággal** rendelkezik.

- **Tartalmi struktúra:**  
  A wiki oldalai kategóriákba rendezve jelennek meg (pl. „Használati útmutató”, „Rendszerleírás”, „Sablonprojektek”, „Szabályzatok”).  
  Minden bejegyzéshez metaadatok (pl. létrehozás dátuma, szerkesztő, verzió) tartoznak, így könnyen követhető a frissítések története.

- **Célja és funkciója:**

  - A rendszer működésének, használatának és fejlesztési elveinek dokumentálása.
  - Központi tudásbázis a felhasználók és fejlesztők számára.
  - Segítség az új felhasználók betanításában és a projektek egységes működésének fenntartásában.
  - Hivatkozások, képek és példák formájában részletes magyarázatokat tartalmazhat.

- **Elérhetőség:**  
  A wiki minden bejelentkezett felhasználó számára **globálisan elérhető és olvasható**, függetlenül attól, hogy mely projektekhez tartozik.

#### Összegzés

Az Acxor Saját Wiki egy **önálló, belső „miniwikipédia”**, de **nem közösségi szerkesztésű**.  
Feladata, hogy egységes, hiteles és központilag karbantartott tudásbázist nyújtson, amely biztosítja a rendszer átláthatóságát, a projektfolyamatok követhetőségét, valamint az új felhasználók gyors beilleszkedését.

### Célközönségi flexibilitás

Az **Acxor** fejlesztése során kiemelt szempont a **célközönségi flexibilitás**, vagyis hogy a rendszer **különböző felhasználói típusokhoz és munkastílusokhoz** egyaránt képes alkalmazkodni.  
Ez azt jelenti, hogy az alkalmazás nem csak egy konkrét szakmai rétegre (pl. fejlesztőcsapatokra) korlátozódik, hanem bármilyen együttműködést, projektalapú munkát vagy tanulási folyamatot képes támogatni.

- **Szoftverfejlesztési projektek**

  - Fejlesztési sprint-ek kezelése
  - Hibajegyek, backlogok és kódfejlesztési folyamatok nyomon követése

- **Oktatási és tanulási projektek**

  - Tanfolyamok, vizsgák, modulok vagy tananyagok követése
  - XP és badge alapú motiváció diákok számára (pl. “tanulási gamifikáció”)

- **Kutatási projektek**

  - Feladatok, határidők, adatgyűjtési folyamatok koordinálása
  - Jegyzetek és dokumentációk tárolása a beépített wiki modulban

- **Kreatív és művészeti projektek**

  - Közös tartalomkészítés (zene, design, írás, videó) feladatokra bontva
  - Csapaton belüli együttműködés és értékelés

- **Vállalati és irodai munkafolyamatok**

  - Belső folyamatok, kampányok, HR-feladatok vagy adminisztratív teendők kezelése
  - Projektek közötti XP- és teljesítmény-összehasonlítás

- **Közösségi vagy nonprofit projektek**

  - Önkéntes munkák, eseményszervezések, adománygyűjtések koordinálása
  - Résztvevők motiválása badge-ekkel és elismerésekkel

- **Személyes célmenedzsment**
  - Saját fejlődési vagy produktivitási célok követése
  - Mindennapi feladatok “játékszerű” rendszerezése XP-k és szintek alapján

#### Jellemzői:

- **Rugalmas felépítés:** a felhasználók igényei szerint alakítható, legyen szó céges, oktatási vagy közösségi projektről.
- **Szerepalapú működés:** a rendszer különböző szerepköröket (pl. admin, contributor, viewer) biztosít, így mindenki a számára releváns funkciókat látja.
- **Skálázható komplexitás:** egyszerű feladatkezelőként és nagyobb projektmenedzsment rendszerként is használható.

A cél, hogy az Acxor ne egy szűk felhasználói réteget szolgáljon ki, hanem **széles körben testreszabható legyen**, alkalmazkodva a felhasználók működéséhez és igényeihez.

### Letisztultabb kinézet

Az Acxor felülete **minimalista, modern és funkcionálisan átgondolt**.  
A „letisztultabb kinézet” azt jelenti, hogy a felhasználói élmény középpontjában az **áttekinthetőség, gyors navigáció és vizuális egyensúly** áll.  
Nem a felesleges grafikai elemek dominálnak, hanem a tartalom, a struktúra és a könnyű használhatóság.

#### Kiemelt jellemzők:

- Egységes színpaletta és ikonrendszer.
- Reszponzív, jól olvasható tipográfia.
- Funkcióközpontú elrendezés, kevés vizuális zajjal.
- A gamifikációs elemek (badge-ek, szintek, XP) vizuálisan megjelennek, de nem zavarják a munkát.

A letisztult dizájn segíti a fókuszált munkavégzést, miközben **esztétikus, professzionális megjelenést** biztosít minden platformon.

### Online működés

Az **Acxor** kizárólag **online működésre** tervezett rendszer, ami azt jelenti, hogy minden adat, projekt, kommunikáció és tevékenység **felhőalapon** zajlik, és **valós időben szinkronizálódik** az összes felhasználó között.  
Ez biztosítja az azonnali együttműködést, a naprakész információkat és az adatok folyamatos elérhetőségét.

#### Fő jellemzők:

- **Valós idejű frissítés:**  
  Minden feladat, státuszváltozás, XP-gyűjtés és üzenet azonnal megjelenik minden csapattag felületén.

- **Központi adattárolás:**  
  Az összes adat biztonságosan a felhőben kerül tárolásra, így nincs szükség helyi mentésre vagy manuális szinkronizálásra.

- **Közvetlen kommunikáció:**  
  Az online működés lehetővé teszi a **Global Chat**, értesítések és projekt-hozzászólások valós idejű használatát.

- **Böngésző és mobil kompatibilitás:**  
  Az Acxor webes és mobilfelületei is folyamatos internetkapcsolatot igényelnek, így az információk mindig naprakészek maradnak.

- **Biztonságos hozzáférés:**  
  A bejelentkezés, jogosultságkezelés és adatvédelem teljes mértékben a szerveroldalon zajlik, ezáltal az adatok integritása és biztonsága garantált.

#### Előnyök:

- Minden projekt és kommunikáció **egy központi rendszerben** történik.
- A csapattagok **valós időben dolgozhatnak együtt**, bárhonnan és bármilyen eszközről.
- Az adatok elvesztésének kockázata minimális, hiszen minden a felhőben kerül tárolásra.

## Szerepkörök

- Az Acxor három fő szerepkört különböztet meg projektszinten, valamint egy negyediket globális rendszerszinten.
  A szerepkörök jogosultsági szintekre épülnek, és meghatározzák, ki mit láthat, módosíthat vagy hozhat létre az alkalmazásban.

![Use-Case Diagram](./images/usecase.png)

### Project Admin

- A projekt létrehozója automatikusan admin lesz.
- Teljes hozzáférése van az adott projekthez.
- Feladata: a projekt struktúrájának kezelése, tagok hozzáadása, sémák, határidők és státuszok beállítása.

**Jogosultságai:**

- Projekt létrehozása / módosítása / törlése
- Felhasználók hozzáadása, eltávolítása, jogosultság módosítása
- Taskok, Subtaskok, Sprintek létrehozása és kiosztása
- Task státuszok visszavonása (“visszadobás”)
- Projekt zárása és XP kiosztás megerősítése
- Chat-bot üzenetek validálása (pl. projekt lezárásakor)

### Contributor (Közreműködő)

- A projekt aktív tagja, aki feladatokat kap és azokon dolgozik.
- Felelős saját taskjaiért, státuszuk frissítéséért és a projekt előrehaladásáért.
- Részt vesz a csapatkommunikációban és a gamifikációban.

**Jogosultságai:**

- Saját taskok és subtaskok megtekintése, státusz módosítása
- Új subtask javaslása
- Kommunikáció a Log / Chat felületen
- Saját teljesítmény statisztika és XP megtekintése
- Badge-ek és szintek követése

### Viewer (Megfigyelő – opcionális)

- Csak olvasási joggal rendelkezik az adott projekthez.
- Ideális külső érdeklődők, ügyfelek vagy oktatók számára.
- Nem tud módosítani, csak betekintést nyer a projekt állapotába.

**Jogosultságai:**

- Projektadatok (dashboard, Kanban, Scrumban, Gamification) megtekintése
- Nincs módosítási jog
- Nincs chat hozzáférés
- Statisztikák és előrehaladás olvasása

### Global Admin (Rendszerszintű admin)

- A teljes Acxor rendszer kezelője, nemcsak egyetlen projekthez kötődik.
- Felelős minden projekt, felhasználó és beállítás felügyeletéért.
- Fő célja a rendszer működésének fenntartása és karbantartása.

**Jogosultságai:**

- Összes projekt és felhasználó megtekintése és módosítása
- Globális beállítások kezelése (pl. XP-szabályok, integrációk, licenc)
- Inaktív projektek archiválása vagy törlése
- Felhasználók felfüggesztése, jogosultság módosítása
- Teljes rendszerstatisztika és riportok megtekintése
- Gamifikációs rendszer paramétereinek beállítása
- Hibák és visszaélések kezelése

## Gamification

Az **Acxor** motivációt és élményt ad a feladatkezeléshez:

- **Pontozás és teljesítmény jelzés:** Minden teljesített task és subtask növeli a csapattag pontszámát.
- **Teljesítési szintek:** Sprint vagy projekt lezárása után a csapat és az egyének “achievementeket” kapnak.
- **Vizualizált haladás:** Színes státuszjelzők és haladási sávok ösztönzik a folyamatos munkát.
- **Class-ok bevezetése:** Bizonyos szintektől újabb és újabb osztály kitüntetéseket lehet szerezni, amikhez egyedi háttérképet kapnak a felhasználók.

**Szinteződés**

Az Acxor projektmenedzsment rendszerében a gamifikáció célja a felhasználók motiválása és a csapattagok aktivitásának ösztönzése. A rendszer az alábbi logikára épül:

### Prestige és szintkövetelmény

Minden szintlépés XP-követelménye a következő képlettel számolható:

**XP required = 20 + (next_level \* 10) + (prestige*level * 10)**

- **Prestige 0, Level 1:** 20 + (2 \* 10) + (0 \* 10) = 40 XP
- **Prestige 1, Level 1:** 20 + (2 \* 10) + (1 \* 10) = 50 XP

Ez a képlet minden szintnél érvényes, így a prestige szint növeli az XP követelményt a további szintekhez.

#### XP pontok

- **Task teljesítése:** +5 XP
- **SubTask teljesítése:** +3 XP
- **Sprint / projekt lezárása:** +30 XP
- **Legjobb teljesítmény:** A legtöbb pontot gyűjtő contributor további +10 XP-t kap.

#### Szintek és szintlépés

- Minden felhasználó **level 1**-ről indul.
- Szintlépéskor az aktuális XP-ből mindig levonásra kerül a következő szinthez szükséges érték.
- Például:
  - Level 1 → Level 2 (Prestige 0): 20 + (2\*10) + (0\*10) = 40 XP
  - Level 4 → Level 5 (Prestige 0): 20 + (5\*10) + (0\*10) = 70 XP

#### Badge-ek

- Különleges szinteknél (5, 10, 15, 20, 25, 30, 35, 40, 45, 50) badge-ek szerezhetők.
- A badge-ek **háttérképként is használhatók**, és minden megadott szintfordulónál a játékos választhat 3 különböző **class** közül, amelyek egyedi hátteret biztosítanak.
  - Példa: **Level 5** → választható osztályok: Freelancer, Swordsman, Archer.

#### Prestige rendszer

- Minden **50. szintnél** a felhasználó prestige-t érhet el, ami új határokat ad a profilhoz.
- A prestige célja a hosszú távú játékosság fenntartása és a profil vizuális kiemelése.

| Prestige | xp before leveling | Level before +60 xp | xp after leveling with +60 xp                         | Level after +60xp                         |
| -------- | ------------------ | ------------------- | ----------------------------------------------------- | ----------------------------------------- |
| 1        | 0                  | 1                   | 60-[(20+2\*10)+(1*10)]= 10                            | 2                                         |
| 2        | 40                 | 3                   | 100-[(20+4\*10)+(3*10)]= 10                           | 4                                         |
| 0        | 30                 | 1                   | 90-[(20+2\*10)+(0*10)]= 50-> [50-(20+3\*10)+(0*10)]=0 | 3 (Két szintet is léphetünk elég ponttal) |

## Összehasonlítás más szoftverekkel

Az Acxor összevetése a meglévő projektmenedzsment rendszerekkel (pl. Trello, Jira, Asana) valóban erős alapot ad, de a kiegyensúlyozottabb elemzéshez érdemes lesz olyan funkciókat és jellegzetességeket is beemelni, amelyek ezekben a rendszerekben nem, vagy csak korlátozott formában érhetők el.

Ilyen egyedi elemek lehetnek például:

- Egyszerű, vizuálisan letisztult felület, ami nem terheli a felhasználót felesleges opciókkal
- Valós idejű státuszfrissítés és kommunikáció a feladatok szintjén (nem csak projektszinten)
- Integrált gamifikációs rendszer, ami XP-t és szinteket rendel a felhasználói aktivitáshoz
- Chat-bot funkció, amely segíti a projektkoordinációt és a feladatok automatikus frissítését
- Közvetlen feladatfüggőségek kezelése (Task → SubTask → Sprint kapcsolat)
- Egységes, gyors, projektalapú sávnavigáció, amely egyszerre átlátható és konzisztens
- Rugalmas szerepkör- és jogosultságkezelés, beleértve a projektszintű adminisztrációt
- Átfogó visszajelzési és XP-kiosztási rendszer, amely ösztönzi a felhasználói aktivitást

Ezek az elemek segítenek abban, hogy az Acxor nemcsak alternatíva, hanem kifejezetten innovatív megoldás legyen a piacon.  
A végleges összehasonlító táblázatban így mind a meglévő funkciók (feature parity), mind az egyedi előnyök (unique value) egyértelműen láthatóvá válnak.

| Funkció / Jellegzetesség                             | **Trello**                              | **Jira**                         | **Acxor**                                       |
| ---------------------------------------------------- | --------------------------------------- | -------------------------------- | ----------------------------------------------- |
| **Célközönség**                                      | Általános felhasználók, kisebb csapatok | Nagyvállalati fejlesztőcsapatok  | Közepes méretű fejlesztőcsapatok                |
| **Felület típusa**                                   | Egyszerű, kártyás (Kanban)              | Részletes, moduláris UI          | Letisztult, modern, kombinált (Kanban + Scrum)  |
| **Projektstruktúra**                                 | Lapos táblaalapú                        | Hierarchikus (Epic–Task–Subtask) | Sprint-alapú, automatikusan generált hierarchia |
| **Task/Subtask rendszer**                            | ✅ Egyszerű kártyák                     | ✅ Részletes, státuszalapú       | ✅ Függőségi logikával bővített                 |
| **Függőségi rendszer**                               | ❌ Nincs                                | ⚪ Plugin szükséges              | ✅ Beépített lineáris függőségek                |
| **Scrum támogatás**                                  | ❌                                      | ✅ Teljes                        | ⚪ Egyszerűsített sprint logika                 |
| **Kanban támogatás**                                 | ✅                                      | ✅                               | ✅ Dinamikus, kapcsolt a Scrum nézettel         |
| **Gamifikáció (XP, szintek, badge-ek)**              | ❌                                      | ❌                               | ✅ Beépített, motivációs rendszer               |
| **Chat / Kommunikáció**                              | ⚪ Kártyaszintű kommentek               | ⚪ Taskszintű kommentek          | ✅ Globális Log + Chat-bot rendszer             |
| **Chat-bot aktivitásfigyelés**                       | ❌                                      | ⚪ Külső integrációval           | ✅ Automatikus státuszjelentés és projektzárás  |
| **Valós idejű frissítés / értesítések**              | ⚪ Részben (plugin)                     | ✅ Teljes                        | ✅ Beépített, task-szintű értesítések           |
| **Felhasználói statisztikák és teljesítménymérés**   | ❌                                      | ✅ Jelentések és diagramok       | ✅ XP alapú teljesítményrendszer                |
| **Integráció más eszközökkel (GitHub, Slack, stb.)** | ✅ Széleskörű                           | ✅ Széleskörű                    | ⚪ Teljesen Git                                 |
| **Feladatállapotok testreszabása**                   | ⚪ Egyszerű címkékkel                   | ✅ Workflow konfiguráció         | ⚪ Egyszerűsített státuszrendszer               |
| **Adminisztrációs jogosultságkezelés**               | ⚪ Egyszerű (board admin)               | ✅ Részletes, szervezeti szintű  | ✅ Projektszintű, rugalmas szerepkörök          |
| **Automatizálás**                                    | ⚪ Alap szinten (Butler)                | ✅ Szabályalapú automatizmus     | ⚪ Egyszerű eseménylogika (pl. státuszváltás)   |
| **Mobil- és webtámogatás**                           | ✅ Teljes                               | ✅ Teljes                        | ✅ Reszponzív, platformfüggetlen                |
| **Open source / zárt modell**                        | ⚪ Részben zárt                         | ❌ Zárt                          | ⚪ Tervezés alatt (nyílt alap)                  |
| **Cél: egyszerűség vagy komplexitás**                | ✅ Egyszerű                             | ❌ Komplex                       | ⚪ Kiegyensúlyozott – “középutas” megoldás      |

**Összegzés:**

- A **Trello** az egyszerűségre épít, de korlátozott funkcionalitással bír.
- A **Jira** vállalati szintű, részletes, de bonyolult a beállítása és használata.
- Az **Acxor** a kettő közötti “középutas” megoldás: vizuális, gyors, de fejlesztői csapatokra optimalizált, saját függőségi és gamifikációs rendszerrel.

### PlatformFüggetlenség

Az **Acxor** teljes mértékben platformfüggetlen, így **weben és mobilon egyaránt** elérhető.

- **Web:** Teljes funkcionalitás, beleértve a projektek kezelését, taskok és subtaskok létrehozását, sprint-kezelést, gamifikációs elemeket és fájl feltöltést.
- **Mobil:** Elsősorban a projekt **követhetőségének** és a gyors visszajelzésnek a támogatására készült. A mobilalkalmazásban lehetőség van:
  - Task státuszok gyors frissítésére
  - **Global chat** használatára
  - Fájlok feltöltésére és megosztására

A mobil verzió célja, hogy a csapattagok mindig naprakészen követhessék a projekt előrehaladását, és gyorsan kommunikálhassanak, miközben a fő munka továbbra is a webes felületen történik.

### Hasonlóságok a Jira-val

#### Sprint-alapú munkavégzés

Az Acxor, a Jira-hoz hasonlóan, iterációkban (sprintekben) kezeli a projekteket.  
Minden projekthez meghatározható határidő, backlog, tasklista és státusz.  
A sprint csak akkor zárható le, ha minden feladat és alfeladat befejeződött.

#### Task–Subtask hierarchia

Akárcsak a Jira-ban, az Acxorban is minden fő feladat (task) felbontható subtaskokra, melyek részfeladatokat képviselnek.  
A státuszkezelés és a progressz-jelzés a Jira logikáját követi: **To Do → In Progress → Done**.

#### Projekt-specifikus statisztikák és felhasználói aktivitás

Az alkalmazás megmutatja, hogy ki mennyi időt töltött el egy feladattal, és milyen arányban vett részt a projektben.  
Hasonló a Jira “Reports” és “Velocity Chart” funkcióihoz, csak leegyszerűsítve és vizuálisabban.

#### Kanban nézet

Az Acxor is biztosít egy oszlopokra bontott, kártyás (Kanban) nézetet, ahol a feladatok státusz szerint rendeződnek.

### Hasonlóságok a Trello-val

#### Egyszerű, vizuális kezelőfelület

Az Acxor a Trello-hoz hasonlóan minimalista és intuitív, hogy a felhasználók technikai ismeretek nélkül is könnyen átlássák a projektet.  
A Kanban-board elrendezés, a kártyák és oszlopok rendszere a Trello inspirációjára készült.

#### Drag & Drop interakció

A taskok mozgatása és státuszváltása egyszerű kattintással vagy húzással történik.  
A vizuális visszajelzések (színek, ikonok, animációk) a Trello-hoz hasonlóak.

#### Web és mobil kompatibilitás

Mindkettő platformfüggetlen: böngészőből és mobilról is teljes értékűen használható.  
Az Acxor UI-ja a Trello mobil-egyszerűségét veszi alapul, de kiegészíti több adminisztratív funkcióval.

### Ami az Acxorban más, mint a Jira és a Trello

#### Függőségi rendszer – lineáris task logika

Az Acxor bevezeti azt a szabályt, hogy egy feladat csak akkor kezdhető el, ha az előző teljesült.  
Ez a funkció sem a Trello-ban, sem a Jira-ban nem alapértelmezett (Jira-ban plugin kell hozzá).  
Ennek köszönhetően a fejlesztési folyamat szekvenciálisan és kontrolláltan halad előre.

### Projektmenedzsment összehasonlítás (Redmine, Trac, Taskwarrior)

Az Acxor a közepes komplexitású fejlesztői csapatok számára készült, kiemelten figyelve a vizualitásra, egyszerűségre és motivációs rendszerekre. Összehasonlításképpen bemutatjuk a Redmine, Trac és Taskwarrior főbb jellemzőit:

| Funkció / Eszköz               | Acxor                        | Redmine                   | Trac                              | Taskwarrior              |
| ------------------------------ | ---------------------------- | ------------------------- | --------------------------------- | ------------------------ |
| Webes felület                  | ✅ Modern, vizuális UI       | ✅ Webes, részletes       | ✅ Webes, minimalista             | ❌ CLI alapú             |
| Sprint/Iteration kezelés       | ⚪ Egyszerű                  | ✅ Teljes                 | ❌ Nincs                          | ❌ Nincs                 |
| Kanban board                   | ✅ Beépített                 | ⚪ Plugin szükséges       | ❌ Nincs                          | ❌ Nincs                 |
| Gamifikáció (XP, szint, badge) | ✅ Beépített                 | ❌ Nincs                  | ❌ Nincs                          | ❌ Nincs                 |
| Chat/Log                       | ✅ Globális, automatikus bot | ⚪ Csak jegyekhez komment | ⚪ Wiki / jegy alapú kommunikáció | ❌ Nincs                 |
| Testreszabható workflow        | ⚪ Egyszerű                  | ✅ Részletes              | ⚪ Limitált                       | ⚪ Parancssori scripting |
| Többprojekt-kezelés            | ⚪ Egyszerű                  | ✅ Igen                   | ✅ Igen                           | ❌ Nincs                 |

#### Részletezés: miben más az Acxor

1. **Gamifikáció és motiváció**: Az Acxor integrált XP-, szint- és badge-rendszere ösztönzi a felhasználókat a feladatok teljesítésére, míg a Redmine, Trac és Taskwarrior nem rendelkezik ilyen beépített motivációs elemekkel.
2. **Vizualitás és valós idejű értesítések**: Acxorban a Kanban és Scrum nézetek vizuálisan mutatják a feladatok állapotát, a Log és chat-bot automatikusan jelzi a státuszváltozásokat. Más rendszerekben (különösen Taskwarriorban és Tracban) ilyen vizuális és valós idejű integráció nincs.
3. **Egyszerűsített sprint/iteration kezelés**: Míg a Redmine teljes Scrum támogatást kínál, az Acxorban egyszerűbb, gyorsan áttekinthető sprint logika található, ami kisebb csapatoknak ideális.
4. **Integrált kommunikáció**: Az Acxorban a chat-log és a bot együttműködik a projekt állapotával, így minden csapattag naprakész. Redmine és Trac esetén a kommunikáció inkább jegy- vagy wiki-szintű, nem globális.
5. **Egységes és gyors bevezetés**: Új projekt létrehozásakor az Acxor automatikusan felépíti a sprint-alapú struktúrát és a task/subtask hierarchiát, minimalizálva a manuális konfigurációt, ami Redmine-ban és Tracban több beállítást igényel.

Összességében az Acxor a vizuális áttekinthetőség, motivációs elemek és gyors bevezethetőség terén kínál újszerű megoldást, miközben közepes komplexitású projektekhez ideális.

#### Gamifikációs rendszer

Egyedülálló elem az Acxorban:

- Minden task és subtask elvégzése XP-t ad.
- A felhasználók szintet lépnek, badge-eket kapnak, és teljesítmény szerint rangsorolhatók.  
  Ez motiválja a csapatokat, hogy aktívabbak és pontosabbak legyenek a határidők betartásában.  
  A Jira és Trello nem tartalmaz ilyen integrált motivációs rendszert.

#### Kettős nézet: Scrum és Kanban egyben

Az Acxorban a felhasználó egy kattintással válthat a Kanban és Scrum nézet között.  
Míg a Jira külön projekttípust kér a Scrum és Kanban boardhoz, az Acxor egyesíti a kettőt.  
Ez egyszerűsíti a kezelést: ugyanaz a projekt idő-alapú (Scrum) és folyamat-alapú (Kanban) módon is követhető.

#### Integrált kommunikáció (Log & Chat bot)

A Jira-ban a kommentek task-szinten történnek, míg a Trello-ban a kártyán belül.  
Az Acxor ehelyett egy globális kommunikációs panelt (Log) és egy intelligens botot használ, amely automatikusan jelzi:

- ha valaki új feladatot kezd,
- ha változott egy státusz,
- ha az admin visszadobott egy hibás feladatot,
- vagy ha a projekt lezárult.  
  Ez valós idejű transzparenciát ad az egész csapatnak.

#### Egységes projektstruktúra és automatikus iteráció

Új projekt létrehozásakor az Acxor automatikusan sprint-alapú szerkezetet épít fel,  
létrehozza az alap task-struktúrát, és lehetőséget ad a határidők és résztvevők beállítására.  
Ez sokkal gyorsabb bevezetést tesz lehetővé, mint a Jira részletes setup-ja vagy a Trello manuális táblalétrehozása.

#### Összehasonlítás a Duolingo-val

A gamifikáció hatékony eszköz a felhasználói aktivitás és motiváció növelésére. Míg a Duolingo főként nyelvtanulást ösztönöz pontozás, szintek és jutalmak révén, az Acxor hasonló mechanizmusokat alkalmaz a fejlesztői csapatok projektfeladatainak teljesítéséhez. Az alábbi táblázat szemlélteti a két rendszer főbb gamifikációs elemeit:

| Gamifikációs elem       | Acxor                                 | Duolingo                             |
| ----------------------- | ------------------------------------- | ------------------------------------ |
| XP pontok               | Task és Subtask teljesítésével        | Tanulási feladatok teljesítésével    |
| Szintek                 | XP alapján szintlépés                 | XP alapján szintlépés                |
| Badge-ek                | Bizonyos szinteknél és teljesítmények | Elért mérföldkövekért                |
| Vizualizált haladás     | Progress bar a sprint/task szinten    | Streaks, napi célok, feladatjelzők   |
| Verseny / ranglista     | Contributorok rangsorolása XP szerint | Barátok és globális ranglista        |
| Automatikus értesítések | Task státusz változáskor              | Feladatok és napi célok emlékeztetői |

**Összehasonlítás**:  
Az Acxor és a Duolingo gamifikációja sok hasonlóságot mutat, például mindkettő XP- és szintalapú rendszert használ. Az Acxor azonban kifejezetten projektekre és csapatmunkára optimalizált, míg a Duolingo egyéni tanulási folyamatot támogat. Az Acxorban a badge-ek és jutalmak közvetlenül a feladatok teljesítéséhez kapcsolódnak, a Duolingóban inkább mérföldkövekhez és streak-ekhez. Az Acxor vizualizált haladása a sprint és task szintjén történik, míg a Duolingo a napi célok és streak-ek vizuális megjelenítésére fókuszál. Továbbá az Acxor rangsorolja a csapattagokat teljesítmény alapján, míg a Duolingo inkább barátok és globális felhasználók közötti összehasonlításra épít. Végül, az Acxor automatikusan értesíti a felhasználókat a státuszváltozásokról, a Duolingo pedig napi emlékeztetőkkel ösztönöz. Összességében az Acxor gamifikációja a csapat- és projektfókuszú munkát motiválja, míg a Duolingo a tanulást.

## Jelenleg még nem dolgoztam ki:

- Ezen választás:
  - Open source az egész. (Az üzemeltetés fizetős.)
  - Open source az egész. (Az üzemeltetés ingyenes, de az adatok feldolgozásra kerülnek.)
  - Open source alap, fizetős plugin-ek.
  - Fizetős alap, open source plugin-ek.
  - Teljesen zárt, piaci szoftver.
