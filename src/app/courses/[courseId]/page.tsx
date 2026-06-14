"use client";

import { use, useState } from "react";
import { mockCourses, mockModules, mockTopics } from "@/data/mock-dashboard";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, ChevronDown, ChevronUp, PlayCircle, Lock } from "lucide-react";
import { useAuth } from "@/components/dashboard/auth-provider";

export default function CourseSyllabusPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = use(params);
  const { user } = useAuth();

  const course = mockCourses.find((c) => c.id === resolvedParams.courseId);
  if (!course) {
    notFound();
  }

  const isEnrolled = user?.role === "admin" || user?.enrolledCourseIds?.includes(course.id);
  const courseModules = mockModules.filter(m => m.courseId === course.id).sort((a, b) => a.order - b.order);
  const courseTopics = mockTopics.filter(t => t.courseId === course.id);

  // Initialize all modules as expanded by default for easy viewing
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    courseModules.forEach(m => initial[m.id] = true);
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  return (
    <div className="w-full pb-12 ">
      <Link href="/courses" className="inline-flex items-center text-xs sm:text-[13px] lg:text-sm text-zinc-400 hover:text-cyan-400 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Courses
      </Link>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-8 h-8 text-cyan-400" />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">{course.title}</h1>
        </div>
        <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">{course.description}</p>

        {!isEnrolled && (
          <div className="mt-6 p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-4">
            <Lock className="w-6 h-6 text-zinc-500" />
            <div>
              <p className="text-white font-medium">You are not enrolled in this course.</p>
              <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">Enroll to get full access to all curriculum materials.</p>
            </div>
            <button className="ml-auto px-4 py-2 bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold font-medium rounded-lg transition-colors cursor-pointer">
              Enroll Now
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white mb-6">Course Syllabus</h2>

        {courseModules.length > 0 ? courseModules.map((module, mIdx) => {
          const moduleTopics = courseTopics.filter(t => t.moduleId === module.id);
          const isExpanded = expandedModules[module.id];

          return (
            <div key={module.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-5 bg-zinc-950/50 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] sm:text-[11px] lg:text-xs font-bold text-cyan-500 uppercase tracking-wider mb-1">Module {module.order}</span>
                  <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white text-left">{module.title}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-500 hidden sm:block">
                    {moduleTopics.length} {moduleTopics.length === 1 ? 'Topic' : 'Topics'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-zinc-400" /> : <ChevronDown className="w-5 h-5 text-zinc-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="divide-y divide-zinc-800 ">
                  {moduleTopics.length > 0 ? moduleTopics.map((topic, tIdx) => (
                    <div key={topic.id} className="group relative">
                      <div className="p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-800/30 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 font-medium text-[13px] border border-zinc-700">
                            {tIdx + 1}
                          </div>
                          <div>
                            <h4 className={`text-sm sm:text-base lg:text-lg font-semibold ${isEnrolled ? 'text-white group-hover:text-cyan-400' : 'text-zinc-300'} transition-colors`}>
                              {topic.title}
                            </h4>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] sm:text-[11px] lg:text-xs text-zinc-500">
                              <span className="flex items-center"><PlayCircle className="w-3.5 h-3.5 mr-1" /> {topic.video.duration}</span>
                              {topic.mcqs.length > 0 && <span>• {topic.mcqs.length} MCQs</span>}
                            </div>
                          </div>
                        </div>

                        {isEnrolled ? (
                          <Link
                            href={`/topic/${topic.id}`}
                            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[13px] font-medium rounded-lg transition-colors absolute inset-0 sm:static sm:inset-auto opacity-0 sm:opacity-100 group-hover:opacity-100 flex items-center justify-center sm:justify-end"
                          >
                            <span className="hidden sm:inline">Start Learning</span>
                          </Link>
                        ) : (
                          <Lock className="w-5 h-5 text-zinc-600" />
                        )}
                      </div>
                    </div>
                  )) : (
                    <div className="p-4 sm:p-6 text-center text-zinc-500 text-[13px] italic">
                      No topics have been added to this module yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }) : (
          <div className="p-12 text-center border border-zinc-800 border-dashed rounded-xl text-zinc-500">
            Curriculum is currently being developed. Please check back later.
          </div>
        )}
      </div>
    </div>
  );
}
