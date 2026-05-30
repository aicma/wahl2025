## 1. Dependencies & Project Setup

- [x] 1.1 Install PapaParse and its TypeScript types (`papaparse`, `@types/papaparse`)
- [x] 1.2 Verify PapaParse appears in `package.json` dependencies

## 2. Remote CSV Fetch

- [x] 2.1 Create `src/lib/fetchCsv.ts` with a `fetchCsv(url: string): Promise<string>` function
- [x] 2.2 Implement non-2xx response detection and rejection with HTTP status in error message
- [x] 2.3 Implement network/CORS failure detection with a descriptive error message

## 3. CSV Parsing

- [x] 3.1 Create `src/lib/parseCsv.ts` with a `parseCsv(csvText: string): Promise<Record<string, string>[]>` function using PapaParse
- [x] 3.2 Enable PapaParse `header: true` option for automatic header-to-key mapping
- [x] 3.3 Reject with a descriptive error when PapaParse reports parse errors

## 4. IndexedDB Helper

- [x] 4.1 Create `src/lib/idb.ts` with a `getDb(): Promise<IDBDatabase>` helper that opens the shared app database
- [x] 4.2 Implement `storeRecords(sourceUrl: string, records: Record<string, string>[]): Promise<void>` that derives an object store name from the URL, upgrades the schema if needed, clears prior data, and writes new records
- [x] 4.3 Implement `queryRecords(sourceUrl: string): Promise<Record<string, string>[]>` that reads all records from the store for a given URL, returning `[]` if the store does not exist
- [x] 4.4 Handle the case where IndexedDB is unavailable and reject with a descriptive error in both `storeRecords` and `queryRecords`

## 5. Orchestration

- [x] 5.1 Create `src/lib/importCsv.ts` with an `importCsv(url: string): Promise<Record<string, string>[]>` function that chains `fetchCsv` → `parseCsv` → `storeRecords` and returns the parsed records
- [x] 5.2 Export `queryRecords` from `src/lib/importCsv.ts` (or re-export from `idb.ts`) for use in components

## 6. UI Integration

- [x] 6.1 Add a minimal UI in `src/App.tsx` (or a dedicated component) with a URL text input and an "Import" button
- [x] 6.2 Wire the Import button to call `importCsv`, show a loading state during the operation, and display a success or error message
- [x] 6.3 On load, call `queryRecords` for the last-used URL (if stored) and display the record count or a preview table
