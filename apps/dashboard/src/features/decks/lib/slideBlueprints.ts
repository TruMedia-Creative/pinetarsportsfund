import type { DeckSection } from "../model";
import type { SectionType } from "../../templates/model";

export type SlideLayoutVariant =
  | "narrative"
  | "metrics"
  | "visual"
  | "timeline"
  | "comparison";

export interface SlideBlueprintOption {
  id: SlideLayoutVariant;
  label: string;
  description: string;
}

export interface SectionCompletion {
  complete: number;
  total: number;
  missing: string[];
  ratio: number;
}

const BASE_BLUEPRINTS: SlideBlueprintOption[] = [
  {
    id: "narrative",
    label: "Narrative",
    description: "Headline + context + supporting detail.",
  },
  {
    id: "metrics",
    label: "Metrics First",
    description: "Lead with KPIs and quantified proof points.",
  },
  {
    id: "visual",
    label: "Visual First",
    description: "Lead with imagery and concise text.",
  },
];

const SECTION_BLUEPRINTS: Record<SectionType, SlideBlueprintOption[]> = {
  cover: BASE_BLUEPRINTS,
  executive_summary: [
    ...BASE_BLUEPRINTS,
    {
      id: "comparison",
      label: "Comparison",
      description: "Current state vs target outcome side-by-side.",
    },
  ],
  investment_thesis: [
    ...BASE_BLUEPRINTS,
    {
      id: "comparison",
      label: "Comparison",
      description: "Contrast risk-adjusted upside with alternatives.",
    },
  ],
  opportunity: BASE_BLUEPRINTS,
  market: [
    ...BASE_BLUEPRINTS,
    {
      id: "comparison",
      label: "Comparison",
      description: "Demand/supply and TAM/SAM comparisons.",
    },
  ],
  project_overview: BASE_BLUEPRINTS,
  team: [
    ...BASE_BLUEPRINTS,
    {
      id: "visual",
      label: "Visual First",
      description: "Headshots, roles, and short credibility lines.",
    },
  ],
  use_of_funds: [
    {
      id: "metrics",
      label: "Metrics First",
      description: "Allocation table and total capitalization first.",
    },
    {
      id: "comparison",
      label: "Comparison",
      description: "Sources vs uses with callout variances.",
    },
    {
      id: "narrative",
      label: "Narrative",
      description: "Explain rationale behind each allocation.",
    },
  ],
  returns: [
    {
      id: "timeline",
      label: "Timeline",
      description: "Phase-by-phase timeline with metric anchors.",
    },
    {
      id: "metrics",
      label: "Metrics First",
      description: "Highlight return metrics before details.",
    },
    {
      id: "narrative",
      label: "Narrative",
      description: "Explain path to returns and exit strategy.",
    },
  ],
  projections: [
    {
      id: "metrics",
      label: "Metrics First",
      description: "Projection table and KPI cards.",
    },
    {
      id: "comparison",
      label: "Comparison",
      description: "Base case vs downside scenario comparison.",
    },
    {
      id: "narrative",
      label: "Narrative",
      description: "Tell the assumptions behind projections.",
    },
  ],
  risks_disclaimer: BASE_BLUEPRINTS,
  closing_cta: BASE_BLUEPRINTS,
};

interface SectionContentWithVariant {
  layoutVariant?: SlideLayoutVariant;
  body?: unknown;
  bullets?: unknown;
  images?: unknown;
  rows?: unknown;
  metrics?: unknown;
  keyMetrics?: unknown;
  timelineItems?: unknown;
  members?: unknown;
  allocationRows?: unknown;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function countRows(value: unknown): number {
  return Array.isArray(value) ? value.length : 0;
}

function hasMeaningfulBody(content: SectionContentWithVariant): boolean {
  return typeof content.body === "string" && content.body.trim().length > 0;
}

export function getBlueprintOptions(sectionType: SectionType): SlideBlueprintOption[] {
  return SECTION_BLUEPRINTS[sectionType] ?? BASE_BLUEPRINTS;
}

export function getSavedLayoutVariant(section: DeckSection): SlideLayoutVariant {
  const content = section.content as SectionContentWithVariant;
  const variant = content.layoutVariant;
  const valid = getBlueprintOptions(section.type).some((option) => option.id === variant);
  return valid ? (variant as SlideLayoutVariant) : getBlueprintOptions(section.type)[0]?.id ?? "narrative";
}

export function withLayoutVariant(
  section: DeckSection,
  variant: SlideLayoutVariant,
): DeckSection {
  return {
    ...section,
    content: {
      ...section.content,
      layoutVariant: variant,
    },
  };
}

export function getSectionCompletion(section: DeckSection): SectionCompletion {
  const content = section.content as SectionContentWithVariant;
  let total = 1;
  let complete = hasMeaningfulBody(content) ? 1 : 0;
  const missing: string[] = [];

  if (!hasMeaningfulBody(content)) {
    missing.push("Add a clear body summary");
  }

  if (section.type === "cover") {
    total += 1;
    if (countRows(content.images) > 0 || typeof (content as { heroImageUrl?: string }).heroImageUrl === "string") {
      complete += 1;
    } else {
      missing.push("Add a hero image or visual");
    }
  }

  if (section.type === "use_of_funds") {
    total += 1;
    if (countRows(content.allocationRows) > 0) {
      complete += 1;
    } else {
      missing.push("Add allocation rows");
    }
  }

  if (section.type === "returns") {
    total += 1;
    if (countRows(content.keyMetrics) > 0 || countRows(content.timelineItems) > 0) {
      complete += 1;
    } else {
      missing.push("Add return metrics or timeline");
    }
  }

  if (section.type === "projections") {
    total += 1;
    if (countRows(content.rows) > 0 || countRows(content.metrics) > 0) {
      complete += 1;
    } else {
      missing.push("Add projection rows or key metrics");
    }
  }

  if (section.type === "team") {
    total += 1;
    if (countRows(content.members) > 0) {
      complete += 1;
    } else {
      missing.push("Add at least one team member");
    }
  }

  return {
    complete,
    total,
    missing,
    ratio: total === 0 ? 0 : complete / total,
  };
}

export function getSectionOutline(section: DeckSection): string[] {
  const content = section.content as SectionContentWithVariant;
  const bullets = asStringArray(content.bullets);

  if (bullets.length > 0) {
    return bullets.slice(0, 3);
  }

  if (section.type === "use_of_funds") {
    const rowCount = countRows(content.allocationRows);
    return rowCount > 0
      ? [
          `Allocation rows: ${rowCount}`,
          "Include total capitalization",
          "Highlight two key spending priorities",
        ]
      : ["Add categories", "Add amounts", "Add total project cost"];
  }

  if (section.type === "returns") {
    return [
      "State preferred return and target IRR",
      "Show timeline milestones",
      "Close with exit strategy",
    ];
  }

  if (section.type === "projections") {
    return [
      "List year-by-year projections",
      "Show key KPI callouts",
      "Document assumptions clearly",
    ];
  }

  if (typeof content.body === "string" && content.body.trim()) {
    const preview = content.body.trim().split(/[.!?]\s+/).filter(Boolean).slice(0, 2);
    return preview.length > 0 ? preview : ["Add concise summary", "Add proof points", "Add clear CTA"]; 
  }

  return ["Define key message", "Add supporting proof", "Add decision-oriented close"];
}
