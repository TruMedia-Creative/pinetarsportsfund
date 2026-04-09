import { useEffect, useMemo, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<Deck["status"] | "all">("all");

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

  const summary = useMemo(
    () => ({
      total: decks.length,
      active: decks.filter((deck) => deck.status === "draft" || deck.status === "ready").length,
      exported: decks.filter((deck) => deck.status === "exported").length,
      archived: decks.filter((deck) => deck.status === "archived").length,
    }),
    [decks],
  );

  const filteredDecks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return decks.filter((deck) => {
      const matchesStatus = statusFilter === "all" || deck.status === statusFilter;
      const matchesQuery =
        query.length === 0 ||
        deck.title.toLowerCase().includes(query) ||
        deck.projectName.toLowerCase().includes(query) ||
        AUDIENCE_LABELS[deck.audienceType].toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [decks, searchQuery, statusFilter]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900">Decks</h1>
          <p className="text-sm text-gray-500">
            Start a new deck, return to active drafts, or narrow the list by status and audience.
          </p>
        </div>
        <Link
          to="/decks/new"
          className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
        >
          + New Deck
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total Decks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.total}</p>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Active Work</p>
          <p className="mt-2 text-2xl font-bold text-amber-900">{summary.active}</p>
        </div>
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Exported</p>
          <p className="mt-2 text-2xl font-bold text-emerald-900">{summary.exported}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Archived</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{summary.archived}</p>
        </div>
      </div>

      {actionError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {decks.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">No decks yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">
            Create your first deck with a guided setup, then refine sections, preview the flow, and export when the story is ready.
          </p>
          <Link
            to="/decks/new"
            className="mt-4 inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
          >
            Create your first deck
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-end md:justify-between">
            <div className="flex-1">
              <label htmlFor="deckSearch" className="mb-1 block text-sm font-medium text-slate-700">
                Search decks
              </label>
              <input
                id="deckSearch"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by title, project, or audience"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="w-full md:max-w-xs">
              <label htmlFor="statusFilter" className="mb-1 block text-sm font-medium text-slate-700">
                Status filter
              </label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as Deck["status"] | "all")}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All statuses</option>
                <option value="draft">Draft</option>
                <option value="ready">Ready</option>
                <option value="exported">Exported</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          {filteredDecks.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
              <h2 className="text-base font-semibold text-slate-900">No decks match those filters</h2>
              <p className="mt-2 text-sm text-slate-500">
                Clear the search or switch status filters to see more results.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                }}
                className="mt-4 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset filters
              </button>
            </div>
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
              {filteredDecks.map((deck) => (
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
        </>
      )}
    </div>
  );
}
