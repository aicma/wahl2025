## ADDED Requirements

### Requirement: Persist parsed CSV records to IndexedDB

The system SHALL open (or create) an IndexedDB database and write all parsed CSV records into an object store named after a deterministic slug derived from the source URL. Each write operation SHALL replace the entire contents of that object store, discarding any previously stored records for the same source URL.

#### Scenario: First-time store for a URL

- **WHEN** records are stored for a URL that has no existing IndexedDB object store
- **THEN** a new object store is created and all records are written to it

#### Scenario: Re-import replaces existing records

- **WHEN** records are stored for a URL that already has an object store with data
- **THEN** all prior records in that store are removed and replaced with the new records

#### Scenario: Empty record set

- **WHEN** an empty array of records is stored
- **THEN** the object store is created (or cleared) and no records are written; no error is thrown

#### Scenario: IndexedDB unavailable

- **WHEN** the browser does not support IndexedDB or access is blocked (e.g., private browsing restriction)
- **THEN** the system rejects with a descriptive error indicating IndexedDB is unavailable
