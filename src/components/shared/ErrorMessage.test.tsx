import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ErrorMessage } from "./ErrorMessage.tsx";

describe("ErrorMessage", () => {
  it("renders its content as an alert", () => {
    render(<ErrorMessage>Something went wrong</ErrorMessage>);
    expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  });
});
