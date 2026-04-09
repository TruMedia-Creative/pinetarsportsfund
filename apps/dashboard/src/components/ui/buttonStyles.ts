type ButtonVariant = "primary" | "secondary" | "subtle" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

export interface ButtonClassOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonClassName({
  variant = "primary",
  size = "md",
  fullWidth = false,
}: ButtonClassOptions = {}) {
  const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
    secondary: "border border-slate-300 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
    subtle: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    ghost: "text-indigo-700 hover:bg-indigo-50",
    danger: "bg-red-600 text-white shadow-sm hover:bg-red-700",
  };
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };

  return cx(base, variantClasses[variant], sizeClasses[size], fullWidth && "w-full");
}