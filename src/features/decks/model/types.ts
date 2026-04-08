import type { AudienceType, SectionType } from "../../templates/model";

export type DeckStatus = "draft" | "ready" | "exported" | "archived";

export type SlideSpacing = "compact" | "normal" | "relaxed";

export interface DeckTheme {
  /** Background color of the preview canvas. */
  backgroundColor?: string;
  /** Primary color used for headings and borders (defaults to brand navy). */
  primaryColor?: string;
  /** Accent color used for highlights and decorative elements (defaults to brand red). */
  accentColor?: string;
  /** Spacing between slides in the preview. */
  slideSpacing?: SlideSpacing;
}

export interface DeckSection {
  id: string;
  type: SectionType;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
  content: Record<string, unknown>;
}

export interface Deck {
  id: string;
  title: string;
  slug: string;
  audienceType: AudienceType;
  status: DeckStatus;
  templateId: string;
  projectName: string;
  subtitle?: string;
  summary?: string;
  sections: DeckSection[];
  assetIds: string[];
  financialModelId?: string;
  theme?: DeckTheme;
  updatedAt: string;
  createdAt: string;
}
