import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { KitEventEntry } from "../types/data.ts";
import { KitEventItem } from "./KitEventItem.tsx";

describe("KitEventItem", () => {
  it("shows the event label, UTC time, and source", () => {
    const entry: KitEventEntry = {
      eventId: "evt_1",
      eventType: "kit_delivered",
      occurredAt: "2026-05-04T08:00:00.000Z",
      time: Date.UTC(2026, 4, 4, 8),
      source: "carrier",
    };
    render(
      <ol>
        <KitEventItem entry={entry} />
      </ol>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Kit deliveredMay 4, 2026, 08:00 UTCcarrier");
  });
});
