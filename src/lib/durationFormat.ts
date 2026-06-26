import type { Language } from "../types";

const DAYS_PER_YEAR = 365.2425;
const DAYS_PER_MONTH = 30.436875;

function getShortYearLabel(years: number, language: Language): string {
  if (language === "en") return "y";

  const mod10 = years % 10;
  const mod100 = years % 100;

  if (mod10 >= 1 && mod10 <= 4 && (mod100 < 11 || mod100 > 14)) {
    return "г";
  }

  return "л";
}

export function formatYearsMonthsDays(totalDays: number, language: Language): string {
  const safeDays = Math.max(0, Math.round(totalDays));
  const years = Math.floor(safeDays / DAYS_PER_YEAR);
  const afterYears = Math.round(safeDays - years * DAYS_PER_YEAR);
  const months = Math.floor(afterYears / DAYS_PER_MONTH);
  const days = Math.max(0, Math.round(afterYears - months * DAYS_PER_MONTH));

  const yearLabel = getShortYearLabel(years, language);
  const monthLabel = language === "ru" ? "м" : "m";
  const dayLabel = language === "ru" ? "д" : "d";

  if (years > 0 && months > 0) return `${years}${yearLabel} ${months}${monthLabel}`;
  if (years > 0) return `${years}${yearLabel} ${days}${dayLabel}`;
  if (months > 0) return `${months}${monthLabel} ${days}${dayLabel}`;
  return `${days}${dayLabel}`;
}
