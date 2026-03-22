/**
 * Recommendation engine: maps quiz profile → paths → courses.
 * This is the intelligence layer that connects personality assessment to content.
 */
import type { Category } from "../data/quizQuestions";
import { profiles, type ProfileData } from "../data/profileData";
import { careerEmojis, careerMeta } from "../data/careerData";

// ── Profile → Path mapping ──
// Maps each profile type to the Supabase path titles it's most aligned with, in priority order
export const PROFILE_PATH_MAP: Record<Category, string[]> = {
  Tech:     ["Career Accelerator", "Mindset Mastery"],
  Creative: ["Peak Health", "Mindset Mastery", "Career Accelerator"],
  Business: ["Entrepreneurship", "Financial Freedom", "Career Accelerator"],
};

/** Get profile data for a category */
export function getProfileData(category: Category): ProfileData {
  return profiles[category];
}

/** Career with full metadata for rendering */
export interface CareerRecommendation {
  title: string;
  emoji: string;
  description: string;
  tag?: string;
  aiResistance: { level: string; explanation: string };
}

/** Get career recommendations for a profile type */
export function getCareerRecommendations(category: Category): CareerRecommendation[] {
  const profile = profiles[category];
  return profile.careers.map((career) => ({
    title: career,
    emoji: careerEmojis[career] ?? "💼",
    description: careerMeta[career]?.description ?? "",
    tag: careerMeta[career]?.tag,
    aiResistance: profile.aiResistance,
  }));
}

/** Get the primary recommended Supabase path title for a profile */
export function getRecommendedPathTitle(category: Category): string {
  return PROFILE_PATH_MAP[category][0];
}

/** Score how well a course path matches a profile (0-100) */
export function getPathMatchScore(pathTitle: string, category: Category): number {
  const preferred = PROFILE_PATH_MAP[category];
  const idx = preferred.indexOf(pathTitle);
  if (idx === -1) return 30; // Not a direct match, but still accessible
  // First match = 100, second = 75, third = 55
  return [100, 75, 55][idx] ?? 40;
}

/** AI-proof level per career path (not per user) */
export interface AiProofIndicator {
  level: "High" | "Medium" | "Medium-High";
  color: string;
  description: string;
}

const AI_PROOF_MAP: Record<string, AiProofIndicator> = {
  "Software Developer":    { level: "High",        color: "#22c55e", description: "Architecture, critical thinking, and novel problem-solving are hard for AI to replicate." },
  "Web Developer":         { level: "Medium",      color: "#eab308", description: "Front-end development is evolving with AI tools, but UX judgement stays human." },
  "Data Analyst":          { level: "Medium-High",  color: "#84cc16", description: "Interpreting data in business context requires human insight AI can't fully replicate." },
  "DevOps Engineer":       { level: "High",        color: "#22c55e", description: "Infrastructure decisions in complex systems still require deep human expertise." },
  "UI/UX Designer":        { level: "Medium",      color: "#eab308", description: "AI can generate designs, but taste, empathy, and creative direction remain human." },
  "Content Creator":       { level: "Medium",      color: "#eab308", description: "AI-generated content is rising, but authenticity and voice are irreplaceable." },
  "Video Editor":          { level: "Medium",      color: "#eab308", description: "AI assists editing, but narrative judgement and creative vision stay human." },
  "Branding Designer":     { level: "Medium-High",  color: "#84cc16", description: "Brand strategy requires cultural understanding AI can't independently develop." },
  "Entrepreneur":          { level: "High",        color: "#22c55e", description: "Opportunity recognition, risk-taking, and relationship-building are deeply human." },
  "Marketing Specialist":  { level: "Medium-High",  color: "#84cc16", description: "Strategy and consumer psychology keep marketers ahead of AI automation." },
  "Sales Professional":    { level: "High",        color: "#22c55e", description: "Trust, persuasion, and emotional intelligence in sales are irreplaceable." },
  "Business Strategist":   { level: "Medium-High",  color: "#84cc16", description: "Adaptive strategy relies on judgement and empathy — areas AI assists but doesn't own." },
};

export function getAiProofIndicator(careerTitle: string): AiProofIndicator {
  return AI_PROOF_MAP[careerTitle] ?? { level: "Medium", color: "#eab308", description: "This career is evolving alongside AI tools." };
}
