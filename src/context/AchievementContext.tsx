import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useProgress } from './ProgressContext';
import { useStreak } from './StreakContext';

export interface Badge {
  id: string;
  icon: string;
  title: string;
  description: string;
  condition: string; // human-readable
}

const BADGES: Badge[] = [
  { id: 'first-lesson', icon: '📖', title: 'First Steps', description: 'Complete your first lesson', condition: 'lessons >= 1' },
  { id: '5-lessons', icon: '📚', title: 'Bookworm', description: 'Complete 5 lessons', condition: 'lessons >= 5' },
  { id: '10-lessons', icon: '🎓', title: 'Scholar', description: 'Complete 10 lessons', condition: 'lessons >= 10' },
  { id: '20-lessons', icon: '🏆', title: 'Master Learner', description: 'Complete 20 lessons', condition: 'lessons >= 20' },
  { id: 'first-course', icon: '🥇', title: 'Course Clear', description: 'Complete your first course', condition: 'courses >= 1' },
  { id: '3-courses', icon: '💎', title: 'Triple Threat', description: 'Complete 3 courses', condition: 'courses >= 3' },
  { id: 'all-courses', icon: '👑', title: 'WTF Legend', description: 'Complete all 4 courses', condition: 'courses >= 4' },
  { id: 'streak-3', icon: '🔥', title: 'On Fire', description: '3-day streak', condition: 'streak >= 3' },
  { id: 'streak-7', icon: '⚡', title: 'Unstoppable', description: '7-day streak', condition: 'streak >= 7' },
  { id: 'streak-30', icon: '🌟', title: 'Legendary', description: '30-day streak', condition: 'streak >= 30' },
  { id: 'xp-500', icon: '💰', title: 'XP Hunter', description: 'Earn 500 XP', condition: 'xp >= 500' },
  { id: 'xp-1000', icon: '🚀', title: 'XP Machine', description: 'Earn 1,000 XP', condition: 'xp >= 1000' },
];

interface AchievementState {
  unlockedIds: Set<string>;
  newlyUnlocked: Badge | null;
}

interface AchievementContextValue {
  badges: Badge[];
  unlockedIds: Set<string>;
  isUnlocked: (id: string) => boolean;
  newlyUnlocked: Badge | null;
  dismissNew: () => void;
}

const AchievementContext = createContext<AchievementContextValue | null>(null);

const STORAGE_KEY = 'wtf-achievements';

function loadUnlocked(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch { /* ignore */ }
  return new Set();
}

function saveUnlocked(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function AchievementProvider({ children }: { children: ReactNode }) {
  const progress = useProgress();
  const streak = useStreak();

  const [state, setState] = useState<AchievementState>({
    unlockedIds: loadUnlocked(),
    newlyUnlocked: null,
  });

  // Check for new achievements whenever progress/streak changes
  useEffect(() => {
    const lessons = progress.completedLessons.size;
    const courses = progress.completedCourses.size;
    const xp = progress.xpEarned;
    const streakDays = streak.currentStreak;

    setState((prev) => {
      let changed = false;
      const next = new Set(prev.unlockedIds);
      let newBadge: Badge | null = null;

      for (const badge of BADGES) {
        if (next.has(badge.id)) continue;

        let earned = false;
        if (badge.id === 'first-lesson' && lessons >= 1) earned = true;
        if (badge.id === '5-lessons' && lessons >= 5) earned = true;
        if (badge.id === '10-lessons' && lessons >= 10) earned = true;
        if (badge.id === '20-lessons' && lessons >= 20) earned = true;
        if (badge.id === 'first-course' && courses >= 1) earned = true;
        if (badge.id === '3-courses' && courses >= 3) earned = true;
        if (badge.id === 'all-courses' && courses >= 4) earned = true;
        if (badge.id === 'streak-3' && streakDays >= 3) earned = true;
        if (badge.id === 'streak-7' && streakDays >= 7) earned = true;
        if (badge.id === 'streak-30' && streakDays >= 30) earned = true;
        if (badge.id === 'xp-500' && xp >= 500) earned = true;
        if (badge.id === 'xp-1000' && xp >= 1000) earned = true;

        if (earned) {
          next.add(badge.id);
          newBadge = badge;
          changed = true;
        }
      }

      if (!changed) return prev;
      saveUnlocked(next);
      return { unlockedIds: next, newlyUnlocked: newBadge };
    });
  }, [progress.completedLessons.size, progress.completedCourses.size, progress.xpEarned, streak.currentStreak]);

  const isUnlocked = useCallback((id: string) => state.unlockedIds.has(id), [state.unlockedIds]);

  const dismissNew = useCallback(() => {
    setState((prev) => ({ ...prev, newlyUnlocked: null }));
  }, []);

  return (
    <AchievementContext.Provider
      value={{ badges: BADGES, unlockedIds: state.unlockedIds, isUnlocked, newlyUnlocked: state.newlyUnlocked, dismissNew }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const ctx = useContext(AchievementContext);
  if (!ctx) throw new Error('useAchievements must be used within AchievementProvider');
  return ctx;
}
