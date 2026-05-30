## ADDED Requirements

### Requirement: Parse CSV text into records

The system SHALL parse a raw CSV string into an array of record objects using PapaParse with header row detection enabled. Each record SHALL be an object whose keys are the column headers and whose values are the corresponding cell values as strings.

#### Scenario: Valid CSV with header row

- **WHEN** a non-empty CSV string with a header row is parsed
- **THEN** the result is an array of objects, one per data row, with keys matching the header columns

#### Scenario: Empty CSV or header-only CSV

- **WHEN** a CSV string that contains only a header row or is empty is parsed
- **THEN** the result is an empty array and no error is thrown

#### Scenario: CSV with quoted fields containing commas or newlines

- **WHEN** CSV text contains fields that are quoted and contain commas or embedded newlines
- **THEN** those fields are parsed as single values without splitting on the embedded delimiter

#### Scenario: Parse errors in CSV content

- **WHEN** PapaParse reports one or more parse errors for a row
- **THEN** the system rejects with an error describing the first parse error encountered
