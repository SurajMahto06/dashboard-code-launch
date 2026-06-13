"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { mockCourses } from "@/data/mock-dashboard";
import { BookOpen, Plus, Edit3, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return (
      <div className="max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-cyan-400" />
              Course Builder
            </h1>
            <p className="text-zinc-400">Manage your academy curriculum and modules.</p>
          </div>
          <Link href="/courses/new" className="flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            New Course
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map(course => (
            <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
              <div 
                className="h-32 relative bg-cover bg-center"
                style={{ backgroundImage: `url('${course.thumbnail}')` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/50 px-2 py-1 rounded">
                    {course.totalTopics} Topics
                  </span>
                  <div className="flex gap-2">
                    <Link href={`/courses/${course.id}/edit`} className="p-2 text-zinc-400 hover:text-cyan-400 transition-colors bg-zinc-950 rounded-lg border border-zinc-800 inline-flex" title="Edit Course Content">
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button className="p-2 text-zinc-400 hover:text-red-400 transition-colors bg-zinc-950 rounded-lg border border-zinc-800" title="Delete Course">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Student View
  const enrolledCourses = mockCourses.filter(c => user?.enrolledCourseIds?.includes(c.id));
  const otherCourses = mockCourses.filter(c => !user?.enrolledCourseIds?.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto pb-12 space-y-12 w-full">
      <section>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">My Courses</h1>
          <p className="text-zinc-400">Courses you are currently enrolled in.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
            <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col sm:flex-row group hover:border-cyan-800 transition-colors">
              <div 
                className="w-full sm:w-48 h-48 sm:h-auto bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url('${course.thumbnail}')` }}
              ></div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4">{course.description}</p>
                </div>
                <Link href="/" className="inline-flex items-center text-cyan-400 font-medium hover:text-cyan-300">
                  Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>
          )) : (
            <p className="text-zinc-500">You are not enrolled in any courses yet.</p>
          )}
        </div>
      </section>

      {otherCourses.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Available Courses</h2>
            <p className="text-zinc-400">Explore and enroll in new elite programs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {otherCourses.map(course => (
              <div key={course.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group">
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url('${course.thumbnail}')` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{course.description}</p>
                  <button className="w-full py-2 bg-zinc-800 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
