import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

const navItems = [
  { path: ROUTES.DASHBOARD, label: "Home", icon: "🏠" },
  { path: ROUTES.COURSES, label: "Courses", icon: "📚" },
  { path: ROUTES.HABITS, label: "Habits", icon: "✅" },
  { path: ROUTES.PROFILE, label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Only show on main app pages (and sub-routes)
  const showPrefixes = [ROUTES.DASHBOARD, ROUTES.COURSES, ROUTES.HABITS, ROUTES.PROFILE];
  const shouldShow = showPrefixes.some((prefix) => location.pathname.startsWith(prefix));
  if (!shouldShow) return null;

  return (
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
              className={`flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-xl px-4 py-2 transition-all duration-200 ${
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
  );
}
