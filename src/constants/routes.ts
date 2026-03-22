export const ROUTES = {
  AUTH: "/auth",
  ONBOARDING: "/onboarding",
  DASHBOARD: "/dashboard",
  COURSES: "/courses",
  HABITS: "/habits",
  PROFILE: "/profile",
  // Legacy (kept for backwards compat, redirect in App.tsx)
  LOGIN: "/",
  INTRO: "/intro",
  QUIZ: "/quiz",
  RESULT: "/result",
  COURSE: "/course",
  CERTIFICATE: "/certificate",
} as const;
