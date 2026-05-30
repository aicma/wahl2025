## ADDED Requirements

### Requirement: Persist selected Gebiet to URL and localStorage

When the user selects a Gebiet from the autocomplete, the system SHALL write the `Gebietsnummer` to the URL as a `?gebiet=` query parameter using `history.replaceState` and SHALL also write it to `localStorage` under a dedicated key.

#### Scenario: User selects a Gebiet

- **WHEN** the user selects an item from the autocomplete dropdown
- **THEN** the URL is updated to include `?gebiet=<Gebietsnummer>` without a page reload
- **AND** the same value is written to `localStorage`

#### Scenario: User clears the selection

- **WHEN** the user clears the autocomplete input or removes the selection
- **THEN** the `?gebiet=` parameter is removed from the URL
- **AND** the `localStorage` entry is removed

### Requirement: Restore selected Gebiet on load

On page load the system SHALL restore the previously selected Gebiet. The URL query parameter `?gebiet=` takes priority over `localStorage`. If the stored `Gebietsnummer` does not exist in the loaded records, the selection SHALL be silently discarded.

#### Scenario: Valid Gebietsnummer in URL on load

- **WHEN** the page loads with `?gebiet=<Gebietsnummer>` in the URL
- **THEN** the autocomplete input displays the corresponding `Gebietsname` as the current selection

#### Scenario: No URL param but localStorage value present

- **WHEN** the page loads without a `?gebiet=` parameter but a value exists in `localStorage`
- **THEN** the autocomplete restores the selection from `localStorage`

#### Scenario: Stored Gebietsnummer not in records

- **WHEN** the stored or URL-provided `Gebietsnummer` does not match any loaded record
- **THEN** no selection is shown and no error is thrown
