# Frontend Fájlok Rövid Leírása

**1. `src/main.tsx`**  
Belépési pont az alkalmazásba. Az `App` komponenst becsomagolja a `GlobalProvider`-rel, így az app összes komponense hozzáfér a globális state-hez.

**2. `src/App.tsx`**  
Fő layout komponens: tartalmazza a `Sidebar`-t, `Topbar`-t és a fő nézetet, amely a kiválasztott view-t jeleníti meg (`MainView`, `KanbanView`, `ScrumView`, `GamificationView`, `WikiView`).

**3. `src/Context/GlobalContext.tsx`**  
Létrehozza a `GlobalContext`-et és a `GlobalProvider`-t. Itt található a teljes globális state és a dispatch, amelyet a komponensek használnak az állapot frissítésére. A `useGlobalContext` hook egyszerű hozzáférést biztosít.

**4. `src/Context/Reducer.tsx`**  
Az `AppReducer` kezeli a globális state változásait action típusok alapján. Tartalmazza a felhasználó, token, projektek, taskek, subtaskek kezelését, valamint a loading és error állapotokat.

**5. `src/Context/Actions.ts`**  
Tartalmazza az összes API hívást a backend route-okhoz:

- Auth: `registerUser`, `loginUser`
- Projektek: `fetchProjects`, `addProject`
- Taskek: `fetchTasks`, `addTask`
- Subtaskek: `fetchSubtasks`, `addSubtask`  
  A dispatch segítségével frissíti a globális state-et, kezeli a loading és error állapotokat.

**6. `src/components/Sidebar/`**  
Tartalmazza az oldalsáv komponenseit: `Sidebar`, `HeroLogo`, `MainIcon`, `KanbanIcon`, `ScrumIcon`, `GamificationIcon`. Az ikonok gombként működnek, később összeköthetők a view váltással.

**7. `src/components/Topbar/`**  
Tartalmazza a felső menü komponenseit: `Topbar`, `PlanTab`, `TasksTab`, `SubtasksTab`, `LogTab`, `ProjectSelect`, `UserMenu`.

- `Topbar` összerakja a tab-okat és a projekt kiválasztót.
- `UserMenu` kezeli a felhasználói menüt, például Account, Create Project, Log In/Out.

**8. `src/components/Views/`**  
Minden nézet külön komponens:

- `MainView`: projekt áttekintés, statisztikák
- `KanbanView`: Kanban tábla
- `ScrumView`: Scrum board
- `GamificationView`: játékosítási statisztikák
- `WikiView`: projekt dokumentáció és leírások

**Összefoglalás:**  
A frontend teljesen moduláris, a globális állapotot a `GlobalContext` kezeli, a `Reducer` határozza a state változásait, az `Actions` pedig az API hívások és state frissítések logikáját. A Sidebar és Topbar komponensek a nézetek váltását és a projekt kiválasztást teszik lehetővé.
