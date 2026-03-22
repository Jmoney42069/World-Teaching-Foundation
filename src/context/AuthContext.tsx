import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User as DbUser } from '../lib/database.types';

interface AuthState {
  session: null;
  profile: DbUser | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<DbUser, 'display_name' | 'avatar_url' | 'path_id' | 'onboarding_complete' | 'quiz_profile' | 'quiz_scores'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ── DEV / TEST MODE — no Supabase, pure local state ──
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    session: null,
    profile: {
      id: 'dev-user-0000',
      email: 'dev@wtf.local',
      display_name: 'Dev User',
      avatar_url: null,
      path_id: null,
      xp: 250,
      level: 2,
      onboarding_complete: false,
      quiz_profile: null,
      quiz_scores: null,
      created_at: new Date().toISOString(),
    },
    loading: false,
  });

  const signUp = useCallback(async () => ({ error: null }), []);
  const signIn = useCallback(async () => ({ error: null }), []);
  const signOut = useCallback(async () => {}, []);
  const refreshProfile = useCallback(async () => {}, []);

  const updateProfile = useCallback(async (
    updates: Partial<Pick<DbUser, 'display_name' | 'avatar_url' | 'path_id' | 'onboarding_complete' | 'quiz_profile' | 'quiz_scores'>>
  ) => {
    setState((prev) => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...updates } : prev.profile,
    }));
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, signUp, signIn, signOut, refreshProfile, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
