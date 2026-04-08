import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDeckById, getDecks } from "../../../lib/api/mock/decks";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import type { Deck, DeckSection, DeckTheme } from "../model/types";
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

/* ─────────────────────── Brand colours (defaults) ──────────────────────── */
const NAVY = "#0d2b6b";
const RED = "#c0262d";
const TEAL_HEADER = "#3d6b7c";

/* ─────────────────────── Theme helpers ─────────────────────────────────── */

interface ResolvedTheme {
  backgroundColor: string;
  primaryColor: string;
  accentColor: string;
  headerColor: string;
  slideSpacingPx: number;
}

function resolveTheme(theme: DeckTheme | undefined): ResolvedTheme {
  return {
    backgroundColor: theme?.backgroundColor ?? "#4a6b7c",
    primaryColor: theme?.primaryColor ?? NAVY,
    accentColor: theme?.accentColor ?? RED,
    headerColor: TEAL_HEADER,
    slideSpacingPx:
      theme?.slideSpacing === "compact"
        ? 12
        : theme?.slideSpacing === "relaxed"
          ? 48
          : 32,
  };
}

/* ─────────────────────── Utility components ────────────────────────────── */

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

function SectionTitle({ title, primaryColor, accentColor }: { title: string; primaryColor: string; accentColor: string }) {
  return (
    <div>
      <h2
        className="mb-2 text-2xl font-black uppercase tracking-tight"
        style={{ color: primaryColor }}
      >
        {title}
      </h2>
      <div className="mb-6 h-1 w-full" style={{ backgroundColor: accentColor }} />
    </div>
  );
}

function PhotoGallery({ images }: { images: ImageGalleryItem[] }) {
  if (!images.length) return null;
  return (
    <div
      className={`grid gap-3 ${
        images.length === 1
          ? "grid-cols-1"
          : images.length === 2
            ? "grid-cols-2"
            : "grid-cols-3"
      }`}
    >
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img.url}
          alt={img.alt ?? ""}
          className="h-44 w-full rounded-lg object-cover"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────── Section renderers ─────────────────────────────── */

function CoverSection({ section, deck, theme }: { section: DeckSection; deck: Deck; theme: ResolvedTheme }) {
  const c = section.content as CoverContent;
  return (
    <div
      className="mx-auto max-w-5xl overflow-hidden rounded-xl shadow-lg"
      style={{ minHeight: 360, marginBottom: theme.slideSpacingPx }}
    >
      <div className="flex" style={{ minHeight: 360 }}>
        {/* Left panel */}
        <div
          className="flex flex-1 flex-col justify-between p-10"
          style={{ backgroundColor: "#fff", maxWidth: "45%" }}
        >
          <div>
            <h1
              className="mb-2 text-4xl font-black uppercase leading-tight"
              style={{ color: theme.primaryColor }}
            >
              {deck.projectName}
            </h1>
            {c.tagline && (
              <p className="mb-4 text-xl font-bold" style={{ color: theme.accentColor }}>
                {c.tagline}
              </p>
            )}
            {c.body && (
              <div className="mb-6 border-l-4 pl-4" style={{ borderColor: theme.headerColor }}>
                <p className="text-sm leading-relaxed text-gray-600">{c.body}</p>
              </div>
            )}
          </div>
          <div>
            {c.contactName && (
              <p className="font-bold" style={{ color: theme.primaryColor }}>
                {c.contactName}
              </p>
            )}
            {c.company && (
              <p className="font-semibold" style={{ color: theme.accentColor }}>
                {c.company}
              </p>
            )}
            {c.address && (
              <p className="text-sm text-gray-500">📍 {c.address}</p>
            )}
          </div>
        </div>

        {/* Right panel – hero image */}
        <div className="flex-1" style={{ minHeight: 360 }}>
          {c.heroImageUrl ? (
            <img
              src={c.heroImageUrl}
              alt={deck.projectName}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-gray-400"
              style={{ backgroundColor: "#e8eef5" }}
            >
              <span className="text-sm">Hero image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExecutiveSummarySection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as ExecutiveSummaryContent;
  const toc = c.tableOfContents ?? [];
  const returnRows = c.returnsTableRows ?? [];

  return (
    <SectionWrapper className="p-10" marginBottom={theme.slideSpacingPx}>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Left */}
        <div>
          <SectionTitle title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
          {c.body && <p className="mb-6 text-sm leading-relaxed text-gray-600">{c.body}</p>}
          {toc.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                Table of Contents
              </p>
              <ol className="space-y-1">
                {toc.map((item) => (
                  <li key={item.number} className="flex items-start gap-3 border-b border-gray-100 py-1">
                    <span className="w-6 shrink-0 text-xs font-semibold text-gray-400">
                      {String(item.number).padStart(2, "0")}
                    </span>
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-6">
          {(c.images ?? []).length > 0 && (
            <PhotoGallery images={c.images ?? []} />
          )}
          {returnRows.length > 0 && (
            <div
              className="rounded-lg border p-5"
              style={{ borderColor: theme.primaryColor }}
            >
              {c.returnsTableTitle && (
                <h3 className="mb-4 text-sm font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                  {c.returnsTableTitle}
                </h3>
              )}
              <table className="w-full">
                <tbody>
                  {returnRows.map((row, idx) => (
                    <tr key={idx} className={row.highlight ? "font-semibold" : ""} style={row.highlight ? { backgroundColor: "#fef2f2" } : {}}>
                      <td className="py-1.5 text-sm text-gray-700">{row.label}</td>
                      <td className="py-1.5 text-right text-sm font-bold" style={{ color: row.highlight ? theme.accentColor : theme.primaryColor }}>
                        {row.value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}

function UseOfFundsSection({ section, theme }: { section: DeckSection; theme: ResolvedTheme }) {
  const c = section.content as UseOfFundsContent;
  const rows = c.allocationRows ?? [];
  const highlights = c.highlights ?? [];

  return (
    <SectionWrapper className="p-10" marginBottom={theme.slideSpacingPx}>
      <SectionTitle title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Allocation table */}
        <div>
          {c.body && <p className="mb-4 text-sm text-gray-600">{c.body}</p>}
          {rows.length > 0 && (
            <table className="w-full">
              <thead>
                <tr className="border-b-2" style={{ borderColor: theme.primaryColor }}>
                  <th className="pb-2 text-left text-xs font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    Allocation Category
                  </th>
                  <th className="pb-2 text-right text-xs font-black uppercase tracking-wide" style={{ color: theme.accentColor }}>
                    Amount (USD)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    <td className="py-2 text-sm text-gray-700">{row.category}</td>
                    <td className="py-2 text-right text-sm font-semibold" style={{ color: theme.accentColor }}>
                      {row.amount}
                    </td>
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

        {/* Highlights */}
        {highlights.length > 0 && (
          <div className="space-y-6">
            {highlights.map((h, idx) => (
              <div key={idx}>
                <div className="mb-2 border-b-2 pb-1" style={{ borderColor: theme.headerColor }}>
                  <h3 className="text-sm font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                    {h.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-gray-600">{h.body}</p>
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
  const timeline = c.timelineItems ?? [];
  const metrics = c.keyMetrics ?? [];

  return (
    <SectionWrapper className="p-10" marginBottom={theme.slideSpacingPx}>
      <SectionTitle title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && <p className="mb-6 text-sm text-gray-600">{c.body}</p>}

      {/* Timeline grid */}
      {timeline.length > 0 && (
        <div
          className={`mb-8 grid gap-6 ${
            timeline.length === 1
              ? "grid-cols-1"
              : timeline.length <= 2
                ? "grid-cols-2"
                : "grid-cols-4"
          }`}
        >
          {timeline.map((item, idx) => (
            <div key={idx}>
              <p className="mb-1 text-lg font-black" style={{ color: theme.accentColor }}>
                {item.period}
              </p>
              <p className="mb-3 text-xs font-black uppercase tracking-wide" style={{ color: theme.primaryColor }}>
                {item.phase}
              </p>
              <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Key metrics row */}
      {(metrics.length > 0 || c.exitStrategyTitle) && (
        <div
          className="grid gap-6 rounded-lg p-6"
          style={{
            backgroundColor: "#f8fafc",
            gridTemplateColumns: metrics.length > 0 ? `repeat(${Math.min(metrics.length, 2)}, 1fr) 2fr` : "1fr",
          }}
        >
          {metrics.map((m, idx) => (
            <div key={idx} className="text-center">
              <p className="text-4xl font-black" style={{ color: theme.primaryColor }}>
                {m.value}
              </p>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500">
                {m.label}
              </p>
            </div>
          ))}
          {c.exitStrategyTitle && (
            <div className="border-l-4 pl-4" style={{ borderColor: theme.headerColor }}>
              <p className="mb-2 font-bold" style={{ color: theme.accentColor }}>
                {c.exitStrategyTitle}
              </p>
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
    <SectionWrapper className="p-10" marginBottom={theme.slideSpacingPx}>
      <SectionTitle title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && <p className="mb-6 text-sm leading-relaxed text-gray-600">{c.body}</p>}
      {members.length > 0 && (
        <div className={`grid gap-6 ${members.length === 1 ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3"}`}>
          {members.map((member, idx) => (
            <div key={idx} className="flex items-start gap-4">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-white font-bold text-xl"
                  style={{ backgroundColor: theme.primaryColor }}
                >
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
  const rows = c.rows ?? [];
  const metrics = c.metrics ?? [];

  return (
    <SectionWrapper className="p-10" marginBottom={theme.slideSpacingPx}>
      <SectionTitle title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && <p className="mb-6 text-sm text-gray-600">{c.body}</p>}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
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
        {metrics.length > 0 && (
          <div className={`grid gap-4 ${metrics.length > 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {metrics.map((m, idx) => (
              <div key={idx} className="rounded-lg p-4 text-center" style={{ backgroundColor: "#f0f4ff" }}>
                <p className="text-3xl font-black" style={{ color: theme.primaryColor }}>{m.value}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">{m.label}</p>
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
  const bullets = c.bullets ?? [];
  const images = c.images ?? [];

  return (
    <SectionWrapper className="p-10" marginBottom={theme.slideSpacingPx}>
      <SectionTitle title={section.title} primaryColor={theme.primaryColor} accentColor={theme.accentColor} />
      {c.body && (
        <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-gray-600">{c.body}</p>
      )}
      {bullets.length > 0 && (
        <ul className="mb-6 space-y-2">
          {bullets.map((b, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span style={{ color: theme.accentColor }}>•</span>
              <span className="text-sm text-gray-700">{b}</span>
            </li>
          ))}
        </ul>
      )}
      {images.length > 0 && <PhotoGallery images={images} />}
    </SectionWrapper>
  );
}

/* ─────────────────────── Section dispatcher ────────────────────────────── */

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

/* ─────────────────────── Page ──────────────────────────────────────────── */

interface DeckPreviewPageProps {
  /** When true, renders without auth-shell (public/shareable view). */
  isPublic?: boolean;
}

export function DeckPreviewPage({ isPublic = false }: DeckPreviewPageProps) {
  const { deckId, slug } = useParams();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        let found: Deck | undefined;
        if (deckId) {
          found = await getDeckById(deckId);
        } else if (slug) {
          // public view: find by slug
          const all = await getDecks();
          found = all.find((d) => d.slug === slug);
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

  if (loading) return <LoadingSpinner />;

  if (error || !deck) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">{error ?? "Deck not found."}</p>
      </div>
    );
  }

  const enabledSections = [...deck.sections]
    .filter((s) => s.isEnabled)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const theme = resolveTheme(deck.theme);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-8 py-3"
        style={{ backgroundColor: theme.headerColor }}
      >
        <span className="text-sm font-semibold text-white opacity-80">
          Pine Tar Sports Fund
        </span>
        {!isPublic && (
          <Link
            to={`/decks/${deck.id}/edit`}
            className="rounded bg-white/20 px-3 py-1 text-xs font-medium text-white hover:bg-white/30"
          >
            ← Edit Deck
          </Link>
        )}
      </div>

      {/* Sections */}
      <div className="px-4 py-8 sm:px-8 lg:px-16">
        {enabledSections.length === 0 ? (
          <div className="mx-auto max-w-5xl rounded-xl bg-white p-10 text-center shadow-md">
            <p className="text-gray-400">
              This deck has no enabled sections yet.
              {!isPublic && (
                <>
                  {" "}
                  <Link to={`/decks/${deck.id}/edit`} className="text-indigo-600 hover:underline">
                    Edit the deck
                  </Link>{" "}
                  to add content.
                </>
              )}
            </p>
          </div>
        ) : (
          enabledSections.map((section) => (
            <RenderSection key={section.id} section={section} deck={deck} theme={theme} />
          ))
        )}
      </div>

      {/* Footer */}
      <div
        className="py-4 px-8 text-center text-xs text-white/60"
        style={{ backgroundColor: theme.primaryColor }}
      >
        © Pine Tar Sports Fund — This presentation is for informational purposes only.
      </div>
    </div>
  );
}
