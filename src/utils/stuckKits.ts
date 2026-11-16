import { DURATION_STAGES, KIT_STAGE_RANKS, NO_KIT_PRODUCTS } from "../constants/pipeline.ts";
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
import { toTime } from "./toTime.ts";

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

const getOrderToShipTarget = (): number | null => {
  const stage: DurationStage | undefined = DURATION_STAGES.find(
    (candidate: DurationStage): boolean => candidate.start === "order_created",
  );
  return stage === undefined ? null : stage.targetDays;
};

const isKitProduct = (order: Order): boolean => {
  return !NO_KIT_PRODUCTS.includes(order.product.trim().toLowerCase());
};

const findUnshippedOrders = (
  orders: Order[],
  timelines: Map<string, KitTimeline>,
  asOfTime: number,
): StuckKit[] => {
  const targetDays: number | null = getOrderToShipTarget();
  if (targetDays === null) {
    return [];
  }
  const orderIdsWithEvents: Set<string> = new Set(
    [...timelines.values()].map((timeline: KitTimeline): string => timeline.orderId),
  );
  const unshippedOrders: StuckKit[] = [];
  for (const order of orders) {
    if (isExcludedOrder(order) || !isKitProduct(order) || orderIdsWithEvents.has(order.orderId)) {
      continue;
    }
    const createdTime: number | null = toTime(order.createdAt);
    if (createdTime === null) {
      continue;
    }
    const daysOverTarget: number = (asOfTime - createdTime) / DAY_MS - targetDays;
    if (daysOverTarget <= 0) {
      continue;
    }
    unshippedOrders.push({
      orderId: order.orderId,
      kitId: null,
      product: order.product,
      currentStage: "awaiting_shipment",
      daysOverTarget,
    });
  }
  return unshippedOrders;
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

  kits.push(...findUnshippedOrders(dataset.orders, timelines, asOfTime));
  kits.sort((a: StuckKit, b: StuckKit): number => b.daysOverTarget - a.daysOverTarget);
  return { asOfTime, kits };
};
