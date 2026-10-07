import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AuditIssueCard from "./AuditIssueCard";

describe("AuditIssueCard", () => {
  it("renders an audit issue and its recommended fix", () => {
    render(
      <AuditIssueCard
        severity="high"
        title="Missing input label"
        explanation="The input has no accessible label."
        fix="Add a label linked with htmlFor."
      />
    );

    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("Missing input label")).toBeInTheDocument();
    expect(
      screen.getByText("The input has no accessible label.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add a label linked with htmlFor.")
    ).toBeInTheDocument();
  });
});