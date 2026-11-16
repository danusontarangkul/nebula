import { KIT_STAGE_LABELS } from "../constants/pipeline.ts";
import { isKitStage } from "./isKitStage.ts";

export const formatEventType = (eventType: string): string => {
  return isKitStage(eventType) ? KIT_STAGE_LABELS[eventType] : eventType;
};
