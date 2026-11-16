import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableCell } from "./TableCell.tsx";

describe("TableCell", () => {
  it("right-aligns numbers with tabular figures", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell align="right">12.3</TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByRole("cell", { name: "12.3" })).toHaveClass("text-right", "tabular-nums");
  });

  it("uses a monospace font for IDs", () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell align="left" isMonospace>
              kit_1
            </TableCell>
          </tr>
        </tbody>
      </table>,
    );
    expect(screen.getByRole("cell", { name: "kit_1" })).toHaveClass("font-mono");
  });
});
