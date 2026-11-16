import { describe, expect, it } from "vitest";
import type { Dataset, KitEvent, KitTimeline, Order, StuckKitsSummary } from "../types/data.ts";
import { buildKitTimelines } from "./kitTimelines.ts";
import { buildStuckKits, getAsOfTime } from "./stuckKits.ts";

type OrderOverrides = Partial<Pick<Order, "product" | "status" | "isTest">>;

const makeOrder = (orderId: string, overrides: OrderOverrides = {}): Order => ({
  orderId,
  createdAt: "2026-05-01T00:00:00Z",
  customerId: "cus_1",
  product: overrides.product ?? "wgs_30x",
  country: "US",
  status: overrides.status ?? "paid",
  isTest: overrides.isTest ?? "false",
});

const makeEvent = (orderId: string, kitId: string, eventType: string, occurredAt: string): KitEvent => ({
  eventId: `evt_${kitId}_${eventType}_${occurredAt}`,
  orderId,
  kitId,
  eventType,
  occurredAt,
  source: "system",
});

const AS_OF_EVENT: KitEvent = makeEvent("ord_clock", "kit_clock", "report_ready", "2026-10-20T00:00:00Z");

describe("getAsOfTime", () => {
  it("returns the latest event time", () => {
    const timelines: Map<string, KitTimeline> = buildKitTimelines([
      makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-01T00:00:00Z"),
      makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-09T00:00:00Z"),
    ]);
    expect(getAsOfTime(timelines)).toBe(Date.UTC(2026, 4, 9));
  });

  it("returns null when there are no events", () => {
    expect(getAsOfTime(new Map())).toBeNull();
  });
});

describe("buildStuckKits", () => {
  it("lists kits past their current stage's target, measured to the as-of date", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1"), makeOrder("ord_2", { product: "wgs_100x" })],
      kitEvents: [
        AS_OF_EVENT,
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-10-03T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "kit_shipped", "2026-10-15T00:00:00Z"),
      ],
    };
    const summary: StuckKitsSummary = buildStuckKits(dataset);
    expect(summary.asOfTime).toBe(Date.UTC(2026, 9, 20));
    expect(summary.kits).toEqual([
      { orderId: "ord_1", kitId: "kit_1", product: "wgs_30x", currentStage: "kit_shipped", daysOverTarget: 10 },
    ]);
  });

  it("sorts by days over target, longest first", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1"), makeOrder("ord_2")],
      kitEvents: [
        AS_OF_EVENT,
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-08-01T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "sample_received", "2026-09-01T00:00:00Z"),
      ],
    };
    const summary: StuckKitsSummary = buildStuckKits(dataset);
    expect(summary.kits.map((kit: StuckKitsSummary["kits"][number]): string => kit.kitId)).toEqual([
      "kit_2",
      "kit_1",
    ]);
  });

  it("uses the furthest stage even when an earlier scan is missing", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1")],
      kitEvents: [
        AS_OF_EVENT,
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-06-01T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "sample_received", "2026-09-01T00:00:00Z"),
      ],
    };
    const summary: StuckKitsSummary = buildStuckKits(dataset);
    expect(summary.kits[0]?.currentStage).toBe("sample_received");
  });

  it("excludes completed and replaced kits", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1")],
      kitEvents: [
        AS_OF_EVENT,
        makeEvent("ord_1", "kit_1", "sequencing_complete", "2026-06-01T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "report_ready", "2026-06-03T00:00:00Z"),
        makeEvent("ord_1", "kit_2", "kit_shipped", "2026-06-01T00:00:00Z"),
        makeEvent("ord_1", "kit_2", "kit_replaced", "2026-06-16T00:00:00Z"),
      ],
    };
    expect(buildStuckKits(dataset).kits).toEqual([]);
  });

  it("excludes cancelled, refunded, test, and orphan kits", () => {
    const dataset: Dataset = {
      orders: [
        makeOrder("ord_cancelled", { status: "cancelled" }),
        makeOrder("ord_refunded", { status: "refunded" }),
        makeOrder("ord_test", { isTest: "true" }),
      ],
      kitEvents: [
        AS_OF_EVENT,
        makeEvent("ord_cancelled", "kit_1", "kit_shipped", "2026-06-01T00:00:00Z"),
        makeEvent("ord_refunded", "kit_2", "kit_shipped", "2026-06-01T00:00:00Z"),
        makeEvent("ord_test", "kit_3", "kit_shipped", "2026-06-01T00:00:00Z"),
        makeEvent("ord_missing", "kit_4", "kit_shipped", "2026-06-01T00:00:00Z"),
      ],
    };
    expect(buildStuckKits(dataset).kits).toEqual([]);
  });

  it("returns no kits and a null as-of date for an empty dataset", () => {
    expect(buildStuckKits({ orders: [], kitEvents: [] })).toEqual({ asOfTime: null, kits: [] });
  });

  it("measures to a given as-of time instead of the dataset's latest event", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1")],
      kitEvents: [makeEvent("ord_1", "kit_1", "kit_shipped", "2026-10-03T00:00:00Z")],
    };
    const summary: StuckKitsSummary = buildStuckKits(dataset, Date.UTC(2026, 9, 20));
    expect(summary.asOfTime).toBe(Date.UTC(2026, 9, 20));
    expect(summary.kits[0]?.daysOverTarget).toBe(10);
  });
});
