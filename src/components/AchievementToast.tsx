import { useEffect } from 'react';
import { useAchievements } from '../context/AchievementContext';

export default function AchievementToast() {
  const { newlyUnlocked, dismissNew } = useAchievements();

  useEffect(() => {
    if (!newlyUnlocked) return;
    const timeout = setTimeout(dismissNew, 4000);
    return () => clearTimeout(timeout);
  }, [newlyUnlocked, dismissNew]);

  if (!newlyUnlocked) return null;

  return (
    <div className="fixed top-4 left-1/2 z-[60] -translate-x-1/2 animate-fade-up">
      <div className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-surface px-5 py-3 shadow-elevated">
        <span className="text-3xl animate-float">{newlyUnlocked.icon}</span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-accent">Badge Unlocked!</p>
          <p className="text-sm font-bold">{newlyUnlocked.title}</p>
          <p className="text-xs text-muted">{newlyUnlocked.description}</p>
        </div>
        <button onClick={dismissNew} className="ml-2 text-muted hover:text-primary text-lg">✕</button>
      </div>
    </div>
  );
}
