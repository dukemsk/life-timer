export type Language = "en" | "ru";

export type CustomActivity = {
  id: string;
  name: string;
  sessionsPerWeek: number;
  hoursPerSession: number;
  commuteHoursPerSession: number;
  years: number;
};

export type UserSettings = {
  birthDate: string;
  expectedLifespan: number;
  retirementAge: number;
  sleepHoursPerDay: number;
  workHoursPerWorkday: number;
  workdaysPerWeek: number;
  foodHoursPerDay: number;
  commuteHoursPerWorkday: number;
  customActivities: CustomActivity[];
  language: Language;
};

export type TimeBreakdown = {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
};

export type TimeBudget = {
  sleepHours: number;
  workHours: number;
  foodHours: number;
  commuteHours: number;
  customActivityHours: number;
  customActivities: Array<Pick<CustomActivity, "id" | "name"> & { hours: number }>;
  committedHours: number;
  cleanHours: number;
  cleanDays: number;
};
