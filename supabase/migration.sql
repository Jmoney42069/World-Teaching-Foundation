-- ============================================================
-- WTF – World Teaching Foundation
-- Complete Database Schema, RLS Policies, and Seed Data
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================

-- ── 0. Enable required extensions ──
create extension if not exists "pgcrypto";

-- ── 1. PATHS ──
create table if not exists public.paths (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null,
  color text not null,
  created_at timestamptz not null default now()
);

alter table public.paths enable row level security;
drop policy if exists "Paths are readable by everyone" on public.paths;
create policy "Paths are readable by everyone" on public.paths
  for select using (true);

-- ── 2. USERS (profile extension of auth.users) ──
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text not null default '',
  avatar_url text,
  path_id uuid references public.paths(id) on delete set null,
  xp integer not null default 0,
  level integer not null default 1,
  onboarding_complete boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;
drop policy if exists "Users can read own profile" on public.users;
create policy "Users can read own profile" on public.users
  for select using (auth.uid() = id);
drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);
drop policy if exists "Users can insert own profile" on public.users;
create policy "Users can insert own profile" on public.users
  for insert with check (auth.uid() = id);

-- ── 3. COURSES ──
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  title text not null,
  description text not null,
  order_index integer not null default 0,
  duration_minutes integer not null default 30,
  prerequisite_course_id uuid references public.courses(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.courses enable row level security;
drop policy if exists "Courses are readable by everyone" on public.courses;
create policy "Courses are readable by everyone" on public.courses
  for select using (true);

-- ── 4. LESSONS ──
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  content text not null,
  order_index integer not null default 0,
  type text not null default 'text' check (type in ('text', 'quiz', 'reflection')),
  quiz_data jsonb, -- for quiz type: [{question, options[], correct_index, explanation}]
  created_at timestamptz not null default now()
);

alter table public.lessons enable row level security;
drop policy if exists "Lessons are readable by everyone" on public.lessons;
create policy "Lessons are readable by everyone" on public.lessons
  for select using (true);

-- ── 5. USER_COURSE_PROGRESS ──
create table if not exists public.user_course_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  completed_at timestamptz,
  score integer, -- quiz score percentage (null if no quiz)
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.user_course_progress enable row level security;
drop policy if exists "Users can read own course progress" on public.user_course_progress;
create policy "Users can read own course progress" on public.user_course_progress
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own course progress" on public.user_course_progress;
create policy "Users can insert own course progress" on public.user_course_progress
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own course progress" on public.user_course_progress;
create policy "Users can update own course progress" on public.user_course_progress
  for update using (auth.uid() = user_id);

-- ── 6. USER_LESSON_PROGRESS ──
create table if not exists public.user_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz not null default now(),
  reflection_text text, -- for reflection type lessons
  unique (user_id, lesson_id)
);

alter table public.user_lesson_progress enable row level security;
drop policy if exists "Users can read own lesson progress" on public.user_lesson_progress;
create policy "Users can read own lesson progress" on public.user_lesson_progress
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own lesson progress" on public.user_lesson_progress;
create policy "Users can insert own lesson progress" on public.user_lesson_progress
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own lesson progress" on public.user_lesson_progress;
create policy "Users can update own lesson progress" on public.user_lesson_progress
  for update using (auth.uid() = user_id);

-- ── 7. HABITS ──
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  title text not null,
  description text not null default '',
  icon text not null default '✅',
  frequency text not null default 'daily' check (frequency in ('daily', 'weekly')),
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;
drop policy if exists "Habits are readable by everyone" on public.habits;
create policy "Habits are readable by everyone" on public.habits
  for select using (true);

-- ── 8. USER_HABITS (per-user habit state) ──
create table if not exists public.user_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  streak_count integer not null default 0,
  best_streak integer not null default 0,
  last_completed_at timestamptz,
  total_completions integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id)
);

alter table public.user_habits enable row level security;
drop policy if exists "Users can read own habits" on public.user_habits;
create policy "Users can read own habits" on public.user_habits
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own habits" on public.user_habits;
create policy "Users can insert own habits" on public.user_habits
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users can update own habits" on public.user_habits;
create policy "Users can update own habits" on public.user_habits
  for update using (auth.uid() = user_id);

-- ── 9. HABIT_LOGS ──
create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  completed_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique (user_id, habit_id, completed_at)
);

alter table public.habit_logs enable row level security;
drop policy if exists "Users can read own habit logs" on public.habit_logs;
create policy "Users can read own habit logs" on public.habit_logs
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own habit logs" on public.habit_logs;
create policy "Users can insert own habit logs" on public.habit_logs
  for insert with check (auth.uid() = user_id);

-- ── 10. CERTIFICATES ──
create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  issued_at timestamptz not null default now(),
  credential_id text not null unique,
  unique (user_id, course_id)
);

alter table public.certificates enable row level security;
drop policy if exists "Users can read own certificates" on public.certificates;
create policy "Users can read own certificates" on public.certificates
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own certificates" on public.certificates;
create policy "Users can insert own certificates" on public.certificates
  for insert with check (auth.uid() = user_id);

-- ── 11. MEDALS ──
create table if not exists public.medals (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  icon text not null,
  condition_type text not null,
  condition_value integer not null,
  xp_reward integer not null default 50,
  created_at timestamptz not null default now()
);

alter table public.medals enable row level security;
drop policy if exists "Medals are readable by everyone" on public.medals;
create policy "Medals are readable by everyone" on public.medals
  for select using (true);

-- ── 12. USER_MEDALS ──
create table if not exists public.user_medals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  medal_id uuid not null references public.medals(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique (user_id, medal_id)
);

alter table public.user_medals enable row level security;
drop policy if exists "Users can read own medals" on public.user_medals;
create policy "Users can read own medals" on public.user_medals
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own medals" on public.user_medals;
create policy "Users can insert own medals" on public.user_medals
  for insert with check (auth.uid() = user_id);

-- ── 13. ACTIVITY_LOG (for activity feed) ──
create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  action_type text not null, -- 'lesson_complete', 'course_complete', 'habit_check', 'medal_earned', 'level_up'
  description text not null,
  xp_gained integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.activity_log enable row level security;
drop policy if exists "Users can read own activity" on public.activity_log;
create policy "Users can read own activity" on public.activity_log
  for select using (auth.uid() = user_id);
drop policy if exists "Users can insert own activity" on public.activity_log;
create policy "Users can insert own activity" on public.activity_log
  for insert with check (auth.uid() = user_id);

-- ── 14. INDEXES for performance ──
create index if not exists idx_courses_path on public.courses(path_id);
create index if not exists idx_lessons_course on public.lessons(course_id, order_index);
create index if not exists idx_user_lesson_progress_user on public.user_lesson_progress(user_id);
create index if not exists idx_user_course_progress_user on public.user_course_progress(user_id);
create index if not exists idx_habits_path on public.habits(path_id);
create index if not exists idx_user_habits_user on public.user_habits(user_id);
create index if not exists idx_habit_logs_user_date on public.habit_logs(user_id, completed_at);
create index if not exists idx_certificates_user on public.certificates(user_id);
create index if not exists idx_user_medals_user on public.user_medals(user_id);
create index if not exists idx_activity_log_user on public.activity_log(user_id, created_at desc);

-- ============================================================
-- SEED DATA
-- ============================================================

-- ── PATHS ──
insert into public.paths (id, title, description, icon, color) values
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Career Accelerator', 'Fast-track your professional growth with structured learning, portfolio building, and career strategy.', '🚀', '#a3e635'),
  ('a1b2c3d4-0001-0001-0001-000000000002', 'Financial Freedom', 'Master personal finance, investing, and wealth building from the ground up.', '💰', '#22d3ee'),
  ('a1b2c3d4-0001-0001-0001-000000000003', 'Peak Health', 'Build sustainable fitness, nutrition, and mental health habits for life.', '💪', '#ef4444'),
  ('a1b2c3d4-0001-0001-0001-000000000004', 'Mindset Mastery', 'Develop mental resilience, emotional intelligence, and growth mindset.', '🧠', '#8b5cf6'),
  ('a1b2c3d4-0001-0001-0001-000000000005', 'Entrepreneurship', 'Learn to build, launch, and scale your own business from idea to revenue.', '⚡', '#f59e0b')
on conflict do nothing;

-- ── COURSES (Career Accelerator path — 2 complete courses) ──
insert into public.courses (id, path_id, title, description, order_index, duration_minutes) values
  ('b2c3d4e5-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001',
   'Resume & Personal Brand',
   'Craft a compelling resume, LinkedIn profile, and personal brand that makes recruiters reach out to you.',
   1, 45),
  ('b2c3d4e5-0001-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001',
   'Interview Mastery',
   'Master behavioral interviews, technical questions, salary negotiation, and follow-up strategies.',
   2, 60)
on conflict do nothing;

-- ── LESSONS — Course 1: Resume & Personal Brand (6 lessons) ──
insert into public.lessons (id, course_id, title, content, order_index, type, quiz_data) values
  -- Lesson 1
  ('c3d4e5f6-0001-0001-0001-000000000001',
   'b2c3d4e5-0001-0001-0001-000000000001',
   'Why Your Resume Matters More Than You Think',
   '## The 6-Second Rule

Recruiters spend an average of **6 seconds** on an initial resume scan. That means your resume isn''t just a document — it''s a marketing asset.

### What Makes a Resume Stand Out

Most resumes fail because they list responsibilities instead of **results**. Compare:

> ❌ "Managed social media accounts"
> ✅ "Grew Instagram following from 2K to 15K in 6 months, increasing engagement by 340%"

The difference? **Specificity and impact.**

### Key Takeaways

- Your resume is a marketing document, not a biography
- Lead with measurable results, not job descriptions
- Every bullet point should answer: "So what?"
- Tailor your resume for each role — generic resumes get generic results
- ATS (Applicant Tracking Systems) filter 75% of resumes before a human sees them',
   1, 'text', null),

  -- Lesson 2
  ('c3d4e5f6-0001-0001-0001-000000000002',
   'b2c3d4e5-0001-0001-0001-000000000001',
   'Anatomy of a Perfect Resume',
   '## Building Your Resume Section by Section

### 1. Header
Your name (large), location (city only), email, phone, LinkedIn URL, portfolio link.

**Never include:** Full address, photo (in US/UK), date of birth, marital status.

### 2. Summary (Optional but Powerful)
2-3 sentences that position you. Think of it as your elevator pitch:

> "Results-driven marketing specialist with 3+ years experience in B2B SaaS. Proven track record of increasing qualified leads by 200% through data-driven content strategies."

### 3. Experience
For each role:
- **Company name** | Job Title | Dates
- 3-5 bullet points using the **XYZ Formula**: "Accomplished [X] as measured by [Y] by doing [Z]"

### 4. Skills
Hard skills only. Group them: Programming Languages, Tools, Frameworks, Languages.

### 5. Education
Degree, institution, year. Add GPA only if > 3.5 and you''re a recent grad.

### Key Takeaways
- Use reverse chronological order (newest first)
- One page unless you have 10+ years experience
- Use consistent formatting — misaligned bullets are an instant reject
- Save as PDF (never .docx) to preserve formatting',
   2, 'text', null),

  -- Lesson 3
  ('c3d4e5f6-0001-0001-0001-000000000003',
   'b2c3d4e5-0001-0001-0001-000000000001',
   'LinkedIn: Your Digital First Impression',
   '## LinkedIn Is Your Living Resume

93% of recruiters use LinkedIn to find candidates. Your profile works 24/7 while you sleep.

### Headline Formula
Don''t just put your job title. Use this formula:

> [Role] | [Key Skill] | [Value Proposition]
> "Frontend Developer | React & TypeScript | Building accessible web experiences"

### About Section
Write in **first person**. Tell your story:
1. What you do and why you love it
2. Your key achievements (2-3 numbers)
3. What you''re looking for

### The 500+ Connections Rule
LinkedIn''s algorithm rewards profiles with 500+ connections. Connect strategically:
- Everyone you''ve worked with
- Alumni from your school
- People in your target industry
- Recruiters at companies you want

### Content Strategy
Post 2-3 times per week. Share:
- Lessons learned at work
- Industry insights with your take
- Project showcases
- Thoughtful comments on others'' posts

### Key Takeaways
- Your LinkedIn headline is your most-read sentence — make it count
- Custom URL (linkedin.com/in/yourname) looks professional
- Recommendations from colleagues are extremely valuable
- Engage with content daily — LinkedIn rewards active users',
   3, 'text', null),

  -- Lesson 4
  ('c3d4e5f6-0001-0001-0001-000000000004',
   'b2c3d4e5-0001-0001-0001-000000000001',
   'Building Your Personal Brand',
   '## You Are Already a Brand

Whether you realize it or not, people already have a perception of you. Personal branding is about **taking control** of that perception.

### The Brand Triangle

1. **Expertise** — What are you genuinely good at?
2. **Passion** — What do you love talking about?
3. **Market Need** — What do employers/clients need?

The sweet spot where all three overlap is your personal brand.

### Channels for Your Brand

Pick **2-3 maximum** and be consistent:
- **LinkedIn** — Professional insights and career content
- **Twitter/X** — Industry hot takes and networking
- **Personal Website** — Portfolio and long-form content
- **GitHub** — For developers, your code is your resume
- **Medium/Blog** — Thought leadership articles

### The 3-Post Rule
Before reaching out to anyone, make sure your last 3 posts/projects represent who you want to be seen as.

### Consistency > Perfection
Post regularly even if it''s not perfect. A consistent voice builds trust over time.

### Key Takeaways
- Personal branding is not bragging — it''s strategic visibility
- Niche down: "Marketing" is too broad, "B2B SaaS content strategy" is a brand
- Google yourself — what comes up is your current brand
- Build in public: share your learning journey, people love authenticity',
   4, 'text', null),

  -- Lesson 5 (Reflection)
  ('c3d4e5f6-0001-0001-0001-000000000005',
   'b2c3d4e5-0001-0001-0001-000000000001',
   'Define Your Brand Statement',
   '## Reflection: Your Personal Brand Statement

Now it''s your turn. Based on everything you''ve learned, write your personal brand statement.

Use this template as a starting point:

> "I help [target audience] achieve [outcome] through [your unique approach/skill]."

### Think About:
- What problems do you solve?
- Who benefits most from your work?
- What makes your approach different?
- What do people come to you for?

Take your time with this. A strong brand statement will guide every career decision you make.',
   5, 'reflection', null),

  -- Lesson 6 (Quiz)
  ('c3d4e5f6-0001-0001-0001-000000000006',
   'b2c3d4e5-0001-0001-0001-000000000001',
   'Resume & Branding Quiz',
   'Test your knowledge from this course. You need 70% to earn your certificate.',
   6, 'quiz',
   '[
     {"question": "How long do recruiters typically spend on an initial resume scan?", "options": ["30 seconds", "6 seconds", "2 minutes", "1 minute"], "correct_index": 1, "explanation": "Studies show recruiters spend an average of just 6 seconds on initial resume screening."},
     {"question": "What is the XYZ resume formula?", "options": ["Experience, Years, Zone", "Accomplished X, measured by Y, by doing Z", "eXcellent, Yielding, Zealous", "X skills, Y years, Z projects"], "correct_index": 1, "explanation": "The XYZ formula structures achievements as: Accomplished [X] as measured by [Y] by doing [Z]."},
     {"question": "What percentage of recruiters use LinkedIn to find candidates?", "options": ["50%", "73%", "93%", "65%"], "correct_index": 2, "explanation": "93% of recruiters actively use LinkedIn to search for and vet candidates."},
     {"question": "What format should you save your resume in?", "options": [".docx", ".pdf", ".txt", ".png"], "correct_index": 1, "explanation": "PDF preserves formatting across all devices and operating systems."},
     {"question": "What are the three elements of the Brand Triangle?", "options": ["Money, Fame, Power", "Expertise, Passion, Market Need", "Skills, Experience, Education", "Network, Knowledge, Luck"], "correct_index": 1, "explanation": "Your personal brand lives at the intersection of what you''re good at, what you love, and what the market needs."}
   ]')
on conflict do nothing;

-- ── LESSONS — Course 2: Interview Mastery (6 lessons) ──
insert into public.lessons (id, course_id, title, content, order_index, type, quiz_data) values
  -- Lesson 1
  ('c3d4e5f6-0002-0001-0001-000000000001',
   'b2c3d4e5-0001-0001-0001-000000000002',
   'The Interview Mindset',
   '## Interviews Are Conversations, Not Interrogations

The biggest mistake candidates make is treating interviews as tests. They''re not. They''re **mutual evaluations**.

### The Mindset Shift

> You''re not begging for a job. You''re exploring whether this role is the right fit for **both sides**.

This shift changes everything:
- You ask better questions
- You appear more confident
- You make better decisions about offers

### Preparation Framework

Before any interview, research:
1. **The Company** — Mission, recent news, culture, competitors
2. **The Role** — Key responsibilities, required skills, team structure
3. **The Interviewer** — Their LinkedIn, their background, shared connections
4. **The Industry** — Trends, challenges, opportunities

### The 80/20 Rule
80% of interview questions fall into **5 categories**:
1. Tell me about yourself
2. Why this company/role?
3. Describe a challenge you overcame
4. What are your strengths/weaknesses?
5. Where do you see yourself in 5 years?

Prepare solid answers for these and you''re ahead of 90% of candidates.

### Key Takeaways
- Interviews are two-way streets — you''re evaluating them too
- Preparation is the #1 differentiator between good and great candidates
- Confidence comes from preparation, not personality
- Every interview is practice, even if you don''t get the job',
   1, 'text', null),

  -- Lesson 2
  ('c3d4e5f6-0002-0001-0001-000000000002',
   'b2c3d4e5-0001-0001-0001-000000000002',
   'The STAR Method',
   '## Tell Stories, Not Summaries

Behavioral questions ("Tell me about a time...") are the backbone of modern interviews. The **STAR method** is your framework.

### S.T.A.R. Breakdown

**Situation** — Set the scene. Where were you? What was the context?
> "At my previous role at a SaaS startup, our customer churn rate hit 15% in Q3..."

**Task** — What was your responsibility?
> "I was tasked with identifying the root cause and proposing a retention strategy..."

**Action** — What did YOU specifically do? (Use "I", not "we")
> "I analyzed 200 exit surveys, identified 3 key pain points, and designed an onboarding revamp..."

**Result** — What happened? Use numbers.
> "Within 2 months, churn dropped to 8% and NPS increased by 25 points."

### Common STAR Mistakes

❌ Being too vague ("I improved things")
❌ Taking credit for team work without acknowledging the team
❌ Choosing irrelevant examples
❌ Forgetting the result

### Prepare 5-7 STAR Stories

These stories can be remixed for different questions:
- A time you led a project
- A conflict you resolved
- A failure and what you learned
- A time you went above and beyond
- A time you had to learn something fast
- A time you disagreed with your boss
- A time you worked under pressure

### Key Takeaways
- STAR is not optional — it''s how interviewers are trained to evaluate you
- Always end with a quantifiable result
- Practice out loud — writing answers is not enough
- The same story can answer multiple questions with different framing',
   2, 'text', null),

  -- Lesson 3
  ('c3d4e5f6-0002-0001-0001-000000000003',
   'b2c3d4e5-0001-0001-0001-000000000002',
   'Questions That Win Interviews',
   '## The Questions YOU Ask Matter More Than You Think

When interviewers say "Do you have any questions?", they''re still evaluating you. This is not a courtesy — it''s a test.

### Questions That Impress

**About the Role:**
- "What does success look like in the first 90 days?"
- "What''s the biggest challenge someone in this role will face?"
- "How does this role contribute to the company''s key objectives?"

**About the Team:**
- "Can you describe the team dynamic?"
- "How does the team handle disagreements?"
- "What''s the management style of the team lead?"

**About Growth:**
- "What does the career path look like for this role?"
- "How does the company invest in employee development?"
- "Where have previous people in this role moved on to?"

**About the Company:**
- "What''s the company''s biggest priority this year?"
- "How has the company culture evolved recently?"

### Questions to NEVER Ask
❌ "What does your company do?" (Shows zero research)
❌ "How soon can I get promoted?" (Premature)
❌ "What''s the vacation policy?" (Not in first interview)
❌ "Did I get the job?" (Puts them in an awkward position)

### The Power Question
Always end with this:

> "Is there anything about my background that gives you hesitation about my fit for this role?"

This gives you a chance to address concerns **before** they make a decision without you.

### Key Takeaways
- Prepare at least 5 questions for every interview
- Tailor questions to the specific interviewer (HR vs. hiring manager vs. CEO)
- Ask follow-up questions — it shows genuine curiosity
- The power question can literally change the outcome',
   3, 'text', null),

  -- Lesson 4
  ('c3d4e5f6-0002-0001-0001-000000000004',
   'b2c3d4e5-0001-0001-0001-000000000002',
   'Salary Negotiation',
   '## You Leave Money on the Table When You Don''t Negotiate

Studies show that **not negotiating** your first salary can cost you over **$1 million** in lifetime earnings (compounding raises, bonuses, retirement contributions).

### The Negotiation Framework

**Step 1: Know Your Number**
Research salary ranges using:
- Glassdoor, Levels.fyi, Payscale
- LinkedIn Salary Insights
- Ask people in similar roles (yes, it''s okay)

**Step 2: Delay the Number**
If asked "What are your salary expectations?":

> "I''d love to learn more about the role first. I''m sure we can find a number that works for both sides."

If pressed:

> "Based on my research and experience, I''m looking at the range of $X to $Y."

Always give a range where your target is the **bottom** of the range.

**Step 3: Let Them Go First**
The first person to name a number has less power. Try to get their range first.

**Step 4: Negotiate the Package, Not Just Salary**
If salary is fixed, negotiate:
- Signing bonus
- Remote work days
- Professional development budget
- Extra vacation days
- Stock options / equity
- Title

**Step 5: Get It in Writing**
Verbal offers mean nothing. Don''t resign from your current job until you have a signed offer letter.

### Key Takeaways
- Not negotiating is the most expensive mistake in your career
- Always research market rates before any salary conversation
- Negotiate from data, not emotion
- The offer is never final — everything is negotiable
- Be enthusiastic AND firm: "I''m very excited about this. To make it work, I''d need..."',
   4, 'text', null),

  -- Lesson 5 (Reflection)
  ('c3d4e5f6-0002-0001-0001-000000000005',
   'b2c3d4e5-0001-0001-0001-000000000002',
   'Your Interview Preparation Plan',
   '## Reflection: Build Your Interview Game Plan

Create your personal interview preparation plan. Think about your next interview (real or hypothetical).

### Prepare:
1. **Your "Tell me about yourself" pitch** (60 seconds, structured as: Past → Present → Future)
2. **3 STAR stories** you can use for behavioral questions
3. **5 questions** you will ask the interviewer
4. **Your salary range** based on market research
5. **Your power question** for the end of the interview

Write out your plan below. The more specific, the more useful this will be for you.',
   5, 'reflection', null),

  -- Lesson 6 (Quiz)
  ('c3d4e5f6-0002-0001-0001-000000000006',
   'b2c3d4e5-0001-0001-0001-000000000002',
   'Interview Mastery Quiz',
   'Test your knowledge from this course. You need 70% to earn your certificate.',
   6, 'quiz',
   '[
     {"question": "What does STAR stand for?", "options": ["Skills, Training, Achievement, Results", "Situation, Task, Action, Result", "Strategy, Tactics, Analysis, Review", "Strengths, Threats, Actions, Responses"], "correct_index": 1, "explanation": "STAR stands for Situation, Task, Action, Result — the standard framework for behavioral interview answers."},
     {"question": "What should you do when asked about salary expectations early?", "options": ["Name your dream salary immediately", "Say you''ll work for anything", "Deflect and learn more about the role first", "Ask what the last person earned"], "correct_index": 2, "explanation": "Delaying the salary conversation gives you more information and negotiating power."},
     {"question": "How many STAR stories should you prepare?", "options": ["1-2", "5-7", "10-15", "You don''t need to prepare"], "correct_index": 1, "explanation": "5-7 stories is ideal — enough to cover most behavioral questions with different framing."},
     {"question": "What is the ''power question'' at the end of an interview?", "options": ["When do I start?", "What''s the salary?", "Is there anything about my background that gives you hesitation?", "How many candidates are you interviewing?"], "correct_index": 2, "explanation": "This question lets you address concerns before they make a decision without your input."},
     {"question": "Why is not negotiating salary so costly?", "options": ["It only affects one year", "Compounding raises mean lifetime losses of $1M+", "It doesn''t matter", "Companies always pay fairly"], "correct_index": 1, "explanation": "A lower starting salary compounds through raises, bonuses, and retirement contributions — potentially costing $1M+ over a career."}
   ]')
on conflict do nothing;

-- ── HABITS — All 5 paths ──
insert into public.habits (id, path_id, title, description, icon, frequency) values
  -- Career Accelerator
  ('d4e5f6a7-0001-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000001', 'Update your portfolio', 'Spend 20 minutes improving your portfolio or resume', '📄', 'daily'),
  ('d4e5f6a7-0001-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000001', 'Network with one person', 'Send a meaningful message to a new connection', '🤝', 'daily'),
  ('d4e5f6a7-0001-0001-0001-000000000003', 'a1b2c3d4-0001-0001-0001-000000000001', 'Learn something new', 'Read an article or watch a tutorial in your field', '📚', 'daily'),
  ('d4e5f6a7-0001-0001-0001-000000000004', 'a1b2c3d4-0001-0001-0001-000000000001', 'Practice interview answers', 'Rehearse one STAR story out loud', '🎤', 'daily'),
  ('d4e5f6a7-0001-0001-0001-000000000005', 'a1b2c3d4-0001-0001-0001-000000000001', 'Apply to a job', 'Submit one tailored job application', '🎯', 'weekly'),
  -- Financial Freedom
  ('d4e5f6a7-0002-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000002', 'Track your spending', 'Log all expenses for the day', '💳', 'daily'),
  ('d4e5f6a7-0002-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000002', 'Read about finance', 'Spend 15 min reading about investing or budgeting', '📖', 'daily'),
  ('d4e5f6a7-0002-0001-0001-000000000003', 'a1b2c3d4-0001-0001-0001-000000000002', 'No unnecessary purchases', 'Avoid impulse buys today', '🚫', 'daily'),
  ('d4e5f6a7-0002-0001-0001-000000000004', 'a1b2c3d4-0001-0001-0001-000000000002', 'Review your budget', 'Check your weekly budget and adjust', '📊', 'weekly'),
  -- Peak Health
  ('d4e5f6a7-0003-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000003', 'Exercise for 30 minutes', 'Any physical activity — gym, walk, sports', '🏃', 'daily'),
  ('d4e5f6a7-0003-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000003', 'Drink 2L of water', 'Stay hydrated throughout the day', '💧', 'daily'),
  ('d4e5f6a7-0003-0001-0001-000000000003', 'a1b2c3d4-0001-0001-0001-000000000003', 'Eat a healthy meal', 'Have at least one balanced, nutritious meal', '🥗', 'daily'),
  ('d4e5f6a7-0003-0001-0001-000000000004', 'a1b2c3d4-0001-0001-0001-000000000003', 'Sleep 7+ hours', 'Get adequate sleep for recovery', '😴', 'daily'),
  ('d4e5f6a7-0003-0001-0001-000000000005', 'a1b2c3d4-0001-0001-0001-000000000003', 'Meal prep for the week', 'Prepare healthy meals in advance', '🍳', 'weekly'),
  -- Mindset Mastery
  ('d4e5f6a7-0004-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000004', 'Meditate for 10 minutes', 'Guided or silent meditation', '🧘', 'daily'),
  ('d4e5f6a7-0004-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000004', 'Journal your thoughts', 'Write about your day, goals, or reflections', '📝', 'daily'),
  ('d4e5f6a7-0004-0001-0001-000000000003', 'a1b2c3d4-0001-0001-0001-000000000004', 'Read for 20 minutes', 'Read a book on mindset, psychology, or growth', '📚', 'daily'),
  ('d4e5f6a7-0004-0001-0001-000000000004', 'a1b2c3d4-0001-0001-0001-000000000004', 'Practice gratitude', 'Write 3 things you are grateful for', '🙏', 'daily'),
  ('d4e5f6a7-0004-0001-0001-000000000005', 'a1b2c3d4-0001-0001-0001-000000000004', 'Weekly life review', 'Reflect on wins, lessons, and goals for next week', '🔍', 'weekly'),
  -- Entrepreneurship
  ('d4e5f6a7-0005-0001-0001-000000000001', 'a1b2c3d4-0001-0001-0001-000000000005', 'Work on your business idea', 'Spend 30 minutes building your venture', '💡', 'daily'),
  ('d4e5f6a7-0005-0001-0001-000000000002', 'a1b2c3d4-0001-0001-0001-000000000005', 'Talk to a potential customer', 'Validate your idea with real people', '🗣️', 'daily'),
  ('d4e5f6a7-0005-0001-0001-000000000003', 'a1b2c3d4-0001-0001-0001-000000000005', 'Study a successful founder', 'Read or watch content about someone who built what you want', '🎓', 'daily'),
  ('d4e5f6a7-0005-0001-0001-000000000004', 'a1b2c3d4-0001-0001-0001-000000000005', 'Track your metrics', 'Record key numbers for your project', '📈', 'daily'),
  ('d4e5f6a7-0005-0001-0001-000000000005', 'a1b2c3d4-0001-0001-0001-000000000005', 'Review weekly progress', 'Assess what worked, what didn''t, and plan next steps', '🗺️', 'weekly')
on conflict do nothing;

-- ── MEDALS (10 medals) ──
insert into public.medals (id, title, description, icon, condition_type, condition_value, xp_reward) values
  ('e5f6a7b8-0001-0001-0001-000000000001', 'First Step', 'Complete your first lesson', '🌱', 'lessons_completed', 1, 50),
  ('e5f6a7b8-0001-0001-0001-000000000002', 'Habit Starter', 'Check in a habit for the first time', '✅', 'habits_completed', 1, 50),
  ('e5f6a7b8-0001-0001-0001-000000000003', 'On Fire', 'Reach a 7-day habit streak', '🔥', 'habit_streak', 7, 50),
  ('e5f6a7b8-0001-0001-0001-000000000004', 'Scholar', 'Complete your first course', '📜', 'courses_completed', 1, 50),
  ('e5f6a7b8-0001-0001-0001-000000000005', 'Dedicated', 'Reach a 30-day habit streak', '💎', 'habit_streak', 30, 50),
  ('e5f6a7b8-0001-0001-0001-000000000006', 'Collector', 'Earn 3 certificates', '🏆', 'certificates_earned', 3, 50),
  ('e5f6a7b8-0001-0001-0001-000000000007', 'Level Up', 'Reach Level 3', '⚡', 'level_reached', 3, 50),
  ('e5f6a7b8-0001-0001-0001-000000000008', 'Early Bird', 'Complete onboarding', '🐣', 'onboarding_complete', 1, 50),
  ('e5f6a7b8-0001-0001-0001-000000000009', 'Perfectionist', 'Score 100% on a quiz', '💯', 'perfect_quiz', 1, 50),
  ('e5f6a7b8-0001-0001-0001-000000000010', 'Unstoppable', 'Reach a 100-day habit streak', '🔱', 'habit_streak', 100, 50)
on conflict do nothing;

-- ══════════════════════════════════════════════
-- Quiz profile columns (idempotent)
-- ══════════════════════════════════════════════
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS quiz_profile text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS quiz_scores jsonb;
