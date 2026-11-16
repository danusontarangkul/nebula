import type { KitEvent, KitTimeline } from "../types/data.ts";
import { isKitStage } from "./isKitStage.ts";
import { toTime } from "./toTime.ts";

export const buildKitTimelines = (kitEvents: KitEvent[]): Map<string, KitTimeline> => {
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
