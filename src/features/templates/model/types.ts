export type AudienceType =
  | "investor"
  | "lender"
  | "sponsor"
  | "municipality"
  | "internal";

export type SectionType =
  | "cover"
  | "executive-summary"
  | "investment-thesis"
  | "market"
  | "opportunity"
  | "project-overview"
  | "use-of-funds"
  | "returns"
  | "projections"
  | "team"
  | "risks-disclaimer"
  | "closing-cta";

export interface SectionDefinition {
  type: SectionType;
  defaultTitle: string;
  defaultContent?: string;
  isRequired: boolean;
  sortOrder: number;
}

export interface ThemeOverrides {
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  supportedAudienceTypes: AudienceType[];
  sectionDefinitions: SectionDefinition[];
  themeOverrides?: ThemeOverrides;
}
