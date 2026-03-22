import { useState, useEffect, useRef, useCallback } from 'react';

interface TourStep {
  target: string;  // CSS selector
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const TOUR_STEPS: TourStep[] = [
  {
    target: '[data-tour="dashboard"]',
    title: 'Welcome to WTF! 🎉',
    content: 'This is your dashboard — your mission control for learning. See your stats, streaks, and daily habits here.',
    position: 'bottom',
  },
  {
    target: '[data-tour="courses"]',
    title: 'Courses 📚',
    content: 'Browse all available courses. Each course has multiple lessons with text, quizzes, and reflections.',
    position: 'top',
  },
  {
    target: '[data-tour="habits"]',
    title: 'Daily Habits ✅',
    content: 'Track your daily habits to build consistency. Complete them every day to build your streak!',
    position: 'top',
  },
  {
    target: '[data-tour="profile"]',
    title: 'Your Profile 👤',
    content: 'View your achievements, certificates, medals, and manage your learning path.',
    position: 'top',
  },
  {
    target: '[data-tour="streak"]',
    title: 'Daily Streak 🔥',
    content: 'Complete a lesson or habit every day to grow your streak. Don\'t break the chain!',
    position: 'bottom',
  },
];

const STORAGE_KEY = 'wtf-tour-completed';

export default function OnboardingTour() {
  const [step, setStep] = useState(0);
  const [active, setActive] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;
    // Delay starting the tour to let the page render
    const timeout = setTimeout(() => setActive(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  const calculatePosition = useCallback(() => {
    if (!active) return;
    const currentStep = TOUR_STEPS[step];
    if (!currentStep) return;

    const target = document.querySelector(currentStep.target);
    if (!target) {
      // Skip to next step if target not found
      if (step < TOUR_STEPS.length - 1) setStep(step + 1);
      else finish();
      return;
    }

    const rect = target.getBoundingClientRect();
    const tooltipW = 300;
    const tooltipH = 140;
    const gap = 12;

    let top = 0;
    let left = 0;

    switch (currentStep.position) {
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        break;
      case 'top':
        top = rect.top - tooltipH - gap;
        left = rect.left + rect.width / 2 - tooltipW / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.left - tooltipW - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipH / 2;
        left = rect.right + gap;
        break;
    }

    // Keep within viewport
    left = Math.max(12, Math.min(left, window.innerWidth - tooltipW - 12));
    top = Math.max(12, Math.min(top, window.innerHeight - tooltipH - 12));

    setTooltipPos({ top, left });
  }, [step, active]);

  useEffect(() => {
    calculatePosition();
    window.addEventListener('resize', calculatePosition);
    return () => window.removeEventListener('resize', calculatePosition);
  }, [calculatePosition]);

  function finish() {
    setActive(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  }

  function next() {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else finish();
  }

  function skip() {
    finish();
  }

  if (!active) return null;

  const currentStep = TOUR_STEPS[step];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[70] bg-black/50" onClick={skip} />

      {/* Spotlight - highlight target element */}
      <TargetHighlight selector={currentStep.target} />

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="fixed z-[80] w-[300px] rounded-2xl border border-accent/30 bg-surface p-5 shadow-elevated animate-scale-in"
        style={{ top: tooltipPos.top, left: tooltipPos.left }}
      >
        <p className="text-xs text-accent font-semibold mb-1">
          Step {step + 1} of {TOUR_STEPS.length}
        </p>
        <h3 className="text-sm font-bold mb-2">{currentStep.title}</h3>
        <p className="text-xs text-muted leading-relaxed">{currentStep.content}</p>

        <div className="flex items-center justify-between mt-4">
          <button onClick={skip} className="text-xs text-muted-soft hover:text-primary transition-colors">
            Skip tour
          </button>
          <div className="flex gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="rounded-lg border border-border-subtle px-3 py-1.5 text-xs font-semibold text-muted hover:text-primary transition-all"
              >
                ← Back
              </button>
            )}
            <button
              onClick={next}
              className="rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-all"
            >
              {step === TOUR_STEPS.length - 1 ? 'Finish ✓' : 'Next →'}
            </button>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mt-3">
          {TOUR_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-4 bg-accent' : i < step ? 'w-1.5 bg-accent/50' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function TargetHighlight({ selector }: { selector: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const el = document.querySelector(selector);
    if (el) {
      setRect(el.getBoundingClientRect());
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selector]);

  if (!rect) return null;

  return (
    <div
      className="fixed z-[75] rounded-xl ring-4 ring-accent/40 pointer-events-none"
      style={{
        top: rect.top - 4,
        left: rect.left - 4,
        width: rect.width + 8,
        height: rect.height + 8,
      }}
    />
  );
}
