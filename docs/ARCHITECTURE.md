# Life Timer Architecture

## Overview
Life Timer is a local React application. It keeps all user data in the browser, performs all calculations on the client, and renders the calculator as the first screen.

## Main Modules
- `src/lib/dateMath.ts`: date parsing, final date calculation, current age, lived days, remaining time, and non-negative guards.
- `src/lib/timeBudget.ts`: sleep, work, food, commute, custom activities, committed time, and clean personal time calculations.
- `src/lib/storage.ts`: default settings, localStorage read/write, and settings normalization.
- `src/lib/i18n.ts`: English and Russian dictionaries plus the translation helper.
- `src/components/*`: form controls, language toggle, summary cards, grid visualization, and required-time breakdown.

## Data Flow
1. `App` loads settings from `localStorage` through `loadSettings`.
2. User edits settings in `SettingsForm`.
3. `App` saves settings through `saveSettings`.
4. `dateMath` calculates the timeline from birth date, current date, expected lifespan, and retirement date.
5. `timeBudget` calculates required time and clean personal time from the remaining days/hours, retirement-limited work days, and custom activities.
6. Components render summary cards, cell grids, and budget rows.

## UI Structure
The interface has a left input panel and a right results panel on desktop. On smaller screens the panels stack vertically. The first screen is the calculator itself, not a marketing page.

## Adding New Parameters
To add a new time parameter:
1. Add it to `UserSettings` in `src/types.ts`.
2. Add a default and normalization rule in `src/lib/storage.ts`.
3. Add labels in both dictionaries in `src/lib/i18n.ts`.
4. Add the input in `SettingsForm`.
5. Add calculation logic in `timeBudget` if it affects clean time.
6. Add or update tests for the calculation and storage behavior.

## Version Notes
All future architecture changes should be reflected here and summarized in `docs/DEVELOPMENT_NOTES.md`.
