import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, LoadingSpinner, SurfacePanel, buttonClassName } from "../../../components/ui";
import { getDeckById, getDecks } from "../../../lib/api/supabase/decks";
import type { Deck, DeckSection, DeckTheme } from "../model/types";
import { DECK_THEME_DEFAULTS } from "../model";
import type {
  CoverContent,
  ExecutiveSummaryContent,
  UseOfFundsContent,
  ReturnsContent,
  TeamContent,
  ProjectionsContent,
  GenericSectionContent,
  ImageGalleryItem,
} from "../model/contentTypes";
import {
  getSectionCompletion,
  getSectionOutline,
  type SlideLayoutVariant,
} from "../lib/slideBlueprints";
import {
  createViewerSessionId,
  readViewerAnalyticsSummary,
  trackViewerEvent,
} from "../lib/viewerAnalytics";

const TEAL_HEADER = "#3d6b7c";

const AUDIENCE_VIEWER_COPY: Record<Deck["audienceType"], { label: string; summary: string }> = {
  investor: {
    label: "Investor Overview",
    summary: "Built for investors evaluating upside, downside protection, and sponsor credibility.",
  },
  lender: {
    label: "Lender Package",
    summary: "Built for lenders reviewing coverage, collateral, and repayment confidence.",
  },
  sponsor: {
    label: "Sponsorship Story",
    summary: "Built for sponsors evaluating reach, audience fit, and activation value.",
  },
  municipality: {
    label: "Municipal Partnership",
    summary: "Built for public stakeholders reviewing civic impact, partnership structure, and delivery confidence.",
  },
  internal: {
    label: "Internal Review",
    summary: "Built for internal stakeholders aligning on status, risks, and next decisions.",
  },
};

const GOAL_LABELS: Partial<Record<NonNullable<Deck["goal"]>, string>> = {
  raise_equity: "Raise Equity",
  secure_debt: "Secure Debt",
  win_sponsor: "Win Sponsorship",
  municipal_partnership: "Municipal Partnership",
  board_update: "Board Update",
  teaser: "Teaser Deck",
};

const GLOSSARY = [
  { term: "IRR", definition: "Internal Rate of Return: annualized return expected over the investment lifecycle." },
  { term: "MOIC", definition: "Multiple on Invested Capital: total value returned divided by invested capital." },
  { term: "DSCR", definition: "Debt Service Coverage Ratio: operating cash flow divided by debt obligations." },
  { term: "NOI", definition: "Net Operating Income: income after operating expenses and before financing costs." },
  { term: "preferred return", definition: "The minimum return paid to investors before the sponsor shares in profits." },
  { term: "capital stack", definition: "The mix of debt and equity used to fund the project." },
  { term: "equity raise", definition: "The total investor capital being raised for the project." },
  { term: "LP", definition: "Limited Partner: a passive investor in the deal structure." },
  { term: "GP", definition: "General Partner: the sponsor or manager responsible for execution." },
  { term: "TAM", definition: "Total Addressable Market: the full market opportunity if all potential demand were captured." },
  { term: "SAM", definition: "Serviceable Available Market: the segment of TAM the project can realistically serve." },
] as const;

const PREVIEW_LAYOUT_OPTIONS: { value: "saved" | SlideLayoutVariant; label: string }[] = [
  { value: "saved", label: "Saved Layout" },
  { value: "narrative", label: "Narrative" },
  { value: "metrics", label: "Metrics First" },
  { value: "visual", label: "Visual First" },
  { value: "timeline", label: "Timeline" },
  { value: "comparison", label: "Comparison" },
];

interface ResolvedTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  headerColor: string;
  slideSpacingPx: number;
}

interface ViewerSectionMeta {
  section: DeckSection;
  index: number;
  outline: string[];
  takeaway: string;
  completion: ReturnType<typeof getSectionCompletion>;
  isAppendix: boolean;
  glossaryTerms: Array<{ term: string; definition: string }>;
}

function resolveTheme(theme: DeckTheme | undefined): ResolvedTheme {
  return {
    backgroundColor: theme?.backgroundColor ?? DECK_THEME_DEFAULTS.backgroundColor,
    primaryColor: theme?.primaryColor ?? DECK_THEME_DEFAULTS.primaryColor,
    accentColor: theme?.accentColor ?? DECK_THEME_DEFAULTS.accentColor,
    headerColor: TEAL_HEADER,
    slideSpacingPx:
      (theme?.slideSpacing ?? DECK_THEME_DEFAULTS.slideSpacing) === "compact"
        ? 12
        : (theme?.slideSpacing ?? DECK_THEME_DEFAULTS.slideSpacing) === "relaxed"
          ? 48
          : 32,
  };
}

function formatDeckDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(value));
}

function getVersionLabel(updatedAt: string) {
  const date = new Date(updatedAt);
  return `v${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getConfidentialityLabel(deck: Deck, isPublic: boolean) {
  if (isPublic) return "Shared viewer link";
  if (deck.audienceType === "investor" || deck.audienceType === "lender") {
    return "Confidential financing material";
  }
  return "Presentation material";
}

function getSectionTakeaway(section: DeckSection) {
  const outline = getSectionOutline(section);
  if (outline.length > 0) return outline[0];

  const body = typeof section.content.body === "string" ? section.content.body.trim() : "";
  if (!body) return "Focus the audience on the single most important decision or proof point here.";

  return body.split(/[.!?]\s+/).filter(Boolean)[0] ?? body;
}

function isAppendixSection(section: DeckSection, index: number, total: number) {
  if (section.type === "risks_disclaimer" || section.type === "projections") return true;
  if (section.type === "team" && total > 6) return true;
  return index >= Math.max(6, total - 2);
}

function findGlossaryTerms(section: DeckSection) {
  const haystack = JSON.stringify(section.content).toLowerCase();
  return GLOSSARY.filter((entry) => haystack.includes(entry.term.toLowerCase()));
}

function createMailtoHref(deck: Deck, label: string) {
  const subject = encodeURIComponent(`${deck.projectName} | ${label}`);
  const body = encodeURIComponent(`Hello,\n\nI reviewed the ${deck.title} deck and would like to discuss next steps.\n\nThank you.`);
  return `mailto:?subject=${subject}&body=${body}`;
}

function SectionWrapper({
  children,
  className = "",
  marginBottom,
}: {
  children: React.ReactNode;
  className?: string;
  marginBottom?: number;
}) {
  return (
    <section
      className={`mx-auto max-w-5xl rounded-xl bg-white shadow-md ${className}`}
      style={{ marginBottom: marginBottom !== undefined ? `${marginBottom}px` : "2rem" }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ title, primaryColor, accentColor, id }: { title: string; primaryColor: string; accentColor: string; id: string }) {
  return (
    <div>
      <h2 id={id} className="mb-2 text-2xl font-black uppercase tracking-tight" style={{ color: primaryColor }}>
        {title}
      </h2>
      <div className="mb-6 h-1 w-full" style={{ backgroundColor: accentColor }} />
    </div>
  );
}

function PhotoGallery({ images }: { images: ImageGalleryItem[] }) {
  if (!images.length) return null;
  return (
    <div className={`grid gap-3 ${images.length === 1 ? "grid-cols-1" : images.length === 2 ? "grid-cols-2" : "grid-cols-3"}`}>
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img.url}
          alt={img.alt ?? ""}
          className="h-44 w-full rounded-lg object-cover"
          onError={(event) => {
            (event.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ))}
    </div>
  );
}

function CoverSection({ section, deck, theme }: { section: DeckSection; deck: Deck; theme: ResolvedTheme }) {
  const c = section.content as CoverContent;
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-xl shadow-lg" style={{ minHeight: 360, marginBottom: theme.slideSpacingPx }}>
      <div className="flex min-h-[360px] flex-col md:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-white p-8 md:max-w-[45%]">
          <div>
            <h1 className="mb-2 text-4xl font-black uppercase leading-tight" style={{ color: theme.primaryColor }}>
              {deck.projectName}
            </h1>
            {c.tagline && <p className="mb-4 text-xl font-bold" style={{ color: theme.accentColor }}>{c.tagline}</p>}
            {c.body && (
              <div className="mb-6 border-l-4 pl-4" style={{ borderColor: theme.headerColor }}>
                <p className="text-sm leading-relaxed text-gray-600">{c.body}</p>
              </div>
            )}
          </div>
          <div>
            {c.contactName && <p className="font-bold" style={{ color: theme.primaryColor }}>{c.contactName}</p>}
            {c.company && <p className="font-semibold" style={{ color: theme.accentColor }}>{c.company}</p>}
            {c.address && <p className="text-sm text-gray-500">{c.address}</p>}
          </div>
        </div>
        <div className="flex-1 min-h-[220px] md:min-h-[360px]">
          {c.heroImageUrl ? (
            <img
              src={c.heroImageUrl}
              alt={deck.projectName}
              className="h-full w-full object-cover"
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm text-slate-400">
              Viewer-ready hero image not available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutiveSummarySection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as ExecutiveSummaryContent;
  const variant = (section.content as { layoutVariant?: SlideLayoutVariant }).layoutVariant ?? "narrative";
  const toc = c.tableOfContents ?? [];
  const returnRows = c.returnsTableRows ?? [];

  return (
    <SectionWrapper className="p-8" marginBottom={theme.slideSpacingPx}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div>
          <SectionTitle id={`section-title-${section.id}`} title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
          {c.body && <p className="mb-6 text-sm leading-relaxed text-gray-600">{c.body}</p>}
          {toc.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">Table of Contents</p>
              <ol className="space-y-1">
                {toc.map((item) => (
                  <li key={item.number} className="flex items-start gap-3 border-b border-gray-100 py-1">
                    <span className="w-6 shrink-0 text-xs font-semibold text-gray-400">{String(item.number).padStart(2, "0")}</span>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <div className="space-y-6">
          {variant !== "metrics" && (c.images ?? []).length > 0 && <PhotoGallery images={c.images ?? []} />}
          {returnRows.length > 0 && (
            <div className="rounded-lg border p-5" style={{ borderColor: theme.primaryColor }}>
              {c.returnsTableTitle && <h3 className="mb-4 text-sm font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>{c.returnsTableTitle}</h3>}
              <table className="w-full">
                <tbody>
                  {returnRows.map((row, idx) => (
                    <tr key={idx} className={row.highlight ? "font-semibold" : ""} style={row.highlight ? { backgroundColor: "#fef2f2" } : undefined}>
                      <td className="py-1.5 text-sm text-gray-700">{row.label}</td>
                      <td className="py-1.5 text-right text-sm font-bold" style={{ color: row.highlight ? theme.accentColor : theme.primaryColor }}>{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {variant === "metrics" && (c.images ?? []).length > 0 && <PhotoGallery images={c.images ?? []} />}
        </div>
      </div>
    </SectionWrapper>
  );
}

function UseOfFundsSection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as UseOfFundsContent;
  const variant = (section.content as { layoutVariant?: SlideLayoutVariant }).layoutVariant ?? "metrics";
  const rows = c.allocationRows ?? [];
  const highlights = c.highlights ?? [];

  return (
    <SectionWrapper className="p-8" marginBottom={theme.slideSpacingPx}>
      <SectionTitle id={`section-title-${section.id}`} title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {variant === "comparison" && highlights.length > 0 && (
          <div className="space-y-6">
            {highlights.map((highlight, idx) => (
              <div key={idx}>
                <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.headerColor }}>
                  <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>{highlight.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{highlight.body}</p>
              </div>
            ))}
          </div>
        )}
        <div>
          {c.body && <p className="mb-4 text-sm text-gray-600">{c.body}</p>}
          {rows.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: theme.primaryColor }}>
                  <th className="pb-2 text-left text-xs font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>Allocation Category</th>
                  <th className="pb-2 text-right text-xs font-black uppercase tracking-wide" style={{ color: theme.accentColor }}>Amount (USD)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-700">{row.category}</td>
                    <td className="py-2 text-right text-sm font-semibold" style={{ color: theme.accentColor }}>{row.amount}</td>
                  </tr>
                ))}
              </tbody>
              {(c.totalLabel || c.totalAmount) && (
                <tfoot>
                  <tr>
                    <td className="pt-3 text-sm font-black" style={{ color: theme.primaryColor }}>{c.totalLabel}</td>
                    <td className="pt-3 text-right text-sm font-black" style={{ color: theme.primaryColor }}>{c.totalAmount}</td>
                  </tr>
                </tfoot>
              )}
            </table>
          )}
        </div>
        {highlights.length > 0 && variant !== "comparison" && (
          <div className="space-y-6">
            {highlights.map((highlight, idx) => (
              <div key={idx}>
                <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.headerColor }}>
                  <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>{highlight.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{highlight.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

function ReturnsSection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as ReturnsContent;
  const variant = (section.content as { layoutVariant?: SlideLayoutVariant }).layoutVariant ?? "timeline";
  const timeline = c.timelineItems ?? [];
  const metrics = c.keyMetrics ?? [];

  return (
    <SectionWrapper className="p-8" marginBottom={theme.slideSpacingPx}>
      <SectionTitle id={`section-title-${section.id}`} title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && <p className="mb-6 text-sm text-gray-600">{c.body}</p>}
      {timeline.length > 0 && variant !== "metrics" && (
        <div className={`mb-8 grid gap-6 ${timeline.length === 1 ? "grid-cols-1" : timeline.length <= 2 ? "grid-cols-2" : "grid-cols-4"}`}>
          {timeline.map((item, idx) => (
            <div key={idx}>
              <p className="mb-1 text-lg font-black" style={{ color: theme.accentColor }}>{item.period}</p>
              <p className="mb-3 text-xs font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>{item.phase}</p>
              <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      )}
      {(metrics.length > 0 || c.exitStrategyTitle) && (
        <div className="grid gap-6 rounded-lg bg-slate-50 p-6" style={{ gridTemplateColumns: metrics.length > 0 ? `repeat(${Math.min(metrics.length, 2)}, 1fr) 2fr` : "1fr" }}>
          {metrics.map((metric, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-black" style={{ color: theme.primaryColor }}>{metric.value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">{metric.label}</p>
            </div>
          ))}
          {c.exitStrategyTitle && (
            <div className="border-l-4 pl-4" style={{ borderColor: theme.headerColor }}>
              <p className="mb-2 font-bold" style={{ color: theme.accentColor }}>{c.exitStrategyTitle}</p>
              <p className="text-sm leading-relaxed text-gray-600">{c.exitStrategyBody}</p>
            </div>
          )}
        </div>
      )}
    </SectionWrapper>
  );
}

function TeamSection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as TeamContent;
  const members = c.members ?? [];

  return (
    <SectionWrapper className="p-8" marginBottom={theme.slideSpacingPx}>
      <SectionTitle id={`section-title-${section.id}`} title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && <p className="mb-6 text-sm leading-relaxed text-gray-600">{c.body}</p>}
      {members.length > 0 && (
        <div className={`grid gap-6 ${members.length === 1 ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
          {members.map((member, idx) => (
            <div key={idx} className="flex items-start gap-4">
              {member.imageUrl ? (
                <img src={member.imageUrl} alt={member.name} className="h-16 w-16 shrink-0 rounded-full object-cover" onError={(event) => { (event.currentTarget as HTMLImageElement).style.display = "none"; }} />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white" style={{ backgroundColor: theme.primaryColor }}>
                  {member.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">{member.name}</p>
                <p className="text-sm" style={{ color: theme.accentColor }}>{member.title}</p>
                {member.bio && <p className="mt-1 text-sm text-gray-600">{member.bio}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}

function ProjectionsSection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as ProjectionsContent;
  const variant = (section.content as { layoutVariant?: SlideLayoutVariant }).layoutVariant ?? "metrics";
  const rows = c.rows ?? [];
  const metrics = c.metrics ?? [];

  return (
    <SectionWrapper className="p-8" marginBottom={theme.slideSpacingPx}>
      <SectionTitle id={`section-title-${section.id}`} title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && <p className="mb-6 text-sm text-gray-600">{c.body}</p>}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {metrics.length > 0 && variant === "visual" && (
          <div className={`grid gap-4 ${metrics.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {metrics.map((metric, idx) => (
              <div key={idx} className="rounded-lg bg-[#f0f4ff] p-4 text-center">
                <p className="text-3xl font-black" style={{ color: theme.primaryColor }}>{metric.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
        {rows.length > 0 && (
          <table className="w-full">
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 text-sm text-gray-700">{row.label}</td>
                  <td className="py-2 text-right text-sm font-semibold" style={{ color: theme.primaryColor }}>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {metrics.length > 0 && variant !== "visual" && (
          <div className={`grid gap-4 ${metrics.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {metrics.map((metric, idx) => (
              <div key={idx} className="rounded-lg bg-[#f0f4ff] p-4 text-center">
                <p className="text-3xl font-black" style={{ color: theme.primaryColor }}>{metric.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{metric.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </SectionWrapper>
  );
}

function GenericSection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as GenericSectionContent;
  const variant = (section.content as { layoutVariant?: SlideLayoutVariant }).layoutVariant ?? "narrative";
  const bullets = c.bullets ?? [];
  const images = c.images ?? [];

  return (
    <SectionWrapper className="p-8" marginBottom={theme.slideSpacingPx}>
      <SectionTitle id={`section-title-${section.id}`} title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {images.length > 0 && variant === "visual" && <PhotoGallery images={images} />}
      {c.body && <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">{c.body}</p>}
      {bullets.length > 0 && (
        <ul className="mb-6 space-y-2">
          {bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: theme.accentColor }}>•</span>
              <span className="text-sm text-gray-700">{bullet}</span>
            </li>
          ))}
        </ul>
      )}
      {images.length > 0 && variant !== "visual" && <PhotoGallery images={images} />}
    </SectionWrapper>
  );
}

function RenderSection({ section, deck, theme }: { section: DeckSection; deck: Deck; theme: ResolvedTheme }) {
  if (!section.isEnabled) return null;

  switch (section.type) {
    case "cover":
      return <CoverSection section={section} deck={deck} theme={theme} />;
    case "executive_summary":
      return <ExecutiveSummarySection section={section} theme={theme} />;
    case "use_of_funds":
      return <UseOfFundsSection section={section} theme={theme} />;
    case "returns":
      return <ReturnsSection section={section} theme={theme} />;
    case "team":
      return <TeamSection section={section} theme={theme} />;
    case "projections":
      return <ProjectionsSection section={section} theme={theme} />;
    default:
      return <GenericSection section={section} theme={theme} />;
  }
}

interface DeckPreviewPageProps {
  isPublic?: boolean;
}

function ViewerLoadingState({ isPublic }: { isPublic: boolean }) {
  if (!isPublic) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
      <SurfacePanel padding="lg" className="w-full max-w-3xl">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Shared deck</p>
          <div className="h-8 w-1/2 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="h-48 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-48 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      </SurfacePanel>
    </div>
  );
}

export function DeckPreviewPage({ isPublic = false }: DeckPreviewPageProps) {
  const { deckId, slug } = useParams();
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewLayoutMode, setPreviewLayoutMode] = useState<"saved" | SlideLayoutVariant>("saved");
  const [presentationMode, setPresentationMode] = useState(false);
  const [readingMode, setReadingMode] = useState(isPublic);
  const [showAppendix, setShowAppendix] = useState(!isPublic);
  const [showGlossary, setShowGlossary] = useState(true);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [dataFocus, setDataFocus] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [sessionId] = useState(() => createViewerSessionId());
  const [analyticsSummary, setAnalyticsSummary] = useState({ sessions: 0, slideViews: 0, ctaClicks: 0, modeChanges: 0 });

  useEffect(() => {
    async function load() {
      try {
        let found: Deck | undefined;
        if (deckId) {
          found = await getDeckById(deckId);
        } else if (slug) {
          const allDecks = await getDecks();
          found = allDecks.find((item) => item.slug === slug);
        }
        if (!found) {
          setError("Deck not found.");
        } else {
          setDeck(found);
        }
      } catch {
        setError("Failed to load deck.");
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [deckId, slug]);

  const enabledSections = [...(deck?.sections ?? [])]
    .filter((section) => section.isEnabled)
    .sort((left, right) => left.sortOrder - right.sortOrder);

  const renderedSections =
    previewLayoutMode === "saved"
      ? enabledSections
      : enabledSections.map((section) => ({
          ...section,
          content: {
            ...section.content,
            layoutVariant: previewLayoutMode,
          },
        }));

  const viewerSections = useMemo<ViewerSectionMeta[]>(() => {
    const mapped = renderedSections.map((section, index, all) => ({
      section,
      index,
      outline: getSectionOutline(section),
      takeaway: getSectionTakeaway(section),
      completion: getSectionCompletion(section),
      isAppendix: isAppendixSection(section, index, all.length),
      glossaryTerms: findGlossaryTerms(section),
    }));
    return showAppendix ? mapped : mapped.filter((entry) => !entry.isAppendix);
  }, [renderedSections, showAppendix]);

  const overallCompletion = useMemo(() => {
    const totals = viewerSections.reduce(
      (acc, entry) => ({
        complete: acc.complete + entry.completion.complete,
        total: acc.total + entry.completion.total,
      }),
      { complete: 0, total: 0 },
    );
    return {
      ...totals,
      ratio: totals.total === 0 ? 0 : totals.complete / totals.total,
    };
  }, [viewerSections]);

  const hiddenAppendixCount = renderedSections.length - viewerSections.length;
  const activeIndex = viewerSections.findIndex((entry) => entry.section.id === activeSectionId);
  const activeEntry = activeIndex >= 0 ? viewerSections[activeIndex] : viewerSections[0] ?? null;
  const theme = resolveTheme(deck?.theme);
  const audienceFrame = deck ? AUDIENCE_VIEWER_COPY[deck.audienceType] : null;
  const coverSection = deck?.sections.find((section) => section.type === "cover");
  const coverContent = (coverSection?.content ?? {}) as CoverContent;

  useEffect(() => {
    if (!deck) return;
    trackViewerEvent({
      deckId: deck.id,
      sessionId,
      type: "session_start",
      label: isPublic ? "public-share" : "private-preview",
      timestamp: new Date().toISOString(),
    });
    setAnalyticsSummary(readViewerAnalyticsSummary(deck.id));
  }, [deck, isPublic, sessionId]);

  useEffect(() => {
    if (viewerSections.length === 0) {
      setActiveSectionId(null);
      return;
    }

    if (!activeSectionId || !viewerSections.some((entry) => entry.section.id === activeSectionId)) {
      setActiveSectionId(viewerSections[0]?.section.id ?? null);
    }
  }, [activeSectionId, viewerSections]);

  useEffect(() => {
    if (!deck || !activeSectionId) return;
    trackViewerEvent({
      deckId: deck.id,
      sessionId,
      type: "slide_view",
      label: activeSectionId,
      timestamp: new Date().toISOString(),
    });
    setAnalyticsSummary(readViewerAnalyticsSummary(deck.id));
  }, [activeSectionId, deck, sessionId]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (viewerSections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries.filter((entry) => entry.isIntersecting).sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (!mostVisible) return;
        const id = mostVisible.target.getAttribute("data-section-id");
        if (id) setActiveSectionId(id);
      },
      { threshold: [0.25, 0.5, 0.75], rootMargin: "-20% 0px -45% 0px" },
    );

    const elements = viewerSections
      .map((entry) => document.getElementById(`preview-section-${entry.section.id}`))
      .filter((element): element is HTMLElement => Boolean(element));

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [viewerSections]);

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      const tagName = document.activeElement?.tagName.toLowerCase();
      if (tagName === "input" || tagName === "textarea" || tagName === "select") return;
      if (viewerSections.length === 0) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        const next = viewerSections[Math.min(Math.max(activeIndex + 1, 0), viewerSections.length - 1)];
        if (next) {
          document.getElementById(`preview-section-${next.section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSectionId(next.section.id);
        }
      }

      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        const previous = viewerSections[Math.max(activeIndex - 1, 0)];
        if (previous) {
          document.getElementById(`preview-section-${previous.section.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveSectionId(previous.section.id);
        }
      }

      if (event.key === "Escape" && presentationMode) {
        setPresentationMode(false);
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [activeIndex, presentationMode, viewerSections]);

  if (loading) return <ViewerLoadingState isPublic={isPublic} />;

  if (error || !deck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12">
        <SurfacePanel padding="lg" className="w-full max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Shared deck</p>
          <h1 className="mt-3 text-2xl font-bold text-slate-900">Deck unavailable</h1>
          <p className="mt-2 text-sm text-slate-500">{error ?? "Deck not found."}</p>
        </SurfacePanel>
      </div>
    );
  }

  const resolvedDeck = deck;

  function handleModeChange(label: string, nextValue: boolean) {
    trackViewerEvent({
      deckId: resolvedDeck.id,
      sessionId,
      type: "mode_change",
      label: `${label}:${nextValue ? "on" : "off"}`,
      timestamp: new Date().toISOString(),
    });
    setAnalyticsSummary(readViewerAnalyticsSummary(resolvedDeck.id));
  }

  async function togglePresentationMode() {
    const next = !presentationMode;
    setPresentationMode(next);
    handleModeChange("presentation", next);

    if (typeof document === "undefined") return;
    try {
      if (next && previewContainerRef.current?.requestFullscreen) {
        await previewContainerRef.current.requestFullscreen();
      } else if (!next && document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch {
      return;
    }
  }

  function scrollToSection(sectionId: string) {
    document.getElementById(`preview-section-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSectionId(sectionId);
  }

  function navigateRelative(offset: -1 | 1) {
    if (viewerSections.length === 0 || activeIndex < 0) return;
    const next = viewerSections[Math.min(Math.max(activeIndex + offset, 0), viewerSections.length - 1)];
    if (next) scrollToSection(next.section.id);
  }

  function handleCtaClick(label: string, action: () => void) {
    trackViewerEvent({
      deckId: resolvedDeck.id,
      sessionId,
      type: "cta_click",
      label,
      timestamp: new Date().toISOString(),
    });
    setAnalyticsSummary(readViewerAnalyticsSummary(resolvedDeck.id));
    action();
  }

  const confidentiality = getConfidentialityLabel(resolvedDeck, isPublic);
  const contactLine = [coverContent.contactName, coverContent.contactTitle, coverContent.company].filter(Boolean).join(" · ");

  return (
    <div ref={previewContainerRef} className={`min-h-screen ${presentationMode ? "bg-slate-900" : ""}`} style={{ backgroundColor: presentationMode ? "#0f172a" : theme.backgroundColor }}>
      <a href="#preview-main" className="sr-only absolute left-4 top-4 z-50 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow focus:not-sr-only">Skip to slide content</a>

      <div className="sticky top-0 z-20 border-b border-white/10 px-4 py-3 shadow-sm sm:px-8" style={{ backgroundColor: theme.headerColor }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">{audienceFrame?.label}</p>
            <h1 className="text-lg font-semibold text-white">{deck.title}</h1>
            <p className="text-xs text-white/70">{audienceFrame?.summary} {deck.goal ? `Primary goal: ${GOAL_LABELS[deck.goal] ?? deck.goal}.` : ""}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
            <select value={previewLayoutMode} onChange={(event) => setPreviewLayoutMode(event.target.value as "saved" | SlideLayoutVariant)} className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white" aria-label="Preview slide layout mode">
              {PREVIEW_LAYOUT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value} className="text-slate-900">{option.label}</option>
              ))}
            </select>
            {!isPublic && <Link to={`/decks/${deck.id}/edit`} className={buttonClassName({ variant: "secondary", size: "md" })}>Edit</Link>}
            {!isPublic && <Link to={`/exports/${deck.id}`} className={buttonClassName({ variant: "primary", size: "md" })}>Export</Link>}
            <Button variant={presentationMode ? "secondary" : "subtle"} onClick={togglePresentationMode}>{presentationMode ? "Exit Presentation" : "Presentation Mode"}</Button>
          </div>
        </div>
      </div>

      <main id="preview-main" className="px-4 py-6 sm:px-8 lg:px-12">
        {!presentationMode && (
          <div className="mx-auto mb-6 grid max-w-6xl grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
            <div className="space-y-4 xl:sticky xl:top-24 xl:self-start">
              <SurfacePanel padding="md">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Viewer framing</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">{deck.projectName}</h2>
                    {deck.subtitle && <p className="mt-1 text-sm text-slate-500">{deck.subtitle}</p>}
                  </div>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{getVersionLabel(deck.updatedAt)}</span>
                </div>
                {deck.summary && <p className="mt-3 text-sm text-slate-600">{deck.summary}</p>}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-600">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Updated</p>
                    <p>{formatDeckDate(deck.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                    <p>{confidentiality}</p>
                  </div>
                </div>
                {contactLine && (
                  <div id="viewer-contact" className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Presenter contact</p>
                    <p className="mt-1">{contactLine}</p>
                  </div>
                )}
              </SurfacePanel>

              <SurfacePanel padding="md">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Viewer Controls</h2>
                  <span className="text-xs text-slate-500">{viewerSections.length} live slides</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant={readingMode ? "primary" : "secondary"} onClick={() => { const next = !readingMode; setReadingMode(next); handleModeChange("reading", next); }}>Reading Mode</Button>
                  <Button size="sm" variant={showAppendix ? "primary" : "secondary"} onClick={() => { const next = !showAppendix; setShowAppendix(next); handleModeChange("appendix", next); }}>Appendix</Button>
                  <Button size="sm" variant={showGlossary ? "primary" : "secondary"} onClick={() => { const next = !showGlossary; setShowGlossary(next); handleModeChange("glossary", next); }}>Glossary</Button>
                  <Button size="sm" variant={dataFocus ? "primary" : "secondary"} onClick={() => { const next = !dataFocus; setDataFocus(next); handleModeChange("data-focus", next); }}>Data Focus</Button>
                  {!isPublic && <Button size="sm" variant={showPresenterNotes ? "primary" : "secondary"} onClick={() => { const next = !showPresenterNotes; setShowPresenterNotes(next); handleModeChange("presenter-notes", next); }} className="col-span-2">Presenter Notes</Button>}
                </div>
                {!showAppendix && hiddenAppendixCount > 0 && <p className="mt-3 text-xs text-slate-500">{hiddenAppendixCount} deep-dive slide{hiddenAppendixCount === 1 ? "" : "s"} hidden.</p>}
              </SurfacePanel>

              <SurfacePanel padding="md">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">Slide Navigator</h2>
                  <span className="text-xs text-slate-500">{activeIndex >= 0 ? `${activeIndex + 1}/${viewerSections.length}` : `0/${viewerSections.length}`}</span>
                </div>
                <div className="mb-3 flex items-center gap-2">
                  <Button size="sm" variant="secondary" onClick={() => navigateRelative(-1)} disabled={activeIndex <= 0}>Previous</Button>
                  <Button size="sm" variant="secondary" onClick={() => navigateRelative(1)} disabled={activeIndex < 0 || activeIndex >= viewerSections.length - 1}>Next</Button>
                </div>
                <label htmlFor="slideJump" className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Jump menu</label>
                <select id="slideJump" value={activeEntry?.section.id ?? ""} onChange={(event) => scrollToSection(event.target.value)} className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900">
                  {viewerSections.map((entry, index) => (
                    <option key={entry.section.id} value={entry.section.id}>{index + 1}. {entry.section.title}</option>
                  ))}
                </select>
                <nav className="mt-4 space-y-2" aria-label="Viewer slide index">
                  {viewerSections.map((entry, index) => (
                    <button
                      key={entry.section.id}
                      type="button"
                      onClick={() => scrollToSection(entry.section.id)}
                      className={`w-full rounded-lg border px-3 py-3 text-left ${activeSectionId === entry.section.id ? "border-indigo-400 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                      aria-current={activeSectionId === entry.section.id ? "true" : undefined}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Slide {index + 1}</p>
                          <p className="text-sm font-semibold text-slate-900">{entry.section.title}</p>
                        </div>
                        {entry.isAppendix && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">Appendix</span>}
                      </div>
                      <p className="mt-2 text-xs text-slate-600">{entry.takeaway}</p>
                    </button>
                  ))}
                </nav>
              </SurfacePanel>

              {!isPublic && (
                <SurfacePanel padding="md">
                  <h2 className="text-sm font-semibold text-slate-900">Viewer Signals</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-600">
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sessions</p><p>{analyticsSummary.sessions}</p></div>
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Slide Views</p><p>{analyticsSummary.slideViews}</p></div>
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">CTA Clicks</p><p>{analyticsSummary.ctaClicks}</p></div>
                    <div><p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mode Changes</p><p>{analyticsSummary.modeChanges}</p></div>
                  </div>
                </SurfacePanel>
              )}
            </div>

            <div className="space-y-4">
              <SurfacePanel padding="md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Audience Actions</h2>
                    <p className="text-sm text-slate-500">Help the viewer move from passive reading into the next conversation.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <a href={createMailtoHref(deck, "Request diligence")} onClick={() => handleCtaClick("request-diligence", () => undefined)} className={buttonClassName({ variant: "primary", size: "md" })}>Request Diligence</a>
                    <a href={createMailtoHref(deck, "Schedule follow-up")} onClick={() => handleCtaClick("schedule-follow-up", () => undefined)} className={buttonClassName({ variant: "secondary", size: "md" })}>Schedule Follow-up</a>
                    <button type="button" onClick={() => handleCtaClick("download-pdf", () => window.print())} className={buttonClassName({ variant: "secondary", size: "md" })}>Download PDF</button>
                    <button type="button" onClick={() => handleCtaClick("contact-sponsor", () => document.getElementById("viewer-contact")?.scrollIntoView({ behavior: "smooth", block: "center" }))} className={buttonClassName({ variant: "ghost", size: "md" })}>Contact Sponsor</button>
                  </div>
                </div>
              </SurfacePanel>

              <SurfacePanel padding="md">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-900">Reading Progress</h2>
                    <p className="text-sm text-slate-500">Use summaries to skim, or step through the full narrative slide by slide.</p>
                  </div>
                  <div className="min-w-56">
                    <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
                      <span>Content readiness</span>
                      <span>{overallCompletion.complete}/{overallCompletion.total}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-indigo-600 transition-all" style={{ width: `${Math.round(overallCompletion.ratio * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </SurfacePanel>
            </div>
          </div>
        )}

        {viewerSections.length === 0 ? (
          <div className="mx-auto max-w-4xl">
            <SurfacePanel padding="lg" className="text-center">
              <h2 className="text-xl font-semibold text-slate-900">No live slides available</h2>
              <p className="mt-2 text-sm text-slate-500">This shared deck does not currently have any enabled audience-facing slides.</p>
              {!isPublic && <Link to={`/decks/${deck.id}/edit`} className={`${buttonClassName({ variant: "primary", size: "md" })} mt-4`}>Open editor</Link>}
            </SurfacePanel>
          </div>
        ) : (
          <div className={`mx-auto ${presentationMode ? "max-w-7xl" : readingMode ? "max-w-4xl" : "max-w-6xl"}`}>
            {viewerSections.map((entry) => (
              <div key={entry.section.id} id={`preview-section-${entry.section.id}`} data-section-id={entry.section.id} className="relative scroll-mt-28" role="region" aria-labelledby={`section-title-${entry.section.id}`}>
                {!presentationMode && (
                  <div className="mx-auto mb-3 max-w-6xl">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="flex-1">
                        <SurfacePanel tone="subtle" padding="sm">
                          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                            <div>
                              <span className="mr-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-indigo-700">Key Takeaway</span>
                              <span className="text-sm text-slate-700">{entry.takeaway}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">Slide {entry.index + 1}</span>
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{entry.completion.complete}/{entry.completion.total} ready</span>
                              {entry.isAppendix && <span className="rounded-full bg-amber-50 px-2.5 py-1 font-medium text-amber-700">Appendix</span>}
                            </div>
                          </div>
                        </SurfacePanel>
                      </div>
                      {!isPublic && <Link to={`/decks/${deck.id}/edit?section=${entry.section.id}`} className={buttonClassName({ variant: "secondary", size: "sm" })}>Edit this slide</Link>}
                    </div>
                    {(showPresenterNotes || dataFocus || (showGlossary && entry.glossaryTerms.length > 0)) && (
                      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
                        {showPresenterNotes && !isPublic && (
                          <SurfacePanel tone="subtle" padding="sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Presenter cue</p>
                            <p className="mt-1 text-sm text-slate-700">Lead with: {entry.takeaway}</p>
                            <ul className="mt-2 space-y-1 text-sm text-slate-600">
                              {entry.outline.slice(0, 2).map((item) => <li key={item}>- {item}</li>)}
                              {entry.completion.missing.slice(0, 1).map((item) => <li key={item}>- Missing detail: {item}</li>)}
                            </ul>
                          </SurfacePanel>
                        )}
                        {showGlossary && entry.glossaryTerms.length > 0 && (
                          <SurfacePanel tone="subtle" padding="sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Glossary hints</p>
                            <ul className="mt-2 space-y-1 text-sm text-slate-600">
                              {entry.glossaryTerms.slice(0, 3).map((item) => <li key={item.term}><strong>{item.term}:</strong> {item.definition}</li>)}
                            </ul>
                          </SurfacePanel>
                        )}
                        {dataFocus && (
                          <SurfacePanel tone="subtle" padding="sm">
                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data cues</p>
                            <ul className="mt-2 space-y-1 text-sm text-slate-600">
                              {entry.outline.slice(0, 3).map((item) => <li key={item}>- {item}</li>)}
                            </ul>
                          </SurfacePanel>
                        )}
                      </div>
                    )}
                  </div>
                )}
                <div className={`viewer-section-enter ${activeSectionId === entry.section.id ? "viewer-slide-active" : ""}`}>
                  <RenderSection section={entry.section} deck={deck} theme={theme} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className={`sticky bottom-0 z-20 border-t border-white/10 px-4 py-3 shadow-lg sm:px-8 ${presentationMode ? "block" : "md:hidden"}`} style={{ backgroundColor: theme.primaryColor }}>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3">
          <Button variant="secondary" size="sm" onClick={() => navigateRelative(-1)} disabled={activeIndex <= 0}>Previous</Button>
          <div className="text-center text-xs text-white/80">
            <p>{activeEntry ? activeEntry.section.title : deck.projectName}</p>
            <p>{activeIndex >= 0 ? `${activeIndex + 1} of ${viewerSections.length}` : `0 of ${viewerSections.length}`}</p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => navigateRelative(1)} disabled={activeIndex < 0 || activeIndex >= viewerSections.length - 1}>Next</Button>
        </div>
      </div>

      <footer className="px-4 py-4 text-center text-xs text-white/60 sm:px-8" style={{ backgroundColor: theme.primaryColor }}>
        <p>© Pine Tar Sports Fund · {confidentiality} · Last updated {formatDeckDate(deck.updatedAt)}</p>
      </footer>
    </div>
  );
}
