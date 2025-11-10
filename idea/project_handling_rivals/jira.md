# JIRA – Részletes, Átfogó Dokumentáció

A Jira egy komplex, vállalati szintű projektmenedzsment és issue tracking rendszer, amelyet fejlesztői csapatok és enterprise környezetek széles köre használ.

## Jira alapkoncepció

A Jira a következő területekre épül:

- Issue tracking
- Agile metodikák támogatása (Scrum / Kanban)
- Workflow testreszabás
- Jogosultságkezelés
- Riportok és dashboardok
- Integrációk

A Jira egyik legnagyobb előnye és hátránya: **szinte bármi testreszabható** → ezért sokaknak túl bonyolult.

## Jira fő fogalmak

### Project

A projektek gyűjtője, többféle sablon alapján:

- Scrum Project
- Kanban Project
- Company-managed
- Team-managed

### Issue

Alap egység, több típusa:

- Task
- Bug
- Story
- Epic
- Subtask
- Custom issue type

### Workflow

Az issue állapotát írja le:

- To Do
- In Progress
- Review
- Testing
- Done

Minden átmenet:

- condition
- validation
- post-function
- notification

## Struktúra (Epic–Story–Task–Subtask)

Epic
└── Story
└── Task
└── Subtask

Ez komplex hierarchia, nagy csapatoknak előnyös.

## Board típusok

### Scrum board

- Sprint tervezés
- Backlog
- Sprint goal
- Burn-down chart
- Velocity

### Kanban board

- Folytonos munkafolyamat
- WIP limit
- Cumulative flow diagram

## Permission rendszer

A Jira jogosultságkezelése rendkívül mély:

- global permissions
- project permissions
- issue-level permissions
- roles
- groups
- permission schemes

Adminisztratív szinten külön modul.

## Reporting

A Jira rengeteg riportot generál automatikusan:

- burndown
- burnup
- sprint report
- control chart
- velocity
- epic progress
- cumulative flow

## Automatizmusok

Trigger → Condition → Action logika alapján

Például:

- automatikus assignee
- állapotváltás szabály alapján
- címkézés
- email értesítések
- webhook hívások
- subtask-ok lezárása automatikusan

## Integrációk

A Jira erős integrációs ökoszisztémával rendelkezik:

- Confluence
- Bitbucket
- GitHub
- GitLab
- Slack
- Teams
- Google Workspace
- Microsoft 365

## Jira előnyei

- mély testreszabhatóság
- erős admin funkciók
- enterprise skálázhatóság
- fejlesztői folyamatok integrációja

## Jira hátrányai

- tanulási görbe meredek
- konfiguráció túl bonyolult
- sok funkciót rejt el mélységekben
- vezetőknek néha kaotikus

## Kapcsolódás az ACXOR-hoz

A Jira komplexitása kiváló inspiráció az Acxor rendszer egyszerűsítésére:

- kevesebb konfiguráció
- egyszerűbb task lifecycle
- letisztult permission model
- intuitív board nézet
- gyors projektindítás
- kevesebb issue típus

A Jira-ból az Acxor azt veszi át, ami működik, de elhagyja a felesleges rétegeket.
