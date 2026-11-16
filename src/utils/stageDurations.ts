import { DURATION_STAGES } from "../constants/pipeline.ts";
import type {
  Dataset,
  DurationStage,
  KitEvent,
  KitStage,
  Order,
  StageDurationRow,
  StageDurationSummary,
} from "../types/data.ts";
import { isKitStage } from "./isKitStage.ts";
import { toUtcDate } from "./toUtcDate.ts";

const DAY_MS: number = 86_400_000;

type KitTimeline = {
  orderId: string;
  times: Map<KitStage, number>;
};

const toTime = (raw: string): number | null => {
  const date: Date | null = toUtcDate(raw);
  return date === null ? null : date.getTime();
};

const buildKitTimelines = (kitEvents: KitEvent[]): Map<string, KitTimeline> => {
  const timelines: Map<string, KitTimeline> = new Map();
  for (const kitEvent of kitEvents) {
    const eventType: string = kitEvent.eventType.trim();
    const time: number | null = toTime(kitEvent.occurredAt);
    if (!isKitStage(eventType) || time === null) {
      continue;
    }
    const timeline: KitTimeline = timelines.get(kitEvent.kitId) ?? {
      orderId: kitEvent.orderId,
      times: new Map(),
    };
    const existingTime: number | undefined = timeline.times.get(eventType);
    if (existingTime === undefined || time < existingTime) {
      timeline.times.set(eventType, time);
    }
    timelines.set(kitEvent.kitId, timeline);
  }
  return timelines;
};

const buildReplacementTimes = (timelines: Map<string, KitTimeline>): Map<string, number[]> => {
  const replacementTimes: Map<string, number[]> = new Map();
  for (const timeline of timelines.values()) {
    const replacedAt: number | undefined = timeline.times.get("kit_replaced");
    if (replacedAt === undefined) {
      continue;
    }
    const times: number[] = replacementTimes.get(timeline.orderId) ?? [];
    times.push(replacedAt);
    replacementTimes.set(timeline.orderId, times);
  }
  return replacementTimes;
};

const getOrderStartTime = (
  timeline: KitTimeline,
  order: Order,
  replacementTimes: number[],
): number | null => {
  const shippedAt: number | undefined = timeline.times.get("kit_shipped");
  if (shippedAt === undefined) {
    return null;
  }
  const earlierReplacements: number[] = replacementTimes.filter(
    (replacedAt: number): boolean => replacedAt <= shippedAt,
  );
  if (earlierReplacements.length > 0) {
    return Math.max(...earlierReplacements);
  }
  return toTime(order.createdAt);
};

const getStageDurationDays = (
  stage: DurationStage,
  timeline: KitTimeline,
  order: Order,
  replacementTimes: number[],
): number | null => {
  const startTime: number | null | undefined =
    stage.start === "order_created"
      ? getOrderStartTime(timeline, order, replacementTimes)
      : timeline.times.get(stage.start);
  const endTimes: number[] = stage.end
    .map((endStage: KitStage): number | undefined => timeline.times.get(endStage))
    .filter((time: number | undefined): time is number => time !== undefined);
  if (startTime === null || startTime === undefined || endTimes.length === 0) {
    return null;
  }
  const durationMs: number = Math.min(...endTimes) - startTime;
  if (durationMs < 0) {
    return null;
  }
  return durationMs / DAY_MS;
};

export const median = (values: number[]): number | null => {
  if (values.length === 0) {
    return null;
  }
  const sorted: number[] = [...values].sort((a: number, b: number): number => a - b);
  const middle: number = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2;
  }
  return sorted[middle] ?? null;
};

export const buildStageDurations = (dataset: Dataset): StageDurationSummary => {
  const ordersById: Map<string, Order> = new Map(
    dataset.orders.map((order: Order): [string, Order] => [order.orderId, order]),
  );
  const timelines: Map<string, KitTimeline> = buildKitTimelines(dataset.kitEvents);
  const replacementTimesByOrderId: Map<string, number[]> = buildReplacementTimes(timelines);
  const durationsByStage: Map<string, Map<string, number[]>> = new Map();

  for (const timeline of timelines.values()) {
    const order: Order | undefined = ordersById.get(timeline.orderId);
    if (order === undefined) {
      continue;
    }
    const replacementTimes: number[] = replacementTimesByOrderId.get(timeline.orderId) ?? [];
    for (const stage of DURATION_STAGES) {
      const durationDays: number | null = getStageDurationDays(stage, timeline, order, replacementTimes);
      if (durationDays === null) {
        continue;
      }
      const durationsByProduct: Map<string, number[]> = durationsByStage.get(stage.id) ?? new Map();
      const durations: number[] = durationsByProduct.get(order.product) ?? [];
      durations.push(durationDays);
      durationsByProduct.set(order.product, durations);
      durationsByStage.set(stage.id, durationsByProduct);
    }
  }

  const productSet: Set<string> = new Set();
  for (const durationsByProduct of durationsByStage.values()) {
    for (const product of durationsByProduct.keys()) {
      productSet.add(product);
    }
  }
  const products: string[] = [...productSet].sort();

  const rows: StageDurationRow[] = DURATION_STAGES.map((stage: DurationStage): StageDurationRow => {
    const durationsByProduct: Map<string, number[]> = durationsByStage.get(stage.id) ?? new Map();
    const medianDaysByProduct: Record<string, number | null> = {};
    for (const product of products) {
      medianDaysByProduct[product] = median(durationsByProduct.get(product) ?? []);
    }
    return { stage, medianDaysByProduct };
  });

  return { products, rows };
};
