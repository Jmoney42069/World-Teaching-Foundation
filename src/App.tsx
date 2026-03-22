import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ProgressProvider } from "./context/ProgressContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import NewDashboardPage from "./pages/NewDashboardPage";
import CourseListPage from "./pages/CourseListPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonPage from "./pages/LessonPage";
import HabitsPage from "./pages/HabitsPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import BottomNav from "./components/BottomNav";
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

function AppRoutes() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<OnboardingRoute><OnboardingPage /></OnboardingRoute>} />

        {/* Protected app routes */}
        <Route path="/dashboard" element={<ProtectedRoute><NewDashboardPage /></ProtectedRoute>} />
        <Route path="/courses" element={<ProtectedRoute><CourseListPage /></ProtectedRoute>} />
        <Route path="/courses/:courseId" element={<ProtectedRoute><CourseDetailPage /></ProtectedRoute>} />
        <Route path="/courses/:courseId/lessons/:lessonId" element={<ProtectedRoute><LessonPage /></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        {/* Legacy redirects */}
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/course" element={<Navigate to="/courses" replace />} />
        <Route path="/certificate" element={<Navigate to="/profile" replace />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProgressProvider>
          <ToastProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ToastProvider>
        </ProgressProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
