export const careerEmojis: Record<string, string> = {
  "Software Developer": "⚙️",
  "Web Developer": "🌐",
  "Data Analyst": "📊",
  "DevOps Engineer": "🔧",
  "UI/UX Designer": "🎨",
  "Content Creator": "✍️",
  "Video Editor": "🎬",
  "Branding Designer": "💎",
  Entrepreneur: "🚀",
  "Marketing Specialist": "📣",
  "Sales Professional": "🤝",
  "Business Strategist": "♟️",
};

export const careerMeta: Record<string, { description: string; tag?: string }> = {
  "Software Developer": {
    description: "Build scalable applications and systems that power modern products.",
    tag: "AI-proof",
  },
  "Web Developer": {
    description: "Craft performant, accessible interfaces that users interact with daily.",
    tag: "High demand",
  },
  "Data Analyst": {
    description: "Turn raw data into actionable insights that drive business decisions.",
    tag: "Trending",
  },
  "DevOps Engineer": {
    description: "Automate infrastructure and ship reliable software at scale.",
    tag: "AI-proof",
  },
  "UI/UX Designer": {
    description: "Shape digital experiences through research, design, and user empathy.",
    tag: "Trending",
  },
  "Content Creator": {
    description: "Tell compelling stories across platforms and build engaged audiences.",
  },
  "Video Editor": {
    description: "Produce polished visual narratives for brands, creators, and media.",
  },
  "Branding Designer": {
    description: "Define the look, feel, and voice that make brands unforgettable.",
    tag: "High demand",
  },
  Entrepreneur: {
    description: "Identify opportunities, build ventures, and create value from scratch.",
    tag: "AI-proof",
  },
  "Marketing Specialist": {
    description: "Grow products and brands through strategy, data, and storytelling.",
    tag: "High demand",
  },
  "Sales Professional": {
    description: "Drive revenue through relationships, negotiation, and persuasion.",
    tag: "AI-proof",
  },
  "Business Strategist": {
    description: "Shape company direction through analysis, planning, and leadership.",
    tag: "Trending",
  },
};

export const courseLevels = [
  { label: "Beginner", price: "Free", active: true },
  { label: "Medium", price: "€5", active: false },
  { label: "Advanced", price: "€19", active: false },
] as const;
