import { beforeEach, describe, expect, it } from "vitest";
import { defaultSettings, loadSettings, saveSettings, STORAGE_KEY } from "./storage";

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("uses defaults when storage is empty", () => {
    expect(loadSettings()).toEqual(defaultSettings);
  });

  it("saves and restores selected language", () => {
    saveSettings({ ...defaultSettings, language: "ru" });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).language).toBe("ru");
    expect(loadSettings().language).toBe("ru");
  });

  it("saves and restores custom activities", () => {
    saveSettings({
      ...defaultSettings,
      customActivities: [
        {
          id: "music",
          name: "Music",
          sessionsPerWeek: 2,
          hoursPerSession: 1,
          commuteHoursPerSession: 1,
          years: 4,
        },
      ],
    });

    expect(loadSettings().customActivities[0]).toMatchObject({
      name: "Music",
      sessionsPerWeek: 2,
      hoursPerSession: 1,
      commuteHoursPerSession: 1,
      years: 4,
    });
  });

  it("falls back to defaults for broken json", () => {
    localStorage.setItem(STORAGE_KEY, "{");
    expect(loadSettings()).toEqual(defaultSettings);
  });
});
