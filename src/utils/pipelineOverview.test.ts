import { describe, expect, it } from "vitest";
import type { Dataset, KitEvent, KitStage, Order, PipelineOverview } from "../types/data.ts";
import { buildPipelineOverview, getCurrentKitStages } from "./pipelineOverview.ts";

const makeEvent = (kitId: string, eventType: string, occurredAt: string = "2026-05-01T00:00:00Z"): KitEvent => ({
  eventId: `evt_${kitId}_${eventType}`,
  orderId: "ord_1",
  kitId,
  eventType,
  occurredAt,
  source: "system",
});

const makeOrder = (orderId: string): Order => ({
  orderId,
  createdAt: "2026-05-01T00:00:00Z",
  customerId: "cus_1",
  product: "wgs_30x",
  country: "US",
  status: "paid",
  isTest: "false",
});

describe("getCurrentKitStages", () => {
  it("uses the furthest stage a kit reached, regardless of row order", () => {
    const stages: Map<string, KitStage> = getCurrentKitStages([
      makeEvent("kit_1", "sample_mailed"),
      makeEvent("kit_1", "kit_shipped"),
      makeEvent("kit_1", "kit_delivered"),
    ]);
    expect(stages.get("kit_1")).toBe("sample_mailed");
  });

  it("treats a replaced kit as replaced", () => {
    const stages: Map<string, KitStage> = getCurrentKitStages([
      makeEvent("kit_1", "kit_shipped"),
      makeEvent("kit_1", "kit_replaced"),
      makeEvent("kit_2", "kit_shipped"),
    ]);
    expect(stages.get("kit_1")).toBe("kit_replaced");
    expect(stages.get("kit_2")).toBe("kit_shipped");
  });

  it("keeps qc_failed as the stage when no replacement follows", () => {
    const stages: Map<string, KitStage> = getCurrentKitStages([
      makeEvent("kit_1", "sample_received"),
      makeEvent("kit_1", "qc_failed"),
    ]);
    expect(stages.get("kit_1")).toBe("qc_failed");
  });

  it("counts a later stage even when an earlier scan is missing", () => {
    const stages: Map<string, KitStage> = getCurrentKitStages([
      makeEvent("kit_1", "kit_delivered"),
      makeEvent("kit_1", "sample_received"),
    ]);
    expect(stages.get("kit_1")).toBe("sample_received");
  });

  it("ignores unknown event types", () => {
    const stages: Map<string, KitStage> = getCurrentKitStages([
      makeEvent("kit_1", "kit_shipped"),
      makeEvent("kit_1", "mystery_event"),
      makeEvent("kit_2", "mystery_event"),
    ]);
    expect(stages.get("kit_1")).toBe("kit_shipped");
    expect(stages.has("kit_2")).toBe(false);
  });
});

describe("buildPipelineOverview", () => {
  it("counts orders, kits, finished kits, and kits per stage", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1"), makeOrder("ord_2"), makeOrder("ord_3")],
      kitEvents: [
        makeEvent("kit_1", "kit_shipped"),
        makeEvent("kit_1", "report_ready"),
        makeEvent("kit_2", "kit_shipped"),
        makeEvent("kit_2", "kit_delivered"),
        makeEvent("kit_3", "kit_shipped"),
        makeEvent("kit_3", "kit_delivered"),
      ],
    };
    const overview: PipelineOverview = buildPipelineOverview(dataset);
    expect(overview.totalOrders).toBe(3);
    expect(overview.totalKits).toBe(3);
    expect(overview.finishedKits).toBe(1);
    expect(overview.kitsByStage).toEqual({
      kit_shipped: 0,
      kit_delivered: 2,
      sample_mailed: 0,
      sample_received: 0,
      qc_passed: 0,
      qc_failed: 0,
      sequencing_complete: 0,
      report_ready: 1,
      kit_replaced: 0,
    });
  });

  it("returns zeros for an empty dataset", () => {
    const overview: PipelineOverview = buildPipelineOverview({ orders: [], kitEvents: [] });
    expect(overview.totalOrders).toBe(0);
    expect(overview.totalKits).toBe(0);
    expect(overview.finishedKits).toBe(0);
  });
});
