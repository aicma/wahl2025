## ADDED Requirements

### Requirement: Filter Gebiete by name

The system SHALL provide a text input that, as the user types, filters the list of available Gebiete to those whose `Gebietsname` contains the search string (case-insensitive substring match). The input SHALL be operable entirely by keyboard.

#### Scenario: Typing narrows results

- **WHEN** the user types a substring into the search input
- **THEN** only Gebiete whose `Gebietsname` contains that substring (case-insensitive) are shown in the dropdown

#### Scenario: No match

- **WHEN** the typed string matches no `Gebietsname`
- **THEN** the dropdown displays an empty-state message and no options

#### Scenario: No records loaded

- **WHEN** no CSV records have been imported yet
- **THEN** the search input is disabled and shows a prompt to import data first

### Requirement: Group results by Gebietsart

The autocomplete dropdown SHALL group matching results under labelled section headings corresponding to `Gebietsart` values (Bund, Land, Wahlkreis). Groups with no matching results SHALL be hidden.

#### Scenario: Results span multiple Gebietsart groups

- **WHEN** the search query matches Gebiete in more than one `Gebietsart`
- **THEN** each non-empty group is shown under its own labelled heading

#### Scenario: Results in only one group

- **WHEN** all matching Gebiete share the same `Gebietsart`
- **THEN** only that group heading is shown
