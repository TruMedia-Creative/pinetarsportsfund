import { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTenant } from "../../features/tenants";
import { hasAccessibleContrast } from "../../lib/colorContrast";
import { useAuth } from "../../features/auth";

type AppTheme = "light" | "dark";

export interface AppShellOutletContext {
  theme: AppTheme;
  accentColor: string;
  setTheme: (theme: AppTheme) => void;
  setAccentColor: (color: string) => void;
}

function persistSetting(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

const NAV_ITEMS = [
  { to: "/", label: "Dashboard" },
  { to: "/decks", label: "Decks" },
  { to: "/admin", label: "Admin" },
  { to: "/settings", label: "Settings" },
] as const;

export function AppShell() {
  const { tenant } = useTenant();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  function handleLogout() {
    setMobileNavOpen(false);
    logout();
    navigate("/login", { replace: true });
  }
  const [theme, setTheme] = useState<AppTheme>(() => {
    if (typeof window === "undefined") return "light";
    return window.localStorage.getItem("app.theme") === "dark" ? "dark" : "light";
  });
  const [accentColor, setAccentColor] = useState(() => {
    if (typeof window === "undefined") return "#4F46E5";
    return window.localStorage.getItem("app.accentColor") ?? "#4F46E5";
  });

  useEffect(() => {
    persistSetting("app.theme", theme);
  }, [theme]);

  useEffect(() => {
    persistSetting("app.accentColor", accentColor);
  }, [accentColor]);

  const isDark = theme === "dark";
  const shellClasses = isDark
    ? "min-h-screen bg-gray-900 text-gray-100"
    : "min-h-screen bg-gray-50 text-gray-900";
  const headerClasses = isDark
    ? "border-b border-gray-700 bg-gray-800 shadow-sm"
    : "border-b border-gray-200 bg-white shadow-sm";
  const linkClasses = isDark
    ? "text-sm font-medium text-gray-300 hover:text-white"
    : "text-sm font-medium text-gray-600 hover:text-gray-900";
  const shellBackgroundHex = isDark ? "#111827" : "#F9FAFB";
  const brandTextColor = hasAccessibleContrast(
    accentColor,
    shellBackgroundHex,
  )
    ? accentColor
    : undefined;
  const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? isDark
          ? "text-white"
          : "text-indigo-600"
        : isDark
          ? "text-gray-300 hover:text-white"
          : "text-gray-600 hover:text-gray-900"
    }`;
  const mobileNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium ${
      isActive
        ? isDark
          ? "bg-gray-700 text-white"
          : "bg-indigo-50 text-indigo-700"
        : isDark
          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  return (
    <div className={shellClasses}>
      <a
        href="#app-main"
        className="sr-only absolute left-4 top-4 z-50 rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow focus:not-sr-only"
      >
        Skip to content
      </a>
      <header className={headerClasses}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex min-h-16 items-center justify-between gap-4 py-3">
            <div className="flex items-center gap-4">
              {tenant?.branding.logoUrl ? (
                <img
                  src={tenant.branding.logoUrl}
                  alt={tenant.name}
                  className="h-8"
                />
              ) : (
                <span className="text-xl font-bold" style={{ color: brandTextColor }}>
                  {tenant?.name ?? "Pine Tar Sports Fund"}
                </span>
              )}
            </div>
            <nav className="hidden items-center gap-6 md:flex" aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === "/"} className={navLinkClassName}>
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className={linkClasses + " cursor-pointer"}
              >
                Logout
              </button>
            </nav>
            <button
              type="button"
              onClick={() => setMobileNavOpen((open) => !open)}
              className={`inline-flex rounded-md border px-3 py-2 text-sm font-medium md:hidden ${
                isDark
                  ? "border-gray-700 text-gray-100"
                  : "border-gray-300 text-gray-700"
              }`}
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
            >
              {mobileNavOpen ? "Close" : "Menu"}
            </button>
          </div>
          {mobileNavOpen && (
            <nav id="mobile-nav" className="space-y-2 border-t border-gray-200 pb-4 pt-3 md:hidden" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={mobileNavLinkClassName}
                  onClick={() => setMobileNavOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </nav>
          )}
        </div>
      </header>
      <main id="app-main" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet context={{ theme, accentColor, setTheme, setAccentColor }} />
      </main>
    </div>
  );
}
