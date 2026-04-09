import { buildPptx } from "../../../lib/pptx";
import { getFinancialModelById } from "../../../lib/api/supabase/financials";
import type { Deck } from "../../decks/model";

/**
 * Export orchestrator. Generates a branded PPTX from a deck and triggers download.
 * Lives here so additional output formats (PDF, email) can be added without touching
 * the PPTX builder or the export UI.
 */
export async function exportDeckAsPptx(deck: Deck): Promise<void> {
  const financialModel = deck.financialModelId
    ? await getFinancialModelById(deck.financialModelId)
    : undefined;
  return buildPptx(deck, { financialModel });
}
