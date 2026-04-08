import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getDeckById } from "../../../lib/api/mock/decks";
import { exportDeckAsPptx } from "../utils/buildDeck";
import { LoadingSpinner } from "../../../components/ui";
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Export</h1>
        <div className="flex items-center gap-3">
          <Link
            to={`/decks/${deck.id}/preview`}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            ← Preview
          </Link>
          <Link
            to={`/decks/${deck.id}/edit`}
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            Edit Deck
          </Link>
        </div>
      </div>

      {/* Deck summary */}
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
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
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {exported && !error && (
        <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          Download started — check your downloads folder for{" "}
          <span className="font-mono font-medium">{deck.slug}.pptx</span>.
        </div>
      )}

      {/* Export options */}
      <div className="space-y-3">
        {/* PPTX */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">PowerPoint (.pptx)</p>
              <p className="mt-0.5 text-sm text-gray-500">
                {enabledCount} slide{enabledCount !== 1 ? "s" : ""} · brand colors applied · ready for distributon
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportPptx}
              disabled={exporting}
              className="inline-flex min-w-[130px] items-center justify-center rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 disabled:opacity-60"
            >
              {exporting ? "Generating…" : exported ? "Download Again" : "Download PPTX"}
            </button>
          </div>
        </div>

        {/* PDF via print */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">PDF (via browser print)</p>
              <p className="mt-0.5 text-sm text-gray-500">
                Open the preview, then use File → Print → Save as PDF
              </p>
            </div>
            <Link
              to={`/decks/${deck.id}/preview`}
              className="inline-flex min-w-[130px] items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Open Preview
            </Link>
          </div>
        </div>
      </div>

      {enabledCount === 0 && (
        <p className="rounded-md border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">
          No sections are enabled. The PPTX will contain a placeholder slide only.{" "}
          <Link to={`/decks/${deck.id}/edit`} className="font-medium underline">
            Edit the deck
          </Link>{" "}
          to enable sections.
        </p>
      )}
    </div>
  );
}
