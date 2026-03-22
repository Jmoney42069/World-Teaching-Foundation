import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  icon?: ReactNode;
  error?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: "px-3 py-2 text-xs",
  md: "px-4 py-3 text-sm",
  lg: "px-5 py-3.5 text-base",
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, error, size = "md", className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-semibold tracking-wide text-muted-soft uppercase"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-soft">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full rounded-xl border bg-surface-alt text-primary placeholder:text-muted-soft outline-none input-glow transition-all duration-200 ${
              error ? "input-error border-error" : "border-border focus:border-accent/50"
            } ${icon ? "pl-10" : ""} ${sizes[size]} ${
              props.disabled ? "cursor-not-allowed opacity-50" : ""
            } ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-xs font-medium text-error" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
