"use client";

import { useAuth } from "@/components/dashboard/auth-provider";
import { mockUsersDB, mockCourses } from "@/data/mock-dashboard";
import { Users, ShieldAlert, MessageCircle, MoreVertical } from "lucide-react";

export default function MenteesPage() {
  const { user } = useAuth();

  if (user?.role !== "mentor") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be a mentor to view this page.</p>
      </div>
    );
  }

  const mentees = mockUsersDB.filter(u => user.menteeIds?.includes(u.id));

  return (
    <div className="w-full pb-12 ">
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center">
          <Users className="w-8 h-8 mr-3 text-cyan-400" />
          My Mentees
        </h1>
        <p className="text-zinc-400">Monitor progress and support your assigned students.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentees.length > 0 ? mentees.map(mentee => (
          <div key={mentee.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 font-bold text-sm">
                  {mentee.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">{mentee.name}</h3>
                  <p className="text-xs text-zinc-500">{mentee.email}</p>
                </div>
              </div>
              <button className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Overall Progress</span>
                <span className="text-cyan-400 font-bold">{mentee.progressPercentage}%</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-500 rounded-full" 
                  style={{ width: `${mentee.progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <div className="text-xs text-zinc-500 flex flex-col">
                <span>Active Courses:</span>
                <span className="font-medium text-zinc-300">
                  {mentee.enrolledCourseIds?.map(id => mockCourses.find(c => c.id === id)?.title).join(', ') || "None"}
                </span>
              </div>
              <button className="p-2 bg-zinc-800 hover:bg-cyan-600 text-white rounded-lg transition-colors cursor-pointer" title="Message Mentee">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full p-12 text-center bg-zinc-900 border border-zinc-800 rounded-xl">
            <p className="text-zinc-500">You have no assigned mentees at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
