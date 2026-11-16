import type { CleanedData, Dataset, KitEvent, Order } from "../types/data.ts";
import { isTestOrder } from "./isTestOrder.ts";
import { toUtcDate } from "./toUtcDate.ts";

const UTC_SUFFIX: RegExp = /Z$/;

const isAlreadyUtc = (raw: string): boolean => {
  return UTC_SUFFIX.test(raw.trim());
};

const isBlank = (value: string): boolean => {
  return value.trim() === "";
};

const normalizeTimestamp = (raw: string): string | null => {
  const date: Date | null = toUtcDate(raw);
  return date === null ? null : date.toISOString();
};

export const cleanDataset = (dataset: Dataset): CleanedData => {
  let missingIdOrders: number = 0;
  let missingIdEvents: number = 0;
  let normalizedTimestamps: number = 0;
  let invalidTimestampEvents: number = 0;
  let orphanEvents: number = 0;
  let duplicateEvents: number = 0;

  const ordersWithIds: Order[] = dataset.orders.filter((order: Order): boolean => {
    if (isBlank(order.orderId)) {
      missingIdOrders += 1;
      return false;
    }
    return true;
  });

  const orders: Order[] = ordersWithIds.map((order: Order): Order => {
    const createdAt: string | null = normalizeTimestamp(order.createdAt);
    if (createdAt === null) {
      return order;
    }
    if (!isAlreadyUtc(order.createdAt)) {
      normalizedTimestamps += 1;
    }
    return { ...order, createdAt };
  });
  const orderIds: Set<string> = new Set(orders.map((order: Order): string => order.orderId));

  const seenEventKeys: Set<string> = new Set();
  const kitEvents: KitEvent[] = [];
  for (const kitEvent of dataset.kitEvents) {
    if (isBlank(kitEvent.orderId) || isBlank(kitEvent.kitId)) {
      missingIdEvents += 1;
      continue;
    }
    const occurredAt: string | null = normalizeTimestamp(kitEvent.occurredAt);
    if (occurredAt === null) {
      invalidTimestampEvents += 1;
      continue;
    }
    if (!orderIds.has(kitEvent.orderId)) {
      orphanEvents += 1;
      continue;
    }
    const eventType: string = kitEvent.eventType.trim();
    const eventKey: string = `${kitEvent.kitId}|${eventType}|${occurredAt}`;
    if (seenEventKeys.has(eventKey)) {
      duplicateEvents += 1;
      continue;
    }
    seenEventKeys.add(eventKey);
    if (!isAlreadyUtc(kitEvent.occurredAt)) {
      normalizedTimestamps += 1;
    }
    kitEvents.push({ ...kitEvent, eventType, occurredAt });
  }

  return {
    dataset: { orders, kitEvents },
    report: {
      missingIdOrders,
      missingIdEvents,
      normalizedTimestamps,
      invalidTimestampEvents,
      orphanEvents,
      duplicateEvents,
      testOrders: orders.filter(isTestOrder).length,
    },
  };
};
