import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableRow } from "./TableRow.tsx";

describe("TableRow", () => {
  it("renders a body row", () => {
    render(
      <table>
        <tbody>
          <TableRow>
            <td>Kit shipped</td>
          </TableRow>
        </tbody>
      </table>,
    );
    expect(screen.getByRole("row")).toHaveClass("border-slate-100");
  });
});
