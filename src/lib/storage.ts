import type { CustomActivity, UserSettings } from "../types";

export const STORAGE_KEY = "life-timer-settings-v1";

export const defaultSettings: UserSettings = {
  birthDate: "",
  expectedLifespan: 83,
  retirementAge: 65,
  sleepHoursPerDay: 8,
  workHoursPerWorkday: 8,
  workdaysPerWeek: 5,
  foodHoursPerDay: 2,
  commuteHoursPerWorkday: 1,
  customActivities: [],
  language: "en",
};

function normalizeNumber(value: unknown, fallback: number, min = 0, max = 24): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(Math.max(value, min), max);
}

function normalizeCustomActivities(value: unknown): CustomActivity[] {
  if (!Array.isArray(value)) return [];

  return value.map((activity, index) => {
    const raw = activity as Partial<CustomActivity>;
    return {
      id: typeof raw.id === "string" && raw.id ? raw.id : `activity-${index + 1}`,
      name: typeof raw.name === "string" ? raw.name : "",
      sessionsPerWeek: normalizeNumber(raw.sessionsPerWeek, 0, 0, 21),
      hoursPerSession: normalizeNumber(raw.hoursPerSession, 0, 0, 24),
      commuteHoursPerSession: normalizeNumber(raw.commuteHoursPerSession, 0, 0, 24),
      years: normalizeNumber(raw.years, 0, 0, 130),
    };
  });
}

export function normalizeSettings(value: Partial<UserSettings> | null | undefined): UserSettings {
  return {
    ...defaultSettings,
    birthDate: typeof value?.birthDate === "string" ? value.birthDate : defaultSettings.birthDate,
    expectedLifespan: normalizeNumber(value?.expectedLifespan, defaultSettings.expectedLifespan, 1, 130),
    retirementAge: normalizeNumber(value?.retirementAge, defaultSettings.retirementAge, 0, 130),
    sleepHoursPerDay: normalizeNumber(value?.sleepHoursPerDay, defaultSettings.sleepHoursPerDay),
    workHoursPerWorkday: normalizeNumber(value?.workHoursPerWorkday, defaultSettings.workHoursPerWorkday),
    workdaysPerWeek: normalizeNumber(value?.workdaysPerWeek, defaultSettings.workdaysPerWeek, 0, 7),
    foodHoursPerDay: normalizeNumber(value?.foodHoursPerDay, defaultSettings.foodHoursPerDay),
    commuteHoursPerWorkday: normalizeNumber(value?.commuteHoursPerWorkday, defaultSettings.commuteHoursPerWorkday),
    customActivities: normalizeCustomActivities(value?.customActivities),
    language: value?.language === "ru" ? "ru" : "en",
  };
}

export function loadSettings(storage: Storage = window.localStorage): UserSettings {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) return defaultSettings;

  try {
    return normalizeSettings(JSON.parse(raw) as Partial<UserSettings>);
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings: UserSettings, storage: Storage = window.localStorage): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(normalizeSettings(settings)));
}
