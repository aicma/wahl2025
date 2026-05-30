## Why

The app loads the full kerg2 dataset (thousands of rows spanning Bund, Länder, and Wahlkreise) but provides no way to navigate to a specific territory. Users need to quickly find a Gebiet by name without scrolling a raw table.

## What Changes

- Add an autocomplete search input that filters Gebiete by `Gebietsname`
- Group autocomplete results by `Gebietsart` (Bund / Land / Wahlkreis)
- Selecting a result sets the active Gebiet, persists the selection to `localStorage`, and reflects it in the URL (query parameter)
- On load, restore the selected Gebiet from the URL (falling back to `localStorage`) so deep-links and page reloads work correctly

## Capabilities

### New Capabilities

- `gebiet-autocomplete`: Searchable combobox that queries loaded records by `Gebietsname` and groups matches by `Gebietsart`
- `gebiet-selection-state`: Manage the selected Gebiet as shared state, synced to URL query parameter and `localStorage`

### Modified Capabilities

<!-- None — no existing specs require change -->

## Impact

- New component(s) under `src/components/`
- `App.tsx` wired to pass records into the autocomplete and react to selection changes
- URL gains a `?gebiet=<Gebietsnummer>` parameter (number chosen over name to survive URL encoding issues)
- Possible new dependency: a headless combobox primitive (e.g. shadcn/ui Command or Radix Combobox) to avoid re-implementing keyboard navigation from scratch
