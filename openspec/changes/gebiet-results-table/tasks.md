## 1. Data Querying

- [x] 1.1 Add a helper that loads the stored rows for a selected Gebiet by matching `Gebietsart` and `Gebietsnummer`
- [x] 1.2 Reuse the existing imported row shape so the table can render the raw CSV fields without introducing a parallel model

## 2. Results Table Component

- [x] 2.1 Create a dedicated results table component under `src/components/` that accepts selected Gebiet metadata, matching rows, loading state, and empty/error states
- [x] 2.2 Render table headers from the row keys and preserve column order from the imported records
- [x] 2.3 Wrap the table in a horizontal overflow container so wide CSV schemas remain usable on smaller screens

## 3. App State & Wiring

- [x] 3.1 In `App.tsx`, add state for selected-Gebiet result rows plus loading/error status
- [x] 3.2 Load matching rows whenever the selected Gebiet changes and clear the table when selection is removed
- [x] 3.3 Reload the selected Gebiet's rows after a successful CSV import so the visible results stay fresh

## 4. UX States

- [x] 4.1 Show a prompt when no Gebiet is selected
- [x] 4.2 Show a prompt when no data has been imported yet
- [x] 4.3 Show an empty-state message when the selected Gebiet has no matching stored rows
- [x] 4.4 Surface query failures with the same explicit error style used elsewhere in the app

## 5. Validation

- [ ] 5.1 Verify the table updates when the user switches between different Gebiete
- [ ] 5.2 Verify re-importing data refreshes the visible rows for the currently selected Gebiet
- [ ] 5.3 Verify the table handles wide datasets and empty states without breaking the existing layout
