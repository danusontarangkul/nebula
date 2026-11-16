import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Spinner } from "./Spinner.tsx";

describe("Spinner", () => {
  it("announces its label as a loading status", () => {
    render(<Spinner label="Loading files…" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading files…");
  });
});
