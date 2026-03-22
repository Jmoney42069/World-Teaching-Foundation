import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { useStreak } from "../context/StreakContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { path: ROUTES.DASHBOARD, label: "Home", icon: "🏠" },
  { path: ROUTES.COURSES, label: "Courses", icon: "📚" },
  { path: "/leaderboard", label: "Ranks", icon: "🏆" },
  { path: ROUTES.HABITS, label: "Habits", icon: "✅" },
  { path: ROUTES.PROFILE, label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const streak = useStreak();
  const { theme, toggle } = useTheme();

  // Only show on main app pages (and sub-routes)
  const showPrefixes = [ROUTES.DASHBOARD, ROUTES.COURSES, ROUTES.HABITS, ROUTES.PROFILE, "/leaderboard"];
  const shouldShow = showPrefixes.some((prefix) => location.pathname.startsWith(prefix));
  if (!shouldShow) return null;

  return (
    <>
      {/* Top bar with streak + theme toggle */}
      <div className="fixed inset-x-0 top-0 z-40 border-b border-border glass-strong safe-top">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2">
          <span className="font-display text-sm font-bold text-accent">WTF</span>
          <div className="flex items-center gap-3">
            <div data-tour="streak" className="flex items-center gap-1 text-sm">
              <span className={streak.currentStreak > 0 ? 'animate-pulse-glow rounded-full' : ''}>🔥</span>
              <span className="font-bold">{streak.currentStreak}</span>
            </div>
            <button
              onClick={toggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:text-primary hover:bg-surface-hover transition-all"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass-strong safe-bottom" aria-label="Main navigation">
        <div className="mx-auto flex max-w-lg items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path || (item.path !== ROUTES.DASHBOARD && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                data-tour={item.label.toLowerCase()}
                className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-3 py-2 transition-all duration-200 ${
                  active
                    ? "text-accent"
                    : "text-muted-soft hover:text-primary"
                }`}
              >
                <span className={`text-xl ${active ? "scale-110" : ""} transition-transform duration-200`}>
                  {item.icon}
                </span>
                <span className="text-[10px] font-semibold">{item.label}</span>
                {active && (
                  <div className="h-0.5 w-4 rounded-full bg-accent" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
