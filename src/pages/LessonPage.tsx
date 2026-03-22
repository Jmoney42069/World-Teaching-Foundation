import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import type { Lesson, QuizQuestion, Course } from '../lib/database.types';
import { Container, Button, EmptyState, GlassCard } from '../components';
import { Skeleton } from '../components/Skeleton';
import { useProgress } from '../context/ProgressContext';
import { getCourse } from '../data/courseRegistry';
import { useStreak } from '../context/StreakContext';

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const progress = useProgress();
  const streak = useStreak();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Reflection state
  const [reflectionText, setReflectionText] = useState('');

  // Completion
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    if (!courseId || !lessonId || !profile) return;
    loadLesson();
  }, [courseId, lessonId, profile]);

  async function loadLesson() {
    setLoading(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setReflectionText('');

    // Load from course registry
    const registryCourse = courseId ? getCourse(courseId) : undefined;
    if (!registryCourse) {
      setLesson(null);
      setCourse(null);
      setLoading(false);
      return;
    }

    const found = registryCourse.lessons.find((l) => l.id === lessonId) ?? registryCourse.lessons[0];
    setLesson(found);
    setCourse(registryCourse);
    setAllLessons(registryCourse.lessons);
    setAlreadyCompleted(progress.isLessonCompleted(found.id));
    setLoading(false);
  }

  const questions: QuizQuestion[] = (lesson?.quiz_data as QuizQuestion[]) ?? [];

  function selectAnswer(qIdx: number, optIdx: number) {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  }

  const quizScore = quizSubmitted
    ? questions.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct_index ? 1 : 0), 0)
    : 0;
  const quizPercent = questions.length > 0 ? Math.round((quizScore / questions.length) * 100) : 0;
  const allAnswered = questions.length > 0 && Object.keys(quizAnswers).length === questions.length;

  // Find current lesson index and next lesson
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1
    ? allLessons[currentIndex + 1]
    : null;
  const isLastLesson = currentIndex === allLessons.length - 1;

  const handleComplete = useCallback(async () => {
    if (!profile || !lesson || !courseId) return;
    setCompleting(true);

    try {
      // For quiz lessons, submit quiz first
      if (lesson.type === 'quiz' && !quizSubmitted) {
        setQuizSubmitted(true);
        setCompleting(false);
        return;
      }

      // Mark lesson completed in progress context
      progress.completeLesson(lesson.id);
      streak.recordActivity();
      toast.success('+20 XP — Lesson complete! ⚡');
      setAlreadyCompleted(true);

      // Check if this was the last lesson → complete the course
      const isLast = currentIndex === allLessons.length - 1;
      const allOthersDone = allLessons.every(
        (l) => l.id === lesson.id || progress.isLessonCompleted(l.id)
      );
      if (isLast || allOthersDone) {
        progress.completeCourse(courseId, course?.title ?? 'Course');
        toast.success(`🎓 Course completed! Certificate earned! +200 XP`);
      }

      // Navigate to next lesson or back to course
      if (nextLesson && !progress.isLessonCompleted(nextLesson.id)) {
        navigate(`/courses/${courseId}/lessons/${nextLesson.id}`, { replace: true });
      } else {
        navigate(`/courses/${courseId}`, { replace: true });
      }
    } catch (_err) {
      toast.error('Failed to complete lesson. Please try again.');
    } finally {
      setCompleting(false);
    }
  }, [profile, lesson, courseId, course, quizSubmitted, nextLesson, currentIndex, allLessons, navigate, toast, progress, streak]);

  if (loading) {
    return (
      <Container size="md">
        <div className="space-y-6 pb-24 pt-4">
          <Skeleton width="30%" height="14px" />
          <Skeleton width="80%" height="32px" />
          <Skeleton width="100%" height="200px" rounded="lg" />
        </div>
      </Container>
    );
  }

  if (!lesson || !course) {
    return (
      <Container size="md">
        <EmptyState
          icon="📖"
          title="Lesson not found"
          description="This lesson doesn't exist or has been removed."
          ctaLabel="Back to Course"
          onCta={() => navigate(`/courses/${courseId}`)}
        />
      </Container>
    );
  }

  return (
    <Container size="md">
      <div className="space-y-8 pb-24">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-muted-soft">
          <Link to="/courses" className="hover:text-accent transition-colors">Courses</Link>
          <span>/</span>
          <Link to={`/courses/${courseId}`} className="hover:text-accent transition-colors">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-primary font-medium">{lesson.title}</span>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center gap-2">
          {allLessons.map((l, i) => (
            <div
              key={l.id}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                l.id === lessonId
                  ? 'bg-accent'
                  : i < currentIndex
                    ? 'bg-accent/50'
                    : 'bg-border'
              }`}
            />
          ))}
        </div>

        {/* Lesson header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-soft">
            Lesson {currentIndex + 1} of {allLessons.length}
          </span>
          <h1 className="font-display text-2xl font-bold tracking-tight mt-1">
            {lesson.title}
          </h1>
        </div>

        {/* Content */}
        {lesson.type === 'text' && (
          <div className="prose prose-sm max-w-none">
            <div
              className="text-sm leading-relaxed text-muted whitespace-pre-line"
              style={{ lineHeight: '1.8' }}
            >
              {lesson.content}
            </div>
          </div>
        )}

        {/* Quiz */}
        {lesson.type === 'quiz' && (
          <div className="space-y-6">
            <div className="text-sm leading-relaxed text-muted whitespace-pre-line mb-6">
              {lesson.content}
            </div>

            {quizSubmitted && (
              <GlassCard padding="md" className={`text-center ${quizPercent === 100 ? 'border-accent/30' : quizPercent >= 50 ? 'border-warning/30' : 'border-error/30'}`}>
                <p className="text-3xl font-bold mb-1">{quizPercent}%</p>
                <p className="text-sm text-muted">
                  {quizScore}/{questions.length} correct
                  {quizPercent === 100 && ' — Perfect score! 🎯'}
                  {quizPercent >= 50 && quizPercent < 100 && ' — Good job!'}
                  {quizPercent < 50 && ' — Keep learning!'}
                </p>
              </GlassCard>
            )}

            {questions.map((q, qIdx) => (
              <div key={qIdx} className="space-y-3">
                <p className="text-sm font-semibold">
                  {qIdx + 1}. {q.question}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = quizAnswers[qIdx] === oIdx;
                    const isCorrect = q.correct_index === oIdx;
                    let borderColor = 'border-border-subtle';
                    let bgColor = 'bg-surface';

                    if (quizSubmitted) {
                      if (isCorrect) {
                        borderColor = 'border-accent/50';
                        bgColor = 'bg-accent/10';
                      } else if (isSelected && !isCorrect) {
                        borderColor = 'border-error/50';
                        bgColor = 'bg-error/10';
                      }
                    } else if (isSelected) {
                      borderColor = 'border-accent/50';
                      bgColor = 'bg-accent/5';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => selectAnswer(qIdx, oIdx)}
                        disabled={quizSubmitted}
                        className={`tap-target flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition-all ${borderColor} ${bgColor} ${
                          quizSubmitted ? '' : 'hover:border-accent/30 hover:bg-surface-hover'
                        }`}
                      >
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                          isSelected ? 'border-accent bg-accent text-bg' : 'border-border'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <span className="ml-auto text-accent">✓</span>}
                        {quizSubmitted && isSelected && !isCorrect && <span className="ml-auto text-error">✗</span>}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="text-xs text-muted italic pl-9">
                    {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reflection */}
        {lesson.type === 'reflection' && (
          <div className="space-y-4">
            <div className="text-sm leading-relaxed text-muted whitespace-pre-line mb-4">
              {lesson.content}
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Your Reflection</label>
              <textarea
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                placeholder="Take a moment to reflect..."
                rows={6}
                disabled={alreadyCompleted}
                className="w-full rounded-xl border border-border bg-surface p-4 text-sm text-primary placeholder:text-muted-soft focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all resize-none"
              />
              {!alreadyCompleted && (
                <p className="mt-1 text-xs text-muted-soft">
                  {reflectionText.length > 0 ? `${reflectionText.length} characters` : 'Write at least a few words to complete this lesson.'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-4 border-t border-border-subtle">
          <Button
            variant="ghost"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            ← Back
          </Button>

          {!alreadyCompleted && (
            <Button
              onClick={handleComplete}
              loading={completing}
              fullWidth
              size="lg"
              disabled={
                (lesson.type === 'quiz' && !quizSubmitted && !allAnswered) ||
                (lesson.type === 'reflection' && reflectionText.trim().length < 10)
              }
            >
              {lesson.type === 'quiz' && !quizSubmitted && 'Submit Quiz'}
              {lesson.type === 'quiz' && quizSubmitted && (nextLesson ? 'Next Lesson →' : 'Finish Course 🎓')}
              {lesson.type !== 'quiz' && (nextLesson ? 'Complete & Continue →' : 'Complete Lesson 🎓')}
            </Button>
          )}

          {alreadyCompleted && nextLesson && (
            <Button
              onClick={() => navigate(`/courses/${courseId}/lessons/${nextLesson.id}`)}
              fullWidth
              size="lg"
            >
              Next Lesson →
            </Button>
          )}

          {alreadyCompleted && isLastLesson && (
            <Button
              onClick={() => navigate(`/courses/${courseId}`)}
              fullWidth
              size="lg"
            >
              Back to Course ✓
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
