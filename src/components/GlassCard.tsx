import type { HTMLAttributes, ReactNode } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: "sm" | "md" | "lg";
  strong?: boolean;
}

const paddings = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function GlassCard({
  children,
  padding = "md",
  strong = false,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`rounded-2xl shadow-card ${strong ? "glass-strong" : "glass"} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
