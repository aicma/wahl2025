## MODIFIED Requirements

### Requirement: Show imported rows for the selected Gebiet

The system SHALL render a results table for the currently selected Gebiet using the imported CSV rows whose `Gebietsart` and `Gebietsnummer` match the active selection. The table SHALL be hidden by default; the pie chart is the primary results view.

#### Scenario: Matching rows exist for the selected Gebiet

- **GIVEN** CSV data has been imported into IndexedDB
- **AND** the user has selected a Gebiet from the autocomplete
- **WHEN** matching rows exist for that Gebiet
- **THEN** the app shows the pie chart above the (hidden) table
- **AND** the table exists in the DOM but is not visible by default
- **AND** the table contains the matching imported rows for that Gebiet

#### Scenario: Selection changes to a different Gebiet

- **GIVEN** the app is already showing results for one selected Gebiet
- **WHEN** the user selects a different Gebiet
- **THEN** the existing chart and table are replaced with results for the newly selected Gebiet
