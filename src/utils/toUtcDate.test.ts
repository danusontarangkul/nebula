import { describe, expect, it } from "vitest";
import { toUtcDate } from "./toUtcDate.ts";

describe("toUtcDate", () => {
  it("parses Z timestamps", () => {
    expect(toUtcDate("2026-08-06T14:59:46Z")?.toISOString()).toBe("2026-08-06T14:59:46.000Z");
  });

  it("parses offset timestamps", () => {
    expect(toUtcDate("2026-08-06T09:59:46-05:00")?.toISOString()).toBe("2026-08-06T14:59:46.000Z");
  });

  it("treats naive timestamps as UTC", () => {
    expect(toUtcDate("2026-08-06 14:59:46")?.toISOString()).toBe("2026-08-06T14:59:46.000Z");
  });

  it("returns null for invalid input", () => {
    expect(toUtcDate("not a date")).toBeNull();
  });
});
