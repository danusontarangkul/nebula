import { describe, expect, it } from "vitest";
import type { Order } from "../types/data.ts";
import { getFilterOptions } from "./filterOptions.ts";

const makeOrder = (product: string, country: string): Order => ({
  orderId: `ord_${product}_${country}`,
  createdAt: "2026-05-01T00:00:00Z",
  customerId: "cus_1",
  product,
  country,
  status: "paid",
  isTest: "false",
});

describe("getFilterOptions", () => {
  it("returns sorted unique products and countries from the data", () => {
    const orders: Order[] = [
      makeOrder("wgs_30x", "US"),
      makeOrder("wgs_100x", "GB"),
      makeOrder("wgs_30x", " GB "),
      makeOrder("", ""),
    ];
    expect(getFilterOptions({ orders, kitEvents: [] })).toEqual({
      products: ["wgs_100x", "wgs_30x"],
      countries: ["GB", "US"],
    });
  });
});
