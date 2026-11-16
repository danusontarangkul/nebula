import type { Order } from "../types/data.ts";

export const isTestOrder = (order: Order): boolean => {
  return order.isTest.trim().toLowerCase() === "true";
};
