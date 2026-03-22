import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Path } from '../lib/database.types';
import { Container, Badge, EmptyState, CourseCardSkeleton } from '../components';
import { getPathMatchScore } from '../lib/recommendations';
import type { Category } from '../data/profileData';
import { useProgress } from '../context/ProgressContext';
import { getAllCourses, getCoursePath, getCourseLessonIds } from '../data/courseRegistry';

interface CourseDisplay {
  id: string;
  title: string;
  description: string;
  path_id: string;
  order_index: number;
  duration_minutes: number;
  created_at: string;
  totalLessons: number;
  completedLessons: number;
  path?: Path;
}

export default function CourseListPage() {
  const { profile } = useAuth();
  const progress = useProgress();
  const [courses, setCourses] = useState<CourseDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'my-path' | 'all' | 'recommended'>('my-path');

  const quizProfile = profile?.quiz_profile as Category | undefined;

  useEffect(() => {
    if (!profile) return;
    loadCourses();
  }, [profile, filter, progress.completedLessons]);

  async function loadCourses() {
    setLoading(true);

    const registryCourses = getAllCourses();
    const mapped: CourseDisplay[] = registryCourses.map((c) => {
      const lessonIds = getCourseLessonIds(c.id);
      const completedCount = lessonIds.filter((id) => progress.isLessonCompleted(id)).length;
      const path = getCoursePath(c.path_id) ?? undefined;
      return {
        id: c.id,
        title: c.title,
        description: c.description,
        path_id: c.path_id,
        order_index: c.order_index,
        duration_minutes: c.duration_minutes,
        created_at: c.created_at,
        totalLessons: lessonIds.length,
        completedLessons: completedCount,
        path,
      };
    });

    setCourses(mapped);
    setLoading(false);
  }

  function getStatus(c: CourseDisplay) {
    if (c.totalLessons === 0) return 'empty';
    if (c.completedLessons === c.totalLessons) return 'completed';
    if (c.completedLessons > 0) return 'in-progress';
    return 'not-started';
  }

  return (
    <Container size="lg">
      <div className="space-y-8 pb-24">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-display font-bold tracking-tight">Courses</h1>
            <p className="mt-1 text-sm text-muted">
              Complete courses to earn XP, certificates, and medals.
            </p>
          </div>

          {/* Filter toggle */}
          <div className="flex rounded-xl border border-border bg-surface p-1">
            {([
              { key: 'my-path' as const, label: 'My Path' },
              ...(quizProfile ? [{ key: 'recommended' as const, label: 'Recommended' }] : []),
              { key: 'all' as const, label: 'All Courses' },
            ]).map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
                  filter === f.key
                    ? 'bg-accent text-bg shadow-sm'
                    : 'text-muted hover:text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && courses.length === 0 && (
          <EmptyState
            icon="📚"
            title="No courses found"
            description={
              filter === 'my-path'
                ? 'No courses available for your path yet. Try viewing all courses.'
                : 'No courses available yet. Check back soon!'
            }
            ctaLabel={filter === 'my-path' ? 'View All Courses' : undefined}
            onCta={filter === 'my-path' ? () => setFilter('all') : undefined}
          />
        )}

        {/* Course grid */}
        {!loading && courses.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[...courses]
              .sort((a, b) => {
                if (filter !== 'recommended' || !quizProfile) return 0;
                const scoreA = a.path ? getPathMatchScore(a.path.title, quizProfile) : 0;
                const scoreB = b.path ? getPathMatchScore(b.path.title, quizProfile) : 0;
                return scoreB - scoreA;
              })
              .map((course) => {
              const status = getStatus(course);
              const progress = course.totalLessons > 0
                ? Math.round((course.completedLessons / course.totalLessons) * 100)
                : 0;
              const matchScore = quizProfile && course.path
                ? getPathMatchScore(course.path.title, quizProfile)
                : null;

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="group rounded-2xl border border-border-subtle bg-surface p-6 transition-all duration-200 hover:border-accent/30 hover:shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {course.path && (
                          <span className="text-xs" style={{ color: course.path.color }}>
                            {course.path.icon} {course.path.title}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-base font-bold tracking-tight group-hover:text-accent transition-colors">
                        {course.title}
                      </h3>
                      {matchScore !== null && matchScore >= 70 && (
                        <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[10px] font-bold text-accent">
                          {matchScore}% match
                        </span>
                      )}
                      <p className="mt-1 text-xs text-muted line-clamp-2">
                        {course.description}
                      </p>
                    </div>

                    <Badge
                      variant={status === 'completed' ? 'success' : 'default'}
                    >
                      {status === 'completed' && '✓ Done'}
                      {status === 'in-progress' && `${progress}%`}
                      {status === 'not-started' && 'New'}
                      {status === 'empty' && '—'}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-muted-soft mb-1.5">
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                      <span>{course.duration_minutes} min</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          status === 'completed'
                            ? 'bg-accent'
                            : 'bg-gradient-to-r from-accent to-cyan'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Container>
  );
}
