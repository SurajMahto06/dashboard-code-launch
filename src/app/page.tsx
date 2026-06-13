"use client";

import { useState } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { mockCourses, mockTopics, mockMentorshipQA, mockUsersDB } from "@/data/mock-dashboard";
import { PlayCircle, Award, Clock, Users, BookOpen, MessageSquare, Activity, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function DashboardOverview() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12 w-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Welcome back, {user.name.split(' ')[0]}!
        </h1>
        <p className="text-zinc-400 mt-2">
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
        <h2 className="text-xl font-bold text-white mb-4">Platform Overview</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center text-zinc-500">
          Admin metrics and charts would be rendered here (e.g., using Recharts).
        </div>
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
          <h2 className="text-xl font-bold text-white mb-4">Action Required: Pending Q&A</h2>
          <div className="space-y-4">
            {pendingQA.length > 0 ? pendingQA.map(qa => (
              <div key={qa.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-white">{qa.studentName}</span>
                  <span className="text-xs text-zinc-500">{qa.date}</span>
                </div>
                <p className="text-zinc-400 text-sm mb-3 line-clamp-2">{qa.question}</p>
                <Link href="/qa" className="text-cyan-400 text-sm font-medium hover:text-cyan-300">Reply Now &rarr;</Link>
              </div>
            )) : (
              <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 text-center">
                All caught up! No pending questions.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white mb-4">Assigned Courses</h2>
          <div className="space-y-4">
            {assignedCourses.map(course => (
              <div key={course.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center bg-cover bg-center shrink-0 shadow-lg relative overflow-hidden"
                  style={{ backgroundImage: `url('${course.thumbnail}')` }}
                >
                  <div className="absolute inset-0 bg-black/50"></div>
                  <BookOpen className="w-5 h-5 text-white relative z-10" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{course.title}</h3>
                  <p className="text-xs text-zinc-400">{course.totalTopics} Topics</p>
                </div>
              </div>
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
  const defaultOpenModule = firstUncompletedTopic ? firstUncompletedTopic.module : (availableTopics[0]?.module || "");

  const [openModules, setOpenModules] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("openCourseModules");
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
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
    if (!acc[topic.module]) acc[topic.module] = [];
    acc[topic.module].push(topic);
    return acc;
  }, {} as Record<string, typeof availableTopics>);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl col-span-full md:col-span-1">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950 text-cyan-400 rounded-lg">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400">Overall Progress</p>
              <h2 className="text-2xl font-bold text-white">{user?.progressPercentage}%</h2>
            </div>
          </div>
          <div className="mt-4 h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-500 rounded-full transition-all duration-1000" 
              style={{ width: `${user?.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Course Modules</h2>
        <div className="space-y-4">
          {Object.entries(topicsByModule).map(([moduleName, topics]) => {
            const isOpen = openModules.includes(moduleName);
            
            return (
              <div key={moduleName} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden transition-all shadow-xl">
                <button 
                  onClick={() => toggleModule(moduleName)}
                  className="w-full flex items-center justify-between p-6 bg-zinc-900 hover:bg-zinc-800/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-cyan-950/50 border border-cyan-900/50 rounded-lg">
                      <BookOpen className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-white">{moduleName}</h3>
                      <p className="text-sm text-zinc-400">{topics.length} {topics.length === 1 ? 'Video' : 'Videos'}</p>
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-zinc-800/50 text-zinc-400">
                    {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>
                
                {isOpen && (
                  <div className="border-t border-zinc-800 p-6 space-y-4 bg-zinc-950/30">
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
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-[10px] font-bold text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded uppercase tracking-wider">
                                {course?.title}
                              </span>
                              {isCompleted && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-950 text-green-400 uppercase tracking-wider">Completed</span>
                              )}
                            </div>
                            <h4 className="text-md font-bold text-white group-hover:text-cyan-400 transition-colors">{topic.title}</h4>
                            <p className="text-zinc-400 text-xs mt-1">{topic.description}</p>
                          </div>
                          <div className="flex items-center gap-6 shrink-0">
                            <div className="flex items-center text-zinc-500 text-xs font-medium bg-zinc-950 px-3 py-1.5 rounded-md border border-zinc-800">
                              <Clock className="w-3 h-3 mr-1.5" />
                              {topic.video.duration}
                            </div>
                            <button className={`flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              isCompleted 
                                ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700" 
                                : "bg-cyan-600 text-white hover:bg-cyan-500"
                            }`}>
                              <PlayCircle className="w-4 h-4 mr-2" />
                              {isCompleted ? "Review" : "Play"}
                            </button>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-cyan-400", bg = "bg-cyan-950" }: any) {
  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
      <div className={`p-3 rounded-lg ${bg} ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-zinc-400">{label}</p>
        <h2 className="text-2xl font-bold text-white">{value}</h2>
      </div>
    </div>
  );
}
