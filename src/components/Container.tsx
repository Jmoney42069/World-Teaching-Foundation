import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
  center?: boolean;
}

const sizes = {
  sm: "max-w-xl",
  md: "max-w-3xl",
  lg: "max-w-4xl",
};

export default function Container({
  children,
  size = "md",
  className = "",
  center = false,
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 ${sizes[size]} ${
        center ? "flex min-h-screen flex-col items-center justify-center" : "py-12 sm:py-16"
      } ${className}`}
    >
      {children}
    </div>
  );
}
