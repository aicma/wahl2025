## Why

The app now lets users choose a Gebiet, but the selection only updates a short text label. There is still no way to inspect the actual imported election rows for that Gebiet, which makes the selection feel incomplete and blocks follow-up analysis work.

## What Changes

- Add a results table below the Gebiet selector that renders the imported rows for the currently selected Gebiet
- Query matching rows from IndexedDB by the selected Gebiet's `Gebietsart` and `Gebietsnummer`
- Show clear empty states when no data has been imported yet, no Gebiet is selected, or the selected Gebiet has no matching rows
- Keep the current import and Gebiet selection flows unchanged while making the selection drive visible results

## Capabilities

### New Capabilities

- `gebiet-results-table`: Render the imported result rows for the currently selected Gebiet in a tabular view

### Modified Capabilities

- `gebiet-selection-state`: The active Gebiet selection now drives the displayed result set in the main app view

## Impact

- New UI component(s) under `src/components/` for the results table and its empty states
- New query helper(s) in `src/lib/idb.ts` or a nearby data helper to load rows for a selected Gebiet
- `App.tsx` gains state and effects for loading, rendering, and refreshing selected-Gebiet results
- No new backend or API work; the feature continues to use the imported CSV data already stored in IndexedDB
