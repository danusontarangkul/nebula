import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Panel } from "./Panel.tsx";

describe("Panel", () => {
  it("renders a labelled section with its description and content", () => {
    render(
      <Panel id="stuck-kits" title="Stuck kits" description="3 kits past target">
        <p>Content</p>
      </Panel>,
    );
    expect(screen.getByRole("region", { name: "Stuck kits" })).toHaveTextContent("3 kits past targetContent");
  });

  it("leaves out the description when none is given", () => {
    const { container }: { container: HTMLElement } = render(
      <Panel id="overview" title="Overview">
        <span>Content</span>
      </Panel>,
    );
    expect(container.querySelectorAll("p")).toHaveLength(0);
  });
});
