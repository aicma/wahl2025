# Wahlergebnis viewer

## Stack
- Vite + React + Typescript
- Shadcn + RadixUI for quick UI development
- Papaparse + Tanstack Table for CSV parsing and Table-Display
- Prettier code formatting

## Decisions

- No Router since Single View Application
- Do not use indexedDb for first version but load csv on build and serve as static asset. 
- Tried Openspec for Agentic Coding - ended up refactoring most of the results away manually since it got cluttered quite a bit 
- use ZOD to verify incoming data is valid for display

## Features
- n-Region Panels
- as soon as >1 Panels are selected sticky compare view is displayed

## ToDo
- Add meaningful Test for parser.
- fix Denglish 
- Display the change from prior Election on Chart Tooltips

### Work time 
- started on it at ~10am and finished at ~20.30
- this includes Initial Project setup, Lunch (~45min), Dog Walks(~30min), and research + debugging of github pages deployment


