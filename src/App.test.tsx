import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { App } from "./App.tsx";

const ORDERS_CSV: string =
  "order_id,created_at,customer_id,product,country,status,is_test\nord_1,2026-04-30T19:49:51-05:00,cus_1,wgs_30x,US,paid,false\n";

const KIT_EVENTS_CSV: string =
  "event_id,order_id,kit_id,event_type,occurred_at,source\nevt_1,ord_1,kit_1,kit_shipped,2026-05-02T10:00:00Z,system\n";

const mockFetch = (responses: Record<string, Response>): void => {
  vi.stubGlobal(
    "fetch",
    vi.fn((url: string): Promise<Response> => {
      const fileName: string = url.split("/").pop() ?? "";
      return Promise.resolve(responses[fileName] ?? new Response("", { status: 404 }));
    }),
  );
};

describe("App", () => {
  afterEach((): void => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows a loading state, then the dashboard panels", async () => {
    const logSpy: MockInstance<typeof console.log> = vi.spyOn(console, "log").mockImplementation((): void => {});
    mockFetch({
      "orders.csv": new Response(ORDERS_CSV),
      "kit_events.csv": new Response(KIT_EVENTS_CSV),
    });

    render(<App />);

    expect(screen.getByText("Loading data…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Pipeline overview" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Stage durations" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Stuck kits" })).toBeInTheDocument();
    expect(logSpy).toHaveBeenCalledWith(
      "Loaded bundled data",
      expect.objectContaining({
        orders: [expect.objectContaining({ orderId: "ord_1" })],
        kitEvents: [expect.objectContaining({ eventId: "evt_1" })],
      }),
    );
  });

  it("shows an error state when a file fails to load", async () => {
    mockFetch({ "orders.csv": new Response(ORDERS_CSV) });

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("Failed to load kit_events.csv (404)");
  });

  it("shows an error state when a required column is missing", async () => {
    mockFetch({
      "orders.csv": new Response("order_id\nord_1\n"),
      "kit_events.csv": new Response(KIT_EVENTS_CSV),
    });

    render(<App />);

    expect(await screen.findByRole("alert")).toHaveTextContent("orders.csv is missing required columns");
  });

  it("replaces the data with an uploaded pair of CSVs", async () => {
    mockFetch({
      "orders.csv": new Response(ORDERS_CSV),
      "kit_events.csv": new Response(KIT_EVENTS_CSV),
    });
    render(<App />);
    await screen.findByRole("heading", { name: "Pipeline overview" });
    const totalOrders = (): string | null => screen.getByText("Total orders").nextElementSibling?.textContent ?? null;
    expect(totalOrders()).toBe("1");

    const uploadedOrders: string = `${ORDERS_CSV}ord_2,2026-05-01T00:00:00Z,cus_2,wgs_100x,GB,paid,false\n`;
    fireEvent.change(screen.getByLabelText("Orders CSV"), {
      target: { files: [new File([uploadedOrders], "orders_new.csv", { type: "text/csv" })] },
    });
    fireEvent.change(screen.getByLabelText("Kit events CSV"), {
      target: { files: [new File([KIT_EVENTS_CSV], "kit_events_new.csv", { type: "text/csv" })] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Load files" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Showing uploaded data from orders_new.csv and kit_events_new.csv",
    );
    await waitFor((): void => {
      expect(totalOrders()).toBe("2");
    });
  });

  it("keeps the current data and shows an error when an uploaded file is missing a column", async () => {
    mockFetch({
      "orders.csv": new Response(ORDERS_CSV),
      "kit_events.csv": new Response(KIT_EVENTS_CSV),
    });
    render(<App />);
    await screen.findByRole("heading", { name: "Pipeline overview" });

    fireEvent.change(screen.getByLabelText("Orders CSV"), {
      target: { files: [new File(["order_id\nord_9\n"], "bad.csv", { type: "text/csv" })] },
    });
    fireEvent.change(screen.getByLabelText("Kit events CSV"), {
      target: { files: [new File([KIT_EVENTS_CSV], "kit_events_new.csv", { type: "text/csv" })] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Load files" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "orders.csv is missing required columns: created_at, customer_id, product, country, status, is_test. The current data is still loaded.",
    );
    expect(screen.getByText("Total orders").nextElementSibling).toHaveTextContent("1");
  });

  it("only enables loading once both files are selected", async () => {
    mockFetch({
      "orders.csv": new Response(ORDERS_CSV),
      "kit_events.csv": new Response(KIT_EVENTS_CSV),
    });
    render(<App />);
    await screen.findByRole("heading", { name: "Pipeline overview" });

    expect(screen.getByRole("button", { name: "Load files" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Orders CSV"), {
      target: { files: [new File([ORDERS_CSV], "orders.csv", { type: "text/csv" })] },
    });
    expect(screen.getByRole("button", { name: "Load files" })).toBeDisabled();
  });
});
