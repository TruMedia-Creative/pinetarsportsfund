type SurfaceTone = "default" | "subtle" | "success" | "warning" | "danger";
type SurfacePadding = "sm" | "md" | "lg";

export interface SurfacePanelClassOptions {
  tone?: SurfaceTone;
  padding?: SurfacePadding;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function surfacePanelClassName({
  tone = "default",
  padding = "md",
}: SurfacePanelClassOptions = {}) {
  const base = "rounded-lg border shadow-sm";
  const toneClasses: Record<SurfaceTone, string> = {
    default: "border-slate-200 bg-white",
    subtle: "border-slate-200 bg-slate-50",
    success: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
    danger: "border-red-200 bg-red-50",
  };
  const paddingClasses: Record<SurfacePadding, string> = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return cx(base, toneClasses[tone], paddingClasses[padding]);
}