## Context

The app currently shows a flat raw table of all kerg2 records. The dataset contains thousands of rows across three territory levels: Bund (1 row-group), Land (16), and Wahlkreis (299). Users have no way to navigate to a specific territory. The autocomplete search is the primary navigation control — once a Gebiet is selected, other parts of the UI (future charts, summaries) will filter to that selection.

## Goals / Non-Goals

**Goals:**

- Provide a keyboard-accessible combobox that filters `Gebietsname` as the user types
- Group dropdown results under `Gebietsart` headings (Bund / Land / Wahlkreis)
- Reflect the selected Gebiet in the URL as `?gebiet=<Gebietsnummer>` so links are shareable
- Persist the last selection to `localStorage` as a fallback when no URL parameter is present
- Restore selection on page load from URL → `localStorage` priority order

**Non-Goals:**

- Fuzzy/phonetic matching (exact substring match is sufficient)
- Multi-selection (single Gebiet at a time)
- Filtering records in the table by the selected Gebiet (separate concern, future change)

## Decisions

### D1: shadcn/ui Command component as the combobox primitive

**Decision**: Use the shadcn/ui `Command` component (built on `cmdk`) for the autocomplete UI.

**Rationale**: The project already uses shadcn/ui (`button.tsx` present, `components.json` configured). `Command` provides keyboard navigation, grouping, and search out of the box. Rolling a custom combobox introduces accessibility risk (focus management, ARIA roles).

**Alternative considered**: Radix `Select` — rejected because it requires a fixed option list and doesn't support type-to-filter behaviour.

---

### D2: `Gebietsnummer` in the URL, not `Gebietsname`

**Decision**: Use `?gebiet=<Gebietsnummer>` (e.g. `?gebiet=11`) rather than the name.

**Rationale**: Names contain umlauts and spaces that need URL-encoding and are sensitive to formatting changes in future CSV releases. The `Gebietsnummer` is stable and unambiguous across all three `Gebietsart` levels.

---

### D3: Load autocomplete options from IndexedDB, not from in-memory records

**Decision**: Add `queryGebietOptions(url)` to `idb.ts`. It calls `getAll()` internally and collapses results to unique `(Gebietsnummer, Gebietsname, Gebietsart)` tuples before returning. `App` calls this on mount — not `queryRecords` — so the full row set is never loaded into React state just to power the autocomplete.

**Rationale**: The raw table is being replaced by per-Gebiet views (charts, comparisons). Keeping thousands of rows in React state purely for the autocomplete option list is wasteful. `~316` unique tuples is the right data shape for this component. Full rows will be loaded on demand per selected Gebiet in future features.

**Alternative considered**: `buildGebietOptions(records)` in a separate file taking in-memory records — rejected because it requires loading the full dataset into React state even when the table view no longer exists.

---

### D4: URL state via `window.history.replaceState`, not a router

**Decision**: Manage the `?gebiet=` param directly with `URLSearchParams` + `history.replaceState`. No React Router added.

**Rationale**: This is the only URL parameter in the app. Pulling in a full router for a single query param is over-engineering at this stage.

## Risks / Trade-offs

- **Large option list (~316 items)** → `cmdk` virtualises rendering; not a concern for this size.
- **No records loaded yet** → autocomplete should render as disabled/empty with a prompt to import first.
- **`Gebietsnummer` uniqueness** → numbers are unique within a `Gebietsart` but `99` (Bund) and `99` could theoretically collide with a Wahlkreis number. Verified: Wahlkreise are numbered 1–299, Länder 1–16 (with offsets), Bund is always `99`. Use `Gebietsart+Gebietsnummer` as the composite key if collision is detected during implementation.
