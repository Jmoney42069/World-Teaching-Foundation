import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  todayActive: boolean;
}

interface StreakContextValue extends StreakState {
  recordActivity: () => void;
}

const StreakContext = createContext<StreakContextValue | null>(null);

const STORAGE_KEY = 'wtf-streak';

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadStreak(): StreakState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { currentStreak: 0, longestStreak: 0, lastActiveDate: null, todayActive: false };
}

function saveStreak(state: StreakState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StreakState>(() => {
    const saved = loadStreak();
    const today = getToday();
    // Check if streak is still alive
    if (saved.lastActiveDate) {
      const last = new Date(saved.lastActiveDate);
      const now = new Date(today);
      const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays > 1) {
        // Streak broken
        return { ...saved, currentStreak: 0, todayActive: false };
      }
      if (diffDays === 0) {
        return { ...saved, todayActive: true };
      }
      // diffDays === 1: streak continues but today not yet active
      return { ...saved, todayActive: false };
    }
    return saved;
  });

  useEffect(() => {
    saveStreak(state);
  }, [state]);

  const recordActivity = useCallback(() => {
    setState((prev) => {
      if (prev.todayActive) return prev;
      const today = getToday();
      const newStreak = prev.currentStreak + 1;
      const longest = Math.max(prev.longestStreak, newStreak);
      return {
        currentStreak: newStreak,
        longestStreak: longest,
        lastActiveDate: today,
        todayActive: true,
      };
    });
  }, []);

  return (
    <StreakContext.Provider value={{ ...state, recordActivity }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const ctx = useContext(StreakContext);
  if (!ctx) throw new Error('useStreak must be used within StreakProvider');
  return ctx;
}
