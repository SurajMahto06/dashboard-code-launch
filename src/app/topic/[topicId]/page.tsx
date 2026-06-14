"use client";

import { use } from "react";
import { mockTopics, mockModules } from "@/data/mock-dashboard";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PlayCircle, FileText, MessageSquare, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/dashboard/auth-provider";

export default function TopicPage({ params }: { params: Promise<{ topicId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();
  const topic = mockTopics.find((t) => t.id === resolvedParams.topicId);
  const moduleInfo = topic ? mockModules.find(m => m.id === topic.moduleId) : null;

  if (!topic) {
    notFound();
  }

  // RBAC Guard: Ensure students are enrolled
  if (user?.role === "student" && !user.enrolledCourseIds?.includes(topic.courseId)) {
    return (
      <div className="w-full p-12 text-center bg-red-950/20 border border-red-900 rounded-2xl mt-12">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400 mb-6">You are not enrolled in the course that contains this topic.</p>
        <Link href="/" className="px-6 py-3 rounded-lg bg-red-900 text-white hover:bg-red-800 transition-colors">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 ">
      <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{moduleInfo?.title || "Module"}</span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6">{topic.title}</h1>
        <p className="text-zinc-400">{topic.description}</p>
      </div>

      <div className="bg-black rounded-xl overflow-hidden aspect-video border border-zinc-800 shadow-2xl mb-8 relative group">
        {/* Placeholder video - using a standard HTML5 video element */}
        <video 
          className="w-full h-full object-cover"
          controls 
          poster="/placeholder-poster.jpg"
          src={topic.video.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Next Steps</h2>
          
          <Link href={`/topic/${topic.id}/mcq`} className="flex items-center p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-800 transition-colors group">
            <div className="p-3 bg-zinc-950 text-cyan-400 rounded-lg mr-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">Take the Quiz</h3>
              <p className="text-sm text-zinc-400">Test your knowledge with multiple-choice questions.</p>
            </div>
          </Link>

          <Link href={`/topic/${topic.id}/interview`} className="flex items-center p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-cyan-800 transition-colors group">
            <div className="p-3 bg-zinc-950 text-cyan-400 rounded-lg mr-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">Interview Questions</h3>
              <p className="text-sm text-zinc-400">Practice common interview questions for this topic.</p>
            </div>
          </Link>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white">Resources</h2>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
            <ul className="space-y-3">
              <li className="flex items-start text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <FileText className="w-5 h-5 mr-3 shrink-0 text-cyan-500 mt-0.5" />
                <span>Download Slides (PDF)</span>
              </li>
              <li className="flex items-start text-zinc-300 hover:text-cyan-400 transition-colors cursor-pointer">
                <FileText className="w-5 h-5 mr-3 shrink-0 text-cyan-500 mt-0.5" />
                <span>Topic Cheatsheet (PDF)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
