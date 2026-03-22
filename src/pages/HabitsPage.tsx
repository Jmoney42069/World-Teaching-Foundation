import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Container, EmptyState, GlassCard, Badge, Button } from '../components';
import { HabitRowSkeleton } from '../components/Skeleton';

interface HabitRow {
  id: string;
  title: string;
  icon: string;
  description: string;
  completedToday: boolean;
  streakCount: number;
  bestStreak: number;
  totalCompletions: number;
}

const STORAGE_KEY = 'wtf-habits';

function loadFromStorage(): HabitRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_e) { /* ignore */ }
  return [];
}
function saveToStorage(habits: HabitRow[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

const DEFAULT_HABITS: Omit<HabitRow, 'completedToday' | 'streakCount' | 'bestStreak' | 'totalCompletions'>[] = [
  { id: 'h1', title: 'Read for 20 minutes', icon: '📖', description: 'Books, articles, or documentation' },
  { id: 'h2', title: 'Practice coding', icon: '💻', description: 'Solve a problem or build something' },
  { id: 'h3', title: 'Exercise for 30 minutes', icon: '💪', description: 'Any physical activity counts' },
  { id: 'h4', title: 'Journal or reflect', icon: '✍️', description: 'Write about your day or goals' },
  { id: 'h5', title: 'Learn something new', icon: '🧠', description: 'Watch a tutorial or take a lesson' },
];

export default function HabitsPage() {
  const { profile } = useAuth();
  const toast = useToast();

  const [habits, setHabits] = useState<HabitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  // Add / delete state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newIcon, setNewIcon] = useState('✅');
  const [newDescription, setNewDescription] = useState('');
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHabits = useCallback(async () => {
    let stored = loadFromStorage();
    if (stored.length === 0) {
      stored = DEFAULT_HABITS.map((h) => ({
        ...h,
        completedToday: false,
        streakCount: 0,
        bestStreak: 0,
        totalCompletions: 0,
      }));
      saveToStorage(stored);
    }
    setHabits(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  function persist(updated: HabitRow[]) {
    setHabits(updated);
    saveToStorage(updated);
  }

  async function handleComplete(row: HabitRow) {
    if (!profile || row.completedToday) return;
    setCompletingId(row.id);
    const updated = habits.map((h) =>
      h.id === row.id
        ? {
            ...h,
            completedToday: true,
            streakCount: h.streakCount + 1,
            bestStreak: Math.max(h.bestStreak, h.streakCount + 1),
            totalCompletions: h.totalCompletions + 1,
          }
        : h
    );
    persist(updated);
    toast.success(`+5 XP — ${row.title} ✓`);
    setCompletingId(null);
  }

  const completedCount = habits.filter((h) => h.completedToday).length;
  const totalCount = habits.length;
  const allDone = totalCount > 0 && completedCount === totalCount;

  const bestStreak = habits.reduce((max, h) => Math.max(max, h.bestStreak), 0);
  const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0);

  async function handleAddHabit() {
    if (!profile || !newTitle.trim()) return;
    setAdding(true);
    const newHabit: HabitRow = {
      id: `h-${Date.now()}`,
      title: newTitle.trim(),
      icon: newIcon || '✅',
      description: newDescription.trim(),
      completedToday: false,
      streakCount: 0,
      bestStreak: 0,
      totalCompletions: 0,
    };
    persist([...habits, newHabit]);
    toast.success(`Habit "${newTitle.trim()}" added!`);
    setNewTitle('');
    setNewIcon('✅');
    setNewDescription('');
    setShowAddForm(false);
    setAdding(false);
  }

  async function handleDeleteHabit(habitId: string) {
    if (!profile) return;
    setDeletingId(habitId);
    persist(habits.filter((h) => h.id !== habitId));
    toast.success('Habit removed.');
    setDeletingId(null);
  }

  return (
    <Container size="md">
      <div className="space-y-8 pb-24">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-display font-bold tracking-tight">Daily Habits</h1>
            <p className="mt-1 text-sm text-muted">
              Check off your habits each day. Consistency builds streaks and earns XP.
            </p>
          </div>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-surface text-xl transition-all hover:bg-surface-hover hover:border-accent/30"
            title="Add habit"
          >
            {showAddForm ? '✕' : '+'}
          </button>
        </div>

        {/* Add habit form */}
        {showAddForm && (
          <GlassCard padding="md" className="space-y-4 animate-fade-up">
            <h3 className="text-sm font-semibold">New Habit</h3>
            <div className="flex gap-3 items-start">
              <input
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                maxLength={2}
                className="h-10 w-12 rounded-lg border border-border-subtle bg-bg text-center text-lg focus:border-accent focus:outline-none"
                placeholder="✅"
              />
              <div className="flex-1 space-y-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  maxLength={100}
                  className="h-10 w-full rounded-lg border border-border-subtle bg-bg px-3 text-sm focus:border-accent focus:outline-none"
                  placeholder="Habit name (e.g. Read 20 pages)"
                />
                <input
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  maxLength={200}
                  className="h-10 w-full rounded-lg border border-border-subtle bg-bg px-3 text-xs text-muted focus:border-accent focus:outline-none"
                  placeholder="Short description (optional)"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button size="sm" onClick={handleAddHabit} loading={adding} disabled={!newTitle.trim()}>
                Add Habit
              </Button>
            </div>
          </GlassCard>
        )}

        {/* Stats row */}
        {!loading && habits.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <GlassCard padding="sm" className="text-center">
              <p className="text-2xl font-bold text-accent">{completedCount}/{totalCount}</p>
              <p className="text-xs text-muted">Today</p>
            </GlassCard>
            <GlassCard padding="sm" className="text-center">
              <p className="text-2xl font-bold">{bestStreak}</p>
              <p className="text-xs text-muted">Best Streak</p>
            </GlassCard>
            <GlassCard padding="sm" className="text-center">
              <p className="text-2xl font-bold">{totalCompletions}</p>
              <p className="text-xs text-muted">Total Done</p>
            </GlassCard>
          </div>
        )}

        {/* All done banner */}
        {allDone && (
          <div className="animate-scale-in rounded-2xl border border-accent/20 bg-accent/5 p-4 text-center">
            <span className="text-3xl">🎉</span>
            <p className="mt-2 text-sm font-semibold">All habits done today! Keep it up!</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-border-subtle bg-surface divide-y divide-border-subtle overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <HabitRowSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && habits.length === 0 && (
          <EmptyState
            icon="✅"
            title="No habits yet"
            description="Complete onboarding to set up your daily habits, or add them from your profile."
          />
        )}

        {/* Habit list */}
        {!loading && habits.length > 0 && (
          <div className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-surface overflow-hidden">
            {habits.map((row) => (
              <div key={row.id} className="flex items-center">
                <button
                  onClick={() => handleComplete(row)}
                  disabled={row.completedToday || completingId === row.id}
                  className={`tap-target flex flex-1 items-center gap-4 p-4 text-left transition-all ${
                    row.completedToday
                      ? 'bg-accent/5 opacity-80'
                      : 'hover:bg-surface-hover'
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all ${
                    row.completedToday
                      ? 'border-accent bg-accent text-bg'
                      : completingId === row.id
                        ? 'border-accent/50 animate-pulse'
                        : 'border-border hover:border-accent/50'
                  }`}>
                    {row.completedToday && (
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>

                  {/* Icon + info */}
                  <span className="text-xl">{row.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${row.completedToday ? 'line-through text-muted' : ''}`}>
                      {row.title}
                    </p>
                    <p className="text-xs text-muted-soft">{row.description}</p>
                  </div>

                  {/* Streak */}
                  {row.streakCount > 0 && (
                    <Badge variant={row.streakCount >= 7 ? 'success' : 'default'}>
                      🔥 {row.streakCount}d
                    </Badge>
                  )}
                </button>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteHabit(row.id)}
                  disabled={deletingId === row.id}
                  className="flex h-full items-center px-3 text-muted-soft hover:text-red-400 transition-colors"
                  title="Remove habit"
                >
                  {deletingId === row.id ? (
                    <span className="animate-pulse">…</span>
                  ) : (
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
