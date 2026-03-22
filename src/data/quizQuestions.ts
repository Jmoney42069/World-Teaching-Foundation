export type Category = "Tech" | "Creative" | "Business";
export type QuizLength = "short" | "medium" | "long";
export type QuestionType = "personality" | "skill" | "logic" | "values" | "learning" | "workstyle" | "motivation";

export interface Answer {
  text: string;
  category: Category;
}

export interface Question {
  question: string;
  answers: Answer[];
  type: QuestionType;
  /** Included in short (8), medium (15), long (30) */
  minLength: QuizLength;
}

/** How many questions per quiz length */
export const QUIZ_LENGTHS: Record<QuizLength, { count: number; label: string; description: string; icon: string }> = {
  short:  { count: 8,  label: "Quick",    description: "8 questions — fast classification",        icon: "⚡" },
  medium: { count: 15, label: "Standard", description: "15 questions — balanced accuracy",          icon: "🎯" },
  long:   { count: 30, label: "Deep",     description: "30 questions — full personality deep-scan", icon: "🧠" },
};

/**
 * 30 questions across 7 question types for deep personality assessment.
 * short questions (8) appear in ALL lengths.
 * medium questions (+7) appear in medium + long.
 * long questions (+15) appear only in long.
 */
export const questions: Question[] = [
  // ═══════════════════════════════════════════
  // SHORT TIER — 8 questions (always included)
  // ═══════════════════════════════════════════

  // ── PERSONALITY ──
  {
    type: "personality",
    minLength: "short",
    question: "When you face a complex problem, what's your first instinct?",
    answers: [
      { text: "Break it down into smaller logical parts", category: "Tech" },
      { text: "Look for an unconventional or creative angle", category: "Creative" },
      { text: "Think about the people involved and how to lead them through it", category: "Business" },
    ],
  },
  {
    type: "personality",
    minLength: "short",
    question: "What type of project excites you the most?",
    answers: [
      { text: "Building a tool or system that solves a real problem", category: "Tech" },
      { text: "Designing an experience that moves people emotionally", category: "Creative" },
      { text: "Launching a product and growing a user base", category: "Business" },
    ],
  },
  {
    type: "personality",
    minLength: "short",
    question: "How do you prefer to spend a free afternoon?",
    answers: [
      { text: "Tinkering with code, gadgets, or experiments", category: "Tech" },
      { text: "Drawing, writing, making music, or exploring art", category: "Creative" },
      { text: "Networking, reading about strategy, or planning ideas", category: "Business" },
    ],
  },

  // ── VALUES ──
  {
    type: "values",
    minLength: "short",
    question: "What matters most to you in a career?",
    answers: [
      { text: "Mastering deep technical knowledge and staying sharp", category: "Tech" },
      { text: "Freedom to express myself and create meaningful work", category: "Creative" },
      { text: "Building wealth, influence, and making an impact at scale", category: "Business" },
    ],
  },

  // ── LEARNING ──
  {
    type: "learning",
    minLength: "short",
    question: "How do you learn best?",
    answers: [
      { text: "Hands-on practice — building and experimenting immediately", category: "Tech" },
      { text: "Visual examples and inspiration — then creating my own version", category: "Creative" },
      { text: "Case studies and real-world scenarios I can apply right away", category: "Business" },
    ],
  },

  // ── WORKSTYLE ──
  {
    type: "workstyle",
    minLength: "short",
    question: "Which work environment energises you the most?",
    answers: [
      { text: "Quiet deep-focus time with minimal interruptions", category: "Tech" },
      { text: "A collaborative, vibrant space full of creative energy", category: "Creative" },
      { text: "A fast-paced environment where quick decisions matter", category: "Business" },
    ],
  },

  // ── MOTIVATION ──
  {
    type: "motivation",
    minLength: "short",
    question: "What drives you to keep going when things get tough?",
    answers: [
      { text: "The challenge itself — I love solving hard puzzles", category: "Tech" },
      { text: "The vision of what I'm creating and who it will touch", category: "Creative" },
      { text: "The end goal — success, growth, and proving it can be done", category: "Business" },
    ],
  },

  // ── SKILL ──
  {
    type: "skill",
    minLength: "short",
    question: "Which of these would you feel most confident doing right now?",
    answers: [
      { text: "Setting up a website or writing a simple script", category: "Tech" },
      { text: "Designing a logo, editing a video, or writing copy", category: "Creative" },
      { text: "Writing a business plan or pitching an idea to investors", category: "Business" },
    ],
  },

  // ═══════════════════════════════════════════
  // MEDIUM TIER — 7 more questions (medium + long)
  // ═══════════════════════════════════════════

  // ── PERSONALITY ──
  {
    type: "personality",
    minLength: "medium",
    question: "In a team setting, what role do you naturally take?",
    answers: [
      { text: "The problem-solver who figures out how things work", category: "Tech" },
      { text: "The one who shapes the vision and aesthetics", category: "Creative" },
      { text: "The organizer who keeps everyone aligned and motivated", category: "Business" },
    ],
  },
  {
    type: "personality",
    minLength: "medium",
    question: "What kind of content do you consume the most?",
    answers: [
      { text: "Tech blogs, tutorials, or science channels", category: "Tech" },
      { text: "Design showcases, films, or creative portfolios", category: "Creative" },
      { text: "Business podcasts, case studies, or finance news", category: "Business" },
    ],
  },

  // ── VALUES ──
  {
    type: "values",
    minLength: "medium",
    question: "Which of these would make you feel most fulfilled at the end of a workday?",
    answers: [
      { text: "I cracked a hard technical problem nobody else could solve", category: "Tech" },
      { text: "I made something beautiful that people genuinely appreciated", category: "Creative" },
      { text: "I closed a deal, grew a metric, or moved a project forward", category: "Business" },
    ],
  },

  // ── LEARNING ──
  {
    type: "learning",
    minLength: "medium",
    question: "When starting a brand-new subject, you prefer to:",
    answers: [
      { text: "Read the documentation / manual first, then experiment", category: "Tech" },
      { text: "Jump in, make mistakes, and learn by doing creatively", category: "Creative" },
      { text: "Find someone who's already done it and learn from their playbook", category: "Business" },
    ],
  },

  // ── SKILL ──
  {
    type: "skill",
    minLength: "medium",
    question: "A friend asks for help with their startup. You'd be most useful at:",
    answers: [
      { text: "Building the product — coding, data, infrastructure", category: "Tech" },
      { text: "Branding — the name, logo, social media presence", category: "Creative" },
      { text: "Strategy — market research, pricing, customer acquisition", category: "Business" },
    ],
  },
  {
    type: "skill",
    minLength: "medium",
    question: "You need to present an idea to a group. You'd naturally focus on:",
    answers: [
      { text: "The technical feasibility and data backing it up", category: "Tech" },
      { text: "The visual story and how it feels emotionally", category: "Creative" },
      { text: "The market opportunity and return on investment", category: "Business" },
    ],
  },

  // ── MOTIVATION ──
  {
    type: "motivation",
    minLength: "medium",
    question: "What does success look like to you?",
    answers: [
      { text: "Building something technically impressive that people rely on", category: "Tech" },
      { text: "Creating work that inspires and resonates with others", category: "Creative" },
      { text: "Leading a venture and making a large-scale impact", category: "Business" },
    ],
  },

  // ═══════════════════════════════════════════
  // LONG TIER — 15 more questions (long only)
  // ═══════════════════════════════════════════

  // ── PERSONALITY (deep) ──
  {
    type: "personality",
    minLength: "long",
    question: "How do you approach learning something completely new?",
    answers: [
      { text: "Dive into documentation and experiment hands-on", category: "Tech" },
      { text: "Explore examples, get inspired, then make my own version", category: "Creative" },
      { text: "Find a mentor, study what works, and create a plan", category: "Business" },
    ],
  },
  {
    type: "personality",
    minLength: "long",
    question: "Which environment would you thrive in?",
    answers: [
      { text: "A lab or dev studio with deep focus time", category: "Tech" },
      { text: "A design studio surrounded by creative energy", category: "Creative" },
      { text: "A fast-paced startup where decisions drive growth", category: "Business" },
    ],
  },
  {
    type: "personality",
    minLength: "long",
    question: "When you daydream about the future, what do you picture?",
    answers: [
      { text: "Building cutting-edge technology that changes how people work", category: "Tech" },
      { text: "Having a body of creative work I'm deeply proud of", category: "Creative" },
      { text: "Running my own company or leading a high-impact organisation", category: "Business" },
    ],
  },
  {
    type: "personality",
    minLength: "long",
    question: "Someone criticises your work. How do you react?",
    answers: [
      { text: "Analyse the feedback objectively — is it technically valid?", category: "Tech" },
      { text: "Feel it emotionally first, then reflect on whether it resonates", category: "Creative" },
      { text: "Ask if the criticism is backed by data or just opinion", category: "Business" },
    ],
  },

  // ── VALUES (deep) ──
  {
    type: "values",
    minLength: "long",
    question: "If money were no object, what would you spend your time doing?",
    answers: [
      { text: "Research and build new technologies or open-source tools", category: "Tech" },
      { text: "Travel, create art, write, or make films", category: "Creative" },
      { text: "Invest in companies, advise founders, or run a non-profit", category: "Business" },
    ],
  },
  {
    type: "values",
    minLength: "long",
    question: "Which skill would you most like to master in the next year?",
    answers: [
      { text: "Programming, data science, or AI engineering", category: "Tech" },
      { text: "Storytelling, visual design, or content creation", category: "Creative" },
      { text: "Negotiation, leadership, or financial strategy", category: "Business" },
    ],
  },

  // ── LEARNING (deep) ──
  {
    type: "learning",
    minLength: "long",
    question: "You're stuck on a concept you don't understand. What do you do?",
    answers: [
      { text: "Search Stack Overflow, read source code, and debug until it clicks", category: "Tech" },
      { text: "Watch a video tutorial, look at visual diagrams, or find a creative analogy", category: "Creative" },
      { text: "Ask a knowledgeable person or join a community to discuss it", category: "Business" },
    ],
  },
  {
    type: "learning",
    minLength: "long",
    question: "Your ideal online course would focus on:",
    answers: [
      { text: "Building a real project step-by-step with technical depth", category: "Tech" },
      { text: "Creative exercises, portfolio building, and critique sessions", category: "Creative" },
      { text: "Frameworks, strategies, and real case studies from successful people", category: "Business" },
    ],
  },

  // ── WORKSTYLE (deep) ──
  {
    type: "workstyle",
    minLength: "long",
    question: "How do you organise your tasks and projects?",
    answers: [
      { text: "Spreadsheets, Kanban boards, or structured systems", category: "Tech" },
      { text: "Mood boards, journals, or free-flowing notes", category: "Creative" },
      { text: "Priority lists, deadlines, and delegation", category: "Business" },
    ],
  },
  {
    type: "workstyle",
    minLength: "long",
    question: "When working on a big project, you tend to:",
    answers: [
      { text: "Go deep into one area until it's perfect before moving on", category: "Tech" },
      { text: "Jump between different parts, following inspiration", category: "Creative" },
      { text: "Create a plan, assign milestones, and track progress", category: "Business" },
    ],
  },

  // ── MOTIVATION (deep) ──
  {
    type: "motivation",
    minLength: "long",
    question: "Which of these quotes resonates with you the most?",
    answers: [
      { text: "\"The best way to predict the future is to invent it.\" — Alan Kay", category: "Tech" },
      { text: "\"Creativity takes courage.\" — Henri Matisse", category: "Creative" },
      { text: "\"The way to get started is to quit talking and begin doing.\" — Walt Disney", category: "Business" },
    ],
  },
  {
    type: "motivation",
    minLength: "long",
    question: "At the end of your life, you want people to remember you as someone who:",
    answers: [
      { text: "Built amazing things and pushed the boundaries of technology", category: "Tech" },
      { text: "Inspired people through original and meaningful creative work", category: "Creative" },
      { text: "Created opportunities for others and built something lasting", category: "Business" },
    ],
  },

  // ── LOGIC ──
  {
    type: "logic",
    minLength: "long",
    question: "What comes next in the sequence: 2, 6, 12, 20, …?",
    answers: [
      { text: "30 — the differences increase by 2 each time", category: "Tech" },
      { text: "28 — it looks like it roughly doubles", category: "Creative" },
      { text: "24 — just add 4 more each time", category: "Business" },
    ],
  },
  {
    type: "logic",
    minLength: "long",
    question: "A company's revenue doubled every year for 3 years, reaching $8M. What was year-one revenue?",
    answers: [
      { text: "$1M — calculated 8 ÷ 2 ÷ 2 ÷ 2", category: "Tech" },
      { text: "Around $2M — roughly estimated", category: "Creative" },
      { text: "$1M — basic compound growth math", category: "Business" },
    ],
  },
  {
    type: "logic",
    minLength: "long",
    question: "If all Blips are Blops, and some Blops are Blaps, which is definitely true?",
    answers: [
      { text: "Some Blips might be Blaps — it's possible but not certain", category: "Tech" },
      { text: "All Blaps are Blips — they're all connected", category: "Creative" },
      { text: "Can't be sure — not enough information for a definite answer", category: "Business" },
    ],
  },
];

/** Get filtered questions for a given quiz length */
export function getQuestionsForLength(length: QuizLength): Question[] {
  const lengthOrder: QuizLength[] = ["short", "medium", "long"];
  const maxIndex = lengthOrder.indexOf(length);
  return questions.filter((q) => lengthOrder.indexOf(q.minLength) <= maxIndex);
}

/** Question type labels for UI */
export const QUESTION_TYPE_LABELS: Record<QuestionType, { icon: string; label: string }> = {
  personality: { icon: "🧩", label: "Personality" },
  skill:       { icon: "🛠️", label: "Skill Assessment" },
  logic:       { icon: "🧠", label: "Logic" },
  values:      { icon: "💎", label: "Values" },
  learning:    { icon: "📚", label: "Learning Style" },
  workstyle:   { icon: "⚙️", label: "Work Style" },
  motivation:  { icon: "🔥", label: "Motivation" },
};

/** Calculate profile from category answers, including per-type breakdown */
export function calculateProfile(answerCategories: Category[]): {
  profile: Category;
  scores: Record<Category, number>;
  total: number;
} {
  const scores: Record<Category, number> = { Tech: 0, Creative: 0, Business: 0 };
  for (const cat of answerCategories) {
    scores[cat]++;
  }
  const total = answerCategories.length;
  const profile = (Object.entries(scores) as [Category, number][])
    .sort((a, b) => b[1] - a[1])[0][0];
  return { profile, scores, total };
}
