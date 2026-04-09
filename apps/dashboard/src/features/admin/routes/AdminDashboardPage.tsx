import { useEffect, useState } from "react";
import {
  getDecks,
  updateDeck,
  deleteDeck,
} from "../../../lib/api/mock";
import { Button, LoadingSpinner, SurfacePanel } from "../../../components/ui";
import type { Deck } from "../../decks/model";

const statusBadge: Record<Deck["status"], string> = {
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

export function AdminDashboardPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getDecks()
      .then((loadedDecks) => {
        if (cancelled) return;
        setDecks(loadedDecks);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  const [actionError, setActionError] = useState<string | null>(null);

  const handleMarkReady = async (id: string) => {
    try {
      setActionError(null);
      await updateDeck(id, { status: "ready" });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update deck");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      setActionError(null);
      await updateDeck(id, { status: "archived" });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to archive deck");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this deck?")) return;
    try {
      setActionError(null);
      await deleteDeck(id);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to delete deck");
    }
  };

  if (loading) return <LoadingSpinner />;

  const readyCount = decks.filter((d) => d.status === "ready").length;
  const exportedCount = decks.filter((d) => d.status === "exported").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Review deck inventory, promote drafts, archive completed work, and remove obsolete records.</p>
      </div>

      {actionError && (
        <SurfacePanel tone="danger" padding="sm" className="text-sm text-red-700">
          {actionError}
        </SurfacePanel>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SurfacePanel padding="md">
          <p className="text-sm text-gray-500">Total Decks</p>
          <p className="text-2xl font-semibold text-gray-900">
            {decks.length}
          </p>
        </SurfacePanel>
        <SurfacePanel padding="md">
          <p className="text-sm text-gray-500">Ready</p>
          <p className="text-2xl font-semibold text-gray-900">
            {readyCount}
          </p>
        </SurfacePanel>
        <SurfacePanel padding="md">
          <p className="text-sm text-gray-500">Exported</p>
          <p className="text-2xl font-semibold text-gray-900">
            {exportedCount}
          </p>
        </SurfacePanel>
      </div>

      {/* Decks */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">
          All Decks
        </h2>
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Project
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Audience
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Updated
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {decks.map((deck) => (
                <tr key={deck.id}>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {deck.title}
                  </td>
                  <td className="px-4 py-2 text-gray-600">{deck.projectName}</td>
                  <td className="px-4 py-2 text-gray-600">
                    {AUDIENCE_LABELS[deck.audienceType]}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[deck.status]}`}
                    >
                      {deck.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(deck.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="space-x-2 px-4 py-2">
                    {deck.status === "draft" && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkReady(deck.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark Ready
                      </Button>
                    )}
                    {deck.status === "ready" && (
                      <Button
                        size="sm"
                        variant="subtle"
                        onClick={() => handleArchive(deck.id)}
                        className="bg-gray-500 text-white hover:bg-gray-600"
                      >
                        Archive
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(deck.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

