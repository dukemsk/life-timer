import { describe, expect, it } from "vitest";
import { normalizeNumericInput, parseFlexibleNumber } from "./numberInput";

describe("numberInput", () => {
  it("parses dot and comma decimals", () => {
    expect(parseFlexibleNumber("2.5")).toBe(2.5);
    expect(parseFlexibleNumber("2,5")).toBe(2.5);
  });

  it("normalizes user input to decimal text", () => {
    expect(normalizeNumericInput("2,5")).toBe("2.5");
    expect(normalizeNumericInput("abc2,5h")).toBe("2.5");
    expect(normalizeNumericInput("092")).toBe("92");
    expect(normalizeNumericInput("08")).toBe("8");
    expect(normalizeNumericInput(",5")).toBe("0.5");
  });
});
