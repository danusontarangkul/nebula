import { describe, expect, it } from "vitest";
import type { Dataset, DurationStageId, KitEvent, Order, StageDurationSummary } from "../types/data.ts";
import { buildStageDurations, median } from "./stageDurations.ts";

const makeOrder = (orderId: string, product: string, createdAt: string = "2026-05-01T00:00:00Z"): Order => ({
  orderId,
  createdAt,
  customerId: "cus_1",
  product,
  country: "US",
  status: "paid",
  isTest: "false",
});

const makeEvent = (orderId: string, kitId: string, eventType: string, occurredAt: string): KitEvent => ({
  eventId: `evt_${kitId}_${eventType}_${occurredAt}`,
  orderId,
  kitId,
  eventType,
  occurredAt,
  source: "system",
});

const getMedian = (summary: StageDurationSummary, stageId: DurationStageId, product: string): number | null => {
  const row: StageDurationSummary["rows"][number] | undefined = summary.rows.find(
    (candidate: StageDurationSummary["rows"][number]): boolean => candidate.stage.id === stageId,
  );
  return row?.medianDaysByProduct[product] ?? null;
};

describe("median", () => {
  it("returns null for no values", () => {
    expect(median([])).toBeNull();
  });

  it("returns the middle value for an odd count", () => {
    expect(median([5, 1, 3])).toBe(3);
  });

  it("averages the two middle values for an even count", () => {
    expect(median([4, 1, 3, 2])).toBe(2.5);
  });
});

describe("buildStageDurations", () => {
  it("computes the median days per stage and product", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1", "wgs_30x"), makeOrder("ord_2", "wgs_30x"), makeOrder("ord_3", "wgs_100x")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-04T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "kit_delivered", "2026-05-06T00:00:00Z"),
        makeEvent("ord_3", "kit_3", "kit_shipped", "2026-05-03T00:00:00Z"),
        makeEvent("ord_3", "kit_3", "kit_delivered", "2026-05-13T00:00:00Z"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(summary.products).toEqual(["wgs_100x", "wgs_30x"]);
    expect(getMedian(summary, "order_to_shipped", "wgs_30x")).toBe(1);
    expect(getMedian(summary, "shipped_to_delivered", "wgs_30x")).toBe(3);
    expect(getMedian(summary, "shipped_to_delivered", "wgs_100x")).toBe(10);
    expect(getMedian(summary, "delivered_to_mailed", "wgs_30x")).toBeNull();
  });

  it("normalizes mixed timestamp formats before measuring", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1", "wgs_30x", "2026-05-01T19:00:00-05:00")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-03 00:00:00"),
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-04T01:00:00+01:00"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(getMedian(summary, "order_to_shipped", "wgs_30x")).toBe(1);
    expect(getMedian(summary, "shipped_to_delivered", "wgs_30x")).toBe(1);
  });

  it("starts a replacement kit's first stage at the replacement, not the order date", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1", "wgs_30x", "2026-05-01T00:00:00Z")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_replaced", "2026-05-17T00:00:00Z"),
        makeEvent("ord_1", "kit_2", "kit_shipped", "2026-05-19T00:00:00Z"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(getMedian(summary, "order_to_shipped", "wgs_30x")).toBe(1.5);
  });

  it("uses either QC result as the end of the QC stage", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1", "wgs_30x"), makeOrder("ord_2", "wgs_30x")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "sample_received", "2026-06-01T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "qc_passed", "2026-06-03T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "sample_received", "2026-06-01T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "qc_failed", "2026-06-05T00:00:00Z"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(getMedian(summary, "received_to_qc", "wgs_30x")).toBe(3);
  });

  it("skips a stage when one of its scans is missing", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1", "wgs_30x")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-05T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "sample_received", "2026-05-20T00:00:00Z"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(getMedian(summary, "delivered_to_mailed", "wgs_30x")).toBeNull();
    expect(getMedian(summary, "mailed_to_received", "wgs_30x")).toBeNull();
  });

  it("counts duplicate events once", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1", "wgs_30x"), makeOrder("ord_2", "wgs_30x")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-04T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-04T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_2", "kit_2", "kit_delivered", "2026-05-08T00:00:00Z"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(getMedian(summary, "shipped_to_delivered", "wgs_30x")).toBe(4);
  });

  it("ignores events whose order does not exist", () => {
    const dataset: Dataset = {
      orders: [],
      kitEvents: [
        makeEvent("ord_missing", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_missing", "kit_1", "kit_delivered", "2026-05-04T00:00:00Z"),
      ],
    };
    const summary: StageDurationSummary = buildStageDurations(dataset);
    expect(summary.products).toEqual([]);
  });
});
