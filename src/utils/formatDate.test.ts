import { describe, expect, it } from "vitest";
import { formatTimestamp, formatUtcDate, formatUtcDateTime } from "./formatDate.ts";

describe("formatUtcDate", () => {
  it("formats a time as a UTC calendar date", () => {
    expect(formatUtcDate(Date.UTC(2026, 9, 19, 23, 46))).toBe("Oct 19, 2026");
  });
});

describe("formatUtcDateTime", () => {
  it("formats a time as a UTC date and time", () => {
    expect(formatUtcDateTime(Date.UTC(2026, 7, 6, 14, 59))).toBe("Aug 6, 2026, 14:59 UTC");
  });
});

describe("formatTimestamp", () => {
  it("formats a parseable timestamp as a UTC date and time", () => {
    expect(formatTimestamp("2026-08-06T09:59:46-05:00")).toBe("Aug 6, 2026, 14:59 UTC");
  });

  it("shows an unparseable timestamp as it is", () => {
    expect(formatTimestamp("not a date")).toBe("not a date");
  });
});
