## Why

The app needs to consume structured data from remote CSV files without requiring a backend proxy or server-side processing. Storing parsed results in the browser's IndexedDB enables offline access, fast queries, and persistence across sessions without a server round-trip.

## What Changes

- Add the ability to fetch a CSV file from a remote URL
- Parse the fetched CSV into structured records
- Persist the parsed records to the browser's IndexedDB
- Expose a way to query the stored records from IndexedDB

## Capabilities

### New Capabilities

- `remote-csv-fetch`: Fetch a CSV file from a given remote URL (handles CORS-safe requests)
- `csv-parse`: Parse raw CSV text into an array of typed record objects
- `indexeddb-store`: Open/create an IndexedDB database and persist parsed CSV records into an object store
- `indexeddb-query`: Read records back from IndexedDB for use in the UI

### Modified Capabilities

<!-- None - no existing specs require change -->

## Impact

- New dependencies: a CSV parsing library (e.g., PapaParse) added to `package.json`
- New source files under `src/lib/` or `src/services/`
- No breaking changes to existing components
- Browser compatibility limited to environments supporting IndexedDB (all modern browsers)
