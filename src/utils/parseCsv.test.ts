import { describe, expect, it } from "vitest";
import type { KitEvent, Order } from "../types/data.ts";
import { parseKitEvents, parseOrders } from "./parseCsv.ts";

const ORDERS_CSV: string = [
  "order_id,created_at,customer_id,product,country,status,is_test",
  "ord_1,2026-04-30T19:49:51-05:00,cus_1,wgs_30x,US,paid,false",
  "ord_2,2026-05-01T13:33:31+10:00,cus_2,upload_only,AU,refunded,true",
  "",
].join("\n");

const KIT_EVENTS_CSV: string = [
  "event_id,order_id,kit_id,event_type,occurred_at,source",
  "evt_1,ord_1,kit_1,kit_shipped,2026-05-02T10:00:00Z,system",
  "",
].join("\n");

describe("parseOrders", () => {
  it("maps each row to an Order", () => {
    const orders: Order[] = parseOrders(ORDERS_CSV);
    expect(orders).toEqual([
      {
        orderId: "ord_1",
        createdAt: "2026-04-30T19:49:51-05:00",
        customerId: "cus_1",
        product: "wgs_30x",
        country: "US",
        status: "paid",
        isTest: "false",
      },
      {
        orderId: "ord_2",
        createdAt: "2026-05-01T13:33:31+10:00",
        customerId: "cus_2",
        product: "upload_only",
        country: "AU",
        status: "refunded",
        isTest: "true",
      },
    ]);
  });

  it("ignores extra columns and header whitespace", () => {
    const csv: string = [
      " order_id ,created_at,customer_id,product,country,status,is_test,extra",
      "ord_1,2026-04-30T19:49:51-05:00,cus_1,wgs_30x,US,paid,false,x",
    ].join("\n");
    const orders: Order[] = parseOrders(csv);
    expect(orders).toHaveLength(1);
    expect(orders[0]?.orderId).toBe("ord_1");
  });

  it("throws when a required column is missing", () => {
    const csv: string = "order_id,created_at\nord_1,2026-04-30T19:49:51-05:00";
    expect(() => parseOrders(csv)).toThrow(
      "orders.csv is missing required columns: customer_id, product, country, status, is_test",
    );
  });

  it("returns an empty array for a header-only file", () => {
    const csv: string = "order_id,created_at,customer_id,product,country,status,is_test\n";
    expect(parseOrders(csv)).toEqual([]);
  });
});

describe("parseKitEvents", () => {
  it("maps each row to a KitEvent", () => {
    const kitEvents: KitEvent[] = parseKitEvents(KIT_EVENTS_CSV);
    expect(kitEvents).toEqual([
      {
        eventId: "evt_1",
        orderId: "ord_1",
        kitId: "kit_1",
        eventType: "kit_shipped",
        occurredAt: "2026-05-02T10:00:00Z",
        source: "system",
      },
    ]);
  });

  it("throws when a required column is missing", () => {
    const csv: string = "event_id,order_id\nevt_1,ord_1";
    expect(() => parseKitEvents(csv)).toThrow(
      "kit_events.csv is missing required columns: kit_id, event_type, occurred_at, source",
    );
  });
});
