# Acxor ↔ GitHub integráció – Működés áttekintése

## 1. Projekt létrehozása és GitHub kapcsolódás

- Új projekt létrehozásakor a felhasználónak lehetősége van **GitHub repository-t linkelni** a projekthez.
- Ha a felhasználó linkeli a GitHub fiókját, az Acxor automatikusan létrehoz egy **repository-t** a projekt számára.
- Ettől kezdve az Acxor projekt és a GitHub repository **összekapcsolódik**, és az adatáramlás az alábbi szabályok szerint működik.

## 2. Feladatok és issue-k szinkronizálása

- Az Acxorban létrehozott **Task-ok és Subtask-ok** automatikusan GitHub **issue-kká alakulnak**.
  - Task → issue
  - Subtask → issue
- A GitHubon létrejövő issue-k neve a következő formátumot követi:  
  **taskname-user-deadline**  
  (pl.: `login-ui-anna-2025-11-10`)
- A határidők automatikusan átkerülnek az issue-khoz, így a projektmenedzsment teljesen követhető GitHubon.

## 3. Munkafolyamat

1. A csapattagok **GitHubon dolgoznak az issue-kon**.
2. Amint az issue állapota változik (pl. `closed`), az Acxorban **automatikusan frissül a megfelelő Task/Subtask státusza** (`Done`, `In Progress` stb.).
3. Csak a GitHub issue-k státusza szinkronizálódik Acxor felé – **új issue-k létrehozása vagy módosítása GitHubról nem történhet Acxorban**.
4. Ha az **admin az Acxorban módosítja a Task/Subtask állapotát vagy határidejét**, ezek a változások **automatikusan frissülnek a kapcsolódó GitHub issue-okon is**.

## 4. Biztonsági és működési szabályok

- Ha a **GitHub repository törlésre kerül**, az Acxor projekt **megáll**.
  - Ettől kezdve a projektet csak **törölni lehet** az Acxorban.
  - Így biztosított, hogy a projekt és a GitHub repository mindig párhuzamosan létezzen, és ne veszítsünk el adatot.
- A feladatok állapota és határideje mindig **az Acxorban marad a fő referenciaként**, a GitHub csak státusz frissítésre szolgál.

## 5. Összefoglalás

- A projekt létrehozásakor **kötelező a GitHub linkelés**, hogy a repository és a projekt összekapcsolódjon.
- Az Acxor **automatikusan létrehozza a GitHub repository-t** a projekthez.
- TaskGroup → Task → Subtask hierarchia GitHub issue-kká alakul.
- Státuszváltozás GitHubon → automatikusan frissül Acxorban.
- Admin által végzett módosítás Acxorban → automatikusan frissül GitHubon is.
- Csak a **GitHub felől történő státuszfrissítés engedélyezett**, adatfelülírás nem.
- Repository törlése → Acxor projekt leáll, csak törölni lehet.

**Eredmény:**  
A csapat a GitHubon dolgozik, de az Acxorban mindig látható a projekt állapota, határidők, és a feladatok státusza valós időben. Az admin által végzett módosítások azonnal szinkronizálódnak a GitHub repository-val is.
