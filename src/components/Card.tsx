import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hoverable?: boolean;
  glow?: boolean;
  padding?: "sm" | "md" | "lg";
}

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  hoverable = false,
  glow = false,
  padding = "md",
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-border-subtle bg-surface shadow-card transition-all duration-200 ${paddings[padding]} ${
        hoverable ? "hover:bg-surface-hover hover:border-border" : ""
      } ${glow ? "glow-ring" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
