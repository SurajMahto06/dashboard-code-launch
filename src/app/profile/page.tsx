"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { User as UserIcon, Mail, Shield, LogOut, Award, BookOpen, Clock, Activity, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="w-full pb-12 ">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 flex items-center">
          <UserIcon className="w-8 h-8 mr-3 text-cyan-400" />
          My Profile
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Manage your personal information, active plans, and account security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-8 text-center border-b border-zinc-800 relative bg-gradient-to-b from-cyan-950/20 to-transparent">
              <button className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                <Edit2 className="w-4 h-4" />
              </button>
              
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-cyan-950 border-4 border-cyan-900/50 text-cyan-400 text-3xl font-bold mb-4 shadow-[0_0_20px_rgba(34,211,238,0.15)]">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <h2 className="text-lg font-bold text-white mb-1">{user.name}</h2>
              <p className="text-sm text-cyan-400 capitalize font-medium mb-3">{user.role} Account</p>
              
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Activity className="w-3 h-3 mr-1.5" />
                Active Status
              </div>
            </div>
            
            <div className="p-6 space-y-4 bg-zinc-950/50">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-zinc-500 mr-3 shrink-0" />
                <span className="text-zinc-300 truncate">{user.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <Shield className="w-4 h-4 text-zinc-500 mr-3 shrink-0" />
                <span className="text-zinc-300">ID: <span className="font-mono text-xs">{user.id}</span></span>
              </div>
            </div>
            
            {/* Logout Button directly below profile info */}
            <div className="p-6 border-t border-zinc-800 bg-zinc-950">
              <button 
                onClick={handleLogout}
                className="w-full flex justify-center items-center px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-lg transition-colors border border-red-500/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Stats */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Plan Details (if student) */}
          {user.role === "student" && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-zinc-800">
                <h3 className="text-base font-semibold text-white flex items-center">
                  <Award className="w-5 h-5 text-cyan-400 mr-2" />
                  Subscription Plan
                </h3>
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="text-sm text-zinc-400 mb-1">Current Plan</div>
                  <div className="text-2xl font-bold text-white capitalize flex items-center">
                    {user.plan || "None"}
                    {user.plan === "elite" && (
                      <span className="ml-3 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 border border-amber-500/30">
                        Pro
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Activity Snapshot */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-zinc-800">
              <h3 className="text-base font-semibold text-white flex items-center">
                <Activity className="w-5 h-5 text-cyan-400 mr-2" />
                Account Overview
              </h3>
            </div>
            
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.role === "student" && (
                <>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center text-zinc-400 text-sm mb-2">
                      <BookOpen className="w-4 h-4 mr-2" /> Enrolled Courses
                    </div>
                    <div className="text-2xl font-bold text-white">{user.enrolledCourseIds?.length || 0}</div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center text-zinc-400 text-sm mb-2">
                      <Clock className="w-4 h-4 mr-2" /> Course Progress
                    </div>
                    <div className="text-2xl font-bold text-white">{user.progressPercentage || 0}%</div>
                  </div>
                </>
              )}
              {user.role === "mentor" && (
                <>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center text-zinc-400 text-sm mb-2">
                      <BookOpen className="w-4 h-4 mr-2" /> Assigned Courses
                    </div>
                    <div className="text-2xl font-bold text-white">{user.assignedCourseIds?.length || 0}</div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center text-zinc-400 text-sm mb-2">
                      <UserIcon className="w-4 h-4 mr-2" /> Active Mentees
                    </div>
                    <div className="text-2xl font-bold text-white">{user.menteeIds?.length || 0}</div>
                  </div>
                </>
              )}
              {user.role === "admin" && (
                <>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center text-zinc-400 text-sm mb-2">
                      <Shield className="w-4 h-4 mr-2" /> Admin Access
                    </div>
                    <div className="text-lg font-bold text-emerald-400">Full System</div>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800/50 p-4 rounded-xl">
                    <div className="flex items-center text-zinc-400 text-sm mb-2">
                      <Clock className="w-4 h-4 mr-2" /> Session Active
                    </div>
                    <div className="text-lg font-bold text-white">Yes</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
