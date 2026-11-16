import { AWAITING_SHIPMENT_LABEL, KIT_STAGE_LABELS } from "../constants/pipeline.ts";
import type { StuckStage } from "../types/data.ts";

export const formatStuckStage = (stage: StuckStage): string => {
  return stage === "awaiting_shipment" ? AWAITING_SHIPMENT_LABEL : KIT_STAGE_LABELS[stage];
};
