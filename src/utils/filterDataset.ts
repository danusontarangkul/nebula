import { DAY_MS } from "../constants/time.ts";
import type { DashboardFilters, Dataset, KitEvent, Order } from "../types/data.ts";
import { toTime } from "./toTime.ts";

const toDayStart = (date: string): number | null => {
  return date === "" ? null : toTime(`${date}T00:00:00Z`);
};

export const hasActiveFilters = (filters: DashboardFilters): boolean => {
  return filters.startDate !== "" || filters.endDate !== "" || filters.product !== "" || filters.country !== "";
};

const matchesFilters = (order: Order, filters: DashboardFilters): boolean => {
  if (filters.product !== "" && order.product.trim() !== filters.product) {
    return false;
  }
  if (filters.country !== "" && order.country.trim() !== filters.country) {
    return false;
  }
  const startTime: number | null = toDayStart(filters.startDate);
  const endDayStart: number | null = toDayStart(filters.endDate);
  if (startTime === null && endDayStart === null) {
    return true;
  }
  const createdTime: number | null = toTime(order.createdAt);
  if (createdTime === null) {
    return false;
  }
  if (startTime !== null && createdTime < startTime) {
    return false;
  }
  if (endDayStart !== null && createdTime >= endDayStart + DAY_MS) {
    return false;
  }
  return true;
};

export const filterDataset = (dataset: Dataset, filters: DashboardFilters): Dataset => {
  if (!hasActiveFilters(filters)) {
    return dataset;
  }
  const orders: Order[] = dataset.orders.filter((order: Order): boolean => matchesFilters(order, filters));
  const orderIds: Set<string> = new Set(orders.map((order: Order): string => order.orderId));
  const kitEvents: KitEvent[] = dataset.kitEvents.filter((kitEvent: KitEvent): boolean =>
    orderIds.has(kitEvent.orderId),
  );
  return { orders, kitEvents };
};
