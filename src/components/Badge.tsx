import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "locked";
  className?: string;
}

const variants = {
  default: "bg-surface-hover text-muted border-border",
  success: "bg-accent/10 text-accent border-accent/20",
  locked: "bg-surface text-muted-soft border-border-subtle",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium leading-4 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
