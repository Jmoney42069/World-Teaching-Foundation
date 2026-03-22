import type { ReactNode } from "react";

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <div className="animate-scale-in flex flex-col items-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-hover to-surface text-3xl">
        {icon}
      </div>
      <div className="space-y-1.5">
        <h3 className="font-display text-lg font-bold tracking-tight">{title}</h3>
        <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
          {description}
        </p>
      </div>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-bg transition-all duration-200 hover:bg-primary-hover hover:shadow-elevated active:scale-[0.97]"
          aria-label={ctaLabel}
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
