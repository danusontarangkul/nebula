import { describe, expect, it } from "vitest";
import { formatCount, formatDays, formatDecimal, formatKitCount } from "./formatNumber.ts";

describe("formatCount", () => {
  it("adds thousands separators", () => {
    expect(formatCount(4376)).toBe("4,376");
  });
});

describe("formatDecimal", () => {
  it("rounds to one decimal place", () => {
    expect(formatDecimal(12.34)).toBe("12.3");
  });
});

describe("formatDays", () => {
  it("formats days with one decimal place by default", () => {
    expect(formatDays(4)).toBe("4.0 d");
  });

  it("formats days with the given decimal places", () => {
    expect(formatDays(7, 0)).toBe("7 d");
  });
});

describe("formatKitCount", () => {
  it("uses the singular for one kit", () => {
    expect(formatKitCount(1)).toBe("1 kit");
  });

  it("uses the plural otherwise", () => {
    expect(formatKitCount(0)).toBe("0 kits");
    expect(formatKitCount(1200)).toBe("1,200 kits");
  });
});
