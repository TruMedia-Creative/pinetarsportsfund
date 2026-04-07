export type AudienceType =
  | "investor"
  | "lender"
  | "sponsor"
  | "municipality"
  | "internal";

export const AUDIENCE_TYPES: readonly AudienceType[] = [
  "investor",
  "lender",
  "sponsor",
  "municipality",
  "internal",
] as const;

export const AUDIENCE_LABELS: Record<AudienceType, string> = {
  investor: "Investor",
  lender: "Lender",
  sponsor: "Sponsor",
  municipality: "Municipality",
  internal: "Internal",
};

export type SectionType =
  | "cover"
  | "executive_summary"
  | "investment_thesis"
  | "opportunity"
  | "market"
  | "project_overview"
  | "team"
  | "use_of_funds"
  | "returns"
  | "projections"
  | "risks_disclaimer"
  | "closing_cta";

export interface SectionTemplate {
  id: string;
  type: SectionType;
  title: string;
  isEnabled: boolean;
  sortOrder: number;
  content: Record<string, unknown>;
}

export interface TemplateSectionDefinition {
  id?: string;
  type: SectionType;
  defaultTitle: string;
  description?: string;
  isRequired: boolean;
  defaultEnabled?: boolean;
  sortOrder: number;
  defaultContent: string;
}

export interface ThemeOverrides {
  primaryColor?: string;
  accentColor?: string;
  fontFamily?: string;
}

export interface SlideTemplate {
  id: string;
  name: string;
  description: string;
  supportedAudienceTypes: AudienceType[];
  sectionDefinitions: TemplateSectionDefinition[];
  themeOverrides?: ThemeOverrides;
}
