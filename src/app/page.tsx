"use client";

import { useState } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { mockCourses, mockTopics, mockMentorshipQA, mockUsersDB, mockModules } from "@/data/mock-dashboard";
import { PlayCircle, Award, Clock, Users, BookOpen, MessageSquare, Activity, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardOverview() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full space-y-8 pb-12 ">
      <header className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
          Welcome back, <span className="text-cyan-400">{user.name.split(' ')[0]}</span>!
        </h1>
        <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400 mt-2">
          {user.role === "admin" ? "System overview and platform management." :
            user.role === "mentor" ? "Here is your mentorship activity overview." :
              "Ready to continue your elite learning journey?"}
        </p>
      </header>

      {user.role === "admin" && <AdminDashboard />}
      {user.role === "mentor" && <MentorDashboard />}
      {user.role === "student" && <StudentDashboard />}
    </div>
  );
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={mockUsersDB.length.toString()} />
        <StatCard icon={BookOpen} label="Active Courses" value={mockCourses.length.toString()} />
        <StatCard icon={MessageSquare} label="Open Q&A" value={mockMentorshipQA.filter(q => q.status === 'pending').length.toString()} />
        <StatCard icon={Activity} label="System Health" value="100%" color="text-green-400" bg="bg-green-950" />
      </div>

      <div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4">Platform Overview</h2>
        <Card className="p-8 text-center text-zinc-500">
          Admin metrics and charts would be rendered here (e.g., using Recharts).
        </Card>
      </div>
    </div>
  );
}

function MentorDashboard() {
  const { user } = useAuth();
  const assignedCourses = mockCourses.filter(c => user?.assignedCourseIds?.includes(c.id));
  const pendingQA = mockMentorshipQA.filter(q => q.status === 'pending' && user?.assignedCourseIds?.includes(q.courseId));

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={Users} label="My Mentees" value={user?.menteeIds?.length?.toString() || "0"} />
        <StatCard icon={BookOpen} label="Assigned Courses" value={assignedCourses.length.toString()} />
        <StatCard icon={MessageSquare} label="Pending Q&A" value={pendingQA.length.toString()} color="text-yellow-400" bg="bg-yellow-950" />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4">Action Required: Pending Q&A</h2>
          <div className="space-y-4">
            {pendingQA.length > 0 ? pendingQA.map(qa => (
              <Card key={qa.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">{qa.studentName}</span>
                  <span className="text-[10px] sm:text-[11px] lg:text-xs text-zinc-500">{qa.date}</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-[13px] lg:text-sm mb-3 line-clamp-2">{qa.question}</p>
                <Link href="/qa" className="text-cyan-400 text-xs sm:text-[13px] lg:text-sm font-medium hover:text-cyan-300">Reply Now &rarr;</Link>
              </Card>
            )) : (
              <Card className="p-4 sm:p-6 text-zinc-500 text-center">
                All caught up! No pending questions.
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4">Assigned Courses</h2>
          <div className="space-y-4">
            {assignedCourses.map(course => (
              <Card key={course.id} className="p-4 flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center bg-cover bg-center shrink-0 shadow-lg relative overflow-hidden"
                  style={{ backgroundImage: `url('${course.thumbnail}')` }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                  <BookOpen className="w-5 h-5 text-white relative z-10" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">{course.title}</h3>
                  <p className="text-[10px] sm:text-[11px] lg:text-xs text-zinc-400">{course.totalTopics} Topics</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



function StudentDashboard() {
  const { user } = useAuth();
  const enrolledCourses = mockCourses.filter(c => user?.enrolledCourseIds?.includes(c.id));
  const availableTopics = mockTopics.filter(t => user?.enrolledCourseIds?.includes(t.courseId));

  // Find the first topic the user hasn't completed yet, or default to the first available module
  const firstUncompletedTopic = availableTopics.find(t => !user?.completedTopicIds?.includes(t.id));

  let defaultOpenModule = "";
  if (firstUncompletedTopic) {
    const mod = mockModules.find(m => m.id === firstUncompletedTopic.moduleId);
    if (mod) defaultOpenModule = mod.title;
  } else if (availableTopics.length > 0) {
    const mod = mockModules.find(m => m.id === availableTopics[0].moduleId);
    if (mod) defaultOpenModule = mod.title;
  }

  const [openModules, setOpenModules] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("openCourseModules");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { }
      }
    }
    return defaultOpenModule ? [defaultOpenModule] : [];
  });

  const toggleModule = (moduleName: string) => {
    setOpenModules(prev => {
      const newModules = prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName];

      if (typeof window !== "undefined") {
        localStorage.setItem("openCourseModules", JSON.stringify(newModules));
      }
      return newModules;
    });
  };

  const topicsByModule = availableTopics.reduce((acc, topic) => {
    const moduleObj = mockModules.find(m => m.id === topic.moduleId);
    const moduleName = moduleObj ? moduleObj.title : "Other Topics";
    if (!acc[moduleName]) acc[moduleName] = [];
    acc[moduleName].push(topic);
    return acc;
  }, {} as Record<string, typeof availableTopics>);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4 sm:p-6 col-span-full md:col-span-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-400 text-zinc-950 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">Overall Progress</p>
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">{user?.progressPercentage}%</h2>
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-1000"
              style={{ width: `${user?.progressPercentage}%` }}
            />
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-6">Course Modules</h2>
        <div className="space-y-4">
          {Object.entries(topicsByModule).map(([moduleName, topics]) => {
            const isOpen = openModules.includes(moduleName);

            return (
              <Card key={moduleName} className="overflow-hidden transition-all">
                <button
                  onClick={() => toggleModule(moduleName)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 bg-zinc-900 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-cyan-400 text-zinc-950 shadow-md rounded-lg">
                      <BookOpen className="w-5 h-5 text-zinc-950" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white">{moduleName}</h3>
                      <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">{topics.length} {topics.length === 1 ? 'Video' : 'Videos'}</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-zinc-800/50 text-zinc-400">
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 sm:p-6 space-y-4 bg-zinc-950/30 border-t border-zinc-800">
                        {topics.map((topic) => {
                          const isCompleted = user?.completedTopicIds?.includes(topic.id);
                          const course = mockCourses.find(c => c.id === topic.courseId);

                          return (
                            <Link
                              key={topic.id}
                              href={`/topic/${topic.id}`}
                              className="group p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div>
                                <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2 mb-2 sm:mb-1.5">
                                  <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">
                                    {course?.title}
                                  </Badge>
                                  {isCompleted && (
                                    <Badge variant="success" className="text-[10px] uppercase tracking-wider">Completed</Badge>
                                  )}
                                </div>
                                <h4 className="text-sm sm:text-base lg:text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{topic.title}</h4>
                                <p className="text-zinc-400 text-xs sm:text-[13px] lg:text-sm mt-1">{topic.description}</p>
                              </div>
                              <div className="flex items-center gap-6 shrink-0">
                                <div className="flex items-center text-zinc-500 text-[10px] sm:text-[11px] lg:text-xs font-medium bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800">
                                  <Clock className="w-3 h-3 mr-1.5" />
                                  {topic.video.duration}
                                </div>
                                <Button variant={isCompleted ? "secondary" : "primary"}>
                                  <PlayCircle className="w-4 h-4 mr-2" />
                                  {isCompleted ? "Review" : "Play"}
                                </Button>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-cyan-400", bg = "bg-cyan-950" }: any) {
  return (
    <Card className="p-4 sm:p-6 flex flex-col md:flex-row items-center gap-4 border-0 shadow-lg">
      <div className={`p-3 rounded-lg ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[13px] text-zinc-400">{label}</p>
        <h2 className="text-base font-bold text-white">{value}</h2>
      </div>
    </Card>
  );
}
