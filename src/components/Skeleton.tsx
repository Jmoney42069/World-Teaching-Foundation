interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

const roundMap = {
  sm: "rounded-lg",
  md: "rounded-xl",
  lg: "rounded-2xl",
  full: "rounded-full",
};

export function Skeleton({
  width,
  height = "1rem",
  rounded = "md",
  className = "",
}: SkeletonProps) {
  return (
    <div
      className={`skeleton ${roundMap[rounded]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <Skeleton width="48px" height="48px" rounded="full" />
      <div className="flex-1 space-y-2">
        <Skeleton width="60%" height="14px" />
        <Skeleton width="40%" height="12px" />
      </div>
    </div>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton width="40px" height="40px" rounded="lg" />
        <div className="flex-1 space-y-2">
          <Skeleton width="70%" height="16px" />
          <Skeleton width="50%" height="12px" />
        </div>
      </div>
      <Skeleton width="100%" height="8px" rounded="full" />
      <div className="grid grid-cols-3 gap-2">
        <Skeleton width="100%" height="48px" />
        <Skeleton width="100%" height="48px" />
        <Skeleton width="100%" height="48px" />
      </div>
    </div>
  );
}

export function HabitRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-3.5 px-4" aria-hidden="true">
      <Skeleton width="20px" height="20px" rounded="sm" />
      <Skeleton width="100%" height="14px" className="flex-1" />
    </div>
  );
}

export function CertificateSkeleton() {
  return (
    <div className="rounded-2xl border-2 border-border-subtle bg-surface p-8 space-y-6">
      <Skeleton width="40%" height="12px" className="mx-auto" />
      <Skeleton width="60%" height="32px" className="mx-auto" />
      <div className="flex justify-center gap-3">
        <Skeleton width="100px" height="1px" />
        <Skeleton width="12px" height="12px" rounded="full" />
        <Skeleton width="100px" height="1px" />
      </div>
      <Skeleton width="30%" height="14px" className="mx-auto" />
      <Skeleton width="50%" height="24px" className="mx-auto" />
      <Skeleton width="20%" height="12px" className="mx-auto" />
    </div>
  );
}
