"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { mockUsersDB, mockCourses } from "@/data/mock-dashboard";
import { Users as UsersIcon, Search, ShieldAlert, Edit, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function UsersPage() {
  const { user } = useAuth();
  const [usersList, setUsersList] = useState(mockUsersDB);

  useEffect(() => {
    const saved = localStorage.getItem("mockUsersDB");
    if (saved) {
      // Migrate old local storage data that might not have the plan field
      const parsedUsers = JSON.parse(saved);
      const migratedUsers = parsedUsers.map((u: any) => {
        let updated = { ...u };
        if (updated.role === "student" && (!updated.plan || updated.plan === "none")) {
          updated.plan = updated.email === "student1@elite.com" ? "elite" : "premium";
        }
        if (!updated.status) {
          updated.status = "active"; // Default to active
        }
        return updated;
      });
      setUsersList(migratedUsers);
      localStorage.setItem("mockUsersDB", JSON.stringify(migratedUsers));
    } else {
      setUsersList(mockUsersDB);
      localStorage.setItem("mockUsersDB", JSON.stringify(mockUsersDB));
    }
  }, []);

  const getCourseBadges = (courseIds: string[] | undefined, role: string) => {
    if (!courseIds || courseIds.length === 0) return <span className="text-zinc-600 italic text-xs">None</span>;
    
    const count = courseIds.length;
    const label = role === 'mentor' ? 'Assigned' : 'Enrolled';
    const courses = courseIds.map(id => mockCourses.find(c => c.id === id)).filter(Boolean);
    
    return (
      <div className="relative group inline-block">
        <span className={`text-xs font-medium px-2 py-1 rounded-md cursor-help ${
          role === 'mentor' 
            ? 'bg-zinc-900 border border-zinc-800 text-zinc-300' 
            : 'bg-cyan-950/30 border border-cyan-900/50 text-cyan-400'
        }`}>
          {count} {label}
        </span>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max max-w-xs bg-zinc-800 text-white text-xs rounded-lg shadow-xl border border-zinc-700 z-50 p-3">
          <div className="font-semibold text-zinc-400 mb-2 uppercase tracking-wider text-[10px]">{label} Courses:</div>
          <div className="flex flex-wrap gap-1.5">
            {courses.map((course: any) => (
              <span key={course.id} className="bg-zinc-700 text-zinc-200 border border-zinc-600 px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap">
                {course.title}
              </span>
            ))}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-zinc-700"></div>
        </div>
      </div>
    );
  };

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl md:text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-zinc-400">You must be an administrator to view this page.</p>
      </div>
    );
  }

  return (
    <div className="w-full pb-12 ">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 flex items-center">
            <UsersIcon className="w-8 h-8 mr-3 text-cyan-400" />
            User Management
          </h1>
          <p className="text-zinc-400">View and manage all students, mentors, and admins.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500" />
            </div>
            <Input
              type="text"
              className="md:w-64 pl-10"
              placeholder="Search users..."
            />
          </div>
          <Link href="/users/new" tabIndex={-1}>
            <Button className="shrink-0">
              <Plus className="w-5 h-5 mr-1" />
              Add User
            </Button>
          </Link>
        </div>
      </div>

      <Card className="rounded-xl overflow-hidden shadow-xl border-0 p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950 border-b border-zinc-800">
              <tr>
                <th scope="col" className="px-6 py-4">Name</th>
                <th scope="col" className="px-6 py-4">Email</th>
                <th scope="col" className="px-6 py-4">Role</th>
                <th scope="col" className="px-6 py-4">Plan</th>
                <th scope="col" className="px-6 py-4">Status</th>
                <th scope="col" className="px-6 py-4">Courses</th>
                <th scope="col" className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u: any) => (
                <tr key={u.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-900 flex items-center justify-center text-cyan-400 font-bold mr-3 shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    {u.name}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={u.role === 'admin' ? 'outline' : u.role === 'mentor' ? 'secondary' : 'default'} className="capitalize">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {u.role === "student" ? (
                      <Badge variant={u.plan === 'elite' ? 'success' : 'outline'} className="uppercase tracking-wider">
                        {u.plan || 'none'}
                      </Badge>
                    ) : (
                      <span className="text-zinc-600 text-xs italic">N/A</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`flex items-center text-xs font-medium capitalize ${
                      u.status === 'active' ? 'text-green-400' :
                      u.status === 'inactive' ? 'text-red-400' :
                      'text-yellow-400'
                    }`}>
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        u.status === 'active' ? 'bg-green-500' :
                        u.status === 'inactive' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></span>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.role === 'admin' ? (
                      <span className="text-xs font-medium text-zinc-500">All Access</span>
                    ) : u.role === 'mentor' ? (
                      getCourseBadges(u.assignedCourseIds, u.role)
                    ) : (
                      getCourseBadges(u.enrolledCourseIds, u.role)
                    )}
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end items-center gap-1">
                    <Link href={`/users/${u.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="danger" size="icon">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
