import type { DurationStage, KitStage } from "../types/data.ts";

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

export const DURATION_STAGES: readonly DurationStage[] = [
  {
    id: "order_to_shipped",
    label: "Order placed → kit shipped",
    start: "order_created",
    end: ["kit_shipped"],
    targetDays: 3,
  },
  {
    id: "shipped_to_delivered",
    label: "Kit shipped → delivered",
    start: "kit_shipped",
    end: ["kit_delivered"],
    targetDays: 7,
  },
  {
    id: "delivered_to_mailed",
    label: "Delivered → sample mailed",
    start: "kit_delivered",
    end: ["sample_mailed"],
    targetDays: 45,
  },
  {
    id: "mailed_to_received",
    label: "Sample mailed → received at lab",
    start: "sample_mailed",
    end: ["sample_received"],
    targetDays: 14,
  },
  {
    id: "received_to_qc",
    label: "Received → QC result",
    start: "sample_received",
    end: ["qc_passed", "qc_failed"],
    targetDays: 7,
  },
  {
    id: "qc_to_sequenced",
    label: "QC passed → sequencing complete",
    start: "qc_passed",
    end: ["sequencing_complete"],
    targetDays: 28,
  },
  {
    id: "sequenced_to_report",
    label: "Sequencing complete → report ready",
    start: "sequencing_complete",
    end: ["report_ready"],
    targetDays: 5,
  },
];
