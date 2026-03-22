import { useNavigate } from "react-router-dom";
import { Container } from "../components";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container size="sm" center>
      <div className="animate-scale-in space-y-8 text-center">
        {/* Subtle background glow */}
        <div className="relative mx-auto">
          <div className="absolute inset-0 mx-auto h-40 w-40 rounded-full bg-accent/5 blur-3xl" />
          <h1 className="font-display text-display relative font-bold tracking-tight text-primary/10">
            404
          </h1>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">
            Page not found
          </p>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            This page doesn't exist
          </h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
            The page you're looking for has been moved, removed, or never existed.
            Head back to your dashboard to continue learning.
          </p>
        </div>

        {/* Floating orbs for visual interest */}
        <div className="relative mx-auto flex justify-center gap-6">
          <div className="animate-float h-3 w-3 rounded-full bg-accent/30" style={{ animationDelay: "0ms" }} />
          <div className="animate-float h-2 w-2 rounded-full bg-cyan/30" style={{ animationDelay: "200ms" }} />
          <div className="animate-float h-4 w-4 rounded-full bg-violet/20" style={{ animationDelay: "400ms" }} />
          <div className="animate-float h-2.5 w-2.5 rounded-full bg-accent/20" style={{ animationDelay: "600ms" }} />
        </div>

        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-bg transition-all duration-200 hover:bg-primary-hover hover:shadow-elevated active:scale-[0.97]"
          aria-label="Back to home"
        >
          ← Back to Home
        </button>
      </div>
    </Container>
  );
}
