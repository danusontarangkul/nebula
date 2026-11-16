import { describe, expect, it } from "vitest";
import type { Dataset, KitDetail, KitEvent, KitEventEntry, Order, OrderDetail } from "../types/data.ts";
import { buildOrderDetail } from "./orderDetail.ts";

const makeOrder = (orderId: string): Order => ({
  orderId,
  createdAt: "2026-05-01T00:00:00Z",
  customerId: "cus_1",
  product: "wgs_30x",
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

const getEventTypes = (kit: KitDetail | undefined): string[] => {
  return kit?.events.map((entry: KitEventEntry): string => entry.eventType) ?? [];
};

describe("buildOrderDetail", () => {
  it("returns null when the order does not exist", () => {
    const dataset: Dataset = { orders: [makeOrder("ord_1")], kitEvents: [] };
    expect(buildOrderDetail(dataset, "ord_missing")).toBeNull();
  });

  it("finds an order by ID, ignoring surrounding whitespace", () => {
    const dataset: Dataset = { orders: [makeOrder("ord_1")], kitEvents: [] };
    const detail: OrderDetail | null = buildOrderDetail(dataset, "  ord_1 ");
    expect(detail?.order.orderId).toBe("ord_1");
    expect(detail?.kits).toEqual([]);
  });

  it("sorts each kit's events in time order across timestamp formats", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "sample_mailed", "2026-05-10T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-01 12:00:00"),
        makeEvent("ord_1", "kit_1", "kit_delivered", "2026-05-04T08:00:00+02:00"),
      ],
    };
    const detail: OrderDetail | null = buildOrderDetail(dataset, "ord_1");
    expect(getEventTypes(detail?.kits[0])).toEqual(["kit_shipped", "kit_delivered", "sample_mailed"]);
  });

  it("lists every kit on the order, with replacements after the original", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1"), makeOrder("ord_2")],
      kitEvents: [
        makeEvent("ord_1", "kit_2", "kit_shipped", "2026-05-20T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_1", "kit_1", "kit_replaced", "2026-05-17T00:00:00Z"),
        makeEvent("ord_2", "kit_3", "kit_shipped", "2026-05-02T00:00:00Z"),
      ],
    };
    const detail: OrderDetail | null = buildOrderDetail(dataset, "ord_1");
    expect(detail?.kits.map((kit: KitDetail): string => kit.kitId)).toEqual(["kit_1", "kit_2"]);
    expect(detail?.kits.map((kit: KitDetail): boolean => kit.isReplacement)).toEqual([false, true]);
  });

  it("puts events with invalid timestamps last", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1")],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_delivered", "not a date"),
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
      ],
    };
    const detail: OrderDetail | null = buildOrderDetail(dataset, "ord_1");
    expect(getEventTypes(detail?.kits[0])).toEqual(["kit_shipped", "kit_delivered"]);
    expect(detail?.kits[0]?.events[1]?.time).toBeNull();
  });
});
