import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton.tsx";

describe("Skeleton", () => {
  it("renders a pulsing block hidden from screen readers with the given size", () => {
    const { container }: { container: HTMLElement } = render(<Skeleton className="h-5 w-24" />);
    const block: Element | null = container.firstElementChild;
    expect(block).toHaveAttribute("aria-hidden", "true");
    expect(block).toHaveClass("animate-pulse", "h-5", "w-24");
  });
});
