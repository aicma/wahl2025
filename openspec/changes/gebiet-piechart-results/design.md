## Context

The app already imports and stores `kerg2.csv` rows in IndexedDB, queries them by selected Gebiet, and splits them into `resultRows` (party results) and `systemRows` (meta statistics). The `GebietResultsTable` component owns these two arrays. A charting library is not yet installed. The stack is React 19 + Vite + Tailwind CSS v4.

## Goals / Non-Goals

**Goals:**

- Add a pie chart of Zweitstimmen (Stimme = 2) by `Gruppenname` derived from `resultRows`
- Place the chart above the table inside `GebietResultsTable`
- Hide the raw results table by default so the chart is the primary view

**Non-Goals:**

- Erststimmen chart (out of scope for this change)
- Interactive drill-down or cross-filtering between chart and table
- Sorting, filtering, or paginating the hidden table
- Responsive/print optimisations beyond basic mobile usability

## Decisions

### D1: Charting library — Recharts

**Decision**: Use [Recharts](https://recharts.org) (`recharts`).

**Rationale**: Recharts is built on React + SVG, has no DOM-manipulation side-effects that conflict with React 19's concurrent renderer, is tree-shakeable, and has a minimal API for `PieChart` + `Pie` + `Cell`. It is the most popular React chart library and has TypeScript types bundled. Alternatives:

- _Chart.js / react-chartjs-2_: Canvas-based; harder to style with Tailwind; requires separate type package.
- _Victory_: React-native-first; heavier bundle; less community momentum.
- _Visx_: Low-level D3 primitives; too much boilerplate for a simple pie chart.

### D2: Data derivation — filter `resultRows` by `Stimme === 2`

**Decision**: Inside `GebietPiechart`, filter the passed `resultRows` to `Stimme === 2` and map `{ name: Gruppenname, value: Anzahl }` for each entry where `Anzahl > 0`.

**Rationale**: `resultRows` already excludes System-Gruppe rows. Filtering to `Stimme === 2` gives the Zweitstimmen distribution which determines seat allocation and is the canonical "election result" metric. Erststimmen (Stimme = 1) can be added as a toggle later without changing the data shape.

### D3: Color palette — deterministic by index, Tailwind CSS v4 compatible

**Decision**: Use a fixed ordered palette of hex values (not Tailwind class names) passed as `COLORS` array, cycling by index.

**Rationale**: Recharts `Cell` requires a `fill` prop as a CSS color string, not a class. Hard-coded hex avoids a runtime `getComputedStyle` call and keeps the component portable.

### D4: Table visibility — hidden via CSS, not unmounted

**Decision**: Wrap the table section in a `hidden` class rather than conditionally rendering `null`.

**Rationale**: Keeps the TanStack Table instance alive so column widths and scroll position are preserved if the table is later toggled visible. Avoids re-running `useReactTable` on every show/hide.

## Risks / Trade-offs

- **Bundle size** → Recharts adds ~70 kB gzip. Acceptable for a data-heavy election results app; can be lazy-loaded behind `React.lazy` if it becomes a concern.
- **Rows with `Anzahl = null/undefined`** → Filtered out before passing to Recharts to avoid rendering invisible slices. Edge case if all rows have no count (e.g. Zwischenergebnis with no data) — the chart will render empty and a fallback message should be shown.
- **Many parties with small slices** → Pie charts become hard to read with 20+ slices. Mitigation: group parties below a threshold (e.g. < 1 %) into an "Übrige" slice in a follow-up change; out of scope here.

## Open Questions

- Should the chart show absolute `Anzahl` or `Prozent` as the label? Decision deferred to implementation — use `Prozent` for labels since it is more informative in a pie context.
