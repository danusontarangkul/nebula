import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Dataset, KitEvent, Order } from "../types/data.ts";
import { Dashboard } from "./Dashboard.tsx";

const makeOrder = (orderId: string): Order => ({
  orderId,
  createdAt: "2026-05-01T00:00:00Z",
  customerId: "cus_1",
  product: "wgs_30x",
  country: "GB",
  status: "paid",
  isTest: "false",
});

const makeEvent = (orderId: string, kitId: string, eventType: string, occurredAt: string): KitEvent => ({
  eventId: `evt_${kitId}_${eventType}`,
  orderId,
  kitId,
  eventType,
  occurredAt,
  source: "carrier",
});

const DATASET: Dataset = {
  orders: [makeOrder("ord_1"), makeOrder("ord_clock")],
  kitEvents: [
    makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
    makeEvent("ord_1", "kit_1", "kit_replaced", "2026-05-17T00:00:00Z"),
    makeEvent("ord_1", "kit_2", "kit_shipped", "2026-05-19T00:00:00Z"),
    makeEvent("ord_1", "kit_2", "kit_delivered", "2026-05-22T00:00:00Z"),
    makeEvent("ord_clock", "kit_clock", "report_ready", "2026-10-20T00:00:00Z"),
  ],
};

describe("Dashboard", () => {
  it("opens an order's details and kit timelines from the search", () => {
    render(<Dashboard data={DATASET} />);

    fireEvent.change(screen.getByLabelText("Order ID"), { target: { value: "ord_1" } });
    fireEvent.click(screen.getByRole("button", { name: "Look up" }));

    expect(screen.getByLabelText("Order ID")).toHaveValue("");
    const dialog: HTMLElement = screen.getByRole("dialog", { name: "Order ord_1" });
    expect(within(dialog).getByText("wgs_30x")).toBeInTheDocument();
    expect(within(dialog).getByText("GB")).toBeInTheDocument();
    expect(within(dialog).getByText("paid")).toBeInTheDocument();
    expect(within(dialog).getByText("May 1, 2026, 00:00 UTC")).toBeInTheDocument();
    expect(within(dialog).getByText(/Replaces/)).toHaveTextContent("Replaces kit_1");
    const replacementEvents: HTMLElement = within(dialog).getByRole("list", { name: "Events for kit_2" });
    expect(within(replacementEvents).getAllByRole("listitem").map((item: HTMLElement): string => item.textContent ?? "")).toEqual([
      "Kit shippedMay 19, 2026, 00:00 UTCcarrier",
      "Kit deliveredMay 22, 2026, 00:00 UTCcarrier",
    ]);
  });

  it("shows a message when the order is not found", () => {
    render(<Dashboard data={DATASET} />);

    fireEvent.change(screen.getByLabelText("Order ID"), { target: { value: "ord_missing" } });
    fireEvent.click(screen.getByRole("button", { name: "Look up" }));

    expect(screen.getByRole("alert")).toHaveTextContent("No order found for ord_missing");
    expect(screen.getByLabelText("Order ID")).toHaveValue("ord_missing");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens an order from the stuck kits list and closes it", () => {
    render(<Dashboard data={DATASET} />);

    fireEvent.click(screen.getByRole("button", { name: "ord_1" }));
    expect(screen.getByRole("dialog", { name: "Order ord_1" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes the order details with the Escape key", () => {
    render(<Dashboard data={DATASET} />);

    fireEvent.click(screen.getByRole("button", { name: "ord_1" }));
    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("applies filters to every panel and clears them in one action", () => {
    const dataset: Dataset = {
      orders: [
        { ...makeOrder("ord_us"), country: "US" },
        { ...makeOrder("ord_gb"), country: "GB" },
      ],
      kitEvents: [
        makeEvent("ord_us", "kit_us", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_gb", "kit_gb", "kit_shipped", "2026-05-02T00:00:00Z"),
        makeEvent("ord_gb", "kit_gb", "kit_delivered", "2026-10-20T00:00:00Z"),
      ],
    };
    render(<Dashboard data={dataset} />);
    const totalOrders = (): string | null => screen.getByText("Total orders").nextElementSibling?.textContent ?? null;

    expect(totalOrders()).toBe("2");
    expect(screen.getByRole("button", { name: "ord_us" })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Country"), { target: { value: "GB" } });

    expect(totalOrders()).toBe("1");
    expect(screen.queryByRole("button", { name: "ord_us" })).not.toBeInTheDocument();
    expect(screen.getByText(/as of Oct 20, 2026/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear filters" }));

    expect(totalOrders()).toBe("2");
    expect(screen.getByLabelText("Country")).toHaveValue("");
  });

  it("excludes test orders by default and shows what was cleaned", () => {
    const dataset: Dataset = {
      orders: [makeOrder("ord_1"), { ...makeOrder("ord_test"), isTest: "true" }],
      kitEvents: [
        makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"),
        { ...makeEvent("ord_1", "kit_1", "kit_shipped", "2026-05-02T00:00:00Z"), eventId: "evt_dupe" },
        makeEvent("ord_orphan", "kit_orphan", "kit_shipped", "2026-05-02T00:00:00Z"),
      ],
    };
    render(<Dashboard data={dataset} />);
    const totalOrders = (): string | null => screen.getByText("Total orders").nextElementSibling?.textContent ?? null;
    const countFor = (label: string): string | null => screen.getByText(label).nextElementSibling?.textContent ?? null;

    expect(totalOrders()).toBe("1");
    expect(countFor("Duplicate events removed")).toBe("1");
    expect(countFor("Orphan events excluded")).toBe("1");
    expect(countFor("Test orders excluded")).toBe("1");

    fireEvent.click(screen.getByLabelText("Include test orders"));

    expect(totalOrders()).toBe("2");
    expect(countFor("Test orders included")).toBe("1");
  });
});
