## 1. Dependencies & Setup

- [x] 1.1 Add the shadcn/ui `Command` component (`npx shadcn add command`)
- [x] 1.2 Add the shadcn/ui `Popover` component (`npx shadcn add popover`) for the floating dropdown wrapper

## 2. Data Utilities

- [x] 2.1 Add `queryGebietOptions(url)` to `src/lib/idb.ts` — calls `getAll()` internally and returns deduplicated `(Gebietsnummer, Gebietsname, Gebietsart)` tuples
- [x] 2.2 Use a composite key `Gebietsart+Gebietsnummer` internally to avoid cross-level number collisions

## 3. Selection State Hook

- [x] 3.1 Create `src/lib/useGebietSelection.ts` — a hook that reads the initial selection from `?gebiet=` URL param (fallback: `localStorage`) and returns `[selected, setSelected]`
- [x] 3.2 On `setSelected`: write `Gebietsnummer` to `localStorage` and update URL via `history.replaceState` (or remove both when `null`)
- [x] 3.3 Validate the restored value against the loaded records; silently discard if not found

## 4. GebietSearch Component

- [x] 4.1 Create `src/components/GebietSearch.tsx` wrapping `Popover` + `Command` with a trigger button that displays the selected `Gebietsname` (or a placeholder)
- [x] 4.2 Render `CommandGroup` per `Gebietsart` with `CommandItem` per Gebiet; hide empty groups
- [x] 4.3 Wire `onSelect` to call the `setSelected` callback from `useGebietSelection`
- [x] 4.4 Disable the component and show "Import data first" placeholder when `records` is empty

## 5. App Integration

- [x] 5.1 In `App.tsx` call `queryGebietOptions(BTW25_CSV_URL)` on mount and pass the result into `GebietSearch` (remove the raw records state and table)
- [x] 5.2 Wire `useGebietSelection` in `App.tsx` and pass `selected`/`setSelected` to `GebietSearch`
- [x] 5.3 Render `GebietSearch` above the data table in the existing layout
