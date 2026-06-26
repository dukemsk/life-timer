# Life Timer Development Notes

## Current V1 Decisions
- Build as a local `React + TypeScript + Vite` app.
- Use `Vitest` for function and smoke tests.
- Store settings in `localStorage`.
- Default language is English.
- Russian is available through the `EN / RU` toggle.
- Birth date display follows the selected language: `MM/DD/YYYY` in English and `DD.MM.YYYY` in Russian.
- Birth date input auto-inserts `/` for English and `.` for Russian while the user types digits.
- Default expected lifespan is `83`.
- Default retirement age is `65`.
- Custom activities can be added from the inputs panel and are included in committed time.
- Custom activity number inputs accept comma or dot decimals and clear `0` on focus for easier replacement.
- Summary cards use compact duration labels such as `43г 4м` / `43y 4m`; the final date card is not shown.
- The estimated final year appears under expected lifespan after a valid birth date is entered.
- The necessary-time block shows years and days only; raw hours are hidden.
- Cell grids are only for years, months, weeks, and days.
- Each time grid is split into three independent rows: lived, committed remaining time, and clean remaining time.
- Hours and minutes are displayed as numbers.

## Modules
- `dateMath`: timeline and remaining-time calculations.
- `timeBudget`: recurring obligation and clean-time calculations.
- `storage`: defaults, normalization, persistence.
- `i18n`: copy dictionaries and translation helper.
- `components`: interface building blocks.

## Commands
- Install dependencies: `pnpm install`.
- Start local app: `pnpm dev`.
- Run tests: `pnpm test`.
- Build production version: `pnpm build`.

## Implementation Notes
- Keep business calculations out of React components when possible.
- Add tests before changing calculation rules.
- Update `ARCHITECTURE.md`, `BUSINESS_LOGIC.md`, and this file whenever behavior or structure changes.

## Future Changes Log
- V1: Initial calculator, bilingual UI, local persistence, cell grids, documentation, and tests.
