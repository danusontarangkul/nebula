import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./FormField.tsx";

describe("FormField", () => {
  it("labels its control", () => {
    render(
      <FormField label="Country">
        <input type="text" />
      </FormField>,
    );
    expect(screen.getByLabelText("Country")).toBeInTheDocument();
  });
});
