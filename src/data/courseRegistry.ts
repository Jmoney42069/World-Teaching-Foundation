/**
 * Central course + lesson registry.
 * All course content lives here — CourseDetailPage and LessonPage look up by ID.
 *
 * Each course has 3 tiers:
 *   - Beginner (free)      — basics, self-paced
 *   - Medium   (€5)        — intermediate, 3-day course
 *   - Advanced (€19.99)    — in-depth, 2-week course
 */
import type { Course, Lesson, Path } from '../lib/database.types';

// ── Tier system ──
export type TierLevel = 'beginner' | 'medium' | 'advanced';

export interface TierInfo {
  level: TierLevel;
  label: string;
  price: number;          // 0 = free
  priceLabel: string;     // "Free", "€5", "€19.99"
  duration: string;       // "Self-paced", "3 days", "2 weeks"
  description: string;
  lessons: Lesson[];
}

export const TIER_META: Record<TierLevel, Omit<TierInfo, 'lessons' | 'description'>> = {
  beginner: { level: 'beginner', label: 'Beginner',  price: 0,     priceLabel: 'Free',   duration: 'Self-paced' },
  medium:   { level: 'medium',   label: 'Medium',    price: 5,     priceLabel: '€5',     duration: '3 days' },
  advanced: { level: 'advanced', label: 'Advanced',  price: 19.99, priceLabel: '€19.99', duration: '2 weeks' },
};

// ── Paths ──
export const PATHS: Record<string, Path> = {
  'p1': { id: 'p1', title: 'Career Accelerator',  description: 'Fast-track your professional growth with proven career strategies.', icon: '🚀', color: '#6366f1', created_at: '' },
  'p2': { id: 'p2', title: 'Financial Freedom',    description: 'Master money management, investing, and building lasting wealth.', icon: '💰', color: '#22c55e', created_at: '' },
  'p3': { id: 'p3', title: 'Mindset Mastery',      description: 'Build mental resilience, focus, and a growth-oriented mindset.', icon: '🧠', color: '#a855f7', created_at: '' },
  'p4': { id: 'p4', title: 'Entrepreneurship',     description: 'Turn your ideas into a real business from day one.', icon: '💡', color: '#f59e0b', created_at: '' },
};

// ── Courses ──
export interface RegistryCourse extends Course {
  lessons: Lesson[];               // beginner lessons (backward compat)
  tiers: Record<TierLevel, TierInfo>;
}

// ── Helper to build a tier ──
function tier(level: TierLevel, description: string, lessons: Lesson[]): TierInfo {
  return { ...TIER_META[level], description, lessons };
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
    lessons: [  // beginner lessons (default)
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
    tiers: {
      beginner: tier('beginner', 'Learn the basics of Python — variables, loops, functions.', [
        { id: 'py-1', course_id: 'mock-1', title: 'What is Python?', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Python is a high-level, interpreted programming language known for its clear syntax and readability.\n\nCreated by Guido van Rossum and first released in 1991, Python has grown into one of the most popular programming languages in the world.\n\nWhy Python?\n• Easy to learn — reads almost like English\n• Incredibly versatile — web apps, data science, AI, automation\n• Massive ecosystem — over 400,000 packages on PyPI\n• Huge community — millions of developers\n• Cross-platform — runs on Windows, Mac, Linux\n\nIn this course, you'll learn the core building blocks: variables, data types, control flow, and functions.` },
        { id: 'py-2', course_id: 'mock-1', title: 'Variables & Data Types', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Variables are containers for storing data values.\n\nIn Python, you create a variable by assigning a value:\n  name = "Alice"\n  age = 25\n  height = 5.6\n  is_student = True\n\nCommon data types:\n• str — text: "hello"\n• int — whole numbers: 42\n• float — decimals: 3.14\n• bool — True or False\n• list — ordered collection: [1, 2, 3]\n• dict — key-value pairs: {"name": "Alice"}\n\nNaming rules:\n• Must start with a letter or underscore\n• Use snake_case: my_variable_name` },
        { id: 'py-3', course_id: 'mock-1', title: 'Loops & Conditions', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Control flow lets your program make decisions and repeat actions.\n\nConditions:\n  if age >= 18:\n      print("Adult")\n  elif age >= 13:\n      print("Teenager")\n  else:\n      print("Child")\n\nFor loops:\n  for fruit in ["apple", "banana"]:\n      print(fruit)\n\nWhile loops:\n  count = 5\n  while count > 0:\n      print(count)\n      count -= 1\n\nControl: break, continue, pass` },
        { id: 'py-4', course_id: 'mock-1', title: 'Functions', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Functions are reusable blocks of code.\n\n  def greet(name):\n      return f"Hello, {name}!"\n\nDefault parameters:\n  def greet(name, greeting="Hello"):\n      return f"{greeting}, {name}!"\n\nMultiple return values:\n  def get_stats(numbers):\n      return min(numbers), max(numbers)\n\nScope: variables inside a function are local.` },
        { id: 'py-5', course_id: 'mock-1', title: 'Beginner Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your Python basics.', quiz_data: [
          { question: 'What type is 3.14?', options: ['str', 'int', 'float', 'bool'], correct_index: 2, explanation: '3.14 is a float.' },
          { question: 'Which keyword defines a function?', options: ['func', 'function', 'def', 'define'], correct_index: 2, explanation: 'Python uses "def".' },
          { question: 'What does range(3) produce?', options: ['[1,2,3]', '[0,1,2]', '[0,1,2,3]', '[3]'], correct_index: 1, explanation: 'range(3) = 0, 1, 2.' },
        ] },
      ]),
      medium: tier('medium', 'Intermediate Python — data structures, files, error handling, and modules.', [
        { id: 'py-m1', course_id: 'mock-1', title: 'Lists & Dictionaries', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Lists and dictionaries are Python's most important data structures.\n\nLists — ordered, mutable sequences:\n  fruits = ["apple", "banana", "cherry"]\n  fruits.append("date")\n  fruits[0]  # "apple"\n  fruits[-1]  # "date"\n\nList comprehensions:\n  squares = [x**2 for x in range(10)]\n  evens = [x for x in range(20) if x % 2 == 0]\n\nDictionaries — key-value mappings:\n  person = {"name": "Alice", "age": 25, "city": "Amsterdam"}\n  person["email"] = "alice@example.com"\n\n  for key, value in person.items():\n      print(f"{key}: {value}")\n\nNested structures:\n  students = [\n      {"name": "Alice", "grades": [90, 85, 92]},\n      {"name": "Bob", "grades": [78, 82, 88]}\n  ]\n\nSets — unique unordered collections:\n  unique = {1, 2, 3, 2, 1}  # {1, 2, 3}\n\nTuples — immutable sequences:\n  point = (3, 4)\n  x, y = point  # unpacking` },
        { id: 'py-m2', course_id: 'mock-1', title: 'File Handling', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Reading and writing files is essential for real-world programs.\n\nReading a file:\n  with open("data.txt", "r") as f:\n      content = f.read()\n\n  with open("data.txt") as f:\n      for line in f:\n          print(line.strip())\n\nWriting a file:\n  with open("output.txt", "w") as f:\n      f.write("Hello, World!\\n")\n\nAppending:\n  with open("log.txt", "a") as f:\n      f.write("New entry\\n")\n\nWorking with CSV:\n  import csv\n  with open("data.csv") as f:\n      reader = csv.DictReader(f)\n      for row in reader:\n          print(row["name"], row["score"])\n\nJSON files:\n  import json\n  with open("config.json") as f:\n      data = json.load(f)\n\n  with open("output.json", "w") as f:\n      json.dump(data, f, indent=2)\n\nThe 'with' statement ensures files are properly closed, even if an error occurs.` },
        { id: 'py-m3', course_id: 'mock-1', title: 'Error Handling', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Errors happen — good code handles them gracefully.\n\ntry/except:\n  try:\n      result = 10 / 0\n  except ZeroDivisionError:\n      print("Cannot divide by zero")\n  except (TypeError, ValueError) as e:\n      print(f"Error: {e}")\n  else:\n      print("Success!")\n  finally:\n      print("Always runs")\n\nCommon exceptions:\n• ValueError — wrong value type\n• TypeError — wrong operation for type\n• KeyError — missing dictionary key\n• FileNotFoundError — file doesn't exist\n• IndexError — list index out of range\n\nRaising exceptions:\n  def divide(a, b):\n      if b == 0:\n          raise ValueError("Divisor cannot be zero")\n      return a / b\n\nCustom exceptions:\n  class InsufficientFundsError(Exception):\n      pass` },
        { id: 'py-m4', course_id: 'mock-1', title: 'Modules & Packages', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Modules let you organise code into reusable files.\n\nImporting:\n  import math\n  print(math.sqrt(16))  # 4.0\n\n  from math import pi, sqrt\n  from datetime import datetime as dt\n\nCreating your own module:\n  # myutils.py\n  def greet(name):\n      return f"Hello, {name}!"\n\n  # main.py\n  from myutils import greet\n\nPopular standard library modules:\n• os — file system operations\n• sys — system-specific parameters\n• json — JSON encoding/decoding\n• re — regular expressions\n• datetime — date and time\n• random — random numbers\n• collections — OrderedDict, Counter, defaultdict\n\nInstalling external packages:\n  pip install requests\n  pip install pandas numpy\n\nVirtual environments:\n  python -m venv myenv\n  myenv\\Scripts\\activate  # Windows\n  source myenv/bin/activate  # Mac/Linux` },
        { id: 'py-m5', course_id: 'mock-1', title: 'Intermediate Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your intermediate Python knowledge.', quiz_data: [
          { question: 'What does [x**2 for x in range(3)] produce?', options: ['[1,4,9]', '[0,1,4]', '[0,2,4]', '[1,2,3]'], correct_index: 1, explanation: 'range(3)=0,1,2 → squares are 0,1,4.' },
          { question: 'Which keyword handles exceptions?', options: ['catch', 'except', 'handle', 'error'], correct_index: 1, explanation: 'Python uses except to catch exceptions.' },
          { question: 'What does "with open()" ensure?', options: ['Faster reading', 'Auto file closing', 'File encryption', 'Binary mode'], correct_index: 1, explanation: 'The with statement ensures the file is properly closed.' },
          { question: 'How do you install an external package?', options: ['import install pkg', 'pip install pkg', 'python get pkg', 'download pkg'], correct_index: 1, explanation: 'pip install is the standard package manager command.' },
        ] },
      ]),
      advanced: tier('advanced', 'Advanced Python — OOP, decorators, web scraping, APIs, testing, and data analysis.', [
        { id: 'py-a1', course_id: 'mock-1', title: 'Object-Oriented Programming', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `OOP organises code around objects that bundle data and behaviour.\n\nClass basics:\n  class Dog:\n      def __init__(self, name, breed):\n          self.name = name\n          self.breed = breed\n\n      def bark(self):\n          return f"{self.name} says Woof!"\n\n  rex = Dog("Rex", "Labrador")\n  print(rex.bark())\n\nInheritance:\n  class Animal:\n      def __init__(self, name):\n          self.name = name\n      def speak(self):\n          raise NotImplementedError\n\n  class Cat(Animal):\n      def speak(self):\n          return f"{self.name} says Meow!"\n\nEncapsulation:\n  class BankAccount:\n      def __init__(self, balance=0):\n          self._balance = balance  # protected\n\n      @property\n      def balance(self):\n          return self._balance\n\n      def deposit(self, amount):\n          if amount > 0:\n              self._balance += amount\n\nMagic methods:\n  class Vector:\n      def __init__(self, x, y):\n          self.x, self.y = x, y\n      def __add__(self, other):\n          return Vector(self.x + other.x, self.y + other.y)\n      def __repr__(self):\n          return f"Vector({self.x}, {self.y})"` },
        { id: 'py-a2', course_id: 'mock-1', title: 'Decorators & Generators', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Decorators modify function behaviour. Generators produce values lazily.\n\nDecorators:\n  def timer(func):\n      import time\n      def wrapper(*args, **kwargs):\n          start = time.time()\n          result = func(*args, **kwargs)\n          print(f"{func.__name__} took {time.time()-start:.2f}s")\n          return result\n      return wrapper\n\n  @timer\n  def slow_function():\n      import time; time.sleep(1)\n\nGenerators — lazy sequences:\n  def fibonacci():\n      a, b = 0, 1\n      while True:\n          yield a\n          a, b = b, a + b\n\n  fib = fibonacci()\n  print(next(fib))  # 0\n  print(next(fib))  # 1\n\nGenerator expressions:\n  squares = (x**2 for x in range(1000000))  # barely uses memory\n\nContext managers:\n  from contextlib import contextmanager\n\n  @contextmanager\n  def managed_resource():\n      print("Setup")\n      yield "resource"\n      print("Cleanup")` },
        { id: 'py-a3', course_id: 'mock-1', title: 'Web Scraping', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Web scraping extracts data from websites programmatically.\n\nUsing requests + BeautifulSoup:\n  import requests\n  from bs4 import BeautifulSoup\n\n  response = requests.get("https://example.com")\n  soup = BeautifulSoup(response.text, "html.parser")\n\n  # Find elements\n  title = soup.find("h1").text\n  links = soup.find_all("a")\n  for link in links:\n      print(link.get("href"), link.text)\n\n  # CSS selectors\n  prices = soup.select(".product .price")\n\nHandling pagination:\n  for page in range(1, 11):\n      url = f"https://example.com/products?page={page}"\n      resp = requests.get(url)\n      # parse each page...\n\nBest practices:\n• Respect robots.txt\n• Add delays between requests (time.sleep)\n• Set a User-Agent header\n• Cache responses to avoid re-fetching\n• Handle errors gracefully\n\nStoring scraped data:\n  import csv\n  with open("data.csv", "w", newline="") as f:\n      writer = csv.writer(f)\n      writer.writerow(["title", "price"])\n      writer.writerows(results)` },
        { id: 'py-a4', course_id: 'mock-1', title: 'APIs & HTTP Requests', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `APIs let your programs communicate with web services.\n\nGET requests:\n  import requests\n  resp = requests.get("https://api.example.com/users")\n  data = resp.json()\n  for user in data:\n      print(user["name"])\n\nPOST requests:\n  resp = requests.post("https://api.example.com/users", json={\n      "name": "Alice",\n      "email": "alice@example.com"\n  })\n\nAuthentication:\n  headers = {"Authorization": "Bearer YOUR_TOKEN"}\n  resp = requests.get(url, headers=headers)\n\nQuery parameters:\n  resp = requests.get(url, params={"page": 1, "limit": 10})\n\nError handling:\n  resp = requests.get(url)\n  resp.raise_for_status()  # raises on 4xx/5xx\n\nBuilding a simple API with Flask:\n  from flask import Flask, jsonify\n  app = Flask(__name__)\n\n  @app.route("/api/hello")\n  def hello():\n      return jsonify({"message": "Hello, World!"})\n\nREST conventions:\n• GET — read data\n• POST — create data\n• PUT/PATCH — update data\n• DELETE — remove data` },
        { id: 'py-a5', course_id: 'mock-1', title: 'Testing Your Code', order_index: 5, type: 'text', quiz_data: null, created_at: '', content: `Testing ensures your code works correctly and stays correct as you make changes.\n\nUnit tests with pytest:\n  # test_math.py\n  def add(a, b):\n      return a + b\n\n  def test_add():\n      assert add(2, 3) == 5\n      assert add(-1, 1) == 0\n      assert add(0, 0) == 0\n\nRun: pytest test_math.py\n\nFixtures:\n  import pytest\n\n  @pytest.fixture\n  def sample_data():\n      return [1, 2, 3, 4, 5]\n\n  def test_sum(sample_data):\n      assert sum(sample_data) == 15\n\nParametrised tests:\n  @pytest.mark.parametrize("input,expected", [\n      (1, 1), (2, 4), (3, 9)\n  ])\n  def test_square(input, expected):\n      assert input ** 2 == expected\n\nTest coverage:\n  pip install pytest-cov\n  pytest --cov=myproject\n\nTDD workflow:\n1. Write a failing test\n2. Write minimal code to pass\n3. Refactor\n4. Repeat` },
        { id: 'py-a6', course_id: 'mock-1', title: 'Data Analysis with Pandas', order_index: 6, type: 'text', quiz_data: null, created_at: '', content: `Pandas is Python's most powerful data analysis library.\n\nBasics:\n  import pandas as pd\n\n  df = pd.read_csv("sales.csv")\n  print(df.head())\n  print(df.describe())\n  print(df.info())\n\nSelecting data:\n  df["name"]              # single column\n  df[["name", "price"]]   # multiple columns\n  df[df["price"] > 100]   # filter rows\n  df.loc[0:5, "name":"price"]  # label-based\n  df.iloc[0:5, 0:3]       # position-based\n\nTransformations:\n  df["total"] = df["price"] * df["quantity"]\n  df["category"] = df["category"].str.lower()\n  df = df.dropna()\n  df = df.fillna(0)\n\nGrouping and aggregation:\n  df.groupby("category")["price"].mean()\n  df.groupby("region").agg({"sales": "sum", "profit": "mean"})\n\nMerging DataFrames:\n  merged = pd.merge(orders, customers, on="customer_id")\n\nExporting:\n  df.to_csv("output.csv", index=False)\n  df.to_json("output.json")\n  df.to_excel("output.xlsx")` },
        { id: 'py-a7', course_id: 'mock-1', title: 'Advanced Quiz', order_index: 7, type: 'quiz', created_at: '', content: 'Test your advanced Python skills.', quiz_data: [
          { question: 'What does @property do in a class?', options: ['Makes a method static', 'Creates a getter', 'Deletes an attribute', 'Makes it private'], correct_index: 1, explanation: '@property creates a getter method accessible like an attribute.' },
          { question: 'What does yield do?', options: ['Returns and exits', 'Produces a value and pauses', 'Raises an exception', 'Imports a module'], correct_index: 1, explanation: 'yield produces a value and pauses the generator until next() is called.' },
          { question: 'Which library is used for data analysis?', options: ['Flask', 'BeautifulSoup', 'Pandas', 'pytest'], correct_index: 2, explanation: 'Pandas is Python\'s primary data analysis library.' },
          { question: 'What does resp.raise_for_status() do?', options: ['Returns JSON', 'Raises exception on HTTP errors', 'Retries the request', 'Logs the response'], correct_index: 1, explanation: 'raise_for_status() raises an HTTPError for 4xx/5xx responses.' },
          { question: 'In TDD, what comes first?', options: ['Write code', 'Write a failing test', 'Refactor', 'Deploy'], correct_index: 1, explanation: 'TDD starts with writing a failing test, then code to pass it, then refactor.' },
        ] },
      ]),
    },
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
    lessons: [  // beginner lessons (default)
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
    tiers: {
      beginner: tier('beginner', 'Understand the basics of money — budgeting, saving, and debt.', [
        { id: 'fin-1', course_id: 'mock-2', title: 'Why Financial Literacy Matters', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Financial literacy is the ability to understand and effectively use financial skills — budgeting, saving, investing, and managing debt.\n\nWhy it matters:\n• Financially literate people carry less debt\n• Save more for emergencies\n• Invest earlier and more consistently\n• Experience less financial stress\n\nKey principles:\n1. Spend less than you earn — always\n2. Pay yourself first — save before you spend\n3. Understand assets vs liabilities\n4. Avoid high-interest debt\n5. Start investing early — time is your greatest advantage` },
        { id: 'fin-2', course_id: 'mock-2', title: 'Budgeting That Works', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `A budget tells your money where to go instead of wondering where it went.\n\nThe 50/30/20 Rule:\n• 50% Needs — rent, groceries, utilities\n• 30% Wants — dining out, subscriptions, hobbies\n• 20% Savings & Debt — emergency fund, investments\n\nHow to start:\n1. Track everything for 30 days\n2. Categorise spending\n3. Identify leaks\n4. Set realistic limits\n5. Automate savings` },
        { id: 'fin-3', course_id: 'mock-2', title: 'Emergency Funds & Saving', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `An emergency fund covers unexpected expenses so you don't go into debt.\n\nHow much?\n• Starter: €1,000\n• Full: 3–6 months of expenses\n• Self-employed: 6–12 months\n\nHow to build it:\n1. Start small — €50/month adds up\n2. Automate transfers on payday\n3. Use windfalls — tax refunds, bonuses → fund` },
        { id: 'fin-4', course_id: 'mock-2', title: 'Intro to Investing', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Saving protects what you have; investing grows it.\n\nCompound interest:\n€200/month from age 20 at 8% return:\n• Age 30: ~€36,000\n• Age 40: ~€118,000\n• Age 60: ~€700,000\n\nInvestment types:\n1. Stocks — owning a piece of a company\n2. Bonds — lending money for stable returns\n3. Index Funds/ETFs — diversified and low-cost (start here)\n4. Real Estate — property for income\n\nGetting started:\n1. Open a brokerage account\n2. Start with a low-cost global index fund\n3. Set up automatic monthly contributions\n4. Don't check daily — invest and forget` },
        { id: 'fin-5', course_id: 'mock-2', title: 'Beginner Finance Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your financial basics.', quiz_data: [
          { question: 'Recommended full emergency fund size?', options: ['€500', '1 month', '3–6 months of expenses', '1 year salary'], correct_index: 2, explanation: '3–6 months of living expenses is recommended.' },
          { question: 'In 50/30/20, what is the 20%?', options: ['Needs', 'Wants', 'Savings & debt', 'Taxes'], correct_index: 2, explanation: '20% goes to savings, investments, and debt repayment.' },
          { question: 'Best diversification for beginners?', options: ['Stocks', 'Crypto', 'Index funds/ETFs', 'Real estate'], correct_index: 2, explanation: 'Index funds provide instant diversification at low cost.' },
        ] },
      ]),
      medium: tier('medium', 'Intermediate finance — taxes, retirement, insurance, and credit building.', [
        { id: 'fin-m1', course_id: 'mock-2', title: 'Tax Optimisation Basics', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Understanding taxes is one of the most valuable financial skills.\n\nKey concepts:\n• Gross vs net income — what you earn vs what you keep\n• Tax brackets — progressive taxation means higher income is taxed at higher rates, but only the amount IN that bracket\n• Deductions — reduce your taxable income (mortgage interest, charitable donations, business expenses)\n• Tax credits — directly reduce your tax bill (more valuable than deductions)\n\nStrategies:\n1. Maximise tax-advantaged accounts (pension, retirement)\n2. Track deductible expenses throughout the year\n3. Contribute to retirement accounts before tax deadline\n4. Consider timing of income and expenses\n5. Keep records — receipts, statements, documentation\n\nCommon mistakes:\n• Not filing on time (penalties + interest)\n• Missing deductions you qualify for\n• Not adjusting withholding when circumstances change\n• Ignoring tax-loss harvesting opportunities` },
        { id: 'fin-m2', course_id: 'mock-2', title: 'Retirement Planning', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `The earlier you start, the less you need to save.\n\nThe power of starting early:\n• Starting at 25, saving €300/month at 8%: ~€1M by 65\n• Starting at 35, same rate: ~€440K by 65\n• Starting at 45: ~€175K — less than half\n\nRetirement accounts:\n• Employer pension — always contribute enough to get the full employer match (it's free money)\n• Personal pension / IRA — tax-advantaged individual accounts\n• Index funds in taxable accounts — for anything above contribution limits\n\nHow much do you need?\n• The 4% rule: you can withdraw 4% annually without running out\n• Need €40K/year? You need €1M saved\n• Need €60K/year? You need €1.5M saved\n\nRetirement planning steps:\n1. Calculate your target number\n2. Determine monthly savings needed\n3. Automate contributions\n4. Increase savings with every raise\n5. Rebalance portfolio as you age (more bonds, less stocks)` },
        { id: 'fin-m3', course_id: 'mock-2', title: 'Insurance Essentials', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Insurance protects you from financial catastrophe. The right coverage prevents a single event from destroying years of progress.\n\nEssential insurance:\n• Health insurance — medical costs can bankrupt you without it\n• Liability insurance — protects against lawsuits\n• Disability insurance — replaces income if you can't work\n• Life insurance (if dependents) — term life is usually best\n\nInsurance you might NOT need:\n• Extended warranties on electronics\n• Credit card insurance\n• Rental car insurance (check your existing policy)\n• Mortgage insurance (if >20% down payment)\n\nSmart insurance strategy:\n1. Insure against catastrophic losses, not minor ones\n2. Higher deductibles = lower premiums. Self-insure small risks\n3. Bundle policies for discounts\n4. Review annually — life changes require coverage changes\n5. Compare quotes from at least 3 providers` },
        { id: 'fin-m4', course_id: 'mock-2', title: 'Building & Using Credit', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Your credit score affects loan rates, rental applications, and sometimes job applications.\n\nCredit score factors:\n• Payment history (35%) — always pay on time\n• Credit utilisation (30%) — keep below 30% of limit\n• Length of history (15%) — older accounts help\n• Credit mix (10%) — variety of account types\n• New inquiries (10%) — don't apply for too many at once\n\nBuilding credit:\n1. Get a starter credit card (or secured card)\n2. Make small purchases monthly\n3. Pay the full balance every month — never carry a balance\n4. Keep old accounts open (even if unused)\n5. Set up autopay for at least the minimum\n\nUsing credit wisely:\n• Credit cards are a tool, not free money\n• Only charge what you can pay off this month\n• Use rewards/cashback cards strategically\n• Monitor your credit report annually for errors` },
        { id: 'fin-m5', course_id: 'mock-2', title: 'Intermediate Finance Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your intermediate financial knowledge.', quiz_data: [
          { question: 'What is the 4% rule?', options: ['Save 4% of income', 'Withdraw 4% annually in retirement', 'Pay 4% in taxes', 'Invest 4% in bonds'], correct_index: 1, explanation: 'The 4% rule suggests you can withdraw 4% of savings annually without running out.' },
          { question: 'Which credit score factor is most important?', options: ['Credit mix', 'Payment history', 'New inquiries', 'Credit limit'], correct_index: 1, explanation: 'Payment history accounts for 35% of your credit score.' },
          { question: 'What type of life insurance is usually best?', options: ['Whole life', 'Term life', 'Universal life', 'Variable life'], correct_index: 1, explanation: 'Term life is simpler, cheaper, and sufficient for most people.' },
          { question: 'Tax deductions vs credits — which is more valuable?', options: ['Deductions', 'Credits', 'They are equal', 'Neither'], correct_index: 1, explanation: 'Tax credits directly reduce your tax bill; deductions only reduce taxable income.' },
        ] },
      ]),
      advanced: tier('advanced', 'Advanced finance — portfolio management, real estate, business finances, and wealth protection.', [
        { id: 'fin-a1', course_id: 'mock-2', title: 'Advanced Investing Strategies', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Beyond index funds — strategies for building serious wealth.\n\nAsset allocation:\n• Aggressive (age 20–35): 90% stocks, 10% bonds\n• Moderate (age 35–50): 70% stocks, 30% bonds\n• Conservative (age 50+): 50% stocks, 50% bonds\n\nDiversification layers:\n1. Asset class (stocks, bonds, real estate, commodities)\n2. Geography (domestic, international, emerging markets)\n3. Sector (tech, healthcare, energy, finance)\n4. Company size (large-cap, mid-cap, small-cap)\n\nAdvanced strategies:\n• Tax-loss harvesting — sell losers to offset gains\n• Rebalancing — restore target allocation quarterly/annually\n• Factor investing — tilt toward value, momentum, or quality\n• Dollar-cost averaging vs lump sum (DCA wins psychologically)\n\nAlternative investments:\n• REITs — real estate without buying property\n• Commodities — gold, oil as inflation hedges\n• Private equity / angel investing — high risk, high reward\n• Peer-to-peer lending — earn interest directly` },
        { id: 'fin-a2', course_id: 'mock-2', title: 'Real Estate Investing', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Real estate builds wealth through appreciation and rental income.\n\nApproaches:\n1. Buy-to-rent — purchase property, collect monthly rent\n2. House hacking — live in one unit, rent out others\n3. REITs — invest in a fund of properties (like a stock)\n4. Fix-and-flip — buy cheap, renovate, sell for profit\n\nKey metrics:\n• Cap rate = Net operating income / Purchase price (aim for 5–10%)\n• Cash-on-cash return = Annual cash flow / Total cash invested\n• 1% rule — monthly rent should be ≥1% of purchase price\n• Debt-to-income ratio — lenders want <43%\n\nFinancing:\n• Conventional mortgage (20% down for best rates)\n• FHA loan (3.5% down for first-time buyers)\n• Hard money loans (short-term, higher interest)\n\nRisks:\n• Vacancy — no tenants = no income\n• Maintenance costs — budget 1–2% of property value/year\n• Market downturns — property values can drop\n• Bad tenants — screen thoroughly` },
        { id: 'fin-a3', course_id: 'mock-2', title: 'Business Finance & Structure', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Understanding business finance is essential whether you're an entrepreneur or investor.\n\nBusiness structures:\n• Sole proprietorship — simplest, but personal liability\n• LLC — limited liability, flexible taxation\n• Corporation — strongest protection, more complexity\n• Partnership — shared ownership and responsibility\n\nKey financial statements:\n1. Income statement — revenue - expenses = profit\n2. Balance sheet — assets = liabilities + equity\n3. Cash flow statement — where money comes from and goes\n\nCritical metrics:\n• Revenue vs profit — revenue is vanity, profit is sanity\n• Gross margin — (revenue - COGS) / revenue\n• Net margin — net profit / revenue\n• Burn rate — monthly cash expenditure\n• Runway — months of cash remaining\n\nBusiness finance rules:\n1. Separate personal and business finances\n2. Pay yourself a market salary\n3. Keep 3–6 months of operating expenses in reserve\n4. Reinvest profits strategically\n5. Track cash flow weekly, not monthly` },
        { id: 'fin-a4', course_id: 'mock-2', title: 'Estate & Wealth Protection', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Wealth protection ensures your assets are preserved for the long term.\n\nEstate planning essentials:\n• Will — determines how assets are distributed\n• Power of attorney — assigns someone to act on your behalf\n• Healthcare directive — medical wishes if you can't communicate\n• Beneficiary designations — on accounts, insurance, retirement\n\nWealth protection strategies:\n1. Asset protection — use legal structures (trusts, LLCs)\n2. Insurance umbrella — extra liability coverage\n3. Diversification — never concentrate in one asset\n4. Emergency reserves — layered (1 month liquid, 3 months accessible, 6 months invested)\n\nLegacy planning:\n• Trusts — control how and when assets are distributed\n• Education funds — 529 plans or equivalent for children\n• Charitable giving — donor-advised funds for tax efficiency\n• Family governance — teach financial literacy to next generation\n\nCommon wealth destroyers:\n• Lifestyle inflation — expenses growing with income\n• Concentrated stock positions — diversify!\n• Divorce without prenuptial agreement\n• Lack of insurance coverage\n• Emotional investing — buying high, selling low` },
        { id: 'fin-a5', course_id: 'mock-2', title: 'Advanced Finance Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your advanced financial knowledge.', quiz_data: [
          { question: 'What is tax-loss harvesting?', options: ['Avoiding all taxes', 'Selling losers to offset gains', 'Only investing in tax-free bonds', 'Hiding income'], correct_index: 1, explanation: 'Tax-loss harvesting means selling losing investments to offset capital gains taxes.' },
          { question: 'What is the 1% rule in real estate?', options: ['ROI should be 1%', 'Monthly rent ≥ 1% of purchase price', 'Appreciation of 1% yearly', 'Down payment of 1%'], correct_index: 1, explanation: 'The 1% rule suggests monthly rent should be at least 1% of the purchase price.' },
          { question: 'Which business structure offers the simplest setup?', options: ['Corporation', 'LLC', 'Sole proprietorship', 'Partnership'], correct_index: 2, explanation: 'Sole proprietorship is the simplest but offers no liability protection.' },
          { question: 'What is the recommended asset allocation for age 20-35?', options: ['50/50 stocks/bonds', '90% stocks, 10% bonds', '100% bonds', '70/30 stocks/bonds'], correct_index: 1, explanation: 'Young investors can afford more risk with a 90/10 stock/bond split.' },
          { question: 'Which document determines how assets are distributed after death?', options: ['Power of attorney', 'Healthcare directive', 'Will', 'Insurance policy'], correct_index: 2, explanation: 'A will determines how your assets are distributed after death.' },
        ] },
      ]),
    },
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
    lessons: [  // beginner lessons (default)
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
    tiers: {
      beginner: tier('beginner', 'Explore growth mindset, habits, and overcoming self-doubt.', [
        { id: 'mind-1', course_id: 'mock-3', title: 'Fixed vs Growth Mindset', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Carol Dweck discovered two fundamentally different mindsets:\n\nFixed Mindset: "I'm either good at it or I'm not."\n• Avoids challenges\n• Gives up easily\n• Feels threatened by others' success\n\nGrowth Mindset: "I can improve with effort."\n• Embraces challenges\n• Persists through setbacks\n• Finds inspiration in others' success\n\nHow to build it:\n1. "I can't do this" → "I can't do this yet"\n2. Reframe failure as data\n3. Focus on process, not outcome\n4. Surround yourself with growth-minded people` },
        { id: 'mind-2', course_id: 'mock-3', title: 'The Science of Habits', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Up to 40% of daily actions are habits.\n\nThe Habit Loop:\n1. Cue — trigger\n2. Routine — the behaviour\n3. Reward — the benefit\n\nTo build a habit:\n• Make the Cue obvious\n• Make the Routine easy (start with 2 minutes)\n• Make the Reward satisfying\n\nHabit stacking:\n"After I [EXISTING HABIT], I will [NEW HABIT]"\n\nThe 1% rule: improve 1% daily = 37x better in a year.` },
        { id: 'mind-3', course_id: 'mock-3', title: 'Overcoming Self-Doubt', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `70% of people experience impostor syndrome.\n\nTypes:\n• Perfectionist — "If it's not flawless, I failed"\n• Expert — "I don't know everything"\n• Natural Genius — "If it's not easy, I'm not talented"\n\nHow to fight it:\n1. Name it — "That's impostor syndrome, not reality"\n2. Keep an evidence log of wins\n3. Normalise struggle\n4. Take action despite the doubt\n\nThe antidote is not confidence — it's action.` },
        { id: 'mind-4', course_id: 'mock-3', title: 'Beginner Mindset Quiz', order_index: 4, type: 'quiz', created_at: '', content: 'Check your understanding.', quiz_data: [
          { question: 'Core belief of a growth mindset?', options: ['Talent is everything', 'Abilities develop through effort', 'Born smart', 'Quit on failure'], correct_index: 1, explanation: 'Growth mindset = abilities develop through effort.' },
          { question: 'Three parts of the Habit Loop?', options: ['Plan, Execute, Review', 'Cue, Routine, Reward', 'Trigger, Action, Result', 'Start, Middle, End'], correct_index: 1, explanation: 'Cue → Routine → Reward.' },
          { question: '% of people with impostor syndrome?', options: ['10%', '30%', '50%', '70%'], correct_index: 3, explanation: '~70% of people experience it.' },
        ] },
      ]),
      medium: tier('medium', 'Intermediate mindset — deep work, emotional intelligence, and goal setting.', [
        { id: 'mind-m1', course_id: 'mock-3', title: 'Deep Work & Focus', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Cal Newport's "Deep Work": the ability to focus without distraction on cognitively demanding tasks.\n\nWhy it matters:\n• The economy rewards rare, valuable skills\n• Deep work produces those skills\n• Most people can't do it — making it a superpower\n\nRules of deep work:\n1. Work deeply — schedule blocks of 60–90 minutes\n2. Embrace boredom — don't reach for your phone in every idle moment\n3. Quit social media (or drastically reduce it)\n4. Drain the shallows — minimise low-value tasks\n\nFocus techniques:\n• Pomodoro: 25 min work, 5 min break\n• Time blocking: assign every hour a task\n• Environmental design: dedicated workspace, no notifications\n• Shutdown ritual: end work at a fixed time with a closing routine\n\nAttention residue:\nSwitching tasks leaves "residue" that reduces performance. Batch similar tasks and minimise switching.` },
        { id: 'mind-m2', course_id: 'mock-3', title: 'Emotional Intelligence', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `EQ (emotional intelligence) predicts success better than IQ in many domains.\n\nThe five components (Daniel Goleman):\n1. Self-awareness — recognizing your emotions as they happen\n2. Self-regulation — managing emotions constructively\n3. Motivation — internal drive beyond external rewards\n4. Empathy — understanding others' emotions\n5. Social skills — managing relationships effectively\n\nBuilding self-awareness:\n• Name your emotions precisely (frustrated ≠ angry ≠ disappointed)\n• Notice physical signals (tension, breathing, heart rate)\n• Journal daily: "What triggered my strongest emotion today?"\n\nSelf-regulation strategies:\n• Pause before reacting (6-second rule)\n• Reframe: "This is happening FOR me, not TO me"\n• Remove yourself from heated situations temporarily\n\nEmpathy in practice:\n• Listen to understand, not to respond\n• Ask "How does this feel for them?"\n• Validate before advising: "That sounds really frustrating"` },
        { id: 'mind-m3', course_id: 'mock-3', title: 'Strategic Goal Setting', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Most goals fail because they're vague. Strategic goal setting makes them achievable.\n\nSMART goals:\n• Specific — what exactly will you accomplish?\n• Measurable — how will you track progress?\n• Achievable — is it realistic with effort?\n• Relevant — does it align with your bigger vision?\n• Time-bound — when is the deadline?\n\nBad: "I want to get fit"\nGood: "I will run 5km in under 30 minutes by March 1st"\n\nGoal hierarchy:\n1. Vision (10-year) — who do you want to become?\n2. Goals (1-year) — major milestones\n3. Projects (quarterly) — concrete outcomes\n4. Actions (weekly/daily) — specific tasks\n\nThe implementation intention:\n"When [situation], I will [behaviour]"\n"When it's 7 AM, I will put on running shoes and go outside"\n\nProgress tracking:\n• Weekly review: what worked? What didn't?\n• Monthly check: am I on track for quarterly goals?\n• Annual reflection: did I grow toward my vision?\n\nAnti-goal: define what you DON'T want. This creates guardrails.` },
        { id: 'mind-m4', course_id: 'mock-3', title: 'Stress Management', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Stress isn't the enemy — unmanaged stress is.\n\nTypes of stress:\n• Eustress (positive) — motivates performance, drives growth\n• Distress (negative) — overwhelms and depletes\n\nThe Yerkes-Dodson Law:\nPerformance increases with stress up to a point, then crashes. The goal is to stay in the optimal zone.\n\nPhysical stress management:\n1. Exercise — 30 minutes of any activity reduces cortisol\n2. Sleep — 7–9 hours. Non-negotiable foundation\n3. Breathing — box breathing (4-4-4-4) activates calm\n4. Cold exposure — builds stress tolerance\n5. Nature — 20 minutes outdoors reduces stress hormones\n\nMental stress management:\n1. Journaling — externalize racing thoughts\n2. Meditation — even 5 min/day rewires stress response\n3. Cognitive reframing — "I'm stressed" → "I'm challenged and rising to it"\n4. Time management — stress often = too many commitments\n5. Boundaries — learn to say no without guilt\n\nThe stress audit:\nList everything causing you stress. Categorize: can I eliminate it, reduce it, or change my response to it?` },
        { id: 'mind-m5', course_id: 'mock-3', title: 'Intermediate Mindset Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your intermediate mindset knowledge.', quiz_data: [
          { question: 'What is "attention residue"?', options: ['Forgetting things', 'Mental leftovers from task switching', 'Information overload', 'Screen fatigue'], correct_index: 1, explanation: 'Switching tasks leaves performance-reducing mental residue.' },
          { question: 'How many components of EQ per Goleman?', options: ['3', '4', '5', '7'], correct_index: 2, explanation: 'Goleman identifies 5: self-awareness, self-regulation, motivation, empathy, social skills.' },
          { question: 'What does the "S" in SMART goals stand for?', options: ['Simple', 'Specific', 'Strategic', 'Sustainable'], correct_index: 1, explanation: 'S = Specific — clearly defined outcomes.' },
          { question: 'The Yerkes-Dodson Law describes?', options: ['Learning curves', 'Stress vs performance', 'Habit formation', 'Memory decay'], correct_index: 1, explanation: 'Performance increases with stress to a point, then declines.' },
        ] },
      ]),
      advanced: tier('advanced', 'Advanced mindset — peak performance, leadership, cognitive techniques, and life design.', [
        { id: 'mind-a1', course_id: 'mock-3', title: 'Peak Performance Psychology', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Peak performance is where skill meets challenge and time disappears — Mihaly Csikszentmihalyi called it "flow."\n\nFlow state conditions:\n1. Clear goals — know exactly what you're doing\n2. Immediate feedback — know if you're doing it well\n3. Challenge-skill balance — slightly beyond current ability\n4. Deep concentration — undivided attention\n5. Sense of control — confidence in your ability\n\nTriggering flow:\n• Eliminate all distractions\n• Work on ONE thing\n• Set goals that stretch you 4% beyond comfort\n• Have a pre-performance routine\n• Prime with challenging warm-up task\n\nThe performance equation:\nPerformance = Skill × Effort × Recovery\nMost people optimise skill and effort but neglect recovery.\n\nRecovery protocols:\n• Sleep: 7–9 hours, consistent schedule\n• Active recovery: light movement on rest days\n• Mental recovery: hobbies unrelated to work\n• Social recovery: meaningful connections\n• Digital detox: regular screen-free time\n\nMental models of top performers:\n• Process over outcome\n• Embrace discomfort\n• View failure as feedback\n• Compete with yesterday's version of yourself` },
        { id: 'mind-a2', course_id: 'mock-3', title: 'Leadership Mindset', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Leadership is not a position — it's a way of thinking.\n\nServant leadership:\n• Lead by serving others' growth\n• Ask "How can I help you succeed?"\n• Remove obstacles for your team\n• Give credit, take responsibility\n\nDecision-making frameworks:\n1. First principles — strip away assumptions, reason from fundamentals\n2. Second-order thinking — "And then what?"\n3. Inversion — what would guarantee failure? Avoid that\n4. Regret minimisation — what will you regret NOT doing?\n\nInfluence without authority:\n• Build trust through consistency and competence\n• Listen deeply before proposing solutions\n• Find win-win outcomes\n• Share credit generously\n• Be the person who follows through\n\nDifficult conversations:\n1. Lead with curiosity, not judgment\n2. Use "I" statements: "I noticed..." not "You always..."\n3. Focus on behaviour, not character\n4. Propose solutions together\n5. Follow up and acknowledge improvement\n\nEnergy management > time management:\n• Identify your peak energy hours\n• Match hard work to high energy\n• Protect your energy ruthlessly\n• Energy is renewable — time isn't` },
        { id: 'mind-a3', course_id: 'mock-3', title: 'Cognitive Behavioral Techniques', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `CBT is one of the most evidence-based approaches to changing thought patterns.\n\nThe CBT model:\n  Situation → Thought → Emotion → Behaviour\n  Change the thought → change everything downstream.\n\nCommon cognitive distortions:\n• All-or-nothing thinking: "If I'm not perfect, I'm a failure"\n• Catastrophising: "This mistake will ruin everything"\n• Mind reading: "They think I'm stupid"\n• Overgeneralisation: "I always mess up"\n• Filtering: focusing only on the negative\n• Should statements: "I should be further along"\n\nCBT techniques:\n1. Thought record: write down the situation, automatic thought, emotion, and evidence for/against\n2. Behavioural experiments: test your beliefs ("Everyone will judge me" → speak up and observe reactions)\n3. Cognitive restructuring: replace distorted thoughts with balanced ones\n4. Exposure: gradually face feared situations\n5. Activity scheduling: plan enjoyable/meaningful activities\n\nBalanced thinking example:\n• Distorted: "I failed the interview. I'll never get a job."\n• Balanced: "This interview didn't go well. I can learn from it and prepare better next time. One interview doesn't define my career."` },
        { id: 'mind-a4', course_id: 'mock-3', title: 'Designing Your Life', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Life design (from Stanford's Bill Burnett & Dave Evans) treats life like a design problem — prototype, test, iterate.\n\nThe Odyssey Plan:\nWrite three 5-year life plans:\n1. Your current path (keep doing what you're doing)\n2. What you'd do if your current path disappeared\n3. What you'd do if money and others' opinions didn't matter\n\nFor each plan, rate:\n• Resources (do you have what you need?)\n• Confidence (can you pull it off?)\n• Likeability (does it excite you?)\n• Coherence (does it align with your values?)\n\nEnergy audit:\n• Map activities on an Energy/Engagement chart\n• High energy + high engagement = your sweet spot\n• Low energy + low engagement = eliminate or delegate\n\nPrototyping your life:\n• Informational interviews — talk to people living your dream\n• Side projects — test interests without full commitment\n• Micro-experiences — try before you leap\n\nReframing dysfunctional beliefs:\n• "I should know my passion" → "You find passion through action"\n• "I need the perfect plan" → "Plans change; start and iterate"\n• "It's too late" → "The best time was yesterday. The second best is today"\n\nValues mapping: identify your top 5 values. Make decisions through that filter.` },
        { id: 'mind-a5', course_id: 'mock-3', title: 'Advanced Mindset Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your advanced mindset knowledge.', quiz_data: [
          { question: 'What is the "flow state"?', options: ['Relaxation', 'Optimal performance zone', 'Sleep stage', 'Meditation level'], correct_index: 1, explanation: 'Flow is the state where skill meets challenge and performance peaks.' },
          { question: 'What is "first principles" thinking?', options: ['Following established rules', 'Reasoning from fundamentals', 'Copying others', 'Using intuition'], correct_index: 1, explanation: 'First principles strips assumptions and reasons from fundamental truths.' },
          { question: 'In CBT, what drives emotions?', options: ['Situations', 'Thoughts', 'Behaviour', 'Genetics'], correct_index: 1, explanation: 'CBT model: thought interpretation of a situation drives emotion.' },
          { question: 'How many Odyssey Plans should you write?', options: ['1', '2', '3', '5'], correct_index: 2, explanation: 'The Odyssey Plan involves writing 3 different 5-year life plans.' },
          { question: 'The performance equation: Skill × Effort × ?', options: ['Talent', 'Recovery', 'Time', 'Money'], correct_index: 1, explanation: 'Performance = Skill × Effort × Recovery — most neglect recovery.' },
        ] },
      ]),
    },
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
    lessons: [  // beginner lessons (default)
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
    tiers: {
      beginner: tier('beginner', 'Learn the side hustle mindset, find ideas, and validate them.', [
        { id: 'hustle-1', course_id: 'mock-4', title: 'The Side Hustle Mindset', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `A side hustle is a business you build alongside your main job.\n\nWhy start one?\n• Extra income and financial freedom\n• Skill building — marketing, sales, communication\n• Low risk — keep your main income\n• Discovery — find what you're passionate about\n\nMindset shift:\nEmployee: "What tasks do I need to complete?"\nEntrepreneur: "What problems can I solve?"\n\nThe One Rule:\nDon't spend months planning. Get something out fast, talk to real people, and iterate.` },
        { id: 'hustle-2', course_id: 'mock-4', title: 'Finding Your Idea', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `The best ideas solve real problems.\n\n1. The Skill Stack: overlap your skills with market demand\n2. The Problem Journal: write down every frustration for one week\n3. Copy & Improve: look at existing businesses serving niches poorly\n4. Marketplace Test: browse Fiverr/Upwork for what people pay for\n\nValidation rules:\n• Talk to 10 potential customers before building\n• The best validation is someone paying you money` },
        { id: 'hustle-3', course_id: 'mock-4', title: 'Getting Your First Customer', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Your first customer validates your business.\n\nStrategies:\n1. Immediate network — referrals convert 4x better\n2. Go where customers are — Reddit, Facebook Groups, meetups\n3. Free-to-paid pipeline — free consultation → paid service\n4. Cold outreach — lead with value, don't sell first\n5. Social proof — offer 50% discount for honest reviews\n\nPricing:\n• Don't undercharge — price = perceived value\n• Start at a slightly uncomfortable price\n• One customer leads to two. Momentum compounds.` },
        { id: 'hustle-4', course_id: 'mock-4', title: 'Beginner Hustle Quiz', order_index: 4, type: 'quiz', created_at: '', content: 'Test your entrepreneurship basics.', quiz_data: [
          { question: 'Most important form of validation?', options: ['Friends liking it', 'Business plan', 'Someone paying you', 'Social media followers'], correct_index: 2, explanation: 'Revenue is the ultimate validation.' },
          { question: 'What does MVP stand for?', options: ['Most Valuable Product', 'Minimum Viable Product', 'Maximum Viable Plan', 'Market Value Proposition'], correct_index: 1, explanation: 'MVP = Minimum Viable Product.' },
        ] },
      ]),
      medium: tier('medium', 'Intermediate business — branding, marketing, sales psychology, and finances.', [
        { id: 'hustle-m1', course_id: 'mock-4', title: 'Building Your Brand', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Your brand is what people say about you when you're not in the room.\n\nBrand elements:\n• Name — memorable, easy to spell, available as a domain\n• Visual identity — logo, colours, fonts. Keep it simple. Canva is fine to start\n• Voice — how you communicate. Professional? Casual? Bold? Be consistent\n• Story — why you started 🫵 this is your most powerful marketing tool\n\nBrand positioning:\n"I help [target audience] achieve [desired outcome] through [your method]"\nExample: "I help freelance designers get 5 new clients per month through LinkedIn outreach"\n\nBuilding online presence:\n1. Choose ONE platform to master first\n2. Post consistently (3–5x/week)\n3. Provide value before asking for anything\n4. Engage with others in your niche\n5. Build an email list from day one\n\nPersonal brand vs business brand:\n• Personal brand: tied to you, great for services and expertise\n• Business brand: scalable, can be sold, great for products\n• Start with personal (easier), evolve to business as you grow` },
        { id: 'hustle-m2', course_id: 'mock-4', title: 'Digital Marketing Essentials', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `Marketing is getting the right message to the right person at the right time.\n\nThe marketing funnel:\n1. Awareness — they discover you exist\n2. Interest — they want to learn more\n3. Decision — they consider buying\n4. Action — they purchase\n5. Retention — they come back and refer others\n\nChannels ranked by cost-effectiveness:\n• Content marketing (blog, YouTube, podcast) — free, compounds over time\n• Social media — free, builds community and trust\n• Email marketing — highest ROI (~€36 per €1 spent)\n• SEO — free traffic from Google searches\n• Paid ads — fast but expensive. Only after organic works\n\nContent strategy:\n• Answer questions your customers are already asking\n• 80% value, 20% promotion\n• Repurpose: one long piece → social posts, emails, threads\n• Be consistent more than perfect\n\nMetrics that matter:\n• Cost per acquisition (CPA) — how much to get one customer\n• Conversion rate — % of visitors who buy\n• Customer lifetime value (LTV) — total revenue per customer\n• LTV should be ≥3x CPA to be profitable` },
        { id: 'hustle-m3', course_id: 'mock-4', title: 'Sales Psychology', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Selling isn't manipulation — it's helping people make decisions.\n\nPsychological principles (Robert Cialdini):\n1. Reciprocity — give value first, people feel compelled to give back\n2. Social proof — "1,000+ students enrolled" → others trust you more\n3. Authority — demonstrate expertise through content and credentials\n4. Scarcity — limited spots, limited time → urgency to act\n5. Consistency — small commitments lead to bigger ones\n6. Liking — people buy from people they like\n\nThe SPIN selling framework:\n• Situation: understand their current state\n• Problem: identify their pain points\n• Implication: what happens if they don't solve it?\n• Need-Payoff: how will solving it improve their life?\n\nPricing psychology:\n• Anchor high, then present your price as a bargain\n• Price tiers (good/better/best) — most buy the middle\n• End in .99 or .97 for consumer products\n• Round numbers (€5, €20) feel more premium for services\n\nOvercoming objections:\n• "It's too expensive" → "What's it costing you to NOT solve this?"\n• "I need to think about it" → "What specific concern can I address?"\n• "I'm not ready" → "When would be the right time? Let's set a date"` },
        { id: 'hustle-m4', course_id: 'mock-4', title: 'Business Finance Management', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Financial mismanagement kills more businesses than bad ideas.\n\nSeparation rule:\n• Open a business bank account immediately\n• Never mix personal and business expenses\n• Pay yourself a salary, don't just take "whatever's left"\n\nEssential tracking:\n• Revenue — money coming in\n• Expenses — money going out (fixed + variable)\n• Profit = Revenue - Expenses\n• Cash flow — timing of money in vs out\n\nPricing formulas:\n• Service: (hourly rate × hours) + expenses + profit margin\n• Product: (cost of goods × 2.5–4) for retail\n• Subscription: monthly value that's a no-brainer compared to alternatives\n\nTax preparation:\n• Set aside 25–30% of revenue for taxes from day one\n• Track ALL business expenses (they reduce taxable income)\n• Quarterly estimated tax payments\n• Use accounting software (Wave is free, QuickBooks is popular)\n\nKey rule of thumb:\n• Revenue < €10K: spreadsheet is fine\n• Revenue €10K–€50K: use accounting software\n• Revenue > €50K: consider a bookkeeper\n• Revenue > €100K: definitely get an accountant` },
        { id: 'hustle-m5', course_id: 'mock-4', title: 'Intermediate Business Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your intermediate business knowledge.', quiz_data: [
          { question: 'Which marketing channel has the highest ROI?', options: ['Paid ads', 'Social media', 'Email marketing', 'TV ads'], correct_index: 2, explanation: 'Email marketing returns ~€36 per €1 spent.' },
          { question: 'LTV should be ≥__x CPA to be profitable?', options: ['1x', '2x', '3x', '5x'], correct_index: 2, explanation: 'Customer Lifetime Value should be at least 3x Cost Per Acquisition.' },
          { question: 'Which Cialdini principle uses "limited spots"?', options: ['Reciprocity', 'Authority', 'Scarcity', 'Liking'], correct_index: 2, explanation: 'Scarcity creates urgency through limited availability.' },
          { question: 'What % of revenue to set aside for taxes?', options: ['5–10%', '15–20%', '25–30%', '40–50%'], correct_index: 2, explanation: 'Set aside 25–30% from day one to avoid tax surprises.' },
        ] },
      ]),
      advanced: tier('advanced', 'Advanced business — automation, team building, legal, funding, and growth hacking.', [
        { id: 'hustle-a1', course_id: 'mock-4', title: 'Automation & Systems', order_index: 1, type: 'text', quiz_data: null, created_at: '', content: `Systems free you from trading time for money.\n\nThe automation hierarchy:\n1. Eliminate — do you really need to do this?\n2. Automate — can software do this?\n3. Delegate — can someone else do this?\n4. Do — only what requires YOU\n\nTools for automation:\n• Email: Mailchimp / ConvertKit — automated sequences\n• Scheduling: Calendly — let clients book themselves\n• Social media: Buffer / Later — schedule posts in advance\n• Invoicing: Stripe / PayPal — automatic billing\n• CRM: HubSpot (free) — track leads and customers\n• Workflows: Zapier / Make — connect apps without code\n\nStandard Operating Procedures (SOPs):\n1. Record yourself doing the task\n2. Write step-by-step instructions\n3. Include screenshots and examples\n4. Have someone else test it\n5. Iterate based on feedback\n\nThe 4-hour test:\nIf you couldn't work for 4 hours, would your business still function? If not, you don't have a business — you have a job. Build systems so it runs without you.` },
        { id: 'hustle-a2', course_id: 'mock-4', title: 'Building a Team', order_index: 2, type: 'text', quiz_data: null, created_at: '', content: `You can't scale alone. The right team multiplies your output.\n\nWhen to hire:\n• You're turning down work due to capacity\n• Tasks take you away from revenue-generating activities\n• You're spending >5 hrs/week on tasks others could do\n\nWho to hire first:\n1. Virtual assistant — €5–15/hr for admin, email, scheduling\n2. Specialist — contractor for your weakest skill\n3. Generalist — someone who can handle multiple roles\n\nHiring process:\n1. Write a clear job description with expectations\n2. Post on Upwork, Fiverr, or niche job boards\n3. Give a small paid test project\n4. Check references\n5. Start with a 2-week trial\n\nManagement basics:\n• Set clear expectations and KPIs\n• Weekly 15-minute check-ins\n• Document everything in SOPs\n• Give specific, timely feedback\n• Trust but verify\n\nCost considerations:\n• Contract/freelance: flexible, no benefits to pay\n• Part-time employee: more commitment, some overhead\n• Full-time: maximum commitment, highest cost\n\nRule: only hire when the ROI is clear. A €15/hr VA who saves you 10 hrs/week = 10 hours to earn more revenue.` },
        { id: 'hustle-a3', course_id: 'mock-4', title: 'Legal & Compliance', order_index: 3, type: 'text', quiz_data: null, created_at: '', content: `Ignoring legal basics is the most expensive mistake you can make.\n\nBusiness registration:\n• Register as a sole trader or LLC (depends on country)\n• Get a tax ID number\n• Check local business license requirements\n• Register for VAT if applicable\n\nContracts:\n• Always use written contracts with clients\n• Key clauses: scope of work, payment terms, deadlines, cancellation, IP ownership\n• Use templates from reputable sources or consult a lawyer for the first one\n• Never start work without a signed agreement\n\nIntellectual property:\n• Trademark your business name and logo\n• Copyright applies automatically to your content\n• Use contracts to clarify who owns deliverables\n• Don't use others' IP without permission\n\nData protection (GDPR/similar):\n• Privacy policy on your website\n• Cookie consent if applicable\n• Secure storage of customer data\n• Right to be forgotten — can delete data on request\n\nInsurance:\n• Professional liability — covers errors and omissions\n• General liability — covers accidents\n• Cyber insurance — if you handle sensitive data` },
        { id: 'hustle-a4', course_id: 'mock-4', title: 'Funding & Growth', order_index: 4, type: 'text', quiz_data: null, created_at: '', content: `Scaling requires strategic capital allocation.\n\nBootstrapping (self-funding):\n• Reinvest profits into growth\n• Pros: full ownership, full control, forced efficiency\n• Cons: slower growth, limited by revenue\n• Best for: service businesses, lifestyle businesses\n\nExternal funding options:\n1. Friends & family — easy access, risky for relationships\n2. Bank loans — require collateral and track record\n3. Government grants — free money, competitive and slow\n4. Angel investors — €10K–€500K, want equity (10–25%)\n5. Venture capital — €500K+, aggressive growth expected\n6. Crowdfunding — Kickstarter, Indiegogo for product launches\n\nGrowth hacking strategies:\n• Referral programs: give €10, get €10 for each referral\n• Partnerships: collaborate with complementary businesses\n• Content marketing: become the go-to expert in your niche\n• Community building: create a group around your topic\n• Product-led growth: let the product sell itself through free tiers\n\nScaling checklist:\n☐ Product-market fit confirmed (repeat customers)\n☐ Unit economics work (LTV > 3x CAC)\n☐ Systems and SOPs in place\n☐ Team can handle increased volume\n☐ Cash reserves for 3–6 months\n☐ Legal and compliance sorted` },
        { id: 'hustle-a5', course_id: 'mock-4', title: 'Advanced Business Quiz', order_index: 5, type: 'quiz', created_at: '', content: 'Test your advanced business knowledge.', quiz_data: [
          { question: 'The automation hierarchy starts with?', options: ['Automate', 'Delegate', 'Eliminate', 'Do'], correct_index: 2, explanation: 'First ask: do I need to do this at all? Eliminate before automating.' },
          { question: 'Who should you hire first?', options: ['CTO', 'Virtual assistant', 'Lawyer', 'Full-time employee'], correct_index: 1, explanation: 'A VA handles admin tasks cheaply, freeing you for revenue work.' },
          { question: 'What should angel investors typically get?', options: ['1–5% equity', '10–25% equity', '51% equity', 'No equity'], correct_index: 1, explanation: 'Angels typically receive 10–25% equity for their investment.' },
          { question: 'The "4-hour test" checks if?', options: ['You can work 4 hours', 'Business runs without you', 'You can code in 4 hours', 'Break-even in 4 hours'], correct_index: 1, explanation: 'If your business can\'t function without you for 4 hours, you have a job, not a business.' },
          { question: 'When should you always use written contracts?', options: ['Only for big projects', 'Only with strangers', 'Always with clients', 'Never needed'], correct_index: 2, explanation: 'Always use written contracts — they protect both parties.' },
        ] },
      ]),
    },
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

/** Get all lesson IDs for a course (all tiers) */
export function getCourseLessonIds(courseId: string, tierLevel?: TierLevel): string[] {
  const course = COURSES[courseId];
  if (!course) return [];
  if (tierLevel) return course.tiers[tierLevel].lessons.map((l) => l.id);
  // Return all lesson IDs across all tiers
  return Object.values(course.tiers).flatMap((t) => t.lessons.map((l) => l.id));
}

/** Get lessons for a specific tier */
export function getTierLessons(courseId: string, tierLevel: TierLevel): Lesson[] {
  const course = COURSES[courseId];
  return course ? course.tiers[tierLevel].lessons : [];
}

/** Get a specific lesson from any tier */
export function getLesson(courseId: string, lessonId: string): { lesson: Lesson; tier: TierLevel } | undefined {
  const course = COURSES[courseId];
  if (!course) return undefined;
  for (const tierLevel of ['beginner', 'medium', 'advanced'] as TierLevel[]) {
    const lesson = course.tiers[tierLevel].lessons.find((l) => l.id === lessonId);
    if (lesson) return { lesson, tier: tierLevel };
  }
  return undefined;
}
