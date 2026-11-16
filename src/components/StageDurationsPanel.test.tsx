import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DURATION_STAGES } from "../constants/pipeline.ts";
import type { DurationStage, StageDurationSummary } from "../types/data.ts";
import { StageDurationsPanel } from "./StageDurationsPanel.tsx";

const shippingStage: DurationStage | undefined = DURATION_STAGES.find(
  (stage: DurationStage): boolean => stage.id === "shipped_to_delivered",
);

describe("StageDurationsPanel", () => {
  it("shows medians per product and highlights stages over target", () => {
    if (shippingStage === undefined) {
      throw new Error("Shipping stage missing");
    }
    const summary: StageDurationSummary = {
      products: ["wgs_100x", "wgs_30x"],
      rows: [{ stage: shippingStage, medianDaysByProduct: { wgs_100x: 9, wgs_30x: 4 } }],
    };

    render(<StageDurationsPanel summary={summary} />);

    expect(screen.getByRole("columnheader", { name: "wgs_30x" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "4.0 d" })).not.toHaveClass("bg-red-50");
    expect(screen.getByRole("cell", { name: /9\.0 d.*over target/ })).toHaveClass("bg-red-50");
  });

  it("shows a dash when a product has no data for a stage", () => {
    if (shippingStage === undefined) {
      throw new Error("Shipping stage missing");
    }
    const summary: StageDurationSummary = {
      products: ["wgs_30x"],
      rows: [{ stage: shippingStage, medianDaysByProduct: { wgs_30x: null } }],
    };

    render(<StageDurationsPanel summary={summary} />);

    expect(screen.getByRole("cell", { name: "—" })).toBeInTheDocument();
  });
});
