import type { Dataset, KitDetail, KitEvent, KitEventEntry, Order, OrderDetail } from "../types/data.ts";
import { toTime } from "./toTime.ts";

const toEntry = (kitEvent: KitEvent): KitEventEntry => ({
  eventId: kitEvent.eventId,
  eventType: kitEvent.eventType.trim(),
  occurredAt: kitEvent.occurredAt,
  time: toTime(kitEvent.occurredAt),
  source: kitEvent.source,
});

const compareEntries = (a: KitEventEntry, b: KitEventEntry): number => {
  if (a.time === null && b.time === null) {
    return 0;
  }
  if (a.time === null) {
    return 1;
  }
  if (b.time === null) {
    return -1;
  }
  return a.time - b.time;
};

const getFirstTime = (kit: KitDetail): number => {
  return kit.events[0]?.time ?? Number.POSITIVE_INFINITY;
};

export const buildOrderDetail = (dataset: Dataset, orderId: string): OrderDetail | null => {
  const searchId: string = orderId.trim();
  const order: Order | undefined = dataset.orders.find(
    (candidate: Order): boolean => candidate.orderId === searchId,
  );
  if (order === undefined) {
    return null;
  }

  const eventsByKitId: Map<string, KitEventEntry[]> = new Map();
  for (const kitEvent of dataset.kitEvents) {
    if (kitEvent.orderId !== order.orderId) {
      continue;
    }
    const entries: KitEventEntry[] = eventsByKitId.get(kitEvent.kitId) ?? [];
    entries.push(toEntry(kitEvent));
    eventsByKitId.set(kitEvent.kitId, entries);
  }

  const kits: KitDetail[] = [...eventsByKitId].map(
    ([kitId, events]: [string, KitEventEntry[]]): KitDetail => ({
      kitId,
      isReplacement: false,
      events: [...events].sort(compareEntries),
    }),
  );
  kits.sort((a: KitDetail, b: KitDetail): number => getFirstTime(a) - getFirstTime(b));

  return {
    order,
    kits: kits.map(
      (kit: KitDetail, index: number): KitDetail => ({ ...kit, isReplacement: index > 0 }),
    ),
  };
};
