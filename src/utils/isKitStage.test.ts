import { describe, expect, it } from "vitest";
import { isKitStage } from "./isKitStage.ts";

describe("isKitStage", () => {
  it("accepts known pipeline events", () => {
    expect(isKitStage("kit_shipped")).toBe(true);
    expect(isKitStage("kit_replaced")).toBe(true);
  });

  it("rejects unknown values", () => {
    expect(isKitStage("mystery_event")).toBe(false);
    expect(isKitStage("")).toBe(false);
  });
});
