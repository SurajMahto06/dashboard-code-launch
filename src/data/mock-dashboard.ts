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

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  order: number;
}

export interface Topic {
  id: string;
  courseId: string;
  moduleId: string;
  title: string;
  description: string;
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

export const mockModules: CourseModule[] = [
  { id: "mod-fs-1", courseId: "course-fullstack", title: "Module 1: The Basics", order: 1 },
  { id: "mod-fs-2", courseId: "course-fullstack", title: "Module 2: Frontend Mastery", order: 2 }
];

export const mockTopics: Topic[] = [
  {
    id: "topic-fs-1",
    courseId: "course-fullstack",
    title: "Introduction to Full-Stack Architecture",
    description: "Understand the high-level architecture of a modern web application, including frontend, backend, and databases.",
    moduleId: "mod-fs-1",
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
    moduleId: "mod-fs-2",
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

export interface QAReply {
  id: string;
  authorName: string;
  authorRole: "student" | "mentor" | "admin";
  content: string;
  date: string;
  imageUrls?: string[];
}

export interface MentorshipQA {
  id: string;
  studentName: string;
  courseId: string;
  question: string;
  imageUrls?: string[];
  replies: QAReply[];
  status: "pending" | "answered";
  date: string;
}

export const mockMentorshipQA: MentorshipQA[] = [
  {
    id: "qa-1",
    studentName: "Alex Developer",
    courseId: "course-fullstack",
    question: "I am having trouble understanding when to use Redux vs Context API. Could someone explain the best use cases for each?",
    replies: [
      {
        id: "rep-1",
        authorName: "Senior Mentor",
        authorRole: "mentor",
        content: "Context API is great for low-frequency updates like theme or user auth state. Redux is better suited for complex, rapidly changing state logic where you need time-travel debugging.",
        date: "2026-06-12 14:30"
      },
      {
        id: "rep-2",
        authorName: "Alex Developer",
        authorRole: "student",
        content: "That makes sense! So for a simple shopping cart, Context API should be enough right? Like this structure I have here:",
        date: "2026-06-12 15:05",
        imageUrls: ["https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80", "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&q=80"]
      },
      {
        id: "rep-3",
        authorName: "Senior Mentor",
        authorRole: "mentor",
        content: "Exactly! Unless the cart has extremely complex conditional logic or huge data structures, Context will perform perfectly fine.",
        date: "2026-06-12 15:45"
      }
    ],
    status: "answered",
    date: "2026-06-12"
  },
  {
    id: "qa-2",
    studentName: "Sarah Designer",
    courseId: "course-uiux",
    question: "Should I always use an 8px grid for spacing in Figma?",
    replies: [],
    status: "pending",
    date: "2026-06-13"
  },
  {
    id: "qa-3",
    studentName: "Mike Data",
    courseId: "course-data",
    question: "What is the primary difference between Pandas and NumPy when manipulating large datasets?",
    replies: [],
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

export interface AppNotification {
  id: string;
  userId: string | 'all'; // 'all' for system-wide, or specific user ID
  targetRole?: Role; // If userId is 'all', restrict by role
  title: string;
  message: string;
  isRead: boolean;
  date: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export const mockNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-student-1',
    title: 'Mentor Replied',
    message: 'Your mentor has replied to your Q&A question regarding Redux vs Context API.',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    type: 'success'
  },
  {
    id: 'notif-2',
    userId: 'all',
    targetRole: 'student',
    title: 'New Course Material',
    message: 'A new module has been added to Elite Full-Stack Development.',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    type: 'info'
  },
  {
    id: 'notif-3',
    userId: 'usr-mentor',
    title: 'New Mentee Assigned',
    message: 'Alex Developer has been assigned to you as a mentee.',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    type: 'info'
  },
  {
    id: 'notif-4',
    userId: 'all',
    targetRole: 'mentor',
    title: 'Pending Q&A',
    message: 'Sarah Designer asked a new question in UI/UX Design Masterclass.',
    isRead: true,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    type: 'warning'
  },
  {
    id: 'notif-5',
    userId: 'usr-admin',
    title: 'New Registration',
    message: 'New student Mike Data has completed registration.',
    isRead: false,
    date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    type: 'info'
  }
];

export interface Assignment {
  id: string;
  studentId: string;
  mentorId: string;
  courseId: string;
  title: string;
  description: string;
  status: 'pending_submission' | 'submitted' | 'approved' | 'rejected';
  repoUrl?: string;
  fileName?: string; // New field for ZIP upload
  assignedAt: string;
  dueDate?: string;
  submittedAt?: string;
}

export const mockAssignmentsDB: Assignment[] = [
  {
    id: "ass-1",
    studentId: "usr-student-1",
    mentorId: "usr-mentor",
    courseId: "course-fullstack",
    title: "Final Project: Full-Stack E-Commerce Platform",
    description: `For your final project, you will build a complete, production-ready E-Commerce platform. This assignment is designed to test your mastery of the entire full-stack lifecycle.

Technical Requirements:
1. Frontend (Next.js & Tailwind CSS):
   - Build a responsive, accessible UI with product grids, individual product pages, and a functional shopping cart.
   - Implement state management using React Context or Redux for the cart and user session.
   - Design a premium, modern aesthetic using glassmorphism and smooth Framer Motion transitions.

2. Backend (Node.js & Express / Next.js API Routes):
   - Create a secure RESTful API to handle product fetching, user authentication, and order processing.
   - Implement role-based access control (Admin vs Customer). Admin should be able to add/remove products.

3. Database (PostgreSQL & Prisma):
   - Design a relational schema including Users, Products, Orders, and OrderItems.
   - Ensure proper indexing and foreign key constraints.

4. Integrations:
   - Integrate Stripe for payment processing (Test Mode).
   - Implement NextAuth for Google OAuth and email/password login.

Submission Guidelines:
You must provide the link to your GitHub repository containing the full source code, a comprehensive README.md with setup instructions, and upload a compiled .zip file of your final build. Your code will be reviewed for clean architecture, performance, and UI/UX best practices. Good luck!`,
    status: "pending_submission",
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // Due in 7 days
  },
  {
    id: "ass-2",
    studentId: "usr-student-1",
    mentorId: "usr-mentor",
    courseId: "course-fullstack",
    title: "Capstone Project: Real-Time Chat Application",
    description: `Build a real-time messaging application similar to Discord or Slack.
    
Key features must include:
- Real-time WebSocket communication using Socket.io.
- Channel-based chat rooms.
- Direct messaging between users.
- Online/offline presence indicators.
- File attachment sharing (mocked storage).

Please ensure your database is optimized for heavy read/write chat operations.`,
    status: "approved",
    repoUrl: "https://github.com/alex-dev/chat-app",
    fileName: "chat-app-final.zip",
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // Was due 2 days ago
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "ass-3",
    studentId: "usr-student-2",
    mentorId: "usr-mentor",
    courseId: "course-uiux",
    title: "Figma Component Library",
    description: "Design a scalable design system in Figma.",
    status: "pending_submission",
    assignedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  }
];
