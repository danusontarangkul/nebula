import { DURATION_STAGES } from "../constants/pipeline.ts";
import { DAY_MS } from "../constants/time.ts";
import type {
  Dataset,
  DurationStage,
  KitStage,
  KitTimeline,
  Order,
  StageDurationRow,
  StageDurationSummary,
} from "../types/data.ts";
import { buildKitTimelines } from "./kitTimelines.ts";
import { toTime } from "./toTime.ts";

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
