/**
 * Central course + lesson registry.
 * All course content lives here — CourseDetailPage and LessonPage look up by ID.
 */
import type { Course, Lesson, Path } from '../lib/database.types';

// ── Paths ──
export const PATHS: Record<string, Path> = {
  'p1': { id: 'p1', title: 'Career Accelerator',  description: 'Fast-track your professional growth with proven career strategies.', icon: '🚀', color: '#6366f1', created_at: '' },
  'p2': { id: 'p2', title: 'Financial Freedom',    description: 'Master money management, investing, and building lasting wealth.', icon: '💰', color: '#22c55e', created_at: '' },
  'p3': { id: 'p3', title: 'Mindset Mastery',      description: 'Build mental resilience, focus, and a growth-oriented mindset.', icon: '🧠', color: '#a855f7', created_at: '' },
  'p4': { id: 'p4', title: 'Entrepreneurship',     description: 'Turn your ideas into a real business from day one.', icon: '💡', color: '#f59e0b', created_at: '' },
};

// ── Courses ──
export interface RegistryCourse extends Course {
  lessons: Lesson[];
}

export const COURSES: Record<string, RegistryCourse> = {
  // ═══════════════════════════════════════════
  // 1. Python Fundamentals — Career Accelerator
  // ═══════════════════════════════════════════
  'mock-1': {
    id: 'mock-1',
    title: 'Python Fundamentals',
    description: 'Learn Python from scratch — variables, loops, functions, and more. The most in-demand language for beginners and professionals.',
    path_id: 'p1',
    order_index: 1,
    duration_minutes: 45,
    prerequisite_course_id: null,
    created_at: '',
    lessons: [
      {
        id: 'py-1', course_id: 'mock-1', title: 'What is Python?', order_index: 1, type: 'text', quiz_data: null, created_at: '',
        content: `Python is a high-level, interpreted programming language known for its clear syntax and readability.

Created by Guido van Rossum and first released in 1991, Python has grown into one of the most popular programming languages in the world. It consistently ranks in the top 3 languages on every developer survey.

Why Python?
• Easy to learn — reads almost like English
• Incredibly versatile — web apps, data science, AI, automation, scripting
• Massive ecosystem — over 400,000 packages on PyPI
• Huge community — millions of developers, endless tutorials and support
• Cross-platform — runs on Windows, Mac, Linux, and more

Python is used by companies like Google, Netflix, Instagram, Spotify, NASA, and countless startups. Whether you want to build websites, analyse data, train AI models, or automate boring tasks — Python is the language to start with.

In this course, you'll learn the core building blocks: variables, data types, control flow, functions, and how to think like a programmer.`,
      },
      {
        id: 'py-2', course_id: 'mock-1', title: 'Variables & Data Types', order_index: 2, type: 'text', quiz_data: null, created_at: '',
        content: `Variables are containers for storing data values. Think of them as labelled boxes where you put information.

In Python, you create a variable simply by assigning a value with the = sign:

  name = "Alice"
  age = 25
  height = 5.6
  is_student = True

Python figures out the data type automatically — you don't need to declare it.

Common data types:
• str (string) — text wrapped in quotes: "hello", 'world'
• int (integer) — whole numbers: 42, -7, 0
• float — decimal numbers: 3.14, -0.5
• bool (boolean) — True or False
• list — ordered collection: [1, 2, 3]
• dict (dictionary) — key-value pairs: {"name": "Alice", "age": 25}

You can check a variable's type with type():
  print(type(name))   # <class 'str'>
  print(type(age))    # <class 'int'>

Naming rules:
• Must start with a letter or underscore
• Can contain letters, numbers, underscores
• Case-sensitive (Name ≠ name)
• Use snake_case by convention: my_variable_name

Variables are fundamental — every program uses them to store, transform, and pass data around.`,
      },
      {
        id: 'py-3', course_id: 'mock-1', title: 'Loops & Conditions', order_index: 3, type: 'text', quiz_data: null, created_at: '',
        content: `Control flow lets your program make decisions and repeat actions. Without it, code would just run line by line with no logic.

Conditions (if / elif / else):

  age = 18
  if age >= 18:
      print("You're an adult")
  elif age >= 13:
      print("You're a teenager")
  else:
      print("You're a child")

Python uses indentation (4 spaces) to define code blocks — no curly braces needed.

Comparison operators:
  ==  equal to          !=  not equal
  >   greater than      <   less than
  >=  greater or equal  <=  less or equal

Logical operators:
  and — both true       or — at least one true       not — reverse

Loops — for:
  fruits = ["apple", "banana", "cherry"]
  for fruit in fruits:
      print(fruit)

  for i in range(5):    # 0, 1, 2, 3, 4
      print(i)

Loops — while:
  count = 5
  while count > 0:
      print(count)
      count -= 1

Control keywords:
• break — exit the loop immediately
• continue — skip to next iteration
• pass — do nothing (placeholder)

Master these and you can build any logic you can imagine.`,
      },
      {
        id: 'py-4', course_id: 'mock-1', title: 'Functions', order_index: 4, type: 'text', quiz_data: null, created_at: '',
        content: `Functions are reusable blocks of code that perform a specific task. They're one of the most important concepts in programming.

Defining a function:
  def greet(name):
      return f"Hello, {name}!"

  result = greet("World")
  print(result)  # Hello, World!

The def keyword defines a function. Parameters go in parentheses. return sends a value back.

Why use functions?
• Reusability — write once, use many times
• Organisation — break complex problems into small, named pieces
• Testing — test each function independently
• Readability — self-documenting code

Default parameters:
  def greet(name, greeting="Hello"):
      return f"{greeting}, {name}!"

  greet("Alice")            # Hello, Alice!
  greet("Bob", "Hey")       # Hey, Bob!

Multiple return values:
  def get_stats(numbers):
      return min(numbers), max(numbers), sum(numbers)

  low, high, total = get_stats([3, 1, 4, 1, 5])

Scope:
Variables defined inside a function are local — they don't exist outside it. This prevents naming conflicts.

  def calculate():
      x = 10       # local variable
      return x * 2

  # print(x)  ← would cause an error

Functions are the building blocks of clean, maintainable code. As your programs grow, functions keep them organised and manageable.`,
      },
      {
        id: 'py-5', course_id: 'mock-1', title: 'Final Quiz', order_index: 5, type: 'quiz', created_at: '',
        content: 'Test your knowledge of Python fundamentals. Answer all questions, then submit to see your score.',
        quiz_data: [
          { question: 'What type is the value 3.14?', options: ['str', 'int', 'float', 'bool'], correct_index: 2, explanation: '3.14 is a decimal number, so its type is float.' },
          { question: 'Which keyword defines a function in Python?', options: ['func', 'function', 'def', 'define'], correct_index: 2, explanation: 'Python uses the "def" keyword to define functions.' },
          { question: 'What does range(3) produce?', options: ['[1, 2, 3]', '[0, 1, 2]', '[0, 1, 2, 3]', '[3]'], correct_index: 1, explanation: 'range(3) produces 0, 1, 2 — it starts at 0 and stops before 3.' },
          { question: 'Which operator checks equality?', options: ['=', '==', '===', ':='], correct_index: 1, explanation: '== is the equality operator. = is assignment. Python doesn\'t use ===.' },
          { question: 'What will print(type("hello")) output?', options: ["<class 'int'>", "<class 'str'>", "<class 'list'>", "<class 'bool'>"], correct_index: 1, explanation: '"hello" is a string, so type() returns <class \'str\'>.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 2. Financial Literacy 101 — Financial Freedom
  // ═══════════════════════════════════════════
  'mock-2': {
    id: 'mock-2',
    title: 'Financial Literacy 101',
    description: 'Master budgeting, saving, investing, and building wealth step by step.',
    path_id: 'p2',
    order_index: 1,
    duration_minutes: 35,
    prerequisite_course_id: null,
    created_at: '',
    lessons: [
      {
        id: 'fin-1', course_id: 'mock-2', title: 'Why Financial Literacy Matters', order_index: 1, type: 'text', quiz_data: null, created_at: '',
        content: `Financial literacy is the ability to understand and effectively use various financial skills — budgeting, saving, investing, and managing debt.

Why it matters:
Most schools don't teach money management. Yet every adult decision involves money — rent, food, insurance, taxes, retirement. Studies show that financially literate people:
• Carry less debt
• Save more for emergencies
• Invest earlier and more consistently
• Experience less financial stress

The wealth gap isn't just about income — it's about knowledge. Two people earning the same salary can end up in vastly different financial positions depending on how they manage their money.

Key principles to live by:
1. Spend less than you earn — always
2. Pay yourself first — save before you spend
3. Understand the difference between assets and liabilities
4. Avoid high-interest debt like credit card balances
5. Start investing early — time is your greatest advantage

This course will teach you practical frameworks to take control of your money, even if you're starting from zero. No jargon, no complexity — just clear steps you can apply today.`,
      },
      {
        id: 'fin-2', course_id: 'mock-2', title: 'Budgeting That Actually Works', order_index: 2, type: 'text', quiz_data: null, created_at: '',
        content: `A budget isn't about restriction — it's about awareness and intention. It tells your money where to go instead of wondering where it went.

The 50/30/20 Rule (a simple starting framework):
• 50% Needs — rent, groceries, utilities, insurance, transport
• 30% Wants — dining out, subscriptions, hobbies, entertainment
• 20% Savings & Debt — emergency fund, investments, loan payments

How to start budgeting:
1. Track everything for 30 days — every coffee, every subscription
2. Categorise your spending into Needs, Wants, and Savings
3. Identify leaks — subscriptions you forgot about, impulse buys
4. Set realistic limits for each category
5. Automate savings — set up automatic transfers on payday

Tools you can use:
• Spreadsheets (Google Sheets, Excel) — full control
• Budgeting apps (YNAB, Mint, Buddy) — automatic tracking
• The envelope method — cash in labelled envelopes for physical discipline

Common budgeting mistakes:
• Being too restrictive (burnout is real)
• Not accounting for irregular expenses (car repairs, gifts)
• Giving up after one bad month — consistency beats perfection

A budget is a living document. Review it monthly, adjust as your life changes, and remember: the best budget is the one you actually follow.`,
      },
      {
        id: 'fin-3', course_id: 'mock-2', title: 'Emergency Funds & Saving', order_index: 3, type: 'text', quiz_data: null, created_at: '',
        content: `An emergency fund is your financial safety net. It covers unexpected expenses so you don't go into debt when life throws curveballs.

How much should you save?
• Starter goal: €1,000 — covers most small emergencies
• Full goal: 3–6 months of living expenses
• If self-employed: aim for 6–12 months

What counts as an emergency?
✅ Job loss, medical bills, urgent car/home repair
❌ A sale on something you want, a planned vacation

Where to keep it:
• A separate high-yield savings account — not your everyday account
• It should be accessible within 1–2 days, but not so easy to spend impulsively
• Don't invest your emergency fund — it needs to be stable and liquid

How to build it:
1. Start small — even €50/month adds up
2. Automate it — set up a recurring transfer on payday
3. Use windfalls — tax refunds, bonuses, gifts → straight to the fund
4. Cut one unnecessary expense and redirect that money

The psychological power:
Having an emergency fund reduces financial anxiety dramatically. You sleep better knowing that a flat tyre, a broken phone, or a job change won't derail your life.

Once your emergency fund is full, redirect that monthly contribution to investing — that's where real wealth building begins.`,
      },
      {
        id: 'fin-4', course_id: 'mock-2', title: 'Intro to Investing', order_index: 4, type: 'text', quiz_data: null, created_at: '',
        content: `Investing is how you make your money work for you. Saving protects what you have; investing grows it.

The power of compound interest:
If you invest €200/month starting at age 20 with an average 8% annual return:
• By age 30: ~€36,000
• By age 40: ~€118,000
• By age 60: ~€700,000

That's €96,000 of your own money and over €600,000 in growth. Time is the most powerful investment tool.

Common investment types:
1. Stocks — owning a piece of a company. Higher risk, higher potential return.
2. Bonds — lending money to a government/company. Lower risk, stable returns.
3. Index Funds/ETFs — baskets of many stocks. Diversified and low-cost. This is where most beginners should start.
4. Real Estate — property for rental income or appreciation.

Key concepts:
• Diversification — don't put all eggs in one basket
• Dollar-cost averaging — invest a fixed amount regularly, regardless of market price
• Risk tolerance — how much volatility can you handle without panicking?
• Fees matter — a 2% fee vs 0.1% fee compounds to massive differences over decades

Getting started:
1. Open a brokerage account (Interactive Brokers, DeGiro, etc.)
2. Start with a low-cost global index fund (e.g., VWCE, IWDA)
3. Set up automatic monthly contributions
4. Don't check it daily — invest and forget

The biggest risk isn't investing — it's NOT investing and letting inflation silently eat your savings.`,
      },
      {
        id: 'fin-5', course_id: 'mock-2', title: 'Understanding Debt', order_index: 5, type: 'text', quiz_data: null, created_at: '',
        content: `Not all debt is created equal. Understanding the difference between good debt and bad debt is crucial.

Good debt — helps you build wealth or increase earning potential:
• Student loans (if for a high-value degree)
• Mortgage (building equity instead of paying rent)
• Business loans (invested in revenue-generating activities)

Bad debt — costs you money and buys depreciating assets:
• Credit card debt (15–25% interest rates!)
• Car loans on luxury vehicles you can't afford
• Buy-now-pay-later for non-essentials
• Payday loans (predatory interest rates)

The debt avalanche method (mathematically optimal):
1. List all debts with their interest rates
2. Make minimum payments on all debts
3. Put every extra euro toward the highest-interest debt
4. Once it's paid off, move to the next highest

The debt snowball method (psychologically motivating):
1. Same as above, but target the smallest balance first
2. Quick wins build momentum and motivation

Key rules:
• Never carry a credit card balance if you can avoid it
• If you can't pay cash for a depreciating asset, you can't afford it
• Your debt-to-income ratio should stay below 30%
• Negotiate lower interest rates — call your bank and ask

Freedom from high-interest debt is the foundation of financial health. Once you're debt-free (except mortgage/student loans), your money starts working for you instead of for banks.`,
      },
      {
        id: 'fin-6', course_id: 'mock-2', title: 'Financial Literacy Quiz', order_index: 6, type: 'quiz', created_at: '',
        content: 'Test your financial knowledge with this quiz.',
        quiz_data: [
          { question: 'What is the recommended size for a full emergency fund?', options: ['€500', '1 month of expenses', '3–6 months of expenses', '1 year of salary'], correct_index: 2, explanation: 'Financial experts recommend 3–6 months of living expenses as a full emergency fund.' },
          { question: 'In the 50/30/20 budget, what does the 20% cover?', options: ['Needs', 'Wants', 'Savings & debt repayment', 'Taxes'], correct_index: 2, explanation: 'The 20% portion goes toward savings, investments, and paying down debt.' },
          { question: 'Which investment type offers the best diversification for beginners?', options: ['Individual stocks', 'Cryptocurrency', 'Index funds/ETFs', 'Real estate'], correct_index: 2, explanation: 'Index funds contain many stocks in one purchase, providing instant diversification at low cost.' },
          { question: 'Which debt repayment method targets the highest interest rate first?', options: ['Snowball', 'Avalanche', 'Consolidation', 'Minimum payment'], correct_index: 1, explanation: 'The avalanche method prioritises the highest-interest debt, saving the most money over time.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 3. Mindset & Resilience — Mindset Mastery
  // ═══════════════════════════════════════════
  'mock-3': {
    id: 'mock-3',
    title: 'Mindset & Resilience',
    description: 'Build mental toughness, overcome self-doubt, and develop a growth mindset that fuels lifelong learning.',
    path_id: 'p3',
    order_index: 1,
    duration_minutes: 30,
    prerequisite_course_id: null,
    created_at: '',
    lessons: [
      {
        id: 'mind-1', course_id: 'mock-3', title: 'Fixed vs Growth Mindset', order_index: 1, type: 'text', quiz_data: null, created_at: '',
        content: `Stanford psychologist Carol Dweck spent decades researching how people think about their abilities. She discovered two fundamentally different mindsets:

Fixed Mindset: "I'm either good at it or I'm not."
• Avoids challenges (fear of looking dumb)
• Gives up easily when things get hard
• Sees effort as pointless — "if I were talented, it wouldn't be this hard"
• Ignores criticism
• Feels threatened by others' success

Growth Mindset: "I can improve with effort and strategy."
• Embraces challenges as opportunities to grow
• Persists through setbacks
• Sees effort as the path to mastery
• Learns from criticism
• Finds inspiration in others' success

The critical insight: your mindset is not fixed. You can shift from a fixed mindset to a growth mindset with awareness and practice.

How to build a growth mindset:
1. Notice your self-talk — "I can't do this" → "I can't do this yet"
2. Reframe failure as data — "What did this teach me?"
3. Focus on process, not outcome — celebrate effort and learning
4. Surround yourself with growth-minded people
5. Give yourself permission to be a beginner

Research shows that students, athletes, and professionals who adopt a growth mindset consistently outperform those with fixed mindsets — not because they're born smarter, but because they never stop learning.`,
      },
      {
        id: 'mind-2', course_id: 'mock-3', title: 'The Science of Habits', order_index: 2, type: 'text', quiz_data: null, created_at: '',
        content: `Up to 40% of your daily actions are habits — automatic behaviours you do without thinking. Understanding how habits work gives you the power to redesign your life.

The Habit Loop (from Charles Duhigg's research):
1. Cue — a trigger that initiates the behaviour (time, location, emotion, event)
2. Routine — the behaviour itself (what you actually do)
3. Reward — the benefit you get (pleasure, relief, satisfaction)

To build a new habit:
• Make the Cue obvious — "After I pour my morning coffee, I'll journal for 5 minutes"
• Make the Routine easy — start ridiculously small (2 minutes)
• Make the Reward satisfying — track it, celebrate small wins

To break a bad habit:
• Make the Cue invisible — remove triggers from your environment
• Make the Routine difficult — add friction (e.g., delete apps, keep junk food out of the house)
• Make the Reward unsatisfying — track the consequences

Habit stacking (from James Clear's "Atomic Habits"):
Attach a new habit to an existing one:
  "After I [EXISTING HABIT], I will [NEW HABIT]"
  "After I brush my teeth, I will do 10 push-ups"
  "After I sit at my desk, I will write my top 3 priorities"

The 1% rule: If you improve just 1% every day, you'll be 37x better in a year. It's not about massive transformations — it's about consistent tiny improvements that compound over time.

Identity-based habits: Don't say "I'm trying to read more." Say "I'm a reader." Habits that align with the person you want to become are far more sustainable.`,
      },
      {
        id: 'mind-3', course_id: 'mock-3', title: 'Overcoming Self-Doubt', order_index: 3, type: 'text', quiz_data: null, created_at: '',
        content: `Self-doubt is the inner voice that says "you're not good enough" or "who are you to try this?" Everyone experiences it — even the most successful people.

Impostor Syndrome:
70% of people experience impostor syndrome at some point. It's the belief that you're a fraud despite evidence of your competence. Common among high achievers, new learners, and anyone stepping outside their comfort zone.

Types of impostor syndrome:
• The Perfectionist — "If it's not flawless, I failed"
• The Expert — "I don't know everything, so I'm not ready"
• The Natural Genius — "If it doesn't come easy, I'm not talented"
• The Soloist — "If I need help, I'm a fake"
• The Super-person — "I should be able to do it all"

How to fight self-doubt:
1. Name it — "That's impostor syndrome talking, not reality"
2. Evidence log — keep a record of accomplishments, compliments, and wins
3. Normalise struggle — every expert was once a clueless beginner
4. Talk about it — you'll find everyone feels this way
5. Take action despite the doubt — courage isn't the absence of fear

Reframe the narrative:
• "I don't belong here" → "I earned my place, and I'm still growing"
• "Everyone will find out I'm faking" → "I'm learning in real-time, and that's okay"
• "I should know this by now" → "I'm exactly where I need to be on my journey"

The antidote to self-doubt is not confidence — it's action. Every time you act despite the doubt, you build evidence that you're capable. Over time, the evidence wins.`,
      },
      {
        id: 'mind-4', course_id: 'mock-3', title: 'Building Resilience', order_index: 4, type: 'text', quiz_data: null, created_at: '',
        content: `Resilience isn't about never falling — it's about how quickly and effectively you get back up.

The resilience framework (based on psychology research):

1. Emotional awareness
Recognise what you're feeling without judging it. "I'm frustrated" is informational, not a verdict on your character. Suppressing emotions doesn't build resilience — processing them does.

2. Cognitive flexibility
Train yourself to see situations from multiple angles:
• "This is a disaster" → "This is a setback. What can I learn?"
• "Everything always goes wrong" → "This specific thing went wrong. What can I do differently?"

3. Social connection
Resilient people aren't lone wolves. They have support networks — friends, mentors, communities. Reach out, share your struggles, and let others help. Asking for help is a sign of strength, not weakness.

4. Purpose and meaning
People bounce back faster when they're connected to a purpose larger than themselves. Your "why" is your anchor during storms.

5. Self-care as discipline
Sleep, exercise, nutrition, and rest aren't luxuries — they're foundations. You can't be resilient on 4 hours of sleep and energy drinks.

The stress inoculation model:
Like a vaccine, controlled exposure to challenges builds your resilience capacity. Each time you face and overcome a difficulty, you become stronger.

Practical daily practices:
• Journaling — process your thoughts and emotions in writing
• Meditation — even 5 minutes improves emotional regulation
• Cold exposure — cold showers train your stress response
• Gratitude — write 3 things you're grateful for each day
• Reflection — "What went well? What can I improve?"`,
      },
      {
        id: 'mind-5', course_id: 'mock-3', title: 'Mindset Reflection', order_index: 5, type: 'reflection', quiz_data: null, created_at: '',
        content: `Take a moment to reflect on what you've learned about mindset and resilience.

Think about these questions:

1. Do you tend toward a fixed or growth mindset? In which areas of your life?
2. What is one habit you'd like to build, and what cue could you attach it to?
3. When was the last time self-doubt held you back? How would you handle it differently now?
4. What is your personal "why" — the purpose that keeps you going?

Write your honest reflections below. There are no wrong answers — this is your private space to think.`,
      },
      {
        id: 'mind-6', course_id: 'mock-3', title: 'Mindset Quiz', order_index: 6, type: 'quiz', created_at: '',
        content: 'Check your understanding of the key mindset concepts.',
        quiz_data: [
          { question: 'What is the core belief of a growth mindset?', options: ['Talent is everything', 'Abilities can be developed through effort', 'Some people are just born smart', 'Failure means you should quit'], correct_index: 1, explanation: 'A growth mindset believes abilities can be developed through dedication and hard work.' },
          { question: 'What are the three parts of the Habit Loop?', options: ['Plan, Execute, Review', 'Cue, Routine, Reward', 'Trigger, Action, Result', 'Start, Middle, End'], correct_index: 1, explanation: 'Charles Duhigg identified the Habit Loop as Cue → Routine → Reward.' },
          { question: 'What percentage of people experience impostor syndrome?', options: ['10%', '30%', '50%', '70%'], correct_index: 3, explanation: 'Research shows approximately 70% of people experience impostor syndrome at some point.' },
          { question: 'Which is NOT a component of building resilience?', options: ['Emotional awareness', 'Avoiding all stress', 'Social connection', 'Purpose and meaning'], correct_index: 1, explanation: 'Avoiding all stress actually reduces resilience. Controlled exposure to challenges builds it.' },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 4. Start Your Side Hustle — Entrepreneurship
  // ═══════════════════════════════════════════
  'mock-4': {
    id: 'mock-4',
    title: 'Start Your Side Hustle',
    description: 'From idea to first customer — learn to validate, build, and launch a real business in 30 days.',
    path_id: 'p4',
    order_index: 1,
    duration_minutes: 50,
    prerequisite_course_id: null,
    created_at: '',
    lessons: [
      {
        id: 'hustle-1', course_id: 'mock-4', title: 'The Side Hustle Mindset', order_index: 1, type: 'text', quiz_data: null, created_at: '',
        content: `A side hustle is a business you build alongside your main job or studies. It's how many of today's biggest companies started — think Apple (garage), Amazon (Jeff Bezos's home office), and Instagram (a side project).

Why start a side hustle?
• Extra income — reduce financial stress, build savings faster
• Skill building — entrepreneurship teaches marketing, sales, design, communication
• Freedom — build something you own, not just work for someone else's dream
• Low risk — you keep your main income while testing ideas
• Discovery — find what you're genuinely passionate about

The mindset shift:
Employee thinking: "What tasks do I need to complete?"
Entrepreneur thinking: "What problems can I solve? Who will pay for the solution?"

Common fears (and reality checks):
• "I don't have a good enough idea" → You don't need a unique idea, just a better execution
• "I don't have time" → Start with 5 hours/week. Many successful businesses launched on 10 hrs/week
• "I don't have money" → Many businesses cost €0–€100 to start. Skills and hustle beat capital
• "What if I fail?" → 'Failure' is just market research. You learn what doesn't work and iterate

The One Rule:
Don't spend months planning in secret. Get something out there fast, talk to real people, and iterate based on feedback. The market will teach you more than any business book.`,
      },
      {
        id: 'hustle-2', course_id: 'mock-4', title: 'Finding Your Idea', order_index: 2, type: 'text', quiz_data: null, created_at: '',
        content: `The best business ideas solve real problems that people already have. You don't need to invent something revolutionary — you need to find a pain point and serve it better.

Idea generation frameworks:

1. The Skill Stack
List your skills, interests, and experiences. Where do they overlap with market demand?
  My skills: writing, Python, fitness
  Market need: People want to learn Python
  Idea: Python tutorials blog / YouTube channel / tutoring

2. The Problem Journal
For one week, write down every frustration, annoyance, or inefficiency you notice:
  "I can never find a good café to work from"
  "Scheduling meetings with multiple people is a nightmare"
  "I waste 30 minutes deciding what to cook"

Each frustration is a potential business.

3. The Copy & Improve Method
Look at existing businesses and ask:
  • Who are they serving poorly?
  • What niche are they ignoring?
  • Can I do this for a specific audience?
  Example: There are 1,000 fitness apps, but very few for busy parents with 15-minute workout routines.

4. The Marketplace Test
Browse freelance platforms (Fiverr, Upwork) and see what people are paying for:
  • Logo design, video editing, copywriting, social media management
  • If people are already paying, there's demand

Validation rules:
• Don't fall in love with an idea — fall in love with the problem
• Talk to 10 potential customers before building anything
• If people say "I would definitely buy that" but won't pre-order, they won't buy it later either
• The best validation is someone handing you money`,
      },
      {
        id: 'hustle-3', course_id: 'mock-4', title: 'Validating Before Building', order_index: 3, type: 'text', quiz_data: null, created_at: '',
        content: `The graveyard of failed businesses is full of products nobody asked for. Validation means proving demand before investing serious time or money.

The Lean Validation Framework:

Step 1: Define your hypothesis
"I believe [target customer] has a problem with [pain point] and would pay for [solution]."

Example: "I believe freelance designers struggle to find clients and would pay for a client acquisition course."

Step 2: Customer interviews (5–10 people)
Find people who match your target customer and ask:
• "Tell me about the last time you experienced [problem]"
• "What have you tried to solve it?"
• "What was frustrating about those solutions?"
• "If something could solve this perfectly, what would it look like?"

DO NOT pitch your idea. Just listen. You're learning, not selling.

Step 3: The Landing Page Test
Create a simple one-page website that describes your offer:
• Headline: What it is and who it's for
• Benefits: What they'll get
• Call to action: "Join the waitlist" or "Pre-order for €X"

Drive traffic via social media, forums, or communities. If people sign up or pre-order, you've validated demand.

Step 4: The Minimum Viable Product (MVP)
Build the simplest possible version that delivers the core value:
• A course? → Start with a live workshop or a Google Doc
• An app? → Build a no-code version or a spreadsheet
• A product? → Hand-make the first batch

The MVP is not about being polished — it's about being real enough to get honest feedback.

"If you're not embarrassed by the first version of your product, you've launched too late." — Reid Hoffman`,
      },
      {
        id: 'hustle-4', course_id: 'mock-4', title: 'Getting Your First Customer', order_index: 4, type: 'text', quiz_data: null, created_at: '',
        content: `Your first customer is the hardest to get — and the most important. They validate your business with the only metric that matters: money.

Strategies to get your first customer:

1. Your Immediate Network
Tell everyone you know what you're building. Not to sell them, but to ask:
"I'm starting [business]. Do you know anyone who might need this?"
Referrals from trusted connections convert at 4x the rate of cold outreach.

2. Go Where Your Customers Are
• Online: Reddit, Facebook Groups, Discord communities, Twitter/X, LinkedIn
• Offline: Meetups, co-working spaces, campus events, local markets
• Provide value first (answer questions, share knowledge), then mention your offer naturally

3. The Free-to-Paid Pipeline
Offer an incredible free sample:
• Free consultation → paid service
• Free chapter → paid course
• Free template → paid toolkit

The goal: prove your expertise so the paid offer feels like a no-brainer.

4. Cold Outreach (done right)
• Research the person — personalise your message
• Lead with value: "I noticed you're struggling with X. Here's a quick tip…"
• Don't sell in the first message — build rapport
• Follow up (80% of sales happen after the 5th contact)

5. Social Proof Bootstrapping
• Offer your first 3 customers a 50% discount in exchange for an honest review
• Use those reviews everywhere — website, social media, outreach
• Case studies > testimonials. Show the transformation, not just praise

Pricing your offer:
• Don't undercharge out of insecurity — people associate price with value
• Start with a price that feels slightly uncomfortable
• You can always run promotions, but raising prices is harder than starting fair

One customer leads to two. Two lead to ten. Momentum compounds — just get that first one.`,
      },
      {
        id: 'hustle-5', course_id: 'mock-4', title: 'Scaling & Sustainability', order_index: 5, type: 'text', quiz_data: null, created_at: '',
        content: `You have customers, money is coming in — now what? Scaling means growing without burning out, and sustainability means building something that lasts.

The Three Growth Levers:
1. Get more customers (acquisition)
2. Increase what each customer pays (revenue per customer)
3. Keep customers coming back (retention)

Most beginners obsess over #1 and ignore #2 and #3. Selling more to existing customers is 5x cheaper than finding new ones.

Systems and automation:
As you grow, you can't do everything manually. Build systems:
• Email automation for onboarding, follow-ups, and upsells
• Templates for recurring tasks (proposals, invoices, content)
• Standard operating procedures (SOPs) — document how you do things so you could delegate

Time management for side hustlers:
• Block out specific hours for your hustle (e.g., 6–8 AM before work, or weekends)
• Use the 80/20 rule: 20% of activities produce 80% of results. Find your high-leverage activities
• Batch similar tasks (content creation, customer calls, admin)
• Learn to say no to low-value opportunities

When to go full-time:
Don't quit your job until:
• Your side hustle consistently earns 50–75% of your salary for 3+ months
• You have 6 months of living expenses saved
• You have a clear growth trajectory and customer pipeline

Financial sustainability:
• Separate business and personal finances — get a business bank account
• Set aside 25–30% of revenue for taxes
• Reinvest profits into growth (marketing, tools, hiring help)
• Track your numbers: revenue, expenses, profit margin, customer acquisition cost

The ultimate side hustle success is building something that creates value for others and freedom for you. Keep learning, keep iterating, and never stop talking to your customers.`,
      },
      {
        id: 'hustle-6', course_id: 'mock-4', title: 'Side Hustle Reflection', order_index: 6, type: 'reflection', quiz_data: null, created_at: '',
        content: `Now it's time to apply what you've learned to your own life.

Reflect on these questions:

1. What skills, interests, or experiences do you have that could solve a problem for others?
2. What frustrations have you noticed recently that could become a business idea?
3. Who are 5 people you could interview this week to validate an idea?
4. What's the simplest version (MVP) of your idea that you could build this weekend?
5. What's the one thing holding you back — and is it real or just fear?

Write your honest thoughts below. This reflection is the first step of your entrepreneurial journey.`,
      },
      {
        id: 'hustle-7', course_id: 'mock-4', title: 'Entrepreneurship Quiz', order_index: 7, type: 'quiz', created_at: '',
        content: 'Test your entrepreneurship knowledge.',
        quiz_data: [
          { question: 'What is the most important form of validation?', options: ['Friends saying it\'s a great idea', 'A polished business plan', 'Someone paying you money', 'Getting lots of social media followers'], correct_index: 2, explanation: 'Revenue is the ultimate validation. When someone pays, they\'re voting with their wallet.' },
          { question: 'What does MVP stand for?', options: ['Most Valuable Product', 'Minimum Viable Product', 'Maximum Viable Plan', 'Market Value Proposition'], correct_index: 1, explanation: 'MVP = Minimum Viable Product — the simplest version that delivers core value.' },
          { question: 'Which is the cheapest way to grow a business?', options: ['Running ads', 'Selling more to existing customers', 'Hiring a sales team', 'Building a new product'], correct_index: 1, explanation: 'Selling to existing customers is 5x cheaper than acquiring new ones.' },
          { question: 'When should you quit your job for your side hustle?', options: ['As soon as you have the idea', 'When you make your first sale', 'When it earns 50-75% of your salary consistently', 'Never'], correct_index: 2, explanation: 'Wait until your side hustle consistently earns 50–75% of your salary for 3+ months.' },
        ],
      },
    ],
  },
};

/** Get a course by ID */
export function getCourse(courseId: string): RegistryCourse | undefined {
  return COURSES[courseId];
}

/** Get all courses as an array */
export function getAllCourses(): RegistryCourse[] {
  return Object.values(COURSES);
}

/** Get the path for a course */
export function getCoursePath(pathId: string): Path | undefined {
  return PATHS[pathId];
}

/** Get all lesson IDs for a course */
export function getCourseLessonIds(courseId: string): string[] {
  const course = COURSES[courseId];
  return course ? course.lessons.map((l) => l.id) : [];
}
