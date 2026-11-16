import { DURATION_STAGES, KIT_STAGE_RANKS } from "../constants/pipeline.ts";
import { DAY_MS } from "../constants/time.ts";
import type {
  Dataset,
  DurationStage,
  KitStage,
  KitTimeline,
  Order,
  StuckKit,
  StuckKitsSummary,
} from "../types/data.ts";
import { isTestOrder } from "./isTestOrder.ts";
import { buildKitTimelines } from "./kitTimelines.ts";

const EXCLUDED_ORDER_STATUSES: readonly string[] = ["cancelled", "refunded"];

const isExcludedOrder = (order: Order): boolean => {
  const status: string = order.status.trim().toLowerCase();
  return isTestOrder(order) || EXCLUDED_ORDER_STATUSES.includes(status);
};

const getFurthestStage = (timeline: KitTimeline): KitStage | null => {
  let furthestStage: KitStage | null = null;
  for (const stage of timeline.times.keys()) {
    if (furthestStage === null || KIT_STAGE_RANKS[stage] > KIT_STAGE_RANKS[furthestStage]) {
      furthestStage = stage;
    }
  }
  return furthestStage;
};

const findWaitingStage = (currentStage: KitStage): DurationStage | undefined => {
  return DURATION_STAGES.find((stage: DurationStage): boolean => stage.start === currentStage);
};

export const getAsOfTime = (timelines: Map<string, KitTimeline>): number | null => {
  let latestTime: number | null = null;
  for (const timeline of timelines.values()) {
    for (const time of timeline.times.values()) {
      if (latestTime === null || time > latestTime) {
        latestTime = time;
      }
    }
  }
  return latestTime;
};

export const buildStuckKits = (dataset: Dataset, fixedAsOfTime?: number | null): StuckKitsSummary => {
  const ordersById: Map<string, Order> = new Map(
    dataset.orders.map((order: Order): [string, Order] => [order.orderId, order]),
  );
  const timelines: Map<string, KitTimeline> = buildKitTimelines(dataset.kitEvents);
  const asOfTime: number | null = fixedAsOfTime === undefined ? getAsOfTime(timelines) : fixedAsOfTime;
  if (asOfTime === null) {
    return { asOfTime, kits: [] };
  }

  const kits: StuckKit[] = [];
  for (const [kitId, timeline] of timelines) {
    const order: Order | undefined = ordersById.get(timeline.orderId);
    if (order === undefined || isExcludedOrder(order)) {
      continue;
    }
    const currentStage: KitStage | null = getFurthestStage(timeline);
    if (currentStage === null) {
      continue;
    }
    const waitingStage: DurationStage | undefined = findWaitingStage(currentStage);
    const stageStartTime: number | undefined = timeline.times.get(currentStage);
    if (waitingStage === undefined || stageStartTime === undefined) {
      continue;
    }
    const daysInStage: number = (asOfTime - stageStartTime) / DAY_MS;
    const daysOverTarget: number = daysInStage - waitingStage.targetDays;
    if (daysOverTarget <= 0) {
      continue;
    }
    kits.push({
      orderId: order.orderId,
      kitId,
      product: order.product,
      currentStage,
      daysOverTarget,
    });
  }

  kits.sort((a: StuckKit, b: StuckKit): number => b.daysOverTarget - a.daysOverTarget);
  return { asOfTime, kits };
};
