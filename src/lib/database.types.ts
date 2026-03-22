// Types matching supabase/migration.sql — compatible with @supabase/supabase-js v2.99+
// Update these if you change the database schema.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      paths: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          color?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_url: string | null;
          path_id: string | null;
          xp: number;
          level: number;
          onboarding_complete: boolean;
          quiz_profile: string | null;
          quiz_scores: Json | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string;
          avatar_url?: string | null;
          path_id?: string | null;
          xp?: number;
          level?: number;
          onboarding_complete?: boolean;
          quiz_profile?: string | null;
          quiz_scores?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_url?: string | null;
          path_id?: string | null;
          xp?: number;
          level?: number;
          onboarding_complete?: boolean;
          quiz_profile?: string | null;
          quiz_scores?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_path_id_fkey";
            columns: ["path_id"];
            isOneToOne: false;
            referencedRelation: "paths";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          id: string;
          path_id: string;
          title: string;
          description: string;
          order_index: number;
          duration_minutes: number;
          prerequisite_course_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          path_id: string;
          title: string;
          description: string;
          order_index?: number;
          duration_minutes?: number;
          prerequisite_course_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          path_id?: string;
          title?: string;
          description?: string;
          order_index?: number;
          duration_minutes?: number;
          prerequisite_course_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_path_id_fkey";
            columns: ["path_id"];
            isOneToOne: false;
            referencedRelation: "paths";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          id: string;
          course_id: string;
          title: string;
          content: string;
          order_index: number;
          type: "text" | "quiz" | "reflection";
          quiz_data: QuizQuestion[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          title: string;
          content: string;
          order_index?: number;
          type?: "text" | "quiz" | "reflection";
          quiz_data?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          title?: string;
          content?: string;
          order_index?: number;
          type?: "text" | "quiz" | "reflection";
          quiz_data?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      user_course_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          completed_at: string | null;
          score: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          completed_at?: string | null;
          score?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          completed_at?: string | null;
          score?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_course_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_course_progress_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      user_lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          lesson_id: string;
          completed_at: string;
          reflection_text: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          lesson_id: string;
          completed_at?: string;
          reflection_text?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          lesson_id?: string;
          completed_at?: string;
          reflection_text?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
        ];
      };
      habits: {
        Row: {
          id: string;
          path_id: string;
          title: string;
          description: string;
          icon: string;
          frequency: "daily" | "weekly";
          created_at: string;
        };
        Insert: {
          id?: string;
          path_id: string;
          title: string;
          description?: string;
          icon?: string;
          frequency?: "daily" | "weekly";
          created_at?: string;
        };
        Update: {
          id?: string;
          path_id?: string;
          title?: string;
          description?: string;
          icon?: string;
          frequency?: "daily" | "weekly";
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habits_path_id_fkey";
            columns: ["path_id"];
            isOneToOne: false;
            referencedRelation: "paths";
            referencedColumns: ["id"];
          },
        ];
      };
      user_habits: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          streak_count: number;
          best_streak: number;
          last_completed_at: string | null;
          total_completions: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          streak_count?: number;
          best_streak?: number;
          last_completed_at?: string | null;
          total_completions?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          streak_count?: number;
          best_streak?: number;
          last_completed_at?: string | null;
          total_completions?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_habits_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_habits_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
        ];
      };
      habit_logs: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          completed_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          completed_at?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "habit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "habit_logs_habit_id_fkey";
            columns: ["habit_id"];
            isOneToOne: false;
            referencedRelation: "habits";
            referencedColumns: ["id"];
          },
        ];
      };
      certificates: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          issued_at: string;
          credential_id: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          issued_at?: string;
          credential_id: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          issued_at?: string;
          credential_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "certificates_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "certificates_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      medals: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          condition_type: string;
          condition_value: number;
          xp_reward?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          condition_type?: string;
          condition_value?: number;
          xp_reward?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      user_medals: {
        Row: {
          id: string;
          user_id: string;
          medal_id: string;
          earned_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          medal_id: string;
          earned_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          medal_id?: string;
          earned_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_medals_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_medals_medal_id_fkey";
            columns: ["medal_id"];
            isOneToOne: false;
            referencedRelation: "medals";
            referencedColumns: ["id"];
          },
        ];
      };
      activity_log: {
        Row: {
          id: string;
          user_id: string;
          action_type: string;
          description: string;
          xp_gained: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action_type: string;
          description: string;
          xp_gained?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action_type?: string;
          description?: string;
          xp_gained?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "activity_log_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// ── Convenience row aliases ──
export type Path = Database['public']['Tables']['paths']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type UserCourseProgress = Database['public']['Tables']['user_course_progress']['Row'];
export type UserLessonProgress = Database['public']['Tables']['user_lesson_progress']['Row'];
export type Habit = Database['public']['Tables']['habits']['Row'];
export type UserHabit = Database['public']['Tables']['user_habits']['Row'];
export type HabitLog = Database['public']['Tables']['habit_logs']['Row'];
export type Certificate = Database['public']['Tables']['certificates']['Row'];
export type Medal = Database['public']['Tables']['medals']['Row'];
export type UserMedal = Database['public']['Tables']['user_medals']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_log']['Row'];

// ── Quiz data shape (stored as jsonb) ──
export interface QuizQuestion {
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
}

// ── XP / Level constants ──
interface LevelThreshold {
  level: number;
  xp: number;
  title: string;
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, xp: 0, title: 'Beginner' },
  { level: 2, xp: 200, title: 'Learner' },
  { level: 3, xp: 500, title: 'Achiever' },
  { level: 4, xp: 1000, title: 'Expert' },
  { level: 5, xp: 2000, title: 'Master' },
];

export const XP_REWARDS = {
  LESSON_COMPLETE: 20,
  COURSE_COMPLETE: 200,
  HABIT_COMPLETE: 5,
  MEDAL_EARNED: 50,
  ONBOARDING_COMPLETE: 100,
} as const;

export function getLevelInfo(xp: number) {
  let current: LevelThreshold = LEVEL_THRESHOLDS[0];
  let next: LevelThreshold | null = LEVEL_THRESHOLDS[1] ?? null;
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xp) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] ?? null;
      break;
    }
  }
  const progress = next
    ? ((xp - current.xp) / (next.xp - current.xp)) * 100
    : 100;
  return { current, next, progress: Math.min(100, Math.round(progress)) };
}
