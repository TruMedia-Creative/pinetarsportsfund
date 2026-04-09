import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ExportPage from "./ExportPage";

const getDeckByIdMock = vi.fn();
const exportDeckAsPptxMock = vi.fn();

vi.mock("../../../lib/api/supabase/decks", () => ({
  getDeckById: (...args: unknown[]) => getDeckByIdMock(...args),
}));

vi.mock("../utils/buildDeck", () => ({
  exportDeckAsPptx: (...args: unknown[]) => exportDeckAsPptxMock(...args),
}));

const deckFixture = {
  id: "deck-1",
  title: "Investor Deck",
  slug: "investor-deck",
  audienceType: "investor",
  status: "ready",
  templateId: "tpl-investor-pitch",
  projectName: "Pine Tar Sports Complex",
  sections: [
    { id: "s1", isEnabled: true },
    { id: "s2", isEnabled: false },
  ],
};

describe("ExportPage", () => {
  beforeEach(() => {
    getDeckByIdMock.mockResolvedValue(deckFixture);
    exportDeckAsPptxMock.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders the export checklist and summary cards", async () => {
    render(
      <MemoryRouter initialEntries={["/exports/deck-1"]}>
        <Routes>
          <Route path="/exports/:deckId" element={<ExportPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText("Export Checklist")).toBeInTheDocument();
    expect(screen.getByText("Deck Status")).toBeInTheDocument();
    expect(screen.getByText("Enabled Slides")).toBeInTheDocument();
    expect(screen.getByText("Audience")).toBeInTheDocument();
  });

  it("announces export progress and success after download starts", async () => {
    render(
      <MemoryRouter initialEntries={["/exports/deck-1"]}>
        <Routes>
          <Route path="/exports/:deckId" element={<ExportPage />} />
        </Routes>
      </MemoryRouter>,
    );

    const downloadButton = await screen.findByRole("button", { name: "Download PPTX" });
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(exportDeckAsPptxMock).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(/check your downloads folder/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Download started for investor-deck\.pptx\./i)).toBeInTheDocument();
  });
});