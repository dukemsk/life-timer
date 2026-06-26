import type { Language } from "../types";

const DAYS_PER_YEAR = 365.2425;
const DAYS_PER_MONTH = 30.436875;

export function formatYearsMonthsDays(totalDays: number, language: Language): string {
  const safeDays = Math.max(0, Math.round(totalDays));
  const years = Math.floor(safeDays / DAYS_PER_YEAR);
  const afterYears = Math.round(safeDays - years * DAYS_PER_YEAR);
  const months = Math.floor(afterYears / DAYS_PER_MONTH);
  const days = Math.max(0, Math.round(afterYears - months * DAYS_PER_MONTH));

  const yearLabel = language === "ru" ? "г" : "y";
  const monthLabel = language === "ru" ? "м" : "m";
  const dayLabel = language === "ru" ? "д" : "d";

  if (years > 0 && months > 0) return `${years}${yearLabel} ${months}${monthLabel}`;
  if (years > 0) return `${years}${yearLabel} ${days}${dayLabel}`;
  if (months > 0) return `${months}${monthLabel} ${days}${dayLabel}`;
  return `${days}${dayLabel}`;
}
