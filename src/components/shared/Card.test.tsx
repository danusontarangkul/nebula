import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card.tsx";

describe("Card", () => {
  it("renders a labelled section with its content", () => {
    render(
      <Card id="filters" title="Filters">
        <p>Content</p>
      </Card>,
    );
    expect(screen.getByRole("region", { name: "Filters" })).toHaveTextContent("Content");
  });
});
