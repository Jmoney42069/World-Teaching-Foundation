import type { Category } from "./quizQuestions";
export type { Category };

export interface ProfileData {
  label: string;
  tagline: string;
  description: string;
  strengths: string[];
  careers: string[];
  aiResistance: { level: string; explanation: string };
}

export const profiles: Record<Category, ProfileData> = {
  Tech: {
    label: "The Technologist",
    tagline: "You think in systems, logic, and solutions.",
    description:
      "You're an analytical thinker who thrives on solving complex problems. You naturally gravitate toward understanding how things work under the hood — whether it's code, data, or infrastructure. Your mind is built for precision, efficiency, and building things that scale.",
    strengths: [
      "Logical and structured thinking",
      "Strong problem-solving instincts",
      "Comfortable with data and abstraction",
      "Quick at learning technical tools",
      "Detail-oriented and methodical",
    ],
    careers: [
      "Software Developer",
      "Web Developer",
      "Data Analyst",
      "DevOps Engineer",
    ],
    aiResistance: {
      level: "High",
      explanation:
        "Technical roles that involve architecture, critical thinking, and novel problem-solving remain difficult for AI to replicate. You're positioned to work alongside AI, not be replaced by it.",
    },
  },
  Creative: {
    label: "The Creative",
    tagline: "You see what others overlook and create what didn't exist.",
    description:
      "You're an imaginative thinker driven by expression, aesthetics, and storytelling. You bring fresh perspectives, think visually, and feel energised when crafting experiences that connect with people on an emotional level.",
    strengths: [
      "Visual and intuitive thinking",
      "Strong sense of aesthetics and design",
      "Natural storyteller and communicator",
      "Innovation-driven mindset",
      "Ability to turn abstract ideas into tangible work",
    ],
    careers: [
      "UI/UX Designer",
      "Content Creator",
      "Video Editor",
      "Branding Designer",
    ],
    aiResistance: {
      level: "Medium",
      explanation:
        "While AI can generate content, the human ability to judge taste, build emotional resonance, and define creative direction stays irreplaceable. Your edge is originality and intent.",
    },
  },
  Business: {
    label: "The Strategist",
    tagline: "You see opportunity where others see chaos.",
    description:
      "You're a strategic thinker who thrives on leadership, communication, and growth. You naturally connect people, ideas, and resources — always looking for the bigger picture and the next move. You're built for impact at scale.",
    strengths: [
      "Strategic and big-picture thinking",
      "Natural leadership and persuasion",
      "Strong communication skills",
      "Opportunity-driven decision making",
      "Ability to organise and motivate teams",
    ],
    careers: [
      "Entrepreneur",
      "Marketing Specialist",
      "Sales Professional",
      "Business Strategist",
    ],
    aiResistance: {
      level: "Medium–High",
      explanation:
        "Relationship-building, negotiation, and adaptive strategy rely on human judgement and empathy — areas where AI assists but doesn't replace. Your people skills are your moat.",
    },
  },
};
