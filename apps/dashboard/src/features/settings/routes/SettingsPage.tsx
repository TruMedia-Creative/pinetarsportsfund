import { useOutletContext } from "react-router-dom";
import type { AppShellOutletContext } from "../../../components/layout/AppShell";
import { Button, SurfacePanel } from "../../../components/ui";
import { getContrastingTextColor } from "../../../lib/colorContrast";

export function SettingsPage() {
  const { theme, accentColor, setTheme, setAccentColor } =
    useOutletContext<AppShellOutletContext>();

  const labelClasses =
    theme === "dark"
      ? "text-sm font-medium text-gray-200"
      : "text-sm font-medium text-gray-700";
  const helperTextClasses = theme === "dark" ? "text-sm text-gray-400" : "text-sm text-gray-500";
  const inputClasses =
    theme === "dark"
      ? "w-full rounded-md border border-gray-600 bg-gray-900 px-3 py-2 text-sm text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500"
      : "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500";
  const colorInputClasses =
    theme === "dark"
      ? "h-10 w-14 cursor-pointer rounded border border-gray-600 bg-gray-900 p-1"
      : "h-10 w-14 cursor-pointer rounded border border-gray-300 bg-white p-1";
  const previewClasses =
    theme === "dark" ? "mt-4 rounded-md border border-gray-600 p-4" : "mt-4 rounded-md border border-gray-300 p-4";
  const previewTextColor = getContrastingTextColor(accentColor);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className={`mt-1 ${helperTextClasses}`}>
          Customize your workspace theme and overall accent color.
        </p>
      </div>

      <SurfacePanel padding="lg" className={theme === "dark" ? "border-gray-700 bg-gray-800" : undefined}>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <label className="space-y-2">
            <span className={labelClasses}>Theme</span>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className={inputClasses}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <label className="space-y-2">
            <span className={labelClasses}>Accent color</span>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className={colorInputClasses}
              />
              <span className={helperTextClasses}>{accentColor.toUpperCase()}</span>
            </div>
          </label>
        </div>
      </SurfacePanel>

      <SurfacePanel padding="lg" className={theme === "dark" ? "border-gray-700 bg-gray-800" : undefined}>
        <h2 className="text-lg font-semibold">Preview</h2>
        <div className={previewClasses}>
          <Button
            style={{ backgroundColor: accentColor, color: previewTextColor }}
            className="shadow-none"
          >
            Sample Action
          </Button>
        </div>
      </SurfacePanel>
    </div>
  );
}
