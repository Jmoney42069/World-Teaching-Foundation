import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProgressProvider } from "./context/ProgressContext";
import { StreakProvider } from "./context/StreakContext";
import { ThemeProvider } from "./context/ThemeContext";
import { AchievementProvider } from "./context/AchievementContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AchievementToast from "./components/AchievementToast";
import OnboardingTour from "./components/OnboardingTour";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import NewDashboardPage from "./pages/NewDashboardPage";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import HabitsPage from "./pages/HabitsPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFoundPage from "./pages/NotFoundPage";
import BottomNav from "./components/BottomNav";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

/** Auth bypassed for development — all routes render directly */
function ProtectedRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function OnboardingRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
};

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/auth" element={<Page><PublicRoute><AuthPage /></PublicRoute></Page>} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<Page><OnboardingRoute><OnboardingPage /></OnboardingRoute></Page>} />

        {/* Protected app routes */}
        <Route path="/dashboard" element={<Page><ProtectedRoute><NewDashboardPage /></ProtectedRoute></Page>} />
        <Route path="/courses" element={<Page><ProtectedRoute><CourseListPage /></ProtectedRoute></Page>} />
        <Route path="/courses/:courseId" element={<Page><ProtectedRoute><CourseDetailPage /></ProtectedRoute></Page>} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<Page><ProtectedRoute><LessonPage /></ProtectedRoute></Page>} />
        <Route path="/habits" element={<Page><ProtectedRoute><HabitsPage /></ProtectedRoute></Page>} />
        <Route path="/profile" element={<Page><ProtectedRoute><ProfilePage /></ProtectedRoute></Page>} />
        <Route path="/leaderboard" element={<Page><ProtectedRoute><LeaderboardPage /></ProtectedRoute></Page>} />

        {/* Legacy redirects */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/course" element={<Navigate to="/courses" replace />} />
        <Route path="/certificate" element={<Navigate to="/profile" replace />} />

        {/* 404 */}
        <Route path="*" element={<Page><NotFoundPage /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <>
      <AnimatedRoutes />
      <BottomNav />
      <AchievementToast />
      <OnboardingTour />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ProgressProvider>
            <StreakProvider>
              <AchievementProvider>
                <ToastProvider>
                  <BrowserRouter>
                    <AppRoutes />
                  </BrowserRouter>
                </ToastProvider>
              </AchievementProvider>
            </StreakProvider>
          </ProgressProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
