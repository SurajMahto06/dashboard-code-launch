"use client";

import { useState } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { mockCourses, mockTopics, mockMentorshipQA, mockUsersDB, mockModules } from "@/data/mock-dashboard";
import { PlayCircle, Award, Clock, Users, BookOpen, MessageSquare, Activity, ChevronDown, ChevronRight, FileText } from "lucide-react";
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <StatCard icon={Users} label="My Mentees" value={user?.menteeIds?.length?.toString() || "0"} />
        <StatCard icon={MessageSquare} label="Pending Q&A" value={pendingQA.length.toString()} color="text-yellow-400" bg="bg-yellow-950" />
      </div>

      <div className="space-y-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-4">Action Required: Pending Q&A</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {pendingQA.length > 0 ? pendingQA.map(qa => (
            <Card key={qa.id} className="p-4 flex flex-col justify-between border border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{qa.studentName}</span>
                  <span className="text-[10px] sm:text-[11px] lg:text-xs text-zinc-500">{qa.date}</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-[13px] lg:text-sm mb-4 line-clamp-3">{qa.question}</p>
              </div>
              <Link href="/qa" className="text-cyan-400 text-xs sm:text-[13px] lg:text-sm font-semibold hover:text-cyan-300 self-start">
                Reply Now &rarr;
              </Link>
            </Card>
          )) : (
            <Card className="col-span-full p-6 sm:p-8 text-zinc-500 text-center border border-zinc-800 bg-zinc-900/50">
              All caught up! No pending questions.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}



function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="p-4 sm:p-5 col-span-full sm:col-span-1 border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md shadow-lg rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-950 text-cyan-400 rounded-xl shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-[13px] text-zinc-400 font-medium truncate">Overall Progress</p>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">{user?.progressPercentage}%</h2>
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

      <div className="grid gap-6 md:grid-cols-3 mt-8">
        <Card className="p-5 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between rounded-2xl">
          <div className="mb-4">
            <BookOpen className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">Resume Syllabus</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Jump back into your course topics and video modules.</p>
          </div>
          <Link href="/courses">
            <Button className="w-full">Go to Courses &rarr;</Button>
          </Link>
        </Card>

        <Card className="p-5 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between rounded-2xl">
          <div className="mb-4">
            <FileText className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">My Assignments</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">View pending tasks, submit code, or check mentor grades.</p>
          </div>
          <Link href="/assignments">
            <Button className="w-full">Go to Assignments &rarr;</Button>
          </Link>
        </Card>

        <Card className="p-5 border border-zinc-800 bg-zinc-900/40 backdrop-blur-md flex flex-col justify-between rounded-2xl">
          <div className="mb-4">
            <MessageSquare className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-base font-semibold text-white mb-1">Ask a Doubt (Q&A)</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">Post questions, attach error screenshots, and get expert help.</p>
          </div>
          <Link href="/qa">
            <Button className="w-full">Open Q&A Portal &rarr;</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color = "text-cyan-400", bg = "bg-cyan-950" }: any) {
  return (
    <Card className="p-4 sm:p-5 flex items-center gap-4 border border-zinc-800/50 bg-zinc-900/50 backdrop-blur-md shadow-lg rounded-2xl">
      <div className={`p-3 rounded-xl ${bg} ${color} shrink-0`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="min-w-0">
        <p className="text-xs sm:text-[13px] text-zinc-400 truncate font-medium">{label}</p>
        <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">{value}</h2>
      </div>
    </Card>
  );
}
