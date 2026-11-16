import { describe, expect, it } from "vitest";
import { EMPTY_FILTERS } from "../constants/filters.ts";
import type { Dataset, KitEvent, Order } from "../types/data.ts";
import { filterDataset, hasActiveFilters } from "./filterDataset.ts";

const makeOrder = (orderId: string, createdAt: string, product: string, country: string): Order => ({
  orderId,
  createdAt,
  customerId: "cus_1",
  product,
  country,
  status: "paid",
  isTest: "false",
});

const makeEvent = (orderId: string): KitEvent => ({
  eventId: `evt_${orderId}`,
  orderId,
  kitId: `kit_${orderId}`,
  eventType: "kit_shipped",
  occurredAt: "2026-06-01T00:00:00Z",
  source: "system",
});

const DATASET: Dataset = {
  orders: [
    makeOrder("ord_may", "2026-05-15T12:00:00Z", "wgs_30x", "US"),
    makeOrder("ord_june", "2026-06-10T08:00:00Z", "wgs_100x", "GB"),
    makeOrder("ord_june_end", "2026-06-30T23:30:00Z", "wgs_30x", "GB"),
    makeOrder("ord_july", "2026-07-01T00:30:00+02:00", "wgs_30x", "US"),
  ],
  kitEvents: [makeEvent("ord_may"), makeEvent("ord_june"), makeEvent("ord_june_end"), makeEvent("ord_orphan")],
};

const getOrderIds = (dataset: Dataset): string[] => {
  return dataset.orders.map((order: Order): string => order.orderId);
};

describe("hasActiveFilters", () => {
  it("is false when every filter is empty", () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  it("is true when any filter is set", () => {
    expect(hasActiveFilters({ ...EMPTY_FILTERS, country: "US" })).toBe(true);
  });
});

describe("filterDataset", () => {
  it("returns the dataset unchanged when no filters are set", () => {
    expect(filterDataset(DATASET, EMPTY_FILTERS)).toBe(DATASET);
  });

  it("filters by product", () => {
    const result: Dataset = filterDataset(DATASET, { ...EMPTY_FILTERS, product: "wgs_100x" });
    expect(getOrderIds(result)).toEqual(["ord_june"]);
  });

  it("filters by country", () => {
    const result: Dataset = filterDataset(DATASET, { ...EMPTY_FILTERS, country: "GB" });
    expect(getOrderIds(result)).toEqual(["ord_june", "ord_june_end"]);
  });

  it("filters by an inclusive UTC created date range", () => {
    const result: Dataset = filterDataset(DATASET, {
      ...EMPTY_FILTERS,
      startDate: "2026-06-01",
      endDate: "2026-06-30",
    });
    expect(getOrderIds(result)).toEqual(["ord_june", "ord_june_end", "ord_july"]);
  });

  it("supports an open-ended date range", () => {
    const result: Dataset = filterDataset(DATASET, { ...EMPTY_FILTERS, startDate: "2026-06-11" });
    expect(getOrderIds(result)).toEqual(["ord_june_end", "ord_july"]);
  });

  it("combines filters", () => {
    const result: Dataset = filterDataset(DATASET, {
      ...EMPTY_FILTERS,
      product: "wgs_30x",
      country: "GB",
      endDate: "2026-06-30",
    });
    expect(getOrderIds(result)).toEqual(["ord_june_end"]);
  });

  it("keeps only kit events for matching orders", () => {
    const result: Dataset = filterDataset(DATASET, { ...EMPTY_FILTERS, country: "US" });
    expect(result.kitEvents.map((kitEvent: KitEvent): string => kitEvent.orderId)).toEqual(["ord_may"]);
  });
});
