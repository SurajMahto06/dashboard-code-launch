"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { mockCourses } from "@/data/mock-dashboard";
import { BookOpen, Plus, Edit3, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const { user } = useAuth();

  if (user?.role === "admin") {
    return (
      <div className="w-full pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center">
              <BookOpen className="w-8 h-8 mr-3 text-cyan-400" />
              Course Builder
            </h1>
            <p className="text-zinc-400">Manage your academy curriculum and modules.</p>
          </div>
          <Link href="/courses/new" tabIndex={-1}>
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              New Course
            </Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCourses.map(course => (
            <Card key={course.id} className="overflow-hidden group p-0 border-0">
              <div 
                className="h-32 relative bg-cover bg-center"
                style={{ backgroundImage: `url('${course.thumbnail}')` }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-semibold text-white mb-2">{course.title}</h3>
                <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                  <Badge variant="default">
                    {course.totalTopics} Topics
                  </Badge>
                  <div className="flex gap-2">
                    <Link href={`/courses/${course.id}/edit`} tabIndex={-1}>
                      <Button variant="outline" size="icon" title="Edit Course Content">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" className="hover:text-red-400 hover:bg-zinc-900" title="Delete Course">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Student View
  const enrolledCourses = mockCourses.filter(c => user?.enrolledCourseIds?.includes(c.id));
  const otherCourses = mockCourses.filter(c => !user?.enrolledCourseIds?.includes(c.id));

  return (
    <div className="w-full pb-12 space-y-12 ">
      <section>
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6">My Courses</h1>
          <p className="text-zinc-400">Courses you are currently enrolled in.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {enrolledCourses.length > 0 ? enrolledCourses.map(course => (
            <Card key={course.id} className="flex flex-col sm:flex-row group hover:border-cyan-800 transition-colors p-0 overflow-hidden">
              <div 
                className="w-full sm:w-48 h-48 sm:h-auto bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url('${course.thumbnail}')` }}
              ></div>
              <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">{course.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4">{course.description}</p>
                </div>
                <Link href={`/courses/${course.id}`} className="inline-flex items-center text-cyan-400 font-medium hover:text-cyan-300 mt-4 sm:mt-0">
                  Go to Syllabus <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </Card>
          )) : (
            <p className="text-zinc-500">You are not enrolled in any courses yet.</p>
          )}
        </div>
      </section>

      {otherCourses.length > 0 && (
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white mb-2">Available Courses</h2>
            <p className="text-zinc-400">Explore and enroll in new elite programs.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {otherCourses.map(course => (
              <Card key={course.id} className="overflow-hidden group p-0">
                <div 
                  className="h-32 bg-cover bg-center"
                  style={{ backgroundImage: `url('${course.thumbnail}')` }}
                ></div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">{course.description}</p>
                  <Button variant="secondary" className="w-full">
                    Enroll Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
