import { describe, expect, it } from "vitest";
import { formatYearsMonthsDays } from "./durationFormat";

describe("durationFormat", () => {
  it("formats years and months when the remainder is more than a month", () => {
    expect(formatYearsMonthsDays(365.2425 * 10 + 30.436875 * 2, "en")).toBe("10y 2m");
  });

  it("formats years and days when the remainder is less than a month", () => {
    expect(formatYearsMonthsDays(365.2425 * 4 + 12, "ru")).toBe("4г 12д");
  });

  it("uses the Russian short year label for 5 through 20", () => {
    expect(formatYearsMonthsDays(365.2425 * 16 + 12, "ru")).toBe("16л 12д");
  });

  it("uses the Russian short year label after 20 based on the last digit", () => {
    expect(formatYearsMonthsDays(365.2425 * 21 + 12, "ru")).toBe("21г 12д");
    expect(formatYearsMonthsDays(365.2425 * 24 + 12, "ru")).toBe("24г 12д");
    expect(formatYearsMonthsDays(365.2425 * 25 + 12, "ru")).toBe("25л 12д");
  });
});
