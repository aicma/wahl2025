# Wahlergebnis viewer

## Stack
- Vite + React + Typescript
- Shadcn + RadixUI for quick UI development (Benefit of owning the components, only adding components that are really used)
- Papaparse + Tanstack Table for CSV parsing and Table-Display
- recharts for diagram display

## Decisions

- No Router since Single View Application
- Do not use indexedDb for first version but load csv on build and serve as static asset. 
- Tried Openspec for Agentic Coding - ended up refactoring most of the results away manually since it got cluttered quite a bit 
- use ZOD to verify incoming data is valid for display
- target Device is Desktop. Large Mobile devices work too. But <460px is not supported

## Features
- up to 4 Region Panels
- as soon as >1 Panels are selected sticky compare view is displayed
- Light/Dark/System Colors modes

## Testing

### Unit tests

No setup required beyond `npm install`.

```bash
npm test
```

Powered by [Vitest](https://vitest.dev/). Tests live alongside source files as `*.test.ts`.

Currently covers `src/lib/parseCsv.ts`:
- Parses a valid CSV string and returns the correct rows
- Rejects a malformed CSV string (e.g. unterminated quote) with a parse error
- Validates rows against a Zod schema and rejects on schema violations
- Respects the `skipLines` option to strip leading metadata rows
- Strips a UTF-8 BOM when present

### E2E tests

Powered by [Playwright](https://playwright.dev/) (Chromium). Tests live in `e2e/`. The Vite dev server is started automatically before the suite runs.

#### First-time setup

**1. Install the Playwright Chromium browser** (one-time, downloads ~300 MB):

```bash
npx playwright install chromium
```

**2. Install system libraries** required by Chromium.

Option A — with sudo (recommended, permanent):
```bash
sudo npx playwright install-deps chromium
```

Option B — without sudo (extract locally, survives only until `/tmp` is cleared):
```bash
cd /tmp
apt-get download libnspr4 libnss3 libasound2 libgbm1 libwayland-server0
mkdir -p /tmp/pw-libs
for deb in libnspr4*.deb libnss3*.deb libasound2*.deb libgbm1*.deb libwayland-server0*.deb; do
  dpkg-deb -x "$deb" /tmp/pw-libs
done
```

#### Running the tests

With sudo/system libs installed (Option A):
```bash
npm run test:e2e
```

With locally extracted libs (Option B):
```bash
LD_LIBRARY_PATH=/tmp/pw-libs/usr/lib/x86_64-linux-gnu npm run test:e2e
```

#### What is tested (`e2e/gebiet-panel.spec.ts`)

- On first load, exactly one panel is rendered
- The single panel has no close button
- Clicking "+ Add Gebiet" adds a second panel pre-filled with the default region (Bundesgebiet)

## ToDo
- ~~Add meaningful Test for parser.~~
- fix Denglish 
- Display the change from prior Election on Chart Tooltips

### Work time 
- started on it at Saturday ~10am and finished at ~8.30pm. Sunday: Review Session with AI Agents + cleanup + minor improvements/fixes 
- this includes Initial Project setup, Lunch (~45min), Dog Walks(~30min), and research + debugging of github pages deployment


