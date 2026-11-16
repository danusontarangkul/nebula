import { describe, expect, it } from "vitest";
import type { KitEvent, KitTimeline } from "../types/data.ts";
import { buildKitTimelines } from "./kitTimelines.ts";

const makeEvent = (kitId: string, eventType: string, occurredAt: string): KitEvent => ({
  eventId: `evt_${kitId}_${eventType}_${occurredAt}`,
  orderId: "ord_1",
  kitId,
  eventType,
  occurredAt,
  source: "system",
});

describe("buildKitTimelines", () => {
  it("groups event times by kit and stage", () => {
    const timelines: Map<string, KitTimeline> = buildKitTimelines([
      makeEvent("kit_1", "kit_shipped", "2026-05-01T00:00:00Z"),
      makeEvent("kit_1", "kit_delivered", "2026-05-04T00:00:00Z"),
    ]);
    const timeline: KitTimeline | undefined = timelines.get("kit_1");
    expect(timeline?.orderId).toBe("ord_1");
    expect(timeline?.times.get("kit_shipped")).toBe(Date.UTC(2026, 4, 1));
    expect(timeline?.times.get("kit_delivered")).toBe(Date.UTC(2026, 4, 4));
  });

  it("keeps the earliest time when an event repeats", () => {
    const timelines: Map<string, KitTimeline> = buildKitTimelines([
      makeEvent("kit_1", "kit_shipped", "2026-05-03T00:00:00Z"),
      makeEvent("kit_1", "kit_shipped", "2026-05-01T00:00:00Z"),
    ]);
    expect(timelines.get("kit_1")?.times.get("kit_shipped")).toBe(Date.UTC(2026, 4, 1));
  });

  it("skips unknown event types and invalid timestamps", () => {
    const timelines: Map<string, KitTimeline> = buildKitTimelines([
      makeEvent("kit_1", "mystery_event", "2026-05-01T00:00:00Z"),
      makeEvent("kit_2", "kit_shipped", "not a date"),
    ]);
    expect(timelines.size).toBe(0);
  });
});
