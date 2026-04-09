export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center gap-3 p-8" role="status" aria-live="polite">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600" aria-hidden="true" />
      <span className="text-sm font-medium text-gray-600">Loading</span>
    </div>
  );
}
