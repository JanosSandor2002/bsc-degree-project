# REDMINE

A Redmine egy nyílt forráskódú projektmenedzsment rendszer, amelyet főként a testreszabhatóság és a bővíthetőség jellemez. Kiemelt célja az issue tracking, dokumentáció és projekt hierarchia kezelés.

## Redmine alapkoncepció

- Issue tracking
- Projekt- és modulkezelés
- Testreszabható workflow
- Gantt és Calendar vizualizáció
- Roles és permissions
- Plugin és bővítmények

## Redmine fő fogalmak

### Project

- Projekt gyűjtő
- Lehet főprojekt és alprojekt
- Sablonok testreszabhatók
- Hierarchia támogatás

### Issue

- Alap egység a munkafolyamatban
- Típusok: Bug, Feature, Support, Custom
- Tartalmazhat:
  - Prioritást
  - Határidőt
  - Felelőst
  - Subtask-ot

### Tracker

- Az issue típusát jelzi
- Segít a riportok és szűrés kezelésében

### Workflow

- Testreszabható állapotok és átmenetek
- Permission-ekhez kapcsolódó szabályok
- Issue lifecycle: New → In Progress → Resolved → Closed

## Reporting és vizualizáció

- Gantt diagram: projekt időbeli ütemezése
- Calendar: határidők és mérföldkövek
- Issue listák testreszabása
- Felhasználói és projekt riportok

## Permission rendszer

- Roles: Manager, Developer, Reporter, etc.
- Project-level permissions
- Issue-level visibility
- Testreszabható jogok minden modulban

## Integrációk

- SCM rendszerek: Git, Subversion, Mercurial
- E-mail értesítések
- Pluginok: Agile boards, CRM, Wiki
- API elérés REST alapokon

## Redmine előnyei

- Nyílt forráskód, testreszabható
- Erős issue és projekt hierarchia
- Bővíthető pluginokkal
- Nagy projektek kezelésére alkalmas

## Redmine hátrányai

- UI kevésbé modern
- Tanulási görbe közepes
- Gamifikáció beépítetlen
- Integrációk néha manuális konfigurációt igényelnek

## Kapcsolódás az ACXOR-hoz

A Redmine inspiráció az Acxor backend és issue struktúrájához:

- Issue tracking és task hierarchia (Task → Subtask)
- Testreszabható workflow egyszerűsítve
- Adminisztrációs szerepek és permissions egyszerűsítve
- Plugin jellegű bővítések helyett natív integrációk
- Gantt / Timeline nézet egyszerűsítve, modern UI-val
