# GitHub API integráció projektkezelő rendszerhez

## Bevezetés

A projektkezelő rendszer egyik központi eleme a GitHub integráció, amely lehetővé teszi, hogy a felhasználó GitHub repository-khoz kapcsolódó adatokat közvetlenül az alkalmazásban kezelje. A rendszer a GitHub REST API segítségével kommunikál a külső szolgáltatással, így képes lekérni és módosítani az issue-kat, amelyek a belső rendszerben taskként jelennek meg.

## Alapfogalmak

A rendszerben a következő megfeleltetések kerülnek alkalmazásra:

- Project: egy GitHub repository
- Task: egy GitHub issue
- Subtask: a taskhoz tartozó részfeladat, amely nem natív GitHub funkció, ezért egyedi implementáció szükséges

## Hitelesítés

A GitHub API használatához hitelesítés szükséges. A legegyszerűbb megoldás a Personal Access Token használata.

A token létrehozásának lépései:

1. GitHub felhasználói beállítások megnyitása
2. Developer settings menüpont kiválasztása
3. Personal access tokens létrehozása
4. Megfelelő jogosultságok beállítása, például repo és issues

A backend minden API kérésnél ezt a tokent használja az Authorization fejlécben.

Példa HTTP fejléc:
Authorization: Bearer <TOKEN>

## Issue-k lekérése

A rendszer a repository-hoz tartozó issue-kat a következő végponton keresztül kéri le:

GET https://api.github.com/repos/{owner}/{repo}/issues

A válasz JSON formátumban érkezik, amely tartalmazza az issue-k adatait, például:

- id
- title
- body
- state
- number

Ezek az adatok kerülnek leképezésre a belső Task objektumokra.

## Task létrehozása GitHub-on

Új task létrehozásakor a rendszer egy új issue-t hoz létre a GitHub-on.

POST https://api.github.com/repos/{owner}/{repo}/issues

A kérés törzse:
{
"title": "Task címe",
"body": "Task leírása"
}

A válasz tartalmazza az új issue azonosítóját, amelyet a rendszer eltárol.

## Task frissítése

Egy meglévő task módosítása a GitHub issue frissítésével történik.

PATCH https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}

A módosítható mezők:

- title
- body
- state

Példa:
{
"title": "Frissített cím",
"body": "Frissített leírás",
"state": "closed"
}

## Subtask kezelés

A GitHub nem támogat natív subtaskelemeket, ezért a rendszer a subtaskelemeket a GitHub issue leírásában, markdown checklist formátumban tárolja.

Példa markdown formátum:

- [ ] Első részfeladat
- [x] Második részfeladat

A rendszer a következő módon működik:

1. Issue lekérésekor a body mező feldolgozásra kerül
2. A markdown checklist elemek felismerése reguláris kifejezéssel történik
3. A felismert elemek Subtask objektumokká alakulnak

## Subtask feldolgozás logikája

A feldolgozás során a rendszer megkeresi az összes checklist elemet:

- [ ] jelentése: nem teljesített
- [x] jelentése: teljesített

A feldolgozott adatok:

- title: a részfeladat szövege
- completed: logikai érték

## Subtask frissítés

Amikor egy subtask állapota megváltozik, a rendszer újragenerálja az issue teljes markdown tartalmát, majd frissíti a GitHub-on.

A folyamat lépései:

1. Aktuális subtask lista lekérése
2. Markdown újragenerálása
3. PATCH kérés küldése a GitHub API felé

## Szinkronizáció

A rendszer kétirányú szinkronizációt valósíthat meg.

GitHub → rendszer:

- issue-k lekérése
- változások feldolgozása

Rendszer → GitHub:

- új task létrehozása
- task módosítása
- subtask állapot frissítése

## Hibakezelés

A GitHub API használata során figyelembe kell venni:

- rate limit korlátozásokat
- hibás token esetét
- nem létező repository kezelése

A rendszernek minden API hívásnál ellenőriznie kell a válasz státuszkódját.

## Biztonsági megfontolások

A rendszer a GitHub API eléréséhez Personal Access Token alapú hitelesítést alkalmaz, amelyet környezeti változóban tárol a biztonság érdekében.
