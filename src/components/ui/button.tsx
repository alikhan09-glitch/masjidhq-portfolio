import React from "react";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "outline"
  | "ghost"
  | "danger"
  | "gradient";

type Size = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center cursor-pointer gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizes: Record<Size, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants: Record<Variant, string> = {
    primary:
      "bg-emerald-600 text-white hover:bg-emerald-700",
    outline:
      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50",
    ghost:
      "text-emerald-600 hover:bg-emerald-100",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    gradient:
      "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:opacity-90",
  };

  return (
    <button
      className={cn(
        base,
        sizes[size],
        variants[variant],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
      )}

      {!loading && leftIcon}

      {!loading && children}

      {!loading && rightIcon}
    </button>
  );
}
