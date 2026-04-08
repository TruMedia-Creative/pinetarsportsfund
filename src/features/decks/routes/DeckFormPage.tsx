import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDeckById, createDeck, updateDeck } from "../../../lib/api/mock/decks";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { defaultTemplates, AUDIENCE_LABELS, AUDIENCE_TYPES } from "../../templates/model";
import type { AudienceType } from "../../templates/model";
import type { DeckStatus } from "../model";
import type { DeckSection } from "../model/types";
import { createDeckSectionsFromTemplate } from "../utils/createDeckSectionsFromTemplate";
import { DeckSectionEditor } from "./DeckSectionEditor";

type SaveStatus = "idle" | "pending" | "saving" | "saved" | "error";

const SAVE_STATUS_LABEL: Record<SaveStatus, string> = {
  idle: "",
  pending: "Saving…",
  saving: "Saving…",
  saved: "✓ Saved",
  error: "Save failed",
};

const SAVE_STATUS_CLASS: Record<SaveStatus, string> = {
  idle: "text-gray-400",
  pending: "text-gray-400",
  saving: "text-gray-500",
  saved: "text-green-600",
  error: "text-red-600",
};

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

/** Derive a URL-safe slug from a title string. */
function deriveSlug(title: string): string {
  const raw = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return raw || `deck-${Date.now()}`;
}

const AUTOSAVE_DELAY_MS = 1500;

export default function DeckFormPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(deckId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
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

  // Track whether the deck fields have been loaded so the auto-save
  // effect doesn't fire on the initial population from the server.
  const initializedRef = useRef(false);
  const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        // If the deck was saved before section editing existed, seed from template.
        if (deck.sections.length > 0) {
          setSections(deck.sections);
        } else {
          const templateId = AUDIENCE_TEMPLATE_MAP[deck.audienceType];
          const template = defaultTemplates.find((t) => t.id === templateId);
          setSections(template ? createDeckSectionsFromTemplate(template) : []);
        }
        setLoading(false);
        initializedRef.current = true;
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

  /** Shared save helper used by both auto-save and manual submit. */
  const performSave = useCallback(async (id: string, templateId: string, slug: string) => {
    setError(null);
    setSaving(true);
    setSaveStatus("saving");
    try {
      await updateDeck(id, {
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
      });
      setSaveStatus("saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save deck.";
      setError(message);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  }, [title, projectName, audienceType, status, subtitle, summary, sections]);

  /** Debounced auto-save — fires whenever any form field or sections change
   *  while we have a real deck id (i.e. in edit mode). */
  useEffect(() => {
    const currentDeckId = deckId;
    if (!currentDeckId) return;
    if (!initializedRef.current) return;

    const templateId = AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
    // AUDIENCE_OPTIONS already filters out audience types without a template,
    // so this guard is a safety net only.
    if (!templateId) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    // Show immediately that a save is queued during the debounce window.
    setSaveStatus("pending");

    const slug = existingSlug || deriveSlug(title);
    autosaveTimerRef.current = setTimeout(() => {
      void performSave(currentDeckId, templateId, slug);
    }, AUTOSAVE_DELAY_MS);

    return () => {
      if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    };
  }, [title, projectName, audienceType, status, subtitle, summary, existingSlug, sections, deckId, performSave]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
    setError(null);

    const templateId = AUDIENCE_TEMPLATE_MAP[audienceType] ?? "";
    if (!templateId) {
      setError("No template is available for the selected audience type.");
      setSaveStatus("error");
      return;
    }

    // On create: derive slug from title. On edit: preserve the existing slug.
    const slug = isEdit ? existingSlug : deriveSlug(title);

    if (isEdit && deckId) {
      await performSave(deckId, templateId, slug);
    } else {
      setSaving(true);
      setSaveStatus("saving");
      try {
        const created = await createDeck({
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
        });
        setCreatedDeckId(created.id);
        // Reset the guard so the new route's load effect re-initializes before
        // the auto-save effect can fire on the new deckId.
        initializedRef.current = false;
        navigate(`/decks/${created.id}/edit`, { replace: true });
        setSaveStatus("saved");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create deck.");
        setSaveStatus("error");
      } finally {
        setSaving(false);
      }
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
        <div className="flex items-center gap-3">
          {isEdit && (
            <span className={`text-xs font-medium ${SAVE_STATUS_CLASS[saveStatus]}`}>
              {SAVE_STATUS_LABEL[saveStatus]}
            </span>
          )}
          {previewUrl && (
            <Link
              to={previewUrl}
              className="inline-flex items-center rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Preview →
            </Link>
          )}
        </div>
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
            <p className="text-xs text-gray-500">
              {resolvedDeckId
                ? "Changes save automatically."
                : "Toggle, reorder, and edit each section."}
            </p>
          </div>
          <DeckSectionEditor sections={sections} onChange={setSections} />
          {previewUrl && (
            <div className="flex gap-3 pt-2">
              <Link
                to={previewUrl}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View Preview
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
