import { describe, expect, it } from "vitest";
import type { Order } from "../types/data.ts";
import { isTestOrder } from "./isTestOrder.ts";

const makeOrder = (isTest: string): Order => ({
  orderId: "ord_1",
  createdAt: "2026-05-01T00:00:00Z",
  customerId: "cus_1",
  product: "wgs_30x",
  country: "US",
  status: "paid",
  isTest,
});

describe("isTestOrder", () => {
  it("is true for a test order, ignoring case and whitespace", () => {
    expect(isTestOrder(makeOrder("true"))).toBe(true);
    expect(isTestOrder(makeOrder(" TRUE "))).toBe(true);
  });

  it("is false otherwise", () => {
    expect(isTestOrder(makeOrder("false"))).toBe(false);
    expect(isTestOrder(makeOrder(""))).toBe(false);
  });
});
