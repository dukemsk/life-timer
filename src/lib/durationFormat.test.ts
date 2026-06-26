import { describe, expect, it } from "vitest";
import { formatYearsMonthsDays } from "./durationFormat";

describe("durationFormat", () => {
  it("formats years and months when the remainder is more than a month", () => {
    expect(formatYearsMonthsDays(365.2425 * 10 + 30.436875 * 2, "en")).toBe("10y 2m");
  });

  it("formats years and days when the remainder is less than a month", () => {
    expect(formatYearsMonthsDays(365.2425 * 4 + 12, "ru")).toBe("4г 12д");
  });
});
