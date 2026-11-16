import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import type { StuckKitsSummary } from "../types/data.ts";
import { StuckKitsPanel } from "./StuckKitsPanel.tsx";

describe("StuckKitsPanel", () => {
  it("shows each stuck kit with the as-of date", () => {
    const summary: StuckKitsSummary = {
      asOfTime: Date.UTC(2026, 9, 20),
      kits: [
        { orderId: "ord_1", kitId: "kit_1", product: "wgs_30x", currentStage: "kit_delivered", daysOverTarget: 12.34 },
      ],
    };

    render(<StuckKitsPanel summary={summary} onSelectOrder={vi.fn()} />);

    expect(screen.getByText("1 kit past target, as of Oct 20, 2026")).toBeInTheDocument();
    const rows: HTMLElement[] = screen.getAllByRole("row");
    const kitRow: HTMLElement | undefined = rows[1];
    if (kitRow === undefined) {
      throw new Error("Kit row missing");
    }
    expect(within(kitRow).getByText("ord_1")).toBeInTheDocument();
    expect(within(kitRow).getByText("kit_1")).toBeInTheDocument();
    expect(within(kitRow).getByText("wgs_30x")).toBeInTheDocument();
    expect(within(kitRow).getByText("Kit delivered")).toBeInTheDocument();
    expect(within(kitRow).getByText("12.3")).toBeInTheDocument();
  });

  it("shows an empty message when no kits are stuck", () => {
    render(<StuckKitsPanel summary={{ asOfTime: Date.UTC(2026, 9, 20), kits: [] }} onSelectOrder={vi.fn()} />);

    expect(screen.getByText("No kits are past their stage target.")).toBeInTheDocument();
  });

  it("selects the order when its order ID is clicked", () => {
    const onSelectOrder: Mock<(orderId: string) => void> = vi.fn();
    const summary: StuckKitsSummary = {
      asOfTime: Date.UTC(2026, 9, 20),
      kits: [
        { orderId: "ord_1", kitId: "kit_1", product: "wgs_30x", currentStage: "kit_delivered", daysOverTarget: 3 },
      ],
    };

    render(<StuckKitsPanel summary={summary} onSelectOrder={onSelectOrder} />);
    fireEvent.click(screen.getByRole("button", { name: "ord_1" }));

    expect(onSelectOrder).toHaveBeenCalledWith("ord_1");
  });
});
