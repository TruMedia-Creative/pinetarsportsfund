import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDeckById } from "../../../lib/api/supabase/decks";
import { exportDeckAsPptx } from "../utils/buildDeck";
import { Button, LoadingSpinner, SurfacePanel, buttonClassName } from "../../../components/ui";
import type { Deck } from "../../decks/model";

const STATUS_LABELS: Record<Deck["status"], string> = {
  draft:    "Draft",
  ready:    "Ready",
  exported: "Exported",
  archived: "Archived",
};

const AUDIENCE_LABELS: Record<Deck["audienceType"], string> = {
  investor:     "Investor Pitch",
  lender:       "Lender Package",
  sponsor:      "Sponsorship",
  municipality: "Municipality",
  internal:     "Internal",
};

export default function ExportPage() {
  const { deckId } = useParams<{ deckId: string }>();

  const [deck, setDeck]         = useState<Deck | null>(null);
  const [loading, setLoading]   = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError]       = useState<string | null>(null);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!deckId) return;

    getDeckById(deckId)
      .then((d) => {
        if (cancelled) return;
        setDeck(d ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to load deck.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [deckId]);

  async function handleExportPptx() {
    if (!deck) return;
    setExporting(true);
    setError(null);
    try {
      await exportDeckAsPptx(deck);
      setExported(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  if (loading) return <LoadingSpinner />;

  if (!deck) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <p className="text-gray-500">{error ?? "Deck not found."}</p>
      </div>
    );
  }

  const enabledCount = deck.sections.filter((s) => s.isEnabled).length;
  const exportStatusMessage = exporting
    ? "Generating your PowerPoint file. Your download should start automatically."
    : exported
      ? `Download started for ${deck.slug}.pptx.`
      : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">

      <a
        href="#export-main"
        className="sr-only absolute left-4 top-4 z-50 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow focus:not-sr-only"
      >
        Skip to export options
      </a>

      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Export</h1>
          <p className="text-sm text-gray-500">Choose an output path, confirm slide readiness, and return to edit if anything still needs work.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to={`/decks/${deck.id}/preview`}
            className={buttonClassName({ variant: "ghost", size: "md" })}
          >
            ← Preview
          </Link>
          <Link
            to={`/decks/${deck.id}/edit`}
            className={buttonClassName({ variant: "secondary", size: "md" })}
          >
            Edit Deck
          </Link>
        </div>
      </div>

      <div id="export-main" className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SurfacePanel padding="md">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deck Status</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{STATUS_LABELS[deck.status]}</p>
        </SurfacePanel>
        <SurfacePanel padding="md">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Enabled Slides</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{enabledCount} of {deck.sections.length}</p>
        </SurfacePanel>
        <SurfacePanel padding="md">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Audience</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{AUDIENCE_LABELS[deck.audienceType]}</p>
        </SurfacePanel>
      </div>

      {/* Deck summary */}
      <SurfacePanel padding="lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{deck.title}</h2>
            <p className="mt-0.5 text-sm text-gray-500">{deck.projectName}</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-medium text-indigo-700">
            {AUDIENCE_LABELS[deck.audienceType]}
          </span>
        </div>
        <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
          <span>
            Status:{" "}
            <span className="font-medium text-gray-700">{STATUS_LABELS[deck.status]}</span>
          </span>
          <span>
            Sections:{" "}
            <span className="font-medium text-gray-700">
              {enabledCount} enabled / {deck.sections.length} total
            </span>
          </span>
        </div>
      </SurfacePanel>

      {/* Error */}
      {error && (
        <SurfacePanel tone="danger" padding="sm" className="text-sm text-red-700">
          {error}
        </SurfacePanel>
      )}

      {/* Success */}
      {exported && !error && (
        <SurfacePanel tone="success" padding="sm" className="text-sm text-green-700">
          Download started — check your downloads folder for{" "}
          <span className="font-mono font-medium">{deck.slug}.pptx</span>.
        </SurfacePanel>
      )}

      {exportStatusMessage && (
        <p className="sr-only" aria-live="polite">{exportStatusMessage}</p>
      )}

      <SurfacePanel tone="subtle" padding="md">
        <h2 className="text-sm font-semibold text-slate-900">Export Checklist</h2>
        <ul className="mt-2 space-y-2 text-sm text-slate-600">
          <li>{enabledCount > 0 ? "Ready" : "Needs attention"}: confirm the right sections are enabled before download.</li>
          <li>Use preview if you need to review layout variants or slide ordering one more time.</li>
          <li>Use browser print from preview if you need a PDF handoff today.</li>
        </ul>
      </SurfacePanel>

      {/* Export options */}
      <div className="space-y-3">
        {/* PPTX */}
        <SurfacePanel padding="lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-gray-900">PowerPoint (.pptx)</p>
              <p className="mt-0.5 text-sm text-gray-500">
                {enabledCount} slide{enabledCount !== 1 ? "s" : ""} · brand colors applied · ready for distribution
              </p>
            </div>
            <Button
              onClick={handleExportPptx}
              disabled={exporting}
              className="min-w-[160px]"
            >
              {exporting ? "Generating…" : exported ? "Download Again" : "Download PPTX"}
            </Button>
          </div>
        </SurfacePanel>

        {/* PDF via print */}
        <SurfacePanel padding="lg">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-semibold text-gray-900">PDF (via browser print)</p>
              <p className="mt-0.5 text-sm text-gray-500">
                Open the preview, then use File → Print → Save as PDF
              </p>
            </div>
            <Link
              to={`/decks/${deck.id}/preview`}
              className={buttonClassName({ variant: "secondary", size: "md" })}
            >
              Open Preview
            </Link>
          </div>
        </SurfacePanel>
      </div>

      {enabledCount === 0 && (
        <SurfacePanel tone="warning" padding="sm" className="text-sm text-yellow-800">
          No sections are enabled. The PPTX will contain a placeholder slide only.{" "}
          <Link to={`/decks/${deck.id}/edit`} className="font-medium underline">
            Edit the deck
          </Link>{" "}
          to enable sections.
        </SurfacePanel>
      )}
    </div>
  );
}
