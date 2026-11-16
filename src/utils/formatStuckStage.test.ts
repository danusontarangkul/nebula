import { describe, expect, it } from "vitest";
import { formatStuckStage } from "./formatStuckStage.ts";

describe("formatStuckStage", () => {
  it("labels orders that have not shipped", () => {
    expect(formatStuckStage("awaiting_shipment")).toBe("Awaiting shipment");
  });

  it("uses the pipeline label for kit stages", () => {
    expect(formatStuckStage("kit_delivered")).toBe("Kit delivered");
  });
});
