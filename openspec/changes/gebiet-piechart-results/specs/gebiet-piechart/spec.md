## ADDED Requirements

### Requirement: Pie chart renders Zweitstimmen distribution

The system SHALL render a `GebietPiechart` component that displays a pie chart of Zweitstimmen (`Stimme === 2`) by `Gruppenname` using `Anzahl` as the slice value, derived from the `resultRows` passed to it.

#### Scenario: Chart renders with valid result rows

- **WHEN** `resultRows` contains entries with `Stimme === 2` and `Anzahl > 0`
- **THEN** the pie chart displays one slice per qualifying row, labelled with `Gruppenname` and `Prozent`

#### Scenario: Rows without Anzahl are excluded

- **WHEN** a result row has `Stimme === 2` but `Anzahl` is `undefined` or `0`
- **THEN** that row is not rendered as a slice

#### Scenario: No qualifying rows

- **WHEN** `resultRows` contains no entries with `Stimme === 2` and `Anzahl > 0`
- **THEN** the component renders a fallback message instead of an empty chart

#### Scenario: Chart is positioned above the table

- **WHEN** a Gebiet is selected and result rows are available
- **THEN** `GebietPiechart` is rendered above the results table in the layout
