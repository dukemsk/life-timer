import type { Language, TimeBreakdown } from "../types";

export const MS_PER_MINUTE = 60 * 1000;
export const MS_PER_HOUR = 60 * MS_PER_MINUTE;
export const MS_PER_DAY = 24 * MS_PER_HOUR;

export function parseDateOnly(value: string): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match;
  const parsed = new Date(Number(year), Number(month) - 1, Number(day));
  if (
    parsed.getFullYear() !== Number(year) ||
    parsed.getMonth() !== Number(month) - 1 ||
    parsed.getDate() !== Number(day)
  ) {
    return null;
  }
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatDateForLanguage(value: string, language: Language): string {
  const date = parseDateOnly(value);
  if (!date) return value;
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());

  return language === "en" ? `${month}/${day}/${year}` : `${day}.${month}.${year}`;
}

export function formatDateTypingInput(value: string, language: Language): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  const separator = language === "en" ? "/" : ".";
  const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean);

  return parts.join(separator);
}

export function parseLocalizedDateInput(value: string, language: Language): string | null {
  const trimmed = value.trim();
  const isoDate = parseDateOnly(trimmed);
  if (isoDate) return toDateInputValue(isoDate);

  const pattern = language === "en" ? /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/ : /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/;
  const match = pattern.exec(trimmed);
  if (!match) return null;

  const [, first, second, year] = match;
  const month = language === "en" ? Number(first) : Number(second);
  const day = language === "en" ? Number(second) : Number(first);
  const parsed = new Date(Number(year), month - 1, day);
  if (parsed.getFullYear() !== Number(year) || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }

  return toDateInputValue(parsed);
}

export function addYears(date: Date, years: number): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
}

export function calculateFinalDate(birthDate: Date, expectedLifespan: number): Date {
  return addYears(birthDate, expectedLifespan);
}

export function calculateAge(birthDate: Date, now: Date): number {
  let age = now.getFullYear() - birthDate.getFullYear();
  const birthdayThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (now < birthdayThisYear) {
    age -= 1;
  }
  return Math.max(0, age);
}

export function diffDays(start: Date, end: Date): number {
  const startMidnight = new Date(start);
  const endMidnight = new Date(end);
  startMidnight.setHours(0, 0, 0, 0);
  endMidnight.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((endMidnight.getTime() - startMidnight.getTime()) / MS_PER_DAY));
}

export function calculateElapsedDays(birthDate: Date, now: Date): number {
  return diffDays(birthDate, now);
}

export function calculateRemainingBreakdown(now: Date, finalDate: Date): TimeBreakdown {
  const totalMinutes = Math.max(0, Math.floor((finalDate.getTime() - now.getTime()) / MS_PER_MINUTE));
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const years = Math.floor(totalDays / 365.2425);
  const months = Math.floor(totalDays / 30.436875);
  const weeks = Math.floor(totalDays / 7);
  const days = totalDays;
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    totalDays,
    totalHours,
    totalMinutes,
  };
}

export function hasReachedFinalDate(now: Date, finalDate: Date): boolean {
  return now.getTime() >= finalDate.getTime();
}
