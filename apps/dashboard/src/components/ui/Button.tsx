import type { ButtonHTMLAttributes } from "react";
import { buttonClassName, type ButtonClassOptions } from "./buttonStyles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonClassOptions {
  className?: string;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant,
  size,
  fullWidth,
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(buttonClassName({ variant, size, fullWidth }), className)}
      {...props}
    />
  );
}