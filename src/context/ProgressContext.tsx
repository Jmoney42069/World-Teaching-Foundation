import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { TierLevel } from '../data/courseRegistry';

interface ProgressState {
  completedLessons: Set<string>;
  completedCourses: Set<string>;
  certificates: { courseId: string; courseTitle: string; issuedAt: string; tier: TierLevel }[];
  xpEarned: number;
  /** Tracks which tier the user selected for each course */
  courseTiers: Record<string, TierLevel>;
}

interface ProgressContextValue extends ProgressState {
  completeLesson: (lessonId: string) => void;
  completeCourse: (courseId: string, courseTitle: string, tier: TierLevel) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  isCourseCompleted: (courseId: string) => boolean;
  setCourseTier: (courseId: string, tier: TierLevel) => void;
  getCourseTier: (courseId: string) => TierLevel | undefined;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>({
    completedLessons: new Set(),
    completedCourses: new Set(),
    certificates: [],
    xpEarned: 0,
    courseTiers: {},
  });

  const completeLesson = useCallback((lessonId: string) => {
    setState((prev) => {
      if (prev.completedLessons.has(lessonId)) return prev;
      const next = new Set(prev.completedLessons);
      next.add(lessonId);
      return { ...prev, completedLessons: next, xpEarned: prev.xpEarned + 20 };
    });
  }, []);

  const completeCourse = useCallback((courseId: string, courseTitle: string, tier: TierLevel) => {
    setState((prev) => {
      if (prev.completedCourses.has(courseId)) return prev;
      const next = new Set(prev.completedCourses);
      next.add(courseId);
      return {
        ...prev,
        completedCourses: next,
        xpEarned: prev.xpEarned + 200,
        certificates: [
          ...prev.certificates,
          { courseId, courseTitle, issuedAt: new Date().toISOString(), tier },
        ],
      };
    });
  }, []);

  const setCourseTier = useCallback((courseId: string, tier: TierLevel) => {
    setState((prev) => ({
      ...prev,
      courseTiers: { ...prev.courseTiers, [courseId]: tier },
    }));
  }, []);

  const getCourseTier = useCallback(
    (courseId: string) => state.courseTiers[courseId],
    [state.courseTiers],
  );

  const isLessonCompleted = useCallback(
    (lessonId: string) => state.completedLessons.has(lessonId),
    [state.completedLessons],
  );

  const isCourseCompleted = useCallback(
    (courseId: string) => state.completedCourses.has(courseId),
    [state.completedCourses],
  );

  return (
    <ProgressContext.Provider
      value={{ ...state, completeLesson, completeCourse, isLessonCompleted, isCourseCompleted, setCourseTier, getCourseTier }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}
