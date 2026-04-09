import { BrowserRouter, Routes, Route, useParams, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, type ReactNode } from "react";
import { TenantProvider, useTenant } from "./features/tenants";
import { AppShell } from "./components/layout";
import { PublicLayout } from "./components/layout";
import { LoadingSpinner } from "./components/ui";
import { AuthProvider, useAuth } from "./features/auth";

const DashboardPage = lazy(() =>
  import("./features/dashboard/routes").then((module) => ({ default: module.DashboardPage })),
);
const DeckListPage = lazy(() =>
  import("./features/decks/routes").then((module) => ({ default: module.DeckListPage })),
);
const DeckFormPage = lazy(() =>
  import("./features/decks/routes/DeckFormPage"),
);
const DeckPreviewPage = lazy(() =>
  import("./features/decks/routes").then((module) => ({ default: module.DeckPreviewPage })),
);
const AdminDashboardPage = lazy(() =>
  import("./features/admin/routes").then((module) => ({ default: module.AdminDashboardPage })),
);
const SettingsPage = lazy(() =>
  import("./features/settings/routes").then((module) => ({ default: module.SettingsPage })),
);
const LoginPage = lazy(() =>
  import("./features/auth").then((module) => ({ default: module.LoginPage })),
);
const ExportPage = lazy(() =>
  import("./features/exports").then((module) => ({ default: module.ExportPage })),
);

function RouteLoader({ children }: { children: ReactNode }) {
  return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = location.pathname + location.search + location.hash;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from }} replace />;
  }

  return <>{children}</>;
}

function TenantGate({ children }: { children: ReactNode }) {
  const { loading, tenant } = useTenant();

  if (loading) return <LoadingSpinner />;

  if (!tenant) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="mb-2 text-xl font-semibold text-gray-900">
            Workspace not found
          </h1>
          <p className="text-sm text-gray-500">
            We could not load this workspace. Please check the URL or contact
            your administrator.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function TenantRoutes() {
  return (
    <TenantGate>
      <Routes>
        <Route element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<RouteLoader><DashboardPage /></RouteLoader>} />
          <Route path="decks" element={<RouteLoader><DeckListPage /></RouteLoader>} />
          <Route path="decks/new" element={<RouteLoader><DeckFormPage /></RouteLoader>} />
          <Route path="decks/:deckId/edit" element={<RouteLoader><DeckFormPage /></RouteLoader>} />
          <Route path="decks/:deckId/preview" element={<RouteLoader><DeckPreviewPage /></RouteLoader>} />
          <Route path="admin" element={<RouteLoader><AdminDashboardPage /></RouteLoader>} />
          <Route path="settings" element={<RouteLoader><SettingsPage /></RouteLoader>} />
          <Route path="exports/:deckId" element={<RouteLoader><ExportPage /></RouteLoader>} />
        </Route>
        {/* Public shareable deck view — no auth required */}
        <Route element={<PublicLayout />}>
          <Route path="view/:slug" element={<RouteLoader><DeckPreviewPage isPublic /></RouteLoader>} />
        </Route>
      </Routes>
    </TenantGate>
  );
}

function TenantSlugWrapper() {
  const { tenantSlug } = useParams();
  return (
    <TenantProvider slug={tenantSlug}>
      <TenantRoutes />
    </TenantProvider>
  );
}

function App() {
  return (
    <BrowserRouter basename="/pinetarsportsfund">
      <AuthProvider>
        <Routes>
          {/* Login page */}
          <Route path="/login" element={<RouteLoader><LoginPage /></RouteLoader>} />

          {/* Tenant from URL path */}
          <Route
            path="/t/:tenantSlug/*"
            element={<TenantSlugWrapper />}
          />

          {/* Tenant from hostname (default) */}
          <Route
            path="/*"
            element={
              <TenantProvider>
                <TenantRoutes />
              </TenantProvider>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

