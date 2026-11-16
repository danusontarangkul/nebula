import { describe, expect, it } from "vitest";
import type { CleanedData, KitEvent, Order } from "../types/data.ts";
import { cleanDataset } from "./cleanDataset.ts";

const makeOrder = (orderId: string, createdAt: string = "2026-05-01T00:00:00Z", isTest: string = "false"): Order => ({
  orderId,
  createdAt,
  customerId: "cus_1",
  product: "wgs_30x",
  country: "US",
  status: "paid",
  isTest,
});

const makeEvent = (eventId: string, orderId: string, eventType: string, occurredAt: string): KitEvent => ({
  eventId,
  orderId,
  kitId: `kit_${orderId}`,
  eventType,
  occurredAt,
  source: "carrier",
});

describe("cleanDataset", () => {
  it("normalizes every timestamp format to UTC and counts the converted ones", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1", "2026-04-30T19:49:51-05:00")],
      kitEvents: [
        makeEvent("evt_1", "ord_1", "kit_shipped", "2026-05-02T10:00:00Z"),
        makeEvent("evt_2", "ord_1", "kit_delivered", "2026-05-05 08:00:00"),
        makeEvent("evt_3", "ord_1", "sample_mailed", "2026-05-10T12:00:00+02:00"),
      ],
    });
    expect(result.dataset.orders[0]?.createdAt).toBe("2026-05-01T00:49:51.000Z");
    expect(result.dataset.kitEvents.map((kitEvent: KitEvent): string => kitEvent.occurredAt)).toEqual([
      "2026-05-02T10:00:00.000Z",
      "2026-05-05T08:00:00.000Z",
      "2026-05-10T10:00:00.000Z",
    ]);
    expect(result.report.normalizedTimestamps).toBe(3);
  });

  it("counts duplicate events once, including duplicates written in different formats", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1")],
      kitEvents: [
        makeEvent("evt_1", "ord_1", "kit_shipped", "2026-05-02T10:00:00Z"),
        makeEvent("evt_2", "ord_1", "kit_shipped", "2026-05-02T10:00:00Z"),
        makeEvent("evt_3", "ord_1", "kit_shipped", "2026-05-02T06:00:00-04:00"),
        makeEvent("evt_4", "ord_1", "kit_delivered", "2026-05-02T10:00:00Z"),
      ],
    });
    expect(result.dataset.kitEvents.map((kitEvent: KitEvent): string => kitEvent.eventId)).toEqual([
      "evt_1",
      "evt_4",
    ]);
    expect(result.report.duplicateEvents).toBe(2);
  });

  it("excludes orphan events with no matching order", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1")],
      kitEvents: [
        makeEvent("evt_1", "ord_1", "kit_shipped", "2026-05-02T10:00:00Z"),
        makeEvent("evt_2", "ord_missing", "kit_shipped", "2026-05-02T10:00:00Z"),
      ],
    });
    expect(result.dataset.kitEvents).toHaveLength(1);
    expect(result.report.orphanEvents).toBe(1);
  });

  it("excludes events with unreadable timestamps", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1")],
      kitEvents: [makeEvent("evt_1", "ord_1", "kit_shipped", "not a date")],
    });
    expect(result.dataset.kitEvents).toEqual([]);
    expect(result.report.invalidTimestampEvents).toBe(1);
  });

  it("counts test orders without removing them", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1"), makeOrder("ord_2", "2026-05-01T00:00:00Z", "true")],
      kitEvents: [],
    });
    expect(result.dataset.orders).toHaveLength(2);
    expect(result.report.testOrders).toBe(1);
  });

  it("excludes orders with a blank order ID and counts them", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1"), makeOrder(""), makeOrder("   ")],
      kitEvents: [],
    });
    expect(result.dataset.orders.map((order: Order): string => order.orderId)).toEqual(["ord_1"]);
    expect(result.report.missingIdOrders).toBe(2);
  });

  it("excludes events with a blank order or kit ID and counts them", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1")],
      kitEvents: [
        makeEvent("evt_1", "ord_1", "kit_shipped", "2026-05-02T10:00:00Z"),
        makeEvent("evt_2", "", "kit_shipped", "2026-05-02T10:00:00Z"),
        { ...makeEvent("evt_3", "ord_1", "kit_delivered", "2026-05-04T10:00:00Z"), kitId: " " },
      ],
    });
    expect(result.dataset.kitEvents.map((kitEvent: KitEvent): string => kitEvent.eventId)).toEqual(["evt_1"]);
    expect(result.report.missingIdEvents).toBe(2);
    expect(result.report.orphanEvents).toBe(0);
  });

  it("trims event types", () => {
    const result: CleanedData = cleanDataset({
      orders: [makeOrder("ord_1")],
      kitEvents: [makeEvent("evt_1", "ord_1", " kit_shipped ", "2026-05-02T10:00:00Z")],
    });
    expect(result.dataset.kitEvents[0]?.eventType).toBe("kit_shipped");
  });
});
