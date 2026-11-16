import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TableHeaderRow } from "./TableHeaderRow.tsx";

describe("TableHeaderRow", () => {
  it("renders a header row", () => {
    render(
      <table>
        <thead>
          <TableHeaderRow>
            <th>Stage</th>
          </TableHeaderRow>
        </thead>
      </table>,
    );
    expect(screen.getByRole("row")).toHaveClass("border-slate-200");
  });
});
