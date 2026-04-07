import type { AudienceType, SectionType } from "../../templates/model";

export type DeckStatus = "draft" | "ready" | "exported" | "archived";

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
  updatedAt: string;
  createdAt: string;
}
