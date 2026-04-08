import type { DeckTheme } from "./types";

/** Brand default values used in both the deck editor and preview. */
export const DECK_THEME_DEFAULTS = {
  backgroundColor: "#4a6b7c",
  primaryColor: "#0d2b6b",
  accentColor: "#c0262d",
  slideSpacing: "normal",
} as const satisfies Required<DeckTheme>;
