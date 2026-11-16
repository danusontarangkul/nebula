import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatRow } from "./StatRow.tsx";

describe("StatRow", () => {
  it("shows the label and the formatted count", () => {
    render(
      <dl>
        <StatRow label="Duplicate events removed" value={1469} />
      </dl>,
    );
    expect(screen.getByText("Duplicate events removed").nextElementSibling).toHaveTextContent("1,469");
  });
});
