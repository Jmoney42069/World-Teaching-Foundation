import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

function Spinner() {
  return (
    <svg
      className="h-4 w-4 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  );
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-bg hover:bg-primary-hover hover:shadow-elevated",
  secondary:
    "bg-surface text-primary border border-border hover:bg-surface-hover hover:border-muted-soft",
  outline:
    "border border-border text-muted hover:text-primary hover:border-muted-soft",
  ghost: "text-muted hover:text-primary hover:bg-surface-hover",
  danger:
    "bg-error text-white hover:bg-error/90 hover:shadow-elevated",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${
        fullWidth ? "w-full" : ""
      } ${isDisabled ? "pointer-events-none cursor-not-allowed opacity-50" : ""} ${className}`}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
