## ADDED Requirements

### Requirement: Read records from IndexedDB

The system SHALL retrieve all records from the IndexedDB object store associated with a given source URL and return them as an array of record objects. If no store exists for the given URL, the system SHALL return an empty array.

#### Scenario: Records exist for the URL

- **WHEN** records have previously been stored for a given URL
- **THEN** all records are returned as an array of objects matching what was stored

#### Scenario: No store exists for the URL

- **WHEN** no records have been stored for the given URL
- **THEN** an empty array is returned without error

#### Scenario: IndexedDB unavailable

- **WHEN** the browser does not support IndexedDB or access is blocked
- **THEN** the system rejects with a descriptive error indicating IndexedDB is unavailable
