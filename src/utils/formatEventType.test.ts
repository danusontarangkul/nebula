import { describe, expect, it } from "vitest";
import { formatEventType } from "./formatEventType.ts";

describe("formatEventType", () => {
  it("uses the label for a known pipeline event", () => {
    expect(formatEventType("kit_shipped")).toBe("Kit shipped");
  });

  it("shows unknown event types as they are", () => {
    expect(formatEventType("mystery_event")).toBe("mystery_event");
  });
});
