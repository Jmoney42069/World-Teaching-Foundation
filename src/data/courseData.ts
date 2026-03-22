export interface Lesson {
  title: string;
  content: string;
}

export interface CourseLevel {
  id: string;
  label: string;
  price: string | null;
  locked: boolean;
  lessons: Lesson[];
}

export interface Course {
  title: string;
  description: string;
  levels: CourseLevel[];
}

export const pythonCourse: Course = {
  title: "Introduction to Python",
  description:
    "Learn the fundamentals of programming with Python — the most versatile language for beginners and professionals alike.",
  levels: [
    {
      id: "python_beginner",
      label: "Beginner",
      price: null,
      locked: false,
      lessons: [
        {
          title: "What is Python?",
          content:
            "Python is a high-level, general-purpose programming language known for its clear syntax and readability. It's used in web development, data science, AI, automation, and more. Python's simplicity makes it the ideal first language for new programmers.",
        },
        {
          title: "Variables & Data Types",
          content:
            "Variables store data for later use. Python supports several data types: strings (text), integers (whole numbers), floats (decimals), and booleans (true/false). You create a variable simply by assigning a value: name = \"Alice\" or age = 25.",
        },
        {
          title: "Control Flow",
          content:
            "Control flow lets your program make decisions. Use 'if', 'elif', and 'else' to run different code based on conditions. Loops like 'for' and 'while' let you repeat actions. These are the building blocks of any program's logic.",
        },
        {
          title: "Functions",
          content:
            "Functions are reusable blocks of code. You define them with 'def', give them a name, and call them whenever needed. Functions help you organise your code, avoid repetition, and make programs easier to read and maintain.",
        },
        {
          title: "Next Steps",
          content:
            "You've covered the core fundamentals of Python. From here you can explore lists, dictionaries, file handling, and eventually libraries like Flask or Pandas. The key is consistent practice — write code every day, even if it's just a few lines.",
        },
      ],
    },
    {
      id: "python_medium",
      label: "Medium",
      price: "€5",
      locked: true,
      lessons: [],
    },
    {
      id: "python_advanced",
      label: "Advanced",
      price: "€19",
      locked: true,
      lessons: [],
    },
  ],
};
