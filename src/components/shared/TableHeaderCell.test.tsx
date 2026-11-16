import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableHeaderCell } from "./TableHeaderCell.tsx";

describe("TableHeaderCell", () => {
  it("right-aligns when asked", () => {
    render(
      <table>
        <thead>
          <tr>
            <TableHeaderCell align="right">Kits</TableHeaderCell>
          </tr>
        </thead>
      </table>,
    );
    expect(screen.getByRole("columnheader", { name: "Kits" })).toHaveClass("text-right");
  });
});
