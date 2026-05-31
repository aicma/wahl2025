# Wahlergebnis viewer

## Stack
- Vite + React + Typescript
- Shadcn + RadixUI for quick UI development (Benefit of owning the components, only adding components that are really used)
- Papaparse + Tanstack Table for CSV parsing and Table-Display
- recharts for diagram display

## Decisions

- No Router since Single View Application
- Do not use indexedDb for first version but load csv on build and serve as static asset. 
- Tried Openspec for Agentic Coding - ended up refactoring most of the results away manually since it got cluttered quite a bit 
- use ZOD to verify incoming data is valid for display
- target Device is Desktop. Large Mobile devices work too. But <460px is not supported

## Features
- n-Region Panels
- as soon as >1 Panels are selected sticky compare view is displayed
- Light/Dark/System Colors modes

## ToDo
- Add meaningful Test for parser.
- fix Denglish 
- Display the change from prior Election on Chart Tooltips

### Work time 
- started on it at Saturday ~10am and finished at ~8.30pm. Sunday: Review Session with AI Agents + cleanup + minor improvements/fixes 
- this includes Initial Project setup, Lunch (~45min), Dog Walks(~30min), and research + debugging of github pages deployment


