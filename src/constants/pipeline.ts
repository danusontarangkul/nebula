import type { KitStage } from "../types/data.ts";

export const KIT_STAGES: readonly KitStage[] = [
  "kit_shipped",
  "kit_delivered",
  "sample_mailed",
  "sample_received",
  "qc_passed",
  "qc_failed",
  "sequencing_complete",
  "report_ready",
  "kit_replaced",
];

export const KIT_STAGE_LABELS: Record<KitStage, string> = {
  kit_shipped: "Kit shipped",
  kit_delivered: "Kit delivered",
  sample_mailed: "Sample mailed",
  sample_received: "Sample received",
  qc_passed: "QC passed",
  qc_failed: "QC failed",
  sequencing_complete: "Sequencing complete",
  report_ready: "Report ready",
  kit_replaced: "Kit replaced",
};

export const KIT_STAGE_RANKS: Record<KitStage, number> = {
  kit_shipped: 1,
  kit_delivered: 2,
  sample_mailed: 3,
  sample_received: 4,
  qc_passed: 5,
  qc_failed: 5,
  sequencing_complete: 6,
  report_ready: 7,
  kit_replaced: 8,
};
