export type Role = "admin" | "mentor" | "student";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  plan?: "premium" | "elite" | "none";
  status?: "active" | "inactive" | "pending";
  // Student specific
  enrolledCourseIds?: string[];
  progressPercentage?: number;
  completedTopicIds?: string[];
  // Mentor specific
  assignedCourseIds?: string[];
  menteeIds?: string[];
}

export interface Video {
  id: string;
  title: string;
  duration: string;
  videoUrl: string;
}

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correctOptionId: string;
  explanation: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  hints: string[];
}

export interface Topic {
  id: string;
  courseId: string;
  title: string;
  description: string;
  module: string;
  video: Video;
  mcqs: MCQQuestion[];
  interviewQuestions: InterviewQuestion[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  totalTopics: number;
  topics: string[]; // Topic IDs
}

// MOCK DATA

export const mockCourses: Course[] = [
  {
    id: "course-fullstack",
    title: "Elite Full-Stack Development",
    description: "Master React, Node.js, and Cloud Databases to become a 10x Developer.",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    totalTopics: 12,
    topics: ["topic-fs-1", "topic-fs-2"]
  },
  {
    id: "course-data",
    title: "Data Science & AI",
    description: "Learn Machine Learning, Python, and neural networks from industry experts.",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    totalTopics: 8,
    topics: []
  },
  {
    id: "course-uiux",
    title: "UI/UX Design Masterclass",
    description: "Create stunning, user-centric interfaces using Figma and modern design principles.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
    totalTopics: 10,
    topics: []
  }
];

export const mockTopics: Topic[] = [
  {
    id: "topic-fs-1",
    courseId: "course-fullstack",
    title: "Introduction to Full-Stack Architecture",
    description: "Understand the high-level architecture of a modern web application, including frontend, backend, and databases.",
    module: "Module 1: The Basics",
    video: {
      id: "vid-1",
      title: "How the Web Works",
      duration: "15:20",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    mcqs: [
      {
        id: "q1",
        question: "Which of the following is responsible for rendering the UI in a browser?",
        options: [
          { id: "o1", text: "Database" },
          { id: "o2", text: "Frontend" },
          { id: "o3", text: "Backend" },
          { id: "o4", text: "API" },
        ],
        correctOptionId: "o2",
        explanation: "The frontend (HTML, CSS, JS) is processed by the browser to render the user interface."
      }
    ],
    interviewQuestions: [
      {
        id: "iq1",
        question: "Explain the difference between client-side rendering (CSR) and server-side rendering (SSR).",
        hints: ["Think about where the HTML is generated.", "Consider SEO and initial load time impacts."]
      }
    ]
  },
  {
    id: "topic-fs-2",
    courseId: "course-fullstack",
    title: "Advanced React Patterns",
    description: "Deep dive into React performance, custom hooks, and context API.",
    module: "Module 2: Frontend Mastery",
    video: {
      id: "vid-2",
      title: "Mastering Custom Hooks",
      duration: "25:45",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    },
    mcqs: [
      {
        id: "q1",
        question: "When should you use useMemo?",
        options: [
          { id: "o1", text: "To cache a function definition" },
          { id: "o2", text: "To cache a computed value between renders" },
        ],
        correctOptionId: "o2",
        explanation: "useMemo caches the result of a calculation between renders."
      }
    ],
    interviewQuestions: []
  }
];

export const mockMentorshipQA = [
  {
    id: "qa-1",
    studentName: "Alex Developer",
    courseId: "course-fullstack",
    question: "I am having trouble understanding when to use Redux vs Context API.",
    mentorReply: "Context API is great for low-frequency updates like theme or user auth state. Redux is better suited for complex state logic.",
    status: "answered",
    date: "2026-06-12"
  },
  {
    id: "qa-2",
    studentName: "Sarah Designer",
    courseId: "course-uiux",
    question: "Should I always use an 8px grid for spacing in Figma?",
    mentorReply: null,
    status: "pending",
    date: "2026-06-13"
  },
  {
    id: "qa-3",
    studentName: "Mike Data",
    courseId: "course-data",
    question: "What is the primary difference between Pandas and NumPy when manipulating large datasets?",
    mentorReply: null,
    status: "pending",
    date: "2026-06-13"
  }
];

export const mockUsersDB: User[] = [
  {
    id: "usr-admin",
    email: "admin@elite.com",
    name: "System Admin",
    role: "admin",
    status: "active",
  },
  {
    id: "usr-mentor",
    email: "mentor@elite.com",
    name: "Senior Mentor",
    role: "mentor",
    status: "active",
    assignedCourseIds: ["course-fullstack", "course-uiux", "course-data"],
    menteeIds: ["usr-student-1", "usr-student-2", "usr-student-3"]
  },
  {
    id: "usr-student-1",
    email: "student1@elite.com",
    name: "Alex Developer",
    role: "student",
    plan: "elite",
    status: "active",
    enrolledCourseIds: ["course-fullstack"],
    progressPercentage: 45,
    completedTopicIds: ["topic-fs-1"]
  },
  {
    id: "usr-student-2",
    email: "student2@elite.com",
    name: "Sarah Designer",
    role: "student",
    plan: "premium",
    status: "inactive",
    enrolledCourseIds: ["course-uiux"],
    progressPercentage: 15,
    completedTopicIds: []
  },
  {
    id: "usr-student-3",
    email: "student3@elite.com",
    name: "Mike Data",
    role: "student",
    plan: "premium",
    status: "active",
    enrolledCourseIds: ["course-data"],
    progressPercentage: 80,
    completedTopicIds: []
  }
];
