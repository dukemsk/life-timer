import { describe, expect, it } from "vitest";
import { defaultSettings } from "./storage";
import {
  calculateCommuteHours,
  calculateCustomActivityHours,
  calculateFoodHours,
  calculateSleepHours,
  calculateTimeBudget,
  calculateWorkHours,
} from "./timeBudget";

describe("timeBudget", () => {
  it("calculates sleep for every remaining day", () => {
    expect(calculateSleepHours(10, 8)).toBe(80);
  });

  it("calculates food for every remaining day", () => {
    expect(calculateFoodHours(10, 2)).toBe(20);
  });

  it("calculates work by workdays per week", () => {
    expect(calculateWorkHours(14, 8, 5)).toBe(80);
  });

  it("calculates commute by workdays per week", () => {
    expect(calculateCommuteHours(14, 1, 5)).toBe(10);
  });

  it("calculates clean time from remaining hours minus committed hours", () => {
    const budget = calculateTimeBudget(14 * 24, 14, defaultSettings);
    expect(budget.committedHours).toBe(230);
    expect(budget.cleanHours).toBe(106);
    expect(budget.cleanDays).toBeCloseTo(4.416);
  });

  it("limits work and commute to days before retirement", () => {
    const budget = calculateTimeBudget(28 * 24, 28, defaultSettings, 14);
    expect(budget.workHours).toBe(80);
    expect(budget.commuteHours).toBe(10);
  });

  it("calculates custom activities from weekly frequency, duration, commute, and years", () => {
    const activities = calculateCustomActivityHours(365, {
      ...defaultSettings,
      customActivities: [
        {
          id: "gym",
          name: "Gym",
          sessionsPerWeek: 4,
          hoursPerSession: 2,
          commuteHoursPerSession: 1,
          years: 0,
        },
      ],
    });

    expect(activities[0].hours).toBeCloseTo((365 / 7) * 12);
  });
});
