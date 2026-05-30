## Context

The application is a React + TypeScript SPA (Vite) with no server-side component. Data currently comes from hardcoded values or in-memory state. The goal is to add the ability to pull structured data from remote CSV URLs, parse it client-side, and store the results persistently in the browser using IndexedDB so the data survives page reloads and is available offline.

## Goals / Non-Goals

**Goals:**

- Fetch a CSV from any CORS-enabled remote URL using the native `fetch` API
- Parse CSV text into typed record arrays using PapaParse (header row auto-detection)
- Store records in IndexedDB via a thin wrapper (no heavy ORM)
- Provide a simple read API to retrieve stored records for use in components

**Non-Goals:**

- Server-side CSV processing or proxying
- Streaming/chunked CSV ingestion (full file only)
- Relational queries, indexing, or full-text search on stored data
- Sync or conflict resolution across browser tabs (single-tab write model)
- Authentication or signed URL handling for private CSV endpoints

## Decisions

### D1: PapaParse for CSV parsing

**Decision**: Use [PapaParse](https://www.papaparse.com/) as the CSV parsing library.

**Rationale**: PapaParse is the de-facto standard for browser CSV parsing, handles edge cases (quoted fields, newlines in values, BOM), supports header row mapping to objects, and is well-maintained. Alternatives like `csv-parse` are Node-only; hand-rolling a parser introduces correctness risk.

**Alternative considered**: A custom regex-based parser — rejected due to maintenance burden and correctness issues with quoted fields.

---

### D2: Native `fetch` for HTTP retrieval

**Decision**: Use the browser's native `fetch` API (no extra HTTP library).

**Rationale**: The use case is a single GET request for a file. Adding Axios or similar is unnecessary weight. Error handling (network errors, non-2xx responses) is straightforward with `fetch`.

---

### D3: Raw IndexedDB (thin wrapper) over Dexie or localForage

**Decision**: Write a minimal IndexedDB helper (`src/lib/idb.ts`) rather than adding a library like Dexie.

**Rationale**: The access pattern is simple: open a database, write a batch of records, read all records from a store. Dexie is excellent but adds ~75 KB. For this narrow use case a small wrapper is more appropriate and keeps the dependency footprint small.

**Alternative considered**: localForage — rejected because it abstracts over multiple storage backends and forces key-value semantics, which is awkward for tabular record sets.

---

### D4: Each CSV URL gets its own object store keyed by URL hash

**Decision**: Derive an object store name from a sanitised slug of the source URL. Each import replaces the previous contents of that store (full replace, not incremental merge).

**Rationale**: Keeps stores isolated per dataset, makes it trivial to distinguish multiple CSVs, and avoids stale-data merging complexity. A full replace on re-import is the simplest correct behaviour.

## Risks / Trade-offs

- **CORS restrictions** → Mitigation: document that the remote CSV host must send permissive CORS headers; provide a clear error message when a CORS failure is detected.
- **Large CSV files blocking the main thread** → Mitigation: PapaParse's `worker: true` option can be enabled if performance becomes an issue; deferred to a follow-up.
- **IndexedDB quota** → Mitigation: Browser storage quotas are generous (typically GBs) for structured data; not a concern for typical CSV sizes.
- **Object store name collisions** from URL slugging → Mitigation: Use a deterministic hash (short SHA-1 or similar) appended to the slug to ensure uniqueness.

## Open Questions

- Should the UI allow users to enter the CSV URL, or is it configured at build time? (Assumed: runtime user input for now; can be constrained later.)
