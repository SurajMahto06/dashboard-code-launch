"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/auth-provider";
import { ArrowLeft, UserPlus, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mockCourses, mockUsersDB } from "@/data/mock-dashboard";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NewUserPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    plan: "premium",
    status: "active"
  });
  const [assignedCourses, setAssignedCourses] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-lg md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be an administrator to view this page.</p>
      </div>
    );
  }

  const handleCourseToggle = (courseId: string) => {
    setAssignedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newUser = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      password: formData.password, // In real app, this would be hashed
      role: formData.role as "student" | "admin" | "mentor",
      plan: formData.role === "student" ? formData.plan as "premium" | "elite" | "none" : undefined,
      status: formData.status as "active" | "inactive" | "pending",
      avatarUrl: "",
      progressPercentage: formData.role === "student" ? 0 : undefined,
      enrolledCourseIds: formData.role === "student" ? assignedCourses : undefined,
      assignedCourseIds: formData.role === "mentor" ? assignedCourses : undefined,
      completedTopicIds: [],
    };

    // Save to localStorage mock DB
    const saved = localStorage.getItem("mockUsersDB");
    const currentUsers = saved ? JSON.parse(saved) : mockUsersDB;
    localStorage.setItem("mockUsersDB", JSON.stringify([newUser, ...currentUsers]));

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/users");
      }, 1500);
    }, 800);
  };

  return (
    <div className="w-full pb-12 ">
      <Link href="/users" className="inline-flex items-center text-[13px] font-medium text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </Link>

      <div className="mb-8">
        <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center">
          <UserPlus className="w-8 h-8 mr-3 text-cyan-400" />
          Create New User
        </h1>
        <p className="text-zinc-400">Add a new student, mentor, or administrator to the platform.</p>
      </div>

      <Card className="p-8 relative">
        {isSuccess && (
          <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
            <h2 className="text-base font-bold text-white">User Created!</h2>
            <p className="text-zinc-400 mt-2">Redirecting to user management...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Full Name</label>
              <Input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Email Address</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Temporary Password</label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {formData.role === "student" && (
              <div className="space-y-2">
                <label className="block text-[13px] font-medium text-zinc-300 mb-1.5">Subscription Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-[13px] text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="premium">Premium Plan</option>
                  <option value="elite">Elite Mentorship Plan</option>
                </select>
              </div>
            )}
          </div>

          {(formData.role === "student" || formData.role === "mentor") && (
            <div className=" pt-8">
              <h3 className="text-sm font-semibold text-white mb-2">
                {formData.role === "student" ? "Enroll in Courses" : "Assign Courses to Mentor"}
              </h3>
              <p className="text-zinc-400 text-[13px] mb-4">Select the courses this user should have access to.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mockCourses.map((course) => (
                  <label
                    key={course.id}
                    className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${assignedCourses.includes(course.id)
                        ? "border-cyan-500 bg-cyan-950/20"
                        : "border-zinc-800 bg-zinc-950 hover:border-zinc-700"
                      }`}
                  >
                    <div className="flex items-center h-5">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-zinc-950"
                        checked={assignedCourses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                      />
                    </div>
                    <div className="ml-3 text-[13px]">
                      <span className="font-medium text-white block">{course.title}</span>
                      <span className="text-zinc-500">{course.totalTopics} Topics</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4  pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating User..." : "Create User"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
