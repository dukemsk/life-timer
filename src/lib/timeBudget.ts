import type { TimeBudget, UserSettings } from "../types";

export function calculateSleepHours(remainingDays: number, sleepHoursPerDay: number): number {
  return Math.max(0, remainingDays) * Math.max(0, sleepHoursPerDay);
}

export function calculateFoodHours(remainingDays: number, foodHoursPerDay: number): number {
  return Math.max(0, remainingDays) * Math.max(0, foodHoursPerDay);
}

export function calculateWorkHours(
  remainingDays: number,
  workHoursPerWorkday: number,
  workdaysPerWeek: number,
): number {
  const workdayRatio = Math.min(Math.max(workdaysPerWeek, 0), 7) / 7;
  return Math.max(0, remainingDays) * workdayRatio * Math.max(0, workHoursPerWorkday);
}

export function calculateCommuteHours(
  remainingDays: number,
  commuteHoursPerWorkday: number,
  workdaysPerWeek: number,
): number {
  const workdayRatio = Math.min(Math.max(workdaysPerWeek, 0), 7) / 7;
  return Math.max(0, remainingDays) * workdayRatio * Math.max(0, commuteHoursPerWorkday);
}

export function calculateCustomActivityHours(remainingDays: number, settings: UserSettings): TimeBudget["customActivities"] {
  return settings.customActivities
    .map((activity) => {
      const activeDays = activity.years > 0 ? Math.min(remainingDays, activity.years * 365.2425) : remainingDays;
      const weeklyHours = activity.sessionsPerWeek * (activity.hoursPerSession + activity.commuteHoursPerSession);
      return {
        id: activity.id,
        name: activity.name,
        hours: Math.max(0, activeDays) * (Math.max(0, weeklyHours) / 7),
      };
    })
    .filter((activity) => activity.hours > 0);
}

export function calculateTimeBudget(
  remainingHours: number,
  remainingDays: number,
  settings: UserSettings,
  workEligibleDays = remainingDays,
): TimeBudget {
  const sleepHours = calculateSleepHours(remainingDays, settings.sleepHoursPerDay);
  const workHours = calculateWorkHours(workEligibleDays, settings.workHoursPerWorkday, settings.workdaysPerWeek);
  const foodHours = calculateFoodHours(remainingDays, settings.foodHoursPerDay);
  const commuteHours = calculateCommuteHours(workEligibleDays, settings.commuteHoursPerWorkday, settings.workdaysPerWeek);
  const customActivities = calculateCustomActivityHours(remainingDays, settings);
  const customActivityHours = customActivities.reduce((total, activity) => total + activity.hours, 0);
  const committedHours = sleepHours + workHours + foodHours + commuteHours + customActivityHours;
  const cleanHours = Math.max(0, remainingHours - committedHours);

  return {
    sleepHours,
    workHours,
    foodHours,
    commuteHours,
    customActivityHours,
    customActivities,
    committedHours,
    cleanHours,
    cleanDays: cleanHours / 24,
  };
}
