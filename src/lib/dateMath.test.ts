import { describe, expect, it } from "vitest";
import {
  calculateAge,
  calculateElapsedDays,
  calculateFinalDate,
  calculateRemainingBreakdown,
  formatDateForLanguage,
  formatDateTypingInput,
  parseDateOnly,
  parseLocalizedDateInput,
  toDateInputValue,
} from "./dateMath";

describe("dateMath", () => {
  it("calculates final date from birth date and expected lifespan", () => {
    const birthDate = parseDateOnly("1981-01-01")!;
    expect(toDateInputValue(calculateFinalDate(birthDate, 83))).toBe("2064-01-01");
  });

  it("calculates age before and after birthday", () => {
    const birthDate = parseDateOnly("1981-06-10")!;
    expect(calculateAge(birthDate, new Date(2026, 5, 9))).toBe(44);
    expect(calculateAge(birthDate, new Date(2026, 5, 10))).toBe(45);
  });

  it("calculates elapsed days", () => {
    expect(calculateElapsedDays(parseDateOnly("2026-01-01")!, new Date(2026, 0, 11))).toBe(10);
  });

  it("does not return negative remaining time", () => {
    const remaining = calculateRemainingBreakdown(new Date(2065, 0, 1), new Date(2064, 0, 1));
    expect(remaining.totalDays).toBe(0);
    expect(remaining.totalHours).toBe(0);
    expect(remaining.totalMinutes).toBe(0);
  });

  it("formats dates by selected language", () => {
    expect(formatDateForLanguage("1981-01-31", "en")).toBe("01/31/1981");
    expect(formatDateForLanguage("1981-01-31", "ru")).toBe("31.01.1981");
  });

  it("parses localized date inputs into ISO date values", () => {
    expect(parseLocalizedDateInput("01/31/1981", "en")).toBe("1981-01-31");
    expect(parseLocalizedDateInput("31.01.1981", "ru")).toBe("1981-01-31");
  });

  it("adds separators while typing localized date inputs", () => {
    expect(formatDateTypingInput("01", "en")).toBe("01");
    expect(formatDateTypingInput("010", "en")).toBe("01/0");
    expect(formatDateTypingInput("01011981", "en")).toBe("01/01/1981");
    expect(formatDateTypingInput("31011981", "ru")).toBe("31.01.1981");
  });
});
