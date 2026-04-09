import type { HTMLAttributes } from "react";
import {
  surfacePanelClassName,
  type SurfacePanelClassOptions,
} from "./surfacePanelStyles";

interface SurfacePanelProps extends HTMLAttributes<HTMLDivElement>, SurfacePanelClassOptions {}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function SurfacePanel({
  tone,
  padding,
  className,
  ...props
}: SurfacePanelProps) {
  return <div className={cx(surfacePanelClassName({ tone, padding }), className)} {...props} />;
}