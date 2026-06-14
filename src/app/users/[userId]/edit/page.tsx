"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/auth-provider";
import { ArrowLeft, UserCog, ShieldAlert, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { mockCourses, mockUsersDB } from "@/data/mock-dashboard";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function EditUserPage({ params }: { params: Promise<{ userId: string }> }) {
  const resolvedParams = use(params);
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("mockUsersDB");
    const currentUsers = saved ? JSON.parse(saved) : mockUsersDB;
    const targetUser = currentUsers.find((u: any) => u.id === resolvedParams.userId);

    if (targetUser) {
      setFormData({
        name: targetUser.name || "",
        email: targetUser.email || "",
        password: "••••••••", // Masked password
        role: targetUser.role || "student",
        plan: targetUser.plan || "premium",
        status: targetUser.status || "active"
      });

      if (targetUser.role === "student" && targetUser.enrolledCourseIds) {
        setAssignedCourses(targetUser.enrolledCourseIds);
      } else if (targetUser.role === "mentor" && targetUser.assignedCourseIds) {
        setAssignedCourses(targetUser.assignedCourseIds);
      }
    }
    setIsLoading(false);
  }, [resolvedParams.userId]);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">You must be an administrator to view this page.</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-white p-8">Loading user details...</div>;
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

    const saved = localStorage.getItem("mockUsersDB");
    let currentUsers = saved ? JSON.parse(saved) : mockUsersDB;

    currentUsers = currentUsers.map((u: any) => {
      if (u.id === resolvedParams.userId) {
        return {
          ...u,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          plan: formData.role === "student" ? formData.plan : undefined,
          status: formData.status,
          // Only update password if they typed a new one
          ...(formData.password !== "••••••••" ? { password: formData.password } : {}),
          enrolledCourseIds: formData.role === "student" ? assignedCourses : undefined,
          assignedCourseIds: formData.role === "mentor" ? assignedCourses : undefined,
        };
      }
      return u;
    });

    localStorage.setItem("mockUsersDB", JSON.stringify(currentUsers));

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
      <Link href="/users" className="inline-flex items-center text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-400 hover:text-cyan-400 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Users
      </Link>

      <div className="mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white mb-6 flex items-center">
          <UserCog className="w-8 h-8 mr-3 text-cyan-400" />
          Edit User Profile
        </h1>
        <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">Update account details, change roles, or reassign courses.</p>
      </div>

      <Card className="p-8 relative">
        {isSuccess && (
          <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white">Profile Updated!</h2>
            <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400 mt-2">Saving changes to system...</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-1.5">Full Name</label>
              <Input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-1.5">Email Address</label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-1.5">Password (Leave masked to keep unchanged)</label>
              <Input
                required
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-1.5">Account Role</label>
              <select
                value={formData.role}
                onChange={(e) => {
                  setFormData({ ...formData, role: e.target.value });
                  setAssignedCourses([]); // Clear courses on role change to prevent mismatched logic
                }}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-1.5">Account Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {formData.role === "student" && (
              <div className="space-y-2">
                <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-1.5">Subscription Plan</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="premium">Premium Plan</option>
                  <option value="elite">Elite Mentorship Plan</option>
                </select>
              </div>
            )}
          </div>

          {(formData.role === "student" || formData.role === "mentor") && (
            <div className=" pt-8">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-white mb-2">
                {formData.role === "student" ? "Enrolled Courses" : "Assigned Mentorship Courses"}
              </h3>
              <p className="text-zinc-400 text-xs sm:text-[13px] lg:text-sm mb-4">Manage the courses this user has access to.</p>

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
                    <div className="ml-3 text-xs sm:text-[13px] lg:text-sm">
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
              {isSubmitting ? "Updating..." : "Update User"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
