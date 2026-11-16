import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi, type Mock } from "vitest";
import { Button } from "./Button.tsx";

describe("Button", () => {
  it("calls onClick when clicked", () => {
    const onClick: Mock<() => void> = vi.fn();
    render(
      <Button type="button" variant="secondary" onClick={onClick}>
        Clear
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(
      <Button type="submit" variant="primary" disabled>
        Load
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Load" })).toBeDisabled();
  });

  it("applies the styling for its variant", () => {
    render(
      <Button type="button" variant="primary">
        Go
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Go" })).toHaveClass("bg-slate-900");
  });
});
