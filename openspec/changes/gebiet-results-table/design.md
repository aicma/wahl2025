## Context

The current app can import the `kerg2.csv` dataset into IndexedDB and lets users choose a Gebiet through the autocomplete added in the previous change. After selection, the UI only shows the Gebiet name and metadata. The imported result rows are not surfaced anywhere, so users cannot inspect the data behind their selection.

## Goals / Non-Goals

**Goals:**

- Show a table of imported rows that belong to the currently selected Gebiet
- Keep the table synchronized with the active selection and refresh it after re-imports
- Reuse the existing IndexedDB store rather than introducing a new persistence layer
- Preserve the CSV column order so the rendered table stays aligned with the imported dataset
- Provide clear loading and empty states for the main user paths

**Non-Goals:**

- Aggregating, summarizing, or charting the selected Gebiet's results
- Adding sorting, pagination, column pinning, or inline filtering controls
- Changing how the CSV is imported or how Gebiet selection is stored in URL/localStorage
- Adding IndexedDB indexes or schema migrations purely for this table

## Decisions

### D1: Filter selected Gebiet rows from the existing IndexedDB data

**Decision**: Add a dedicated query helper that returns only rows whose `Gebietsart` and `Gebietsnummer` match the selected Gebiet.

**Rationale**: The store already contains the full imported CSV rows and the selected Gebiet already carries the exact identity fields needed for filtering. A focused helper keeps the filtering logic out of `App.tsx` and avoids duplicating the matching rules in multiple places.

**Alternative considered**: Load all rows into React state and filter them in the component. Rejected because it keeps the full dataset resident in UI state even though only one Gebiet's rows are needed at a time.

---

### D2: Reuse the current object store schema and filter client-side

**Decision**: Implement the selected-Gebiet query on top of the existing store schema without adding indexes, using the already persisted rows as the source of truth.

**Rationale**: This is the smallest safe extension of the current architecture. The dataset size is modest for an in-browser app, and the app already reads the same store to build Gebiet options. Avoiding a schema change keeps the feature compatible with already imported data and avoids upgrade complexity.

**Alternative considered**: Introduce IndexedDB indexes for `Gebietsart` and `Gebietsnummer`. Rejected for now because it would require an object store migration and more implementation risk than this view needs.

---

### D3: Render a generic data table driven by the CSV row shape

**Decision**: Build the table columns from the imported row keys and render each matching row as-is, preserving the key order from the parsed records.

**Rationale**: The `kerg2` dataset already defines the meaningful columns, and this feature is about exposing the selected Gebiet's raw results rather than inventing a new domain-specific projection. A generic renderer keeps the implementation adaptable if the CSV adds or renames columns in later releases.

**Alternative considered**: Hard-code a curated subset of columns. Rejected because the repository does not yet define a stable reduced schema for "results", and choosing one now would risk omitting data users expect to see.

---

### D4: Keep results loading in `App.tsx` and presentation in a dedicated component

**Decision**: Let `App.tsx` own the selected-Gebiet results state (`loading`, `error`, `rows`) and pass the data into a presentational table component.

**Rationale**: `App.tsx` already coordinates import status and selected Gebiet state, so it is the right place to trigger result loading when those inputs change. Separating the renderer into its own component keeps the view logic readable and makes the table easier to evolve later.

## Risks / Trade-offs

- **Client-side filtering reads more data than strictly necessary** -> acceptable for the current CSV size and avoids IndexedDB migrations
- **Wide CSV schemas can create a horizontally large table** -> acceptable for an initial raw-data view; implementation should use an overflow container rather than trimming columns
- **Re-imports replace the store contents** -> the app must reload selected-Gebiet rows after a successful import so the table stays consistent with the latest data
- **No selected Gebiet yet** -> the UI should show a prompt instead of an empty table so users understand the next action
