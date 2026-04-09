import { useEffect, useMemo, useState } from "react";
import { BannerUpload } from "../../../components/ui";
import { createAsset, deleteAsset, getAssets } from "../../../lib/api/mock";
import type { Asset, AssetType } from "../model";

interface AssetLibraryProps {
  onSelect?: (asset: Asset) => void;
  allowedTypes?: AssetType[];
}

const ASSET_TYPES: AssetType[] = [
  "image",
  "chart",
  "logo",
  "headshot",
  "rendering",
  "document",
];

export function AssetLibrary({ onSelect, allowedTypes }: AssetLibraryProps) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AssetType | "all">("all");
  const [uploadDataUrl, setUploadDataUrl] = useState<string | undefined>(undefined);
  const [uploadType, setUploadType] = useState<AssetType>("image");
  const [uploadName, setUploadName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAssets()
      .then((data) => setAssets(data))
      .catch(() => setError("Failed to load assets."))
      .finally(() => setLoading(false));
  }, []);

  const typeOptions = allowedTypes ?? ASSET_TYPES;

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      if (allowedTypes && !allowedTypes.includes(asset.type)) return false;
      if (typeFilter !== "all" && asset.type !== typeFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.alt?.toLowerCase().includes(q) ||
        asset.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }, [assets, allowedTypes, query, typeFilter]);

  async function handleCreateAsset() {
    if (!uploadDataUrl) return;
    setError(null);
    try {
      const created = await createAsset({
        name: uploadName.trim() || `Uploaded ${new Date().toLocaleString()}`,
        type: uploadType,
        url: uploadDataUrl,
      });
      setAssets((prev) => [created, ...prev]);
      setUploadDataUrl(undefined);
      setUploadName("");
      if (onSelect) onSelect(created);
    } catch {
      setError("Failed to create asset.");
    }
  }

  async function handleDeleteAsset(id: string) {
    try {
      await deleteAsset(id);
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
    } catch {
      setError("Failed to delete asset.");
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
          Upload Asset
        </p>
        <div className="space-y-2">
          <BannerUpload value={uploadDataUrl} onChange={setUploadDataUrl} />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <input
              type="text"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="Asset name (optional)"
              className="rounded border border-gray-300 px-2 py-1.5 text-sm"
            />
            <select
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value as AssetType)}
              className="rounded border border-gray-300 px-2 py-1.5 text-sm"
            >
              {typeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            disabled={!uploadDataUrl}
            onClick={handleCreateAsset}
            className="rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            Save Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search assets"
          className="rounded border border-gray-300 px-2 py-1.5 text-sm sm:col-span-2"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as AssetType | "all")}
          className="rounded border border-gray-300 px-2 py-1.5 text-sm"
        >
          <option value="all">All types</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-500">Loading assets...</p>
      ) : filteredAssets.length === 0 ? (
        <p className="text-sm text-gray-500">No assets found.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {filteredAssets.map((asset) => (
            <div key={asset.id} className="rounded border border-gray-200 bg-white p-2">
              <div className="mb-2 h-28 overflow-hidden rounded bg-gray-100">
                <img
                  src={asset.url}
                  alt={asset.alt ?? asset.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <p className="truncate text-sm font-medium text-gray-800">{asset.name}</p>
              <p className="text-xs text-gray-500">{asset.type}</p>
              <div className="mt-2 flex items-center justify-between">
                {onSelect ? (
                  <button
                    type="button"
                    onClick={() => onSelect(asset)}
                    className="text-xs font-medium text-indigo-600 hover:underline"
                  >
                    Select
                  </button>
                ) : <span />}
                <button
                  type="button"
                  onClick={() => handleDeleteAsset(asset.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
