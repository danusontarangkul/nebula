import { render, screen } from "@testing-library/react";
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

  it("shows a loading state, then the pipeline overview", async () => {
    const logSpy: MockInstance<typeof console.log> = vi.spyOn(console, "log").mockImplementation((): void => {});
    mockFetch({
      "orders.csv": new Response(ORDERS_CSV),
      "kit_events.csv": new Response(KIT_EVENTS_CSV),
    });

    render(<App />);

    expect(screen.getByText("Loading data…")).toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "Pipeline overview" })).toBeInTheDocument();
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
});
