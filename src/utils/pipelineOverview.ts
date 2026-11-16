import { KIT_STAGE_RANKS, KIT_STAGES } from "../constants/pipeline.ts";
import type { Dataset, KitEvent, KitStage, PipelineOverview } from "../types/data.ts";

const isKitStage = (value: string): value is KitStage =>
  (KIT_STAGES as readonly string[]).includes(value);

export const getCurrentKitStages = (kitEvents: KitEvent[]): Map<string, KitStage> => {
  const stagesByKitId: Map<string, KitStage> = new Map();
  for (const kitEvent of kitEvents) {
    const eventType: string = kitEvent.eventType.trim();
    if (!isKitStage(eventType)) {
      continue;
    }
    const currentStage: KitStage | undefined = stagesByKitId.get(kitEvent.kitId);
    if (currentStage === undefined || KIT_STAGE_RANKS[eventType] > KIT_STAGE_RANKS[currentStage]) {
      stagesByKitId.set(kitEvent.kitId, eventType);
    }
  }
  return stagesByKitId;
};

export const buildPipelineOverview = (dataset: Dataset): PipelineOverview => {
  const stagesByKitId: Map<string, KitStage> = getCurrentKitStages(dataset.kitEvents);
  const kitsByStage: Record<KitStage, number> = {
    kit_shipped: 0,
    kit_delivered: 0,
    sample_mailed: 0,
    sample_received: 0,
    qc_passed: 0,
    qc_failed: 0,
    sequencing_complete: 0,
    report_ready: 0,
    kit_replaced: 0,
  };
  for (const stage of stagesByKitId.values()) {
    kitsByStage[stage] += 1;
  }
  return {
    totalOrders: dataset.orders.length,
    totalKits: stagesByKitId.size,
    finishedKits: kitsByStage.report_ready,
    kitsByStage,
  };
};
