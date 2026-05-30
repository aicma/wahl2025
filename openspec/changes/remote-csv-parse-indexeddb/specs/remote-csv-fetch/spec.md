## ADDED Requirements

### Requirement: Fetch CSV from remote URL

The system SHALL fetch the raw text content of a CSV file from a caller-supplied remote URL using the browser's native `fetch` API. The fetch SHALL reject with a descriptive error when the HTTP response status is not in the 2xx range or when a network/CORS failure occurs.

#### Scenario: Successful fetch

- **WHEN** a valid, CORS-accessible CSV URL is provided
- **THEN** the system returns the full response body as a UTF-8 string

#### Scenario: HTTP error response

- **WHEN** the remote server responds with a non-2xx status code
- **THEN** the system rejects with an error that includes the HTTP status code

#### Scenario: Network or CORS failure

- **WHEN** the fetch fails due to a network error or a CORS policy rejection
- **THEN** the system rejects with an error identifying the failure as a network/CORS issue
