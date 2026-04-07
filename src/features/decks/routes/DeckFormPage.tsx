import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDeckById, createDeck, updateDeck } from "../../../lib/api/mock/decks";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import { defaultTemplates, AUDIENCE_LABELS } from "../../templates/model";
import type { AudienceType } from "../../templates/model";
import type { DeckStatus } from "../model";

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
const ALL_AUDIENCE_OPTIONS = (
  Object.keys(AUDIENCE_LABELS) as AudienceType[]
).map((value) => ({ value, label: AUDIENCE_LABELS[value] }));

const AUDIENCE_OPTIONS = ALL_AUDIENCE_OPTIONS.filter((o) =>
  Boolean(AUDIENCE_TEMPLATE_MAP[o.value]),
);

const STATUS_OPTIONS: { value: DeckStatus; label: string }[] = [
  { value: "draft", label: "Draft" },
  { value: "ready", label: "Ready" },
  { value: "exported", label: "Exported" },
  { value: "archived", label: "Archived" },
];

export default function DeckFormPage() {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(deckId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [projectName, setProjectName] = useState("");
  const [audienceType, setAudienceType] = useState<AudienceType>("investor");
  const [status, setStatus] = useState<DeckStatus>("draft");
  const [subtitle, setSubtitle] = useState("");
  const [summary, setSummary] = useState("");
  const [existingSlug, setExistingSlug] = useState("");

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
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load deck.");
        setLoading(false);
      });
  }, [deckId]);

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
    const slug = isEdit
      ? existingSlug
      : (() => {
          const raw = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
          return raw || `deck-${Date.now()}`;
        })();

    const payload = {
      title,
      projectName,
      audienceType,
      status,
      slug,
      subtitle: subtitle || undefined,
      summary: summary || undefined,
      templateId,
      sections: [],
      assetIds: [],
    };

    try {
      if (isEdit && deckId) {
        await updateDeck(deckId, payload);
      } else {
        await createDeck(payload);
      }
      navigate("/decks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save deck.");
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {isEdit ? "Edit Deck" : "New Deck"}
      </h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
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
    </div>
  );
}
