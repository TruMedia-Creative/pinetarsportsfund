import { fireEvent, render, screen } from "@testing-library/react";
import { DeckSectionEditor } from "./DeckSectionEditor";
import type { DeckSection } from "../model/types";

vi.mock("../../assets/components", () => ({
  AssetPicker: () => <div data-testid="asset-picker" />,
}));

const sectionFixture: DeckSection[] = [
  {
    id: "section-complete",
    type: "project_overview",
    title: "Project Overview",
    isEnabled: true,
    sortOrder: 1,
    content: {
      body: "Project overview body",
      bullets: ["Demand is strong"],
      layoutVariant: "narrative",
    },
  },
  {
    id: "section-incomplete",
    type: "returns",
    title: "Returns",
    isEnabled: true,
    sortOrder: 2,
    content: {
      body: "",
      keyMetrics: [],
      timelineItems: [],
      layoutVariant: "timeline",
    },
  },
];

describe("DeckSectionEditor", () => {
  it("filters to incomplete sections", () => {
    render(
      <DeckSectionEditor
        sections={sectionFixture}
        onChange={vi.fn()}
        assetIds={[]}
        onAssetIdsChange={vi.fn()}
        mode="expert"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Needs Work/i }));

    expect(screen.getByText("Returns & Timeline")).toBeInTheDocument();
    expect(screen.queryByText("Project Overview")).not.toBeInTheDocument();
  });

  it("shows jump-to-next-incomplete and opens focused section details", () => {
    render(
      <DeckSectionEditor
        sections={sectionFixture}
        onChange={vi.fn()}
        assetIds={[]}
        onAssetIdsChange={vi.fn()}
        mode="guided"
        selectedSectionId="section-incomplete"
      />,
    );

    expect(screen.getByRole("link", { name: /Jump to next incomplete slide/i })).toBeInTheDocument();
    expect(screen.getByText("Section heading")).toBeInTheDocument();
    expect(screen.getByText(/Missing: Add a clear body summary/i)).toBeInTheDocument();
  });
});