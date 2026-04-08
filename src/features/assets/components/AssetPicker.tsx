import { useMemo, useState } from "react";
import { AssetLibrary } from "./AssetLibrary";
import type { Asset, AssetType } from "../model";

interface AssetPickerProps {
  onSelect: (asset: Asset) => void;
  allowedTypes?: AssetType[];
  buttonLabel?: string;
  previewUrl?: string;
}

export function AssetPicker({
  onSelect,
  allowedTypes,
  buttonLabel = "Choose from library",
  previewUrl,
}: AssetPickerProps) {
  const [open, setOpen] = useState(false);

  const label = useMemo(() => {
    if (!previewUrl) return buttonLabel;
    return "Change asset";
  }, [buttonLabel, previewUrl]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="shrink-0 rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Asset Library</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
            <AssetLibrary
              allowedTypes={allowedTypes}
              onSelect={(asset) => {
                onSelect(asset);
                setOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
