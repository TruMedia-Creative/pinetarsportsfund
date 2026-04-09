/**
 * Typed content shapes for each DeckSection.type.
 * These narrow the generic `Record<string, unknown>` stored in DeckSection.content.
 */

export interface CoverContent {
  /** Body/summary text shown below the tagline */
  body?: string;
  /** Optional accent label, e.g. "Investment Opportunity" */
  tagline?: string;
  /** Right-side hero image URL */
  heroImageUrl?: string;
  /** Contact person's full name */
  contactName?: string;
  /** Contact person's title */
  contactTitle?: string;
  /** Company name */
  company?: string;
  /** Contact address */
  address?: string;
}

export interface ImageGalleryItem {
  url: string;
  alt?: string;
}

export interface ReturnTableRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface TableOfContentsItem {
  number: number;
  label: string;
}

export interface ExecutiveSummaryContent {
  body?: string;
  images?: ImageGalleryItem[];
  tableOfContents?: TableOfContentsItem[];
  returnsTableTitle?: string;
  returnsTableRows?: ReturnTableRow[];
}

export interface UseOfFundsRow {
  category: string;
  amount: string;
}

export interface UseOfFundsHighlight {
  title: string;
  body: string;
}

export interface UseOfFundsContent {
  body?: string;
  allocationRows?: UseOfFundsRow[];
  totalLabel?: string;
  totalAmount?: string;
  highlights?: UseOfFundsHighlight[];
}

export interface TimelineItem {
  period: string;
  phase: string;
  description: string;
}

export interface KeyMetric {
  value: string;
  label: string;
}

export interface ReturnsContent {
  body?: string;
  timelineItems?: TimelineItem[];
  keyMetrics?: KeyMetric[];
  exitStrategyTitle?: string;
  exitStrategyBody?: string;
}

export interface TeamMember {
  name: string;
  title: string;
  bio?: string;
  imageUrl?: string;
}

export interface TeamContent {
  body?: string;
  members?: TeamMember[];
}

export interface ProjectionsRow {
  label: string;
  value: string;
}

export interface ProjectionsContent {
  body?: string;
  rows?: ProjectionsRow[];
  metrics?: KeyMetric[];
}

/** Generic fallback for sections without a specific typed shape. */
export interface GenericSectionContent {
  body?: string;
  bullets?: string[];
  images?: ImageGalleryItem[];
}
