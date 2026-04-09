import { Outlet } from "react-router-dom";
import { useTenant } from "../../features/tenants";

export function PublicLayout() {
  const { tenant } = useTenant();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-gray-200 bg-white/95 py-4 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 text-center">
          {tenant?.branding.logoUrl ? (
            <img
              src={tenant.branding.logoUrl}
              alt={tenant.name}
              className="mx-auto h-10"
            />
          ) : (
            <span className="text-xl font-bold">
              {tenant?.name ?? "Pine Tar Sports Fund"}
            </span>
          )}
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">
            Shared Deck Experience
          </p>
        </div>
      </header>
      <main className="min-h-[calc(100vh-89px)] px-0 py-0">
        <Outlet />
      </main>
    </div>
  );
}
