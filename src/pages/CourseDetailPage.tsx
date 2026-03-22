import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Lesson, Path } from '../lib/database.types';
import { Container, Button, Badge, EmptyState } from '../components';
import { Skeleton } from '../components/Skeleton';
import { useProgress } from '../context/ProgressContext';
import { getCourse, getCoursePath, TIER_META, type RegistryCourse, type TierLevel } from '../data/courseRegistry';
import { useCertificateDownload, type CertificateProps } from '../components/CertificateDownload';
import CertificateModal from '../components/CertificateModal';

interface LessonWithProgress extends Lesson {
  completed: boolean;
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const progressCtx = useProgress();

  const [course, setCourse] = useState<RegistryCourse | null>(null);
  const [path, setPath] = useState<Path | null>(null);
  const [lessons, setLessons] = useState<LessonWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseCompleted, setCourseCompleted] = useState(false);
  const { download: downloadCert } = useCertificateDownload();
  const [certModal, setCertModal] = useState<CertificateProps | null>(null);
  const [selectedTier, setSelectedTier] = useState<TierLevel>('beginner');

  useEffect(() => {
    if (!courseId || !profile) return;
    loadCourse();
  }, [courseId, profile, progressCtx.completedLessons, progressCtx.completedCourses, selectedTier]);

  // Restore previously chosen tier
  useEffect(() => {
    if (!courseId) return;
    const saved = progressCtx.getCourseTier(courseId);
    if (saved) setSelectedTier(saved);
  }, [courseId]);

  async function loadCourse() {
    setLoading(true);

    const registryCourse = courseId ? getCourse(courseId) : undefined;
    if (!registryCourse) {
      setCourse(null);
      setLoading(false);
      return;
    }

    setCourse(registryCourse);
    setPath(getCoursePath(registryCourse.path_id) ?? null);
    const tierLessons = registryCourse.tiers[selectedTier].lessons;
    setLessons(tierLessons.map((l) => ({ ...l, completed: progressCtx.isLessonCompleted(l.id) })));
    setCourseCompleted(progressCtx.isCourseCompleted(courseId!));
    setLoading(false);
  }

  function handleTierChange(tier: TierLevel) {
    setSelectedTier(tier);
    if (courseId) progressCtx.setCourseTier(courseId, tier);
  }

  const completedCount = lessons.filter((l) => l.completed).length;
  const progress = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0;

  // Find next unfinished lesson
  const nextLesson = lessons.find((l) => !l.completed);

  if (loading) {
    return (
      <Container size="md">
        <div className="space-y-6 pb-24">
          <Skeleton width="40%" height="32px" />
          <Skeleton width="100%" height="12px" />
          <Skeleton width="100%" height="8px" rounded="full" />
          <div className="space-y-3 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} width="100%" height="64px" rounded="lg" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container size="md">
        <EmptyState
          icon="📚"
          title="Course not found"
          description="This course doesn't exist or has been removed."
          ctaLabel="Browse Courses"
          onCta={() => navigate('/courses')}
        />
      </Container>
    );
  }

  return (
    <Container size="md">
      <div className="space-y-8 pb-24">
        {/* Back link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-accent transition-colors"
        >
          ← Back to Courses
        </Link>

        {/* Course header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {path && (
              <Badge>
                {path.icon} {path.title}
              </Badge>
            )}
            {courseCompleted && <Badge variant="success">✓ Completed</Badge>}
          </div>

          <h1 className="font-display text-display font-bold tracking-tight">
            {course.title}
          </h1>
          <p className="text-sm text-muted leading-relaxed">{course.description}</p>

          {/* Tier selector */}
          <div className="grid grid-cols-3 gap-3">
            {(['beginner', 'medium', 'advanced'] as TierLevel[]).map((t) => {
              const meta = TIER_META[t];
              const tierInfo = course.tiers[t];
              const isActive = selectedTier === t;
              return (
                <button
                  key={t}
                  onClick={() => handleTierChange(t)}
                  className={`relative rounded-xl border p-4 text-left transition-all ${
                    isActive
                      ? 'border-accent bg-accent/10 shadow-sm'
                      : 'border-border-subtle bg-surface hover:border-accent/30 hover:bg-surface-hover'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider">{meta.label}</span>
                    <span className={`text-xs font-bold ${meta.price === 0 ? 'text-accent' : 'text-primary'}`}>
                      {meta.priceLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted line-clamp-2">{tierInfo.description}</p>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-soft">
                    <span>⏱ {meta.duration}</span>
                    <span>• {tierInfo.lessons.length} lessons</span>
                  </div>
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] text-bg font-bold">✓</div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-soft">
            <span>{lessons.length} lessons</span>
            <span>•</span>
            <span>{course.duration_minutes} min</span>
            <span>•</span>
            <span>{completedCount}/{lessons.length} completed</span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-muted-soft mb-1.5">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  courseCompleted
                    ? 'bg-accent'
                    : 'bg-gradient-to-r from-accent to-cyan'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Continue button */}
        {nextLesson && !courseCompleted && (
          <Button
            onClick={() => navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
            size="lg"
            fullWidth
          >
            {completedCount > 0 ? 'Continue Course →' : 'Start Course →'}
          </Button>
        )}

        {courseCompleted && (
          <div className="rounded-2xl border border-accent/20 bg-accent/5 p-6 text-center space-y-3">
            <span className="text-3xl">🎉</span>
            <p className="text-sm font-semibold">
              Course completed! Certificate earned.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  const certTier = progressCtx.certificates.find(c => c.courseId === courseId)?.tier ?? selectedTier;
                  setCertModal({
                    studentName: profile?.display_name ?? 'Student',
                    courseTitle: course?.title ?? 'Course',
                    issuedAt: new Date().toISOString(),
                    credentialId: `WTF-${courseId?.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
                    tier: certTier,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-border-subtle bg-surface px-5 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-surface-hover hover:border-accent/30 active:scale-95"
              >
                🔍 View Certificate
              </button>
              <button
                onClick={() => {
                  const certTier = progressCtx.certificates.find(c => c.courseId === courseId)?.tier ?? selectedTier;
                  downloadCert({
                    studentName: profile?.display_name ?? 'Student',
                    courseTitle: course?.title ?? 'Course',
                    issuedAt: new Date().toISOString(),
                    credentialId: `WTF-${courseId?.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
                    tier: certTier,
                  });
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-accent transition-all hover:bg-accent/20 hover:border-accent/50 active:scale-95"
              >
                ⬇ Download Certificate
              </button>
            </div>
            <Link
              to="/profile"
              className="mt-1 inline-block text-xs font-medium text-muted-soft hover:text-accent transition-colors"
            >
              View all certificates →
            </Link>
          </div>
        )}

        {/* Lesson list */}
        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold tracking-tight">Lessons</h2>

          {lessons.length === 0 && (
            <p className="text-sm text-muted py-4">No lessons added yet. Check back soon.</p>
          )}

          <div className="divide-y divide-border-subtle rounded-2xl border border-border-subtle bg-surface overflow-hidden">
            {lessons.map((lesson, idx) => {
              const isLocked = idx > 0 && !lessons[idx - 1].completed && !lesson.completed;
              const isNext = !lesson.completed && !isLocked && (idx === 0 || lessons[idx - 1].completed);

              return (
                <Link
                  key={lesson.id}
                  to={isLocked ? '#' : `/courses/${courseId}/lessons/${lesson.id}`}
                  className={`tap-target flex items-center gap-4 p-4 transition-all ${
                    isLocked
                      ? 'cursor-not-allowed opacity-50'
                      : 'hover:bg-surface-hover'
                  } ${isNext ? 'bg-accent/5' : ''}`}
                  onClick={(e) => {
                    if (isLocked) e.preventDefault();
                  }}
                >
                  {/* Status icon */}
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    lesson.completed
                      ? 'bg-accent text-bg'
                      : isLocked
                        ? 'border border-border text-muted-soft'
                        : 'border-2 border-accent text-accent'
                  }`}>
                    {lesson.completed ? '✓' : isLocked ? '🔒' : idx + 1}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{lesson.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant={
                        lesson.type === 'quiz' ? 'success' : lesson.type === 'reflection' ? 'default' : 'default'
                      }>
                        {lesson.type === 'quiz' && '🧠 Quiz'}
                        {lesson.type === 'reflection' && '✍️ Reflection'}
                        {lesson.type === 'text' && '📖 Read'}
                      </Badge>
                    </div>
                  </div>

                  {/* Arrow */}
                  {!isLocked && (
                    <span className="text-muted-soft group-hover:text-accent">→</span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        open={certModal !== null}
        onClose={() => setCertModal(null)}
        props={certModal}
      />
    </Container>
  );
}
