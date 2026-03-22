import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getLevelInfo, type Path, type Certificate, type Course } from '../lib/database.types';
import { Container, Button, GlassCard, Badge, ProgressRing, EmptyState, Input } from '../components';
import { Skeleton } from '../components/Skeleton';
import { useProgress } from '../context/ProgressContext';
import { useCertificateDownload, type CertificateProps } from '../components/CertificateDownload';
import CertificateModal from '../components/CertificateModal';
import { useAchievements } from '../context/AchievementContext';
import { TIER_META } from '../data/courseRegistry';

interface CertificateWithCourse extends Certificate {
  course?: Course;
}

export default function ProfilePage() {
  const { profile, updateProfile, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const progress = useProgress();

  const [paths, setPaths] = useState<Path[]>([]);
  const [certificates, setCertificates] = useState<CertificateWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [saving, setSaving] = useState(false);
  const { download: downloadCert } = useCertificateDownload();
  const { badges, isUnlocked } = useAchievements();
  const [certModal, setCertModal] = useState<CertificateProps | null>(null);

  useEffect(() => {
    if (!profile) return;
    loadProfile();
  }, [profile?.id, progress.certificates.length]);

  async function loadProfile() {
    if (!profile) return;
    setLoading(true);

    // Mock data for dev/test mode
    setPaths([
      { id: 'p1', title: 'Career Accelerator', description: 'Fast-track your professional growth.', icon: '🚀', color: '#6366f1', created_at: '' },
      { id: 'p2', title: 'Financial Freedom', description: 'Master money management.', icon: '💰', color: '#22c55e', created_at: '' },
      { id: 'p3', title: 'Peak Health', description: 'Optimize your body and energy.', icon: '💪', color: '#ef4444', created_at: '' },
      { id: 'p4', title: 'Mindset Mastery', description: 'Build mental resilience.', icon: '🧠', color: '#a855f7', created_at: '' },
      { id: 'p5', title: 'Entrepreneurship', description: 'Turn ideas into business.', icon: '💡', color: '#f59e0b', created_at: '' },
    ]);
    setCertificates(
      progress.certificates.map((c) => ({
        id: `cert-${c.courseId}`,
        user_id: profile.id,
        course_id: c.courseId,
        issued_at: c.issuedAt,
        credential_id: `WTF-${c.courseId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
        course: { id: c.courseId, title: c.courseTitle, description: '', path_id: '', order_index: 0, duration_minutes: 0, prerequisite_course_id: null, created_at: '' },
      }))
    );
    setLoading(false);
  }

  async function handleNameSave() {
    if (!newName.trim() || newName.trim().length < 2) {
      toast.error('Name must be at least 2 characters.');
      return;
    }
    setSaving(true);
    await updateProfile({ display_name: newName.trim() });
    setEditingName(false);
    toast.success('Name updated!');
    setSaving(false);
  }

  async function handlePathSwitch(pathId: string) {
    await updateProfile({ path_id: pathId });
    toast.success('Path switched!');
  }

  async function handleSignOut() {
    await signOut();
    navigate('/auth');
  }

  if (!profile) return null;

  const levelInfo = getLevelInfo(profile.xp);
  const currentPath = paths.find((p) => p.id === profile.path_id);

  return (
    <Container size="md">
      <div className="space-y-8 pb-24">
        {/* Profile header */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Avatar */}
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-accent/20 to-cyan/20 text-4xl shadow-glow">
            {profile.display_name.charAt(0).toUpperCase()}
          </div>

          {/* Name */}
          <div className="space-y-1">
            {editingName ? (
              <div className="flex items-center gap-2">
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Your name"
                  className="min-w-[200px]"
                  autoFocus
                />
                <Button size="sm" onClick={handleNameSave} loading={saving}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingName(false)}>Cancel</Button>
              </div>
            ) : (
              <button
                onClick={() => { setNewName(profile.display_name); setEditingName(true); }}
                className="group"
              >
                <h1 className="font-display text-2xl font-bold tracking-tight group-hover:text-accent transition-colors">
                  {profile.display_name}
                  <span className="ml-2 text-sm text-muted-soft opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                </h1>
              </button>
            )}
            <p className="text-sm text-muted">{profile.email}</p>
          </div>

          {/* Level + XP */}
          <div className="flex items-center gap-4">
            <ProgressRing percent={levelInfo.progress} size={72} stroke={5}>
              <div className="text-center leading-tight">
                <span className="text-xs font-bold">Lv.{levelInfo.current.level}</span>
              </div>
            </ProgressRing>
            <div className="text-left">
              <p className="text-sm font-bold">{levelInfo.current.title}</p>
              <p className="text-xs text-muted">{profile.xp} XP total</p>
              {levelInfo.next && (
                <p className="text-xs text-muted-soft">
                  {levelInfo.next.xp - profile.xp} XP to Level {levelInfo.next.level}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Current Path */}
        <GlassCard padding="md">
          <h2 className="font-display text-lg font-bold tracking-tight mb-4">Your Life Path</h2>

          {loading ? (
            <Skeleton width="100%" height="60px" rounded="lg" />
          ) : (
            <div className="space-y-3">
              {currentPath ? (
                <div className="flex items-center gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
                  <span className="text-2xl">{currentPath.icon}</span>
                  <div>
                    <p className="font-semibold">{currentPath.title}</p>
                    <p className="text-xs text-muted">{currentPath.description}</p>
                  </div>
                  <Badge variant="success" className="ml-auto">Active</Badge>
                </div>
              ) : (
                <p className="text-sm text-muted">No path selected.</p>
              )}

              <details className="group">
                <summary className="cursor-pointer text-xs font-medium text-accent hover:underline">
                  Switch path ▾
                </summary>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {paths
                    .filter((p) => p.id !== profile.path_id)
                    .map((path) => (
                      <button
                        key={path.id}
                        onClick={() => handlePathSwitch(path.id)}
                        className="flex items-center gap-3 rounded-xl border border-border-subtle bg-surface p-3 text-left transition-all hover:border-accent/30 hover:bg-surface-hover"
                      >
                        <span className="text-xl">{path.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold">{path.title}</p>
                          <p className="text-xs text-muted line-clamp-1">{path.description}</p>
                        </div>
                      </button>
                    ))}
                </div>
              </details>
            </div>
          )}
        </GlassCard>

        {/* Achievement Badges */}
        <GlassCard padding="md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-bold tracking-tight">Badges</h2>
            <Badge>{badges.filter((b) => isUnlocked(b.id)).length}/{badges.length}</Badge>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
            {badges.map((badge) => {
              const unlocked = isUnlocked(badge.id);
              return (
                <div
                  key={badge.id}
                  title={`${badge.title}: ${badge.description}`}
                  className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-center transition-all ${
                    unlocked
                      ? 'border-accent/20 bg-accent/5'
                      : 'border-border-subtle bg-surface opacity-40 grayscale'
                  }`}
                >
                  <span className="text-2xl">{badge.icon}</span>
                  <span className="text-[10px] font-semibold leading-tight line-clamp-2">
                    {badge.title}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Certificates */}
        <GlassCard padding="md">
          <h2 className="font-display text-lg font-bold tracking-tight mb-4">Certificates</h2>

          {loading ? (
            <Skeleton width="100%" height="80px" rounded="lg" />
          ) : certificates.length === 0 ? (
            <EmptyState
              icon="🎓"
              title="No certificates yet"
              description="Complete a course to earn your first certificate."
              ctaLabel="Browse Courses"
              onCta={() => navigate('/courses')}
            />
          ) : (
            <div className="space-y-3">
              {certificates.map((cert) => {
                const certRecord = progress.certificates.find(c => c.courseId === cert.course_id);
                const tierLabel = certRecord?.tier ? TIER_META[certRecord.tier].label : undefined;
                return (
                <div
                  key={cert.id}
                  className="flex items-center gap-4 rounded-xl border border-border-subtle bg-surface p-4"
                >
                  <span className="text-2xl">🎓</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">
                      {cert.course?.title ?? 'Course'}
                      {tierLabel && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                          {tierLabel}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-soft">
                      ID: {cert.credential_id} · {new Date(cert.issued_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCertModal({
                        studentName: profile.display_name,
                        courseTitle: cert.course?.title ?? 'Course',
                        issuedAt: cert.issued_at,
                        credentialId: cert.credential_id,
                        tier: certRecord?.tier,
                      })}
                      className="flex items-center gap-1.5 rounded-lg border border-border-subtle bg-surface-hover px-3 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-surface hover:border-accent/30 active:scale-95"
                    >
                      🔍 View
                    </button>
                    <button
                      onClick={() => downloadCert({
                        studentName: profile.display_name,
                        courseTitle: cert.course?.title ?? 'Course',
                        issuedAt: cert.issued_at,
                        credentialId: cert.credential_id,
                        tier: certRecord?.tier,
                      })}
                      className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition-all hover:bg-accent/20 hover:border-accent/50 active:scale-95"
                    >
                      ⬇ Download
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </GlassCard>

        {/* Account */}
        <div className="pt-4 border-t border-border-subtle">
          <Button variant="danger" onClick={handleSignOut} fullWidth>
            Sign Out
          </Button>
          <p className="mt-3 text-xs text-muted-soft text-center">
            Member since {new Date(profile.created_at).toLocaleDateString()}
          </p>
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
