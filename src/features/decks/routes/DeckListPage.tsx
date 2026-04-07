import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDecks, deleteDeck } from "../../../lib/api/mock/decks";
import { LoadingSpinner } from "../../../components/ui/LoadingSpinner";
import type { Deck } from "../model";

const STATUS_STYLES: Record<Deck["status"], string> = {
  draft: "bg-yellow-100 text-yellow-800",
  ready: "bg-blue-100 text-blue-800",
  exported: "bg-green-100 text-green-800",
  archived: "bg-gray-100 text-gray-600",
};

const AUDIENCE_LABELS: Record<Deck["audienceType"], string> = {
  investor: "Investor",
  lender: "Lender",
  sponsor: "Sponsor",
  municipality: "Municipality",
  internal: "Internal",
};

export function DeckListPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDecks()
      .then((data) => {
        if (cancelled) return;
        setDecks(data);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) {
          setActionError("Failed to load decks. Please refresh and try again.");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this deck? This cannot be undone.")) return;
    try {
      setActionError(null);
      await deleteDeck(id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete deck");
    }
  }

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Decks</h1>
        <Link
          to="/decks/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          + New Deck
        </Link>
      </div>

      {actionError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {decks.length === 0 ? (
        <p className="text-gray-500">
          No decks yet.{" "}
          <Link to="/decks/new" className="text-indigo-600 hover:underline">
            Create your first deck
          </Link>
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Title</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Project</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Audience</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Updated</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {decks.map((deck) => (
                <tr key={deck.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    <Link
                      to={`/decks/${deck.id}/edit`}
                      className="hover:text-indigo-600"
                    >
                      {deck.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{deck.projectName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {AUDIENCE_LABELS[deck.audienceType]}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${STATUS_STYLES[deck.status]}`}
                    >
                      {deck.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
                      new Date(deck.updatedAt),
                    )}
                  </td>
                  <td className="space-x-2 px-4 py-3">
                    <Link
                      to={`/decks/${deck.id}/edit`}
                      className="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      Edit
                    </Link>
                    <Link
                      to={`/decks/${deck.id}/preview`}
                      className="rounded bg-teal-600 px-2 py-1 text-xs font-medium text-white hover:bg-teal-700"
                    >
                      Preview
                    </Link>
                    <button
                      onClick={() => handleDelete(deck.id)}
                      className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
