import { buildPptx } from "../../../lib/pptx";
import type { Deck } from "../../decks/model";

/**
 * Export orchestrator. Generates a branded PPTX from a deck and triggers download.
 * Lives here so additional output formats (PDF, email) can be added without touching
 * the PPTX builder or the export UI.
 */
export async function exportDeckAsPptx(deck: Deck): Promise<void> {
  return buildPptx(deck);
}
