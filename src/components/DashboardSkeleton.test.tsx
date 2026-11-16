import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardSkeleton } from "./DashboardSkeleton.tsx";

describe("DashboardSkeleton", () => {
  it("announces its label as a loading status", () => {
    render(<DashboardSkeleton label="Loading data…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading data…");
  });
});
