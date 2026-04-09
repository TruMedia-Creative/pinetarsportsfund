import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { DeckPreviewPage } from "./DeckPreviewPage";

const getDeckByIdMock = vi.fn();
const getDecksMock = vi.fn();

vi.mock("../../../lib/api/supabase/decks", () => ({
  getDeckById: (...args: unknown[]) => getDeckByIdMock(...args),
  getDecks: (...args: unknown[]) => getDecksMock(...args),
}));

const previewDeckFixture = {
  id: "deck-preview-1",
  title: "Preview Deck",
  slug: "preview-deck",
  audienceType: "investor",
  status: "ready",
  templateId: "tpl-investor-pitch",
  projectName: "Pine Tar Sports Complex",
  subtitle: "Flagship youth and community sports destination",
  summary: "A viewer-ready deck for equity partners and financing conversations.",
  goal: "raise_equity",
  sections: [
    {
      id: "cover-1",
      type: "cover",
      title: "Cover",
      isEnabled: true,
      sortOrder: 1,
      content: {
        tagline: "Accredited Investor Opportunity",
        body: "High-level overview",
        contactName: "Jordan Smith",
        company: "Pine Tar Sports Fund",
      },
    },
    {
      id: "summary-1",
      type: "executive_summary",
      title: "Executive Summary",
      isEnabled: true,
      sortOrder: 2,
      content: {
        body: "Summary body with IRR focus.",
        returnsTableRows: [{ label: "IRR", value: "20%" }],
      },
    },
    {
      id: "projections-1",
      type: "projections",
      title: "Projections",
      isEnabled: true,
      sortOrder: 3,
      content: {
        body: "Projection detail",
        rows: [{ label: "Year 1 Revenue", value: "$2.1M" }],
      },
    },
  ],
  assetIds: [],
  updatedAt: "2026-01-01T00:00:00Z",
  createdAt: "2026-01-01T00:00:00Z",
};

beforeAll(() => {
  class IntersectionObserverMock {
    observe() {}
    disconnect() {}
    unobserve() {}
  }

  vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.print = vi.fn();
});

describe("DeckPreviewPage", () => {
  beforeEach(() => {
    window.localStorage.clear();
    getDeckByIdMock.mockResolvedValue(previewDeckFixture);
    getDecksMock.mockResolvedValue([previewDeckFixture]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the viewer shell for authenticated preview", async () => {
    render(
      <MemoryRouter initialEntries={["/decks/deck-preview-1/preview"]}>
        <Routes>
          <Route path="/decks/:deckId/preview" element={<DeckPreviewPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Viewer Controls")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Skip to slide content" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Viewer slide index" })).toBeInTheDocument();
    expect(screen.getByText("Audience Actions")).toBeInTheDocument();
    expect(screen.getByText("Viewer Signals")).toBeInTheDocument();
    expect(screen.getAllByText("Edit this slide").length).toBeGreaterThan(0);
  });

  it("supports layout changes and viewer comprehension toggles", async () => {
    render(
      <MemoryRouter initialEntries={["/decks/deck-preview-1/preview"]}>
        <Routes>
          <Route path="/decks/:deckId/preview" element={<DeckPreviewPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const layoutSelect = await screen.findByLabelText("Preview slide layout mode");
    fireEvent.change(layoutSelect, { target: { value: "metrics" } });
    expect(layoutSelect).toHaveValue("metrics");

    fireEvent.click(screen.getByRole("button", { name: "Presenter Notes" }));
    fireEvent.click(screen.getByRole("button", { name: "Data Focus" }));

    expect(screen.getAllByText("Presenter cue").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Glossary hints").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Data cues").length).toBeGreaterThan(0);
  });

  it("can hide appendix content from the viewer navigation", async () => {
    render(
      <MemoryRouter initialEntries={["/decks/deck-preview-1/preview"]}>
        <Routes>
          <Route path="/decks/:deckId/preview" element={<DeckPreviewPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const viewerNav = await screen.findByRole("navigation", { name: "Viewer slide index" });
    expect(within(viewerNav).getByText("Projections")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Appendix" }));

    expect(screen.getByText("1 deep-dive slide hidden.")).toBeInTheDocument();
    expect(within(viewerNav).queryByText("Projections")).not.toBeInTheDocument();
  });

  it("renders a polished public viewer without author-only controls", async () => {
    render(
      <MemoryRouter initialEntries={["/view/preview-deck"]}>
        <Routes>
          <Route path="/view/:slug" element={<DeckPreviewPage isPublic />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Viewer Controls")).toBeInTheDocument();
    expect(screen.queryByText("Viewer Signals")).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Edit" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Download PDF" })).toBeInTheDocument();
  });
});
