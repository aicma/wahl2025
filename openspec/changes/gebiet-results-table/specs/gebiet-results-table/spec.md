## ADDED Requirements

### Requirement: Show imported rows for the selected Gebiet

The system SHALL render a results table for the currently selected Gebiet using the imported CSV rows whose `Gebietsart` and `Gebietsnummer` match the active selection.

#### Scenario: Matching rows exist for the selected Gebiet

- **GIVEN** CSV data has been imported into IndexedDB
- **AND** the user has selected a Gebiet from the autocomplete
- **WHEN** matching rows exist for that Gebiet
- **THEN** the app shows a table below the selector
- **AND** the table contains the matching imported rows for that Gebiet
- **AND** the table headers correspond to the CSV fields present in those rows

#### Scenario: Selection changes to a different Gebiet

- **GIVEN** the app is already showing a results table for one selected Gebiet
- **WHEN** the user selects a different Gebiet
- **THEN** the existing table is replaced with the rows for the newly selected Gebiet

### Requirement: Explain empty and unavailable result states

The system SHALL provide explicit non-table states when the selected Gebiet cannot produce visible rows yet.

#### Scenario: No Gebiet is selected

- **GIVEN** CSV data may or may not already be imported
- **WHEN** there is no active Gebiet selection
- **THEN** the app shows a prompt telling the user to select a Gebiet to see results
- **AND** no stale results table remains visible

#### Scenario: No data has been imported yet

- **GIVEN** there are no stored CSV rows in IndexedDB for the configured source URL
- **WHEN** the app renders the results area
- **THEN** it shows a prompt telling the user to import data before results can be displayed

#### Scenario: The selected Gebiet has no stored rows

- **GIVEN** CSV data has been imported
- **AND** the user has selected a Gebiet
- **WHEN** no stored rows match that Gebiet's `Gebietsart` and `Gebietsnummer`
- **THEN** the app shows an empty-state message for that Gebiet instead of an empty table

### Requirement: Keep the results table aligned with imported data

The system SHALL refresh the selected Gebiet's displayed rows after a successful re-import of the CSV source.

#### Scenario: Data is re-imported while a Gebiet is selected

- **GIVEN** a Gebiet is selected and its results are currently visible
- **WHEN** the user successfully re-imports the CSV data
- **THEN** the app reloads the matching rows for the selected Gebiet from IndexedDB
- **AND** the table reflects the latest imported data
