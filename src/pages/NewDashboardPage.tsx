import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getLevelInfo } from '../lib/database.types';
import { Container, GlassCard, Badge, ProgressRing, EmptyState } from '../components';
import { DashboardStatSkeleton, HabitRowSkeleton } from '../components/Skeleton';
import { profiles, type Category } from '../data/profileData';
import { getCareerRecommendations, getAiProofIndicator } from '../lib/recommendations';
import { useProgress } from '../context/ProgressContext';
import { getAllCourses, getCourseLessonIds } from '../data/courseRegistry';

interface HabitSnapshot {
  id: string;
  title: string;
  icon: string;
  completedToday: boolean;
  streakCount: number;
}

interface CourseSnapshot {
  id: string;
  title: string;
  description: string;
  completedLessons: number;
  totalLessons: number;
}

interface DashboardData {
  xp: number;
  levelInfo: ReturnType<typeof getLevelInfo>;
  habits: HabitSnapshot[];
  currentCourse: CourseSnapshot | null;
  totalLessons: number;
  totalCourses: number;
  totalMedals: number;
  totalCertificates: number;
  bestStreak: number;
}

export default function NewDashboardPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const progress = useProgress();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [completingHabitId, setCompletingHabitId] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    if (!profile) { setLoading(false); return; }

    const levelInfo = getLevelInfo(profile.xp + progress.xpEarned);

    // Load habits from localStorage (shared with HabitsPage)
    let habits: HabitSnapshot[] = [];
    try {
      const raw = localStorage.getItem('wtf-habits');
      if (raw) {
        const parsed = JSON.parse(raw) as HabitSnapshot[];
        habits = parsed.map((h) => ({
          id: h.id,
          title: h.title,
          icon: h.icon,
          completedToday: h.completedToday,
          streakCount: h.streakCount,
        }));
      }
    } catch (_e) { /* ignore */ }

    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streakCount), 0);

    // Find current course (first course not yet completed)
    let currentCourse: CourseSnapshot | null = null;
    const allCourses = getAllCourses();
    for (const c of allCourses) {
      if (!progress.completedCourses.has(c.id)) {
        const lessonIds = getCourseLessonIds(c.id);
        const completedCount = lessonIds.filter((lid) => progress.completedLessons.has(lid)).length;
        currentCourse = {
          id: c.id,
          title: c.title,
          description: c.description,
          completedLessons: completedCount,
          totalLessons: lessonIds.length,
        };
        break;
      }
    }

    setData({
      xp: profile.xp + progress.xpEarned,
      levelInfo,
      habits,
      currentCourse,
      totalLessons: progress.completedLessons.size,
      totalCourses: progress.completedCourses.size,
      totalMedals: 1,
      totalCertificates: progress.certificates.length,
      bestStreak,
    });
    setLoading(false);
  }, [profile, progress]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleHabitCheck(habitId: string, habitTitle: string) {
    if (!profile) return;
    setCompletingHabitId(habitId);
    toast.success(`+5 XP — ${habitTitle} ✓`);
    setCompletingHabitId(null);
  }

  const greeting = (() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  if (loading) {
    return (
      <Container size="lg">
        <div className="space-y-6 pb-24">
          <div className="space-y-2">
            <div className="h-8 w-60 bg-surface-hover rounded-lg animate-pulse" />
            <div className="h-4 w-40 bg-surface-hover rounded animate-pulse" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => <DashboardStatSkeleton key={i} />)}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="rounded-2xl border border-border-subtle bg-surface p-6">
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (<HabitRowSkeleton key={j} />))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!data || !profile) return null;

  const habitsCompletedToday = data.habits.filter((h) => h.completedToday).length;
  const habitsTotal = data.habits.length;

  return (
    <Container size="lg">
      <div className="space-y-8 pb-24">
        {/* Greeting + XP bar */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-display font-bold tracking-tight">
              {greeting}, {profile.display_name.split(' ')[0]}!
            </h1>
            <p className="mt-1 text-sm text-muted">
              Level {data.levelInfo.current.level} · {data.levelInfo.current.title}
            </p>
          </div>

          {/* XP ring */}
          <div className="flex items-center gap-4">
            <ProgressRing percent={data.levelInfo.progress} size={64} stroke={5}>
              <span className="text-xs font-bold">{data.levelInfo.progress}%</span>
            </ProgressRing>
            <div>
              <p className="text-sm font-bold">{data.xp} XP</p>
              {data.levelInfo.next && (
                <p className="text-xs text-muted-soft">
                  {data.levelInfo.next.xp - data.xp} XP to Level {data.levelInfo.next.level}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: '📖', label: 'Lessons', value: data.totalLessons },
            { icon: '📚', label: 'Courses', value: data.totalCourses },
            { icon: '🏅', label: 'Medals', value: data.totalMedals },
            { icon: '🔥', label: 'Best Streak', value: `${data.bestStreak}d` },
          ].map((stat) => (
            <GlassCard key={stat.label} padding="sm" className="text-center">
              <span className="text-lg">{stat.icon}</span>
              <p className="text-xl font-bold mt-1">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </GlassCard>
          ))}
        </div>

        {/* Profile Card + Career Recommendations */}
        {profile.quiz_profile && (() => {
          const category = profile.quiz_profile as Category;
          const pd = profiles[category];
          const careers = getCareerRecommendations(category);
          if (!pd) return null;
          return (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Profile Card */}
              <GlassCard padding="md">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/20 to-cyan/20 text-2xl">
                    {category === 'Tech' ? '⚙️' : category === 'Creative' ? '🎨' : '♟️'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-lg font-bold">{pd.label}</h3>
                    <p className="text-xs italic text-muted">{pd.tagline}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {pd.strengths.slice(0, 4).map((s) => (
                        <span key={s} className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-0.5 text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Top Careers with AI-Proof */}
              <GlassCard padding="md">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-soft mb-3">Your Career Paths</h3>
                <div className="space-y-2">
                  {careers.slice(0, 3).map((c) => {
                    const ai = getAiProofIndicator(c.title);
                    return (
                      <div key={c.title} className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg p-2.5">
                        <span className="text-lg">{c.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-sm font-semibold">{c.title}</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: ai.color }} />
                            <span className="text-[10px] font-bold" style={{ color: ai.color }}>AI-Proof: {ai.level}</span>
                          </div>
                        </div>
                        {c.tag && <Badge variant="default">{c.tag}</Badge>}
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </div>
          );
        })()}

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Today's Habits */}
          <GlassCard padding="md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold tracking-tight">Today's Habits</h2>
              <Badge variant={habitsCompletedToday === habitsTotal && habitsTotal > 0 ? 'success' : 'default'}>
                {habitsCompletedToday}/{habitsTotal}
              </Badge>
            </div>

            {habitsTotal === 0 ? (
              <p className="text-sm text-muted py-4 text-center">
                No habits set up yet.{' '}
                <Link to="/habits" className="text-accent hover:underline">Add habits →</Link>
              </p>
            ) : (
              <div className="space-y-1">
                {data.habits.map((row) => (
                  <button
                    key={row.id}
                    onClick={() => handleHabitCheck(row.id, row.title)}
                    disabled={row.completedToday || completingHabitId === row.id}
                    className={`tap-target flex w-full items-center gap-3 rounded-xl p-3 text-left transition-all ${
                      row.completedToday ? 'opacity-60' : 'hover:bg-surface-hover'
                    }`}
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 text-xs transition-all ${
                      row.completedToday
                        ? 'border-accent bg-accent text-bg'
                        : completingHabitId === row.id
                          ? 'border-accent/50 animate-pulse'
                          : 'border-border'
                    }`}>
                      {row.completedToday && (
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm">{row.icon}</span>
                    <span className={`text-sm font-medium ${row.completedToday ? 'line-through text-muted' : ''}`}>
                      {row.title}
                    </span>
                    {row.streakCount > 0 && (
                      <span className="ml-auto text-xs text-muted-soft">🔥{row.streakCount}</span>
                    )}
                  </button>
                ))}
              </div>
            )}

            <Link
              to="/habits"
              className="mt-3 block text-center text-xs font-medium text-accent hover:underline"
            >
              View all habits →
            </Link>
          </GlassCard>

          {/* Current Course */}
          <GlassCard padding="md">
            <h2 className="font-display text-lg font-bold tracking-tight mb-4">Continue Learning</h2>

            {data.currentCourse ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{data.currentCourse.title}</h3>
                  <p className="text-xs text-muted mt-1 line-clamp-2">
                    {data.currentCourse.description}
                  </p>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-muted-soft mb-1">
                    <span>{data.currentCourse.completedLessons}/{data.currentCourse.totalLessons} lessons</span>
                    <span>
                      {data.currentCourse.totalLessons > 0
                        ? Math.round((data.currentCourse.completedLessons / data.currentCourse.totalLessons) * 100)
                        : 0}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent to-cyan transition-all duration-500"
                      style={{
                        width: `${data.currentCourse.totalLessons > 0
                          ? Math.round((data.currentCourse.completedLessons / data.currentCourse.totalLessons) * 100)
                          : 0}%`
                      }}
                    />
                  </div>
                </div>

                <Link
                  to={`/courses/${data.currentCourse.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-bg transition-all hover:bg-primary-hover hover:shadow-elevated active:scale-[0.97]"
                >
                  {data.currentCourse.completedLessons > 0 ? 'Continue →' : 'Start →'}
                </Link>
              </div>
            ) : (
              <EmptyState
                icon="📚"
                title="No course in progress"
                description="Browse courses to start learning."
                ctaLabel="Browse Courses"
                onCta={() => navigate('/courses')}
              />
            )}
          </GlassCard>
        </div>

      </div>
    </Container>
  );
}
