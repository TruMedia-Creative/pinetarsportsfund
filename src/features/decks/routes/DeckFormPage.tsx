import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDeckById, createDeck, updateDeck } from "../../../lib/api/mock/decks";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { defaultTemplates, AUDIENCE_LABELS, AUDIENCE_TYPES } from "../../templates/model";
import type { AudienceType } from "../../templates/model";
import type { DeckStatus, DeckTheme, SlideSpacing } from "../model";
import { DECK_THEME_DEFAULTS } from "../model";
import type { DeckSection } from "../model/types";
import { createDeckSectionsFromTemplate } from "../utils/createDeckSectionsFromTemplate";
import { DeckSectionEditor } from "./DeckSectionEditor";

/** Map each audience type to the first matching template's ID, if one exists. */
const AUDIENCE_TEMPLATE_MAP: Partial<Record<AudienceType, string>> = Object.fromEntries(
  (["investor", "lender", "sponsor", "municipality", "internal"] as AudienceType[]).map(
    (audience) => {
      const match = defaultTemplates.find((t) =>
        t.supportedAudienceTypes.includes(audience),
      );
      return [audience, match?.id ?? ""];
    },
  ),
);

/** Only offer audience types that have an assigned template. */
const ALL_AUDIENCE_OPTIONS = AUDIENCE_TYPES.map((value) => ({
  value,
  label: AUDIENCE_LABELS[value],
}));

const AUDIENCE_OPTIONS = ALL_AUDIENCE_OPTIONS.filter((o) =>
  Boolean(AUDIENCE_TEMPLATE_MAP[o.value]),
);

const STATUS_OPTIONS: { value: DeckStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "exported", label: "Exported" },
  { value: "archived", label: "Archived" },
];

const SPACING_OPTIONS: { value: SlideSpacing; label: string }[] = [
  { value: "compact", label: "Compact" },
  { value: "normal", label: "Normal" },
  { value: "relaxed", label: "Relaxed" },
];

/** Default brand colours shown as placeholders. */
const DEFAULT_BG_COLOR = DECK_THEME_DEFAULTS.backgroundColor;
const DEFAULT_PRIMARY_COLOR = DECK_THEME_DEFAULTS.primaryColor;
const DEFAULT_ACCENT_COLOR = DECK_THEME_DEFAULTS.accentColor;

/** Derive a URL-safe slug from a title string. */
function deriveSlug(title: string): string {
  const raw = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return raw || `deck-${Date.now()}`;
}

export default function DeckFormPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(deckId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // `createdDeckId` tracks the id of a deck just created in this session.
  // In edit mode we always use the `deckId` route param directly.
  const [createdDeckId, setCreatedDeckId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [audienceType, setAudienceType] = useState<AudienceType>("investor");
  const [status, setStatus] = useState<DeckStatus>("draft");
  const [subtitle, setSubtitle] = useState("");
  const [summary, setSummary] = useState("");
  const [existingSlug, setExistingSlug] = useState("");
  const [sections, setSections] = useState<DeckSection[]>([]);
  const [theme, setTheme] = useState<DeckTheme>({ ...DECK_THEME_DEFAULTS });

  useEffect(() => {
    if (!deckId) return;
    getDeckById(deckId)
      .then((deck) => {
        if (!deck) {
          setError("Deck not found.");
          setLoading(false);
          return;
        }
        setTitle(deck.title);
        setProjectName(deck.projectName);
        setAudienceType(deck.audienceType);
        setStatus(deck.status);
        setSubtitle(deck.subtitle ?? "");
        setSummary(deck.summary ?? "");
        setExistingSlug(deck.slug);
        if (deck.theme) setTheme(deck.theme);
        // If the deck was saved before section editing existed, seed from template.
        if (deck.sections.length > 0) {
          setSections(deck.sections);
        } else {
          const templateId = AUDIENCE_TEMPLATE_MAP[deck.audienceType];
          const template = defaultTemplates.find((t) => t.id === templateId);
          setSections(template ? createDeckSectionsFromTemplate(template) : []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load deck.");
        setLoading(false);
      });
  }, [deckId]);

  /** Re-seed sections when audience type changes on a NEW deck. */
  useEffect(() => {
    if (isEdit) return;
    const templateId = AUDIENCE_TEMPLATE_MAP[audienceType];
    if (!templateId) return;
    const template = defaultTemplates.find((t) => t.id === templateId);
    if (!template) return;
    setSections(createDeckSectionsFromTemplate(template));
  }, [audienceType, isEdit]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const templateId = AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
    if (!templateId) {
      setError("No template is available for the selected audience type.");
      setSaving(false);
      return;
    }

    // On create: derive slug from title. On edit: preserve the existing slug.
    const slug = isEdit ? existingSlug : deriveSlug(title);

    const payload = {
      title,
      projectName,
      audienceType,
      status,
      slug,
      subtitle: subtitle || undefined,
      summary: summary || undefined,
      templateId,
      sections,
      assetIds: [],
      theme,
    };

    try {
      if (isEdit && deckId) {
        await updateDeck(deckId, payload);
      } else {
        const created = await createDeck(payload);
        setCreatedDeckId(created.id);
        navigate(`/decks/${created.id}/edit`, { replace: true });
        setSaving(false);
        return;
      }
      setSaving(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save deck.");
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  // In edit mode always point at the current route param; in create mode point at the
  // newly-created deck id (only available after the first successful save).
  const resolvedDeckId = deckId ?? createdDeckId;
  const previewUrl = resolvedDeckId ? `/decks/${resolvedDeckId}/preview` : null;
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, "");
  const shareUrl = existingSlug
    ? `${window.location.origin}${baseUrl}/view/${existingSlug}`
    : null;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? "Edit Deck" : "New Deck"}
        </h1>
        {previewUrl && (
          <Link
            to={previewUrl}
            className="inline-flex items-center rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          >
            Preview →
          </Link>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {shareUrl && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <strong>Shareable link:</strong>{" "}
          <a href={shareUrl} target="_blank" rel="noreferrer" className="underline break-all">
            {shareUrl}
          </a>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Deck Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Pine Tar Sports Complex – Investor Pitch"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            id="projectName"
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="e.g. Pine Tar Sports Complex"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="audienceType" className="text-sm font-medium text-gray-700">
              Audience Type
            </label>
            <select
              id="audienceType"
              value={audienceType}
              onChange={(e) => setAudienceType(e.target.value as AudienceType)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AUDIENCE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as DeckStatus)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="subtitle" className="text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            id="subtitle"
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Optional subtitle"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="summary" className="text-sm font-medium text-gray-700">
            Summary
          </label>
          <textarea
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={3}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Brief description of this deck"
          />
        </div>

        {/* ── Appearance ─────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-5">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">Appearance</h3>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="themeBackgroundColor" className="text-sm font-medium text-gray-700">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="themeBackgroundColor"
                  type="color"
                  value={theme.backgroundColor ?? DEFAULT_BG_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, backgroundColor: e.target.value }))}
                  className="h-9 w-14 cursor-pointer rounded border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={theme.backgroundColor ?? DEFAULT_BG_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, backgroundColor: e.target.value }))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#4a6b7c"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="themeSlideSpacing" className="text-sm font-medium text-gray-700">
                Slide Spacing
              </label>
              <select
                id="themeSlideSpacing"
                value={theme.slideSpacing ?? "normal"}
                onChange={(e) =>
                  setTheme((t) => ({ ...t, slideSpacing: e.target.value as SlideSpacing }))
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SPACING_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="themePrimaryColor" className="text-sm font-medium text-gray-700">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="themePrimaryColor"
                  type="color"
                  value={theme.primaryColor ?? DEFAULT_PRIMARY_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                  className="h-9 w-14 cursor-pointer rounded border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={theme.primaryColor ?? DEFAULT_PRIMARY_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, primaryColor: e.target.value }))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#0d2b6b"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="themeAccentColor" className="text-sm font-medium text-gray-700">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="themeAccentColor"
                  type="color"
                  value={theme.accentColor ?? DEFAULT_ACCENT_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                  className="h-9 w-14 cursor-pointer rounded border border-gray-300 p-0.5"
                />
                <input
                  type="text"
                  value={theme.accentColor ?? DEFAULT_ACCENT_COLOR}
                  onChange={(e) => setTheme((t) => ({ ...t, accentColor: e.target.value }))}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="#c0262d"
                />
              </div>
            </div>
          </div>

          {/* Live colour preview strip */}
          <div
            className="mt-3 flex h-8 overflow-hidden rounded-md border border-gray-200"
            role="img"
            aria-label="Colour preview: background, primary, and accent"
          >
            <div
              className="flex-1"
              style={{ backgroundColor: theme.backgroundColor ?? DEFAULT_BG_COLOR }}
              title="Background"
              aria-label="Background colour preview"
            />
            <div
              className="w-16"
              style={{ backgroundColor: theme.primaryColor ?? DEFAULT_PRIMARY_COLOR }}
              title="Primary"
              aria-label="Primary colour preview"
            />
            <div
              className="w-16"
              style={{ backgroundColor: theme.accentColor ?? DEFAULT_ACCENT_COLOR }}
              title="Accent"
              aria-label="Accent colour preview"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Preview strip: background · primary · accent
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Deck"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/decks")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Section editor — shown once the deck exists (edit mode or after creation) */}
      {sections.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Deck Sections</h2>
            <p className="text-xs text-gray-500">Toggle, reorder, and edit each section.</p>
          </div>
          <DeckSectionEditor sections={sections} onChange={setSections} />
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              disabled={saving}
              onClick={async () => {
                setSaving(true);
                setError(null);
                const templateId = AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
                const slug = existingSlug || deriveSlug(title);
                const payload = {
                  title, projectName, audienceType, status, slug,
                  subtitle: subtitle || undefined,
                  summary: summary || undefined,
                  templateId, sections, assetIds: [], theme,
                };
                try {
                  if (resolvedDeckId) {
                    await updateDeck(resolvedDeckId, payload);
                  }
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Failed to save sections.");
                } finally {
                  setSaving(false);
                }
              }}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Sections"}
            </button>
            {previewUrl && (
              <Link
                to={previewUrl}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Preview
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
