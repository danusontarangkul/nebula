import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TileGrid } from "./TileGrid.tsx";

describe("TileGrid", () => {
  it("lays out its tiles in a responsive grid", () => {
    render(
      <TileGrid>
        <p>Tile</p>
      </TileGrid>,
    );
    expect(screen.getByText("Tile").parentElement).toHaveClass("grid", "sm:grid-cols-3");
  });
});
