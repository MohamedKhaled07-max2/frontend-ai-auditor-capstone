import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScoreCard from "./ScoreCard";

describe("ScoreCard", () => {
  it("renders the category label and score", () => {
    render(
      <ScoreCard
        label="Accessibility"
        score={85}
      />
    );

    expect(screen.getByText("Accessibility")).toBeInTheDocument();
    expect(screen.getByText("85")).toBeInTheDocument();
    expect(screen.getByText("/100")).toBeInTheDocument();
  });
});