## Why

After selecting a Gebiet, users see only a raw data table. A pie chart gives an immediate visual summary of the vote distribution across parties, making the results easier to interpret at a glance. The system rows and data model needed to drive the chart are already in place.

## What Changes

- Add a `GebietPiechart` component that renders a pie chart of Zweitstimmen (valid party results) for the selected Gebiet
- Render `GebietPiechart` above the results table in `GebietResultsTable`
- Hide the raw results table by default (chart-first layout)

## Capabilities

### New Capabilities

- `gebiet-piechart`: A pie chart component that visualises the Zweitstimmen distribution of result rows for a selected Gebiet

### Modified Capabilities

- `gebiet-results-table`: Table is hidden by default; the piechart becomes the primary results view

## Impact

- New dependency: a charting library (Recharts or similar, compatible with React 19 and the existing Vite/Tailwind setup)
- `GebietResultsTable` receives a minor layout change (table conditionally hidden)
- No changes to data fetching, IndexedDB, or parsing logic
