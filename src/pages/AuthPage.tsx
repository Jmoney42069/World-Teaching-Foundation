import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Container, Button, Input } from '../components';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showVerifyBanner, setShowVerifyBanner] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!email.includes('@')) e.email = 'Enter a valid email';
    if (password.length < 6) e.password = 'Minimum 6 characters';
    if (mode === 'register' && displayName.trim().length < 2) e.displayName = 'Minimum 2 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      if (mode === 'register') {
        const { error } = await signUp(email, password, displayName.trim());
        if (error) {
          toast.error(error);
          setErrors({ email: error });
        } else {
          setShowVerifyBanner(true);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error);
          setErrors({ email: error });
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size="sm" center>
      <div className="flex min-h-[80vh] flex-col items-center justify-center py-12">
        {/* Floating orb */}
        <div className="pointer-events-none absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2">
          <div className="h-64 w-64 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="relative w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center">
            <p className="text-3xl font-display font-extrabold tracking-tight text-gradient mb-2">
              World Teaching Foundation
            </p>
            <h1 className="font-display text-display font-bold tracking-tight">
              Life Path<span className="text-gradient"> Improver</span>
            </h1>
            <p className="mt-3 text-sm text-muted">
              {mode === 'login' ? 'Sign in to continue your journey' : 'Create your account to get started'}
            </p>
          </div>

          {/* Email verification banner */}
          {showVerifyBanner && (
            <div className="rounded-2xl border border-accent/30 bg-accent/10 p-5 text-center space-y-2">
              <span className="text-3xl">📧</span>
              <h2 className="text-lg font-bold">Verify your email</h2>
              <p className="text-sm text-muted">
                We sent a confirmation link to <strong>{email}</strong>.<br />
                Click the link in the email, then come back and sign in.
              </p>
              <button
                onClick={() => { setShowVerifyBanner(false); setMode('login'); }}
                className="mt-2 text-sm font-semibold text-accent hover:underline"
              >
                Go to Sign In →
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'register' && (
              <Input
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                error={errors.displayName}
                icon={<span className="text-muted-soft">👤</span>}
                placeholder="Your name"
                autoComplete="name"
              />
            )}

            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<span className="text-muted-soft">✉️</span>}
              placeholder="you@example.com"
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              icon={<span className="text-muted-soft">🔒</span>}
              placeholder="••••••••"
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            />

            <Button type="submit" fullWidth loading={loading} size="lg">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-sm text-muted">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button onClick={() => setMode('register')} className="font-semibold text-accent hover:underline">
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => setMode('login')} className="font-semibold text-accent hover:underline">
                  Sign in
                </button>
              </>
            )}
          </p>

          {/* Skip signup */}
          <div className="text-center pt-2 border-t border-border-subtle">
            <button
              onClick={() => navigate('/onboarding')}
              className="text-sm font-medium text-muted-soft hover:text-accent transition-colors"
            >
              Skip sign up — explore first →
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}
