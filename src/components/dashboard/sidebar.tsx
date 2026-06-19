"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Video,
  MessageCircleQuestion,
  Settings,
  LogOut,
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  FileText,
  X,
  Award
} from "lucide-react";
import { useAuth } from "./auth-provider";
import { PATHS } from "@/config/routes";

export function DashboardSidebar({ isOpen, setIsOpen }: { isOpen?: boolean, setIsOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  // Define navigation based on roles
  const getNavItems = () => {
    switch (user.role) {
      case "admin":
        return [
          { name: "System Overview", href: PATHS.DASHBOARD, icon: LayoutDashboard },
          { name: "User Management", href: PATHS.USERS.ROOT, icon: Users },
          { name: "Course Builder", href: PATHS.COURSES.ROOT, icon: BookOpen },
          { name: "Issue Certificate", href: PATHS.CERTIFICATES.ISSUE, icon: Award },
          { name: "Global Settings", href: PATHS.SETTINGS, icon: Settings },
        ];
      case "mentor":
        return [
          { name: "Mentor Dashboard", href: PATHS.DASHBOARD, icon: LayoutDashboard },
          { name: "My Mentees", href: PATHS.MENTEES, icon: Users },
          { name: "Q&A Review", href: PATHS.QA, icon: MessageCircleQuestion },
          { name: "Assignments", href: PATHS.ASSIGNMENTS, icon: FileText },
        ];
      case "student":
      default:
        return [
          { name: "My Dashboard", href: PATHS.DASHBOARD, icon: LayoutDashboard },
          { name: "Course Modules", href: PATHS.COURSES.ROOT, icon: BookOpen },
          { name: "Assignments", href: PATHS.ASSIGNMENTS, icon: FileText },
          { name: "Mentorship Q&A", href: PATHS.QA, icon: MessageCircleQuestion },
          { name: "Certificates", href: PATHS.CERTIFICATES.ROOT, icon: ShieldCheck },
        ];
    }
  };

  const navigation = getNavItems();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-zinc-50/50 dark:bg-black/80 z-40 lg:hidden"
          onClick={() => setIsOpen?.(false)}
        />
      )}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 flex h-screen w-64 flex-col bg-zinc-950 border-r border-zinc-800 text-zinc-300 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-16 items-center justify-between px-6 ">
          <div className="flex items-center">
            <Video className="h-6 w-6 text-cyan-400 mr-2" />
            <span className="text-base sm:text-lg font-bold text-white">Elite Portal</span>
          </div>
          <button onClick={() => setIsOpen?.(false)} className="lg:hidden text-zinc-400 hover:text-white">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen?.(false)}
                  className={`group flex items-center px-3 py-2 text-xs sm:text-[13px] lg:text-sm font-medium rounded-md transition-colors ${isActive
                      ? "bg-cyan-400 text-zinc-950 font-bold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
                    }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? "text-zinc-950" : "text-zinc-500 group-hover:text-zinc-300"
                      }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

      </div>
    </>
  );
}
