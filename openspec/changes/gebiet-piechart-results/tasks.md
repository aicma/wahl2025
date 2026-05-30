## 1. Dependencies

- [x] 1.1 Install `recharts` as a dependency

## 2. GebietPiechart Component

- [x] 2.1 Create `src/components/GebietPiechart.tsx` with a `GebietPiechartProps` interface accepting `resultRows: ResultRow[]`
- [x] 2.2 Filter `resultRows` to entries where `Stimme === 2` and `Anzahl > 0`
- [x] 2.3 Map filtered rows to `{ name: Gruppenname, value: Anzahl, percent: Prozent }` chart data
- [x] 2.4 Render a Recharts `PieChart` with `Pie`, `Cell`, `Tooltip`, and `Legend`
- [x] 2.5 Assign colors from a fixed palette cycling by index
- [x] 2.6 Render a fallback message when no qualifying rows exist

## 3. Layout Integration

- [x] 3.1 Import and render `GebietPiechart` above the table in `GebietResultsTable`, passing `resultRows`
- [x] 3.2 Wrap the table `<div>` in a `hidden` class to hide it by default
