# Life Timer Business Logic

## What It Is
Life Timer is a personal time-awareness calculator. It helps a user understand how much time they have already lived, how much time may remain, and how much of that remaining time is likely to be truly personal after recurring obligations.

## Problem It Solves
People usually think about life in years, but years hide the practical cost of sleep, work, meals, and commuting. Life Timer turns those abstract years into visible days, hours, and cell grids so the user can make better decisions about attention, priorities, and habits.

## Audience
The app is for people who want a calm, direct way to reflect on time without a dramatic or fear-based interface.

## Inputs
- Birth date.
- Expected lifespan in years.
- Retirement age.
- Sleep hours per day.
- Work hours per workday.
- Workdays per week.
- Food hours per day.
- Commute hours per workday.
- Custom activities with name, weekly frequency, hours per session, commute time per session, and planned years.
- Interface language.

## Outputs
- Current age.
- Estimated final year under expected lifespan.
- Lived days.
- Remaining years, months, weeks, days, hours, and minutes.
- Necessary time for sleep, work, food, commute, and custom activities.
- Clean personal time in days and hours.
- Cell grids for years, months, weeks, and days.
- Each cell grid separates lived time, required remaining time, and clean remaining time into independent rows.

## Calculation Rules
- Final date equals birth date plus expected lifespan.
- Birth date is displayed as `MM/DD/YYYY` in English and `DD.MM.YYYY` in Russian, while the stored value remains ISO `YYYY-MM-DD`.
- Sleep and food are counted every calendar day.
- Work and commute are counted only by the selected workdays-per-week ratio.
- Work and work commute are counted only until the retirement age.
- Custom activities are counted by weekly frequency multiplied by session hours plus activity commute time.
- Custom activity years limit the calculation period; `0` means the activity continues until the final date.
- Clean personal time equals remaining hours minus sleep, work, food, commute, and custom activities.
- Negative remaining time is never shown.

## Limits Of V1
- The app is not a medical, actuarial, or statistical prediction tool.
- All calculations are approximate.
- There are no accounts, server storage, or device sync.
- Calendar months in visual summaries are approximate for readability.
