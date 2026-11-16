import { describe, expect, it } from "vitest";
import { toTime } from "./toTime.ts";

describe("toTime", () => {
  it("returns epoch milliseconds for a valid timestamp", () => {
    expect(toTime("2026-05-01T00:00:00Z")).toBe(Date.UTC(2026, 4, 1));
  });

  it("returns null for an invalid timestamp", () => {
    expect(toTime("not a date")).toBeNull();
  });
});
