import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Path, Habit } from '../lib/database.types';
import { Container, Button, GlassCard, Badge } from '../components';
import {
  type Category,
  type QuizLength,
  QUIZ_LENGTHS,
  getQuestionsForLength,
  calculateProfile,
  QUESTION_TYPE_LABELS,
} from '../data/quizQuestions';
import { profiles } from '../data/profileData';
import {
  getCareerRecommendations,
  getAiProofIndicator,
  getRecommendedPathTitle,
  getPathMatchScore,
} from '../lib/recommendations';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { profile, updateProfile } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<Step>(1);
  const [paths, setPaths] = useState<Path[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [selectedHabits, setSelectedHabits] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Quiz state
  const [quizLength, setQuizLength] = useState<QuizLength>('medium');
  const [quizIndex, setQuizIndex] = useState(0);
  const [answerCategories, setAnswerCategories] = useState<Category[]>([]);
  const [profileResult, setProfileResult] = useState<Category | null>(null);
  const [profileScores, setProfileScores] = useState<Record<Category, number>>({ Tech: 0, Creative: 0, Business: 0 });

  const activeQuestions = getQuestionsForLength(quizLength);

  // Redirect if onboarding already done
  useEffect(() => {
    if (profile?.onboarding_complete) navigate('/dashboard', { replace: true });
  }, [profile?.onboarding_complete, navigate]);

  // Load mock paths for dev mode
  useEffect(() => {
    setPaths([
      { id: 'p1', title: 'Career Accelerator', description: 'Fast-track your professional growth with proven career strategies.', icon: '🚀', color: '#6366f1', created_at: '' },
      { id: 'p2', title: 'Financial Freedom', description: 'Master money management, investing, and building lasting wealth.', icon: '💰', color: '#22c55e', created_at: '' },
      { id: 'p3', title: 'Peak Health', description: 'Optimize your body and energy with science-backed health habits.', icon: '💪', color: '#ef4444', created_at: '' },
      { id: 'p4', title: 'Mindset Mastery', description: 'Build mental resilience, focus, and a growth-oriented mindset.', icon: '🧠', color: '#a855f7', created_at: '' },
      { id: 'p5', title: 'Entrepreneurship', description: 'Turn your ideas into a real business from day one.', icon: '💡', color: '#f59e0b', created_at: '' },
    ]);
  }, []);

  // Load mock habits when path selected
  useEffect(() => {
    if (!selectedPath) return;
    const mockHabits: Habit[] = [
      { id: 'h1', title: 'Morning journal', description: 'Write 3 things you are grateful for', icon: '📝', path_id: selectedPath, frequency: 'daily', created_at: '' },
      { id: 'h2', title: '20 min reading', description: 'Read a non-fiction book for 20 minutes', icon: '📖', path_id: selectedPath, frequency: 'daily', created_at: '' },
      { id: 'h3', title: 'Exercise', description: '30 minutes of physical activity', icon: '🏃', path_id: selectedPath, frequency: 'daily', created_at: '' },
      { id: 'h4', title: 'No phone before bed', description: 'Put your phone away 30 min before sleeping', icon: '📵', path_id: selectedPath, frequency: 'daily', created_at: '' },
      { id: 'h5', title: 'Learn something new', description: 'Spend 15 minutes learning a new skill', icon: '🎓', path_id: selectedPath, frequency: 'daily', created_at: '' },
    ];
    setHabits(mockHabits);
    setSelectedHabits(new Set(mockHabits.slice(0, 3).map((h) => h.id)));
  }, [selectedPath]);

  function toggleHabit(id: string) {
    setSelectedHabits((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleQuizAnswer(category: Category) {
    const newAnswers = [...answerCategories, category];
    setAnswerCategories(newAnswers);

    if (quizIndex < activeQuestions.length - 1) {
      setQuizIndex((q) => q + 1);
    } else {
      // Quiz done — calculate profile
      const result = calculateProfile(newAnswers);
      setProfileResult(result.profile);
      setProfileScores(result.scores);

      // Auto-select recommended path
      const recommendedTitle = getRecommendedPathTitle(result.profile);
      const matchedPath = paths.find((p) => p.title === recommendedTitle);
      if (matchedPath) setSelectedPath(matchedPath.id);

      setStep(4);
    }
  }

  function handleQuizBack() {
    if (quizIndex > 0) {
      setAnswerCategories(answerCategories.slice(0, -1));
      setQuizIndex(quizIndex - 1);
    }
  }

  async function finishOnboarding() {
    if (!selectedPath) return;
    setLoading(true);

    try {
      await updateProfile({
        path_id: selectedPath,
        onboarding_complete: true,
        quiz_profile: profileResult,
        quiz_scores: profileScores as unknown as import('../lib/database.types').Json,
      });

      toast.success('+50 XP ⚡');
      setStep(7);
    } catch (_err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const totalSteps = 7;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  const profileData = profileResult ? profiles[profileResult] : null;
  const careers = profileResult ? getCareerRecommendations(profileResult) : [];

  return (
    <Container size="md" center>
      <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
        {/* Progress bar */}
        <div className="mb-8 w-full max-w-lg">
          <div className="flex items-center justify-between text-xs text-muted-soft mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* ─── Step 1: Welcome ─── */}
        {step === 1 && (
          <div className="animate-fade-up w-full max-w-lg space-y-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-cyan/20 text-4xl shadow-glow">
                🚀
              </div>
              <h1 className="font-display text-display font-bold tracking-tight">
                Welcome to <span className="text-gradient">WTF</span>
              </h1>
              <p className="text-sm font-medium text-muted-soft">World Teaching Foundation</p>
              <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
                Take a personality &amp; skills assessment. We'll determine your profile type,
                recommend career paths, and build a personalized learning plan — just for you.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { icon: '🧩', label: 'Personality Quiz' },
                { icon: '🎯', label: 'Profile Type' },
                { icon: '🛤️', label: 'Career Paths' },
              ].map((f) => (
                <div key={f.label} className="rounded-2xl border border-border-subtle bg-surface p-4">
                  <span className="text-2xl">{f.icon}</span>
                  <p className="mt-2 text-xs font-semibold">{f.label}</p>
                </div>
              ))}
            </div>

            <Button onClick={() => setStep(2)} size="lg" fullWidth>
              Start Assessment →
            </Button>
          </div>
        )}

        {/* ─── Step 2: Choose Quiz Length ─── */}
        {step === 2 && (
          <div className="animate-fade-up w-full max-w-lg space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Choose Your Assessment
              </h2>
              <p className="text-sm text-muted">
                Longer assessments give more accurate results.
              </p>
            </div>

            <div className="space-y-3">
              {(Object.entries(QUIZ_LENGTHS) as [QuizLength, typeof QUIZ_LENGTHS[QuizLength]][]).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setQuizLength(key)}
                  className={`tap-target flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
                    quizLength === key
                      ? 'border-accent bg-accent/5 shadow-glow ring-2 ring-accent/30'
                      : 'border-border-subtle bg-surface hover:border-accent/30 hover:bg-surface-hover'
                  }`}
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-2xl">
                    {cfg.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{cfg.label}</h3>
                      {key === 'medium' && (
                        <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted">{cfg.description}</p>
                  </div>
                  {quizLength === key && (
                    <span className="text-accent">✓</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
              <Button
                onClick={() => {
                  setQuizIndex(0);
                  setAnswerCategories([]);
                  setStep(3);
                }}
                fullWidth
                size="lg"
              >
                Begin ({QUIZ_LENGTHS[quizLength].count} questions) →
              </Button>
            </div>
          </div>
        )}

        {/* ─── Step 3: Take the Quiz ─── */}
        {step === 3 && activeQuestions[quizIndex] && (
          <div className="animate-fade-up w-full max-w-lg space-y-6">
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-soft">
                {QUESTION_TYPE_LABELS[activeQuestions[quizIndex].type].icon} {QUESTION_TYPE_LABELS[activeQuestions[quizIndex].type].label}
              </p>
              <h2 className="font-display text-xl font-bold tracking-tight">
                Question {quizIndex + 1} of {activeQuestions.length}
              </h2>
              <p className="text-base font-medium text-muted">
                {activeQuestions[quizIndex].question}
              </p>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {activeQuestions.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i < quizIndex ? 'w-2 bg-accent' :
                    i === quizIndex ? 'w-6 bg-accent' : 'w-2 bg-border'
                  }`}
                />
              ))}
            </div>

            <div className="space-y-3">
              {activeQuestions[quizIndex].answers.map((answer, ai) => (
                <button
                  key={ai}
                  onClick={() => handleQuizAnswer(answer.category)}
                  className="tap-target flex w-full items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-4 text-left transition-all duration-200 hover:border-accent/30 hover:bg-surface-hover active:scale-[0.98]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-sm font-bold text-accent">
                    {String.fromCharCode(65 + ai)}
                  </span>
                  <span className="text-sm font-medium">{answer.text}</span>
                </button>
              ))}
            </div>

            {quizIndex > 0 && (
              <Button variant="ghost" onClick={handleQuizBack}>
                ← Back
              </Button>
            )}
          </div>
        )}

        {/* ─── Step 4: Profile Result ─── */}
        {step === 4 && profileData && profileResult && (
          <div className="animate-fade-up w-full max-w-2xl space-y-6">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-cyan/20 text-4xl shadow-glow">
                {profileResult === 'Tech' ? '⚙️' : profileResult === 'Creative' ? '🎨' : '♟️'}
              </div>
              <h2 className="font-display text-2xl font-bold tracking-tight">
                You are: <span className="text-gradient">{profileData.label}</span>
              </h2>
              <p className="text-sm italic text-muted">{profileData.tagline}</p>
              <p className="mx-auto max-w-lg text-xs leading-relaxed text-muted-soft">
                {profileData.description}
              </p>
            </div>

            {/* Score breakdown */}
            <GlassCard padding="md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-soft mb-3">Score Breakdown</h3>
              <div className="space-y-2">
                {(Object.entries(profileScores) as [Category, number][])
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, score]) => {
                    const total = answerCategories.length;
                    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
                    return (
                      <div key={cat} className="flex items-center gap-3">
                        <span className="w-20 text-xs font-semibold">{cat}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-border">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              cat === profileResult ? 'bg-accent' : 'bg-muted-soft/40'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-xs font-bold text-muted-soft">{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            </GlassCard>

            {/* Strengths */}
            <GlassCard padding="md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-soft mb-3">Your Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {profileData.strengths.map((s) => (
                  <span key={s} className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </GlassCard>

            {/* Career paths with AI-proof indicators */}
            <GlassCard padding="md">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-soft mb-3">Recommended Careers</h3>
              <div className="space-y-3">
                {careers.map((career) => {
                  const aiProof = getAiProofIndicator(career.title);
                  return (
                    <div key={career.title} className="flex items-start gap-3 rounded-xl border border-border-subtle bg-bg p-3">
                      <span className="text-xl">{career.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{career.title}</span>
                          {career.tag && (
                            <Badge variant="default">{career.tag}</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted mt-0.5">{career.description}</p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span
                            className="inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: aiProof.color }}
                          />
                          <span className="text-[10px] font-bold" style={{ color: aiProof.color }}>
                            AI-Proof: {aiProof.level}
                          </span>
                          <span className="text-[10px] text-muted-soft">— {aiProof.description}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setQuizIndex(0);
                  setAnswerCategories([]);
                  setProfileResult(null);
                  setStep(2);
                }}
              >
                Retake Quiz
              </Button>
              <Button onClick={() => setStep(5)} fullWidth size="lg">
                Choose Learning Path →
              </Button>
            </div>
          </div>
        )}

        {/* ─── Step 5: Select Path (informed by profile) ─── */}
        {step === 5 && (
          <div className="animate-fade-up w-full max-w-2xl space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Choose Your Learning Path
              </h2>
              <p className="text-sm text-muted">
                We pre-selected the best match for your <span className="font-semibold text-accent">{profileResult}</span> profile. You can override.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[...paths]
                .sort((a, b) => {
                  if (!profileResult) return 0;
                  return getPathMatchScore(b.title, profileResult) - getPathMatchScore(a.title, profileResult);
                })
                .map((path, idx) => {
                  const matchScore = profileResult ? getPathMatchScore(path.title, profileResult) : 50;
                  return (
                    <button
                      key={path.id}
                      onClick={() => setSelectedPath(path.id)}
                      className={`tap-target group relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200 ${
                        selectedPath === path.id
                          ? 'border-accent bg-accent/5 shadow-glow ring-2 ring-accent/30'
                          : 'border-border-subtle bg-surface hover:border-accent/30 hover:bg-surface-hover'
                      }`}
                    >
                      <span
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl"
                        style={{ backgroundColor: `${path.color}15` }}
                      >
                        {path.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{path.title}</h3>
                          {idx === 0 && profileResult && (
                            <span className="rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                              Best for {profileResult}
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{path.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                            <div
                              className="h-full rounded-full bg-accent/60 transition-all duration-500"
                              style={{ width: `${matchScore}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-muted-soft">{matchScore}% match</span>
                        </div>
                      </div>
                      {selectedPath === path.id && (
                        <span className="absolute right-4 top-4 text-accent">✓</span>
                      )}
                    </button>
                  );
                })}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(4)}>← Back</Button>
              <Button onClick={() => setStep(6)} disabled={!selectedPath} fullWidth size="lg">
                Continue →
              </Button>
            </div>
          </div>
        )}

        {/* ─── Step 6: Select Habits ─── */}
        {step === 6 && (
          <div className="animate-fade-up w-full max-w-lg space-y-6">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Set Your Daily Habits
              </h2>
              <p className="text-sm text-muted">
                We've pre-selected 3 habits for your path. Adjust as you like.
              </p>
            </div>

            <div className="space-y-2">
              {habits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => toggleHabit(habit.id)}
                  className={`tap-target flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-200 ${
                    selectedHabits.has(habit.id)
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-border-subtle bg-surface hover:bg-surface-hover'
                  }`}
                >
                  <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                    selectedHabits.has(habit.id)
                      ? 'border-accent bg-accent text-bg'
                      : 'border-border'
                  }`}>
                    {selectedHabits.has(habit.id) && (
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                  <span className="text-lg">{habit.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{habit.title}</p>
                    <p className="text-xs text-muted">{habit.description}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" onClick={() => setStep(5)}>← Back</Button>
              <Button
                onClick={finishOnboarding}
                loading={loading}
                fullWidth
                size="lg"
              >
                Start My Journey 🚀
              </Button>
            </div>

            <button
              onClick={finishOnboarding}
              className="block w-full text-center text-xs text-muted-soft hover:text-muted transition-colors"
            >
              Skip for now →
            </button>
          </div>
        )}

        {/* ─── Step 7: Success ─── */}
        {step === 7 && (
          <div className="animate-scale-in w-full max-w-lg space-y-8 text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-cyan/20 text-5xl shadow-glow animate-float">
              🎉
            </div>
            <div className="space-y-3">
              <h2 className="font-display text-3xl font-bold tracking-tight">
                Your Journey Starts Now!
              </h2>
              <p className="text-sm text-muted">
                You've earned <span className="font-bold text-accent">+50 XP</span> for completing onboarding.
              </p>
              {profileData && (
                <p className="text-sm text-muted">
                  Profile: <span className="font-semibold text-accent">{profileData.label}</span>
                </p>
              )}
            </div>

            <GlassCard padding="md" className="inline-flex items-center gap-3 rounded-full">
              <span className="text-lg">🐣</span>
              <span className="text-sm font-semibold">Early Bird medal earned!</span>
            </GlassCard>

            <Button onClick={() => navigate('/dashboard')} size="lg" fullWidth>
              Go to Dashboard →
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
}
