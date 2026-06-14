"use client";

import { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";
import { useAuth } from "./auth-provider";
import { DashboardSidebar } from "./sidebar";
import { NotificationMenu } from "./notification-menu";
import { AppNotification, mockNotifications } from "@/data/mock-dashboard";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationMenuOpen, setIsNotificationMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  // Check for unread notifications
  useEffect(() => {
    if (!user) return;

    const checkUnread = () => {
      const saved = localStorage.getItem("mockNotifications");
      const all: AppNotification[] = saved ? JSON.parse(saved) : mockNotifications;
      const unread = all.some(n =>
        !n.isRead && (n.userId === user.id || (n.userId === "all" && n.targetRole === user.role))
      );
      setHasUnreadNotifications(unread);
    };

    checkUnread();

    // Set up an interval to check for cross-tab updates or just poll
    const interval = setInterval(checkUnread, 5000);
    return () => clearInterval(interval);
  }, [user, isNotificationMenuOpen]); // Also re-check when menu closes


  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!user && pathname !== "/login") {
      router.push("/login");
    } else if (user && pathname === "/login") {
      router.push("/");
    }
  }, [user, pathname, router]);

  // If on login page, just render the content without sidebar
  if (pathname === "/login") {
    return (
      <main className="flex-1 overflow-y-auto bg-zinc-950">
        {children}
      </main>
    );
  }

  // Prevent flash of content while redirecting to login
  if (!user) {
    return null;
  }

  return (
    <>
      <DashboardSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0 bg-zinc-950 relative">
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between lg:justify-end /50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-zinc-400 hover:text-white transition-colors p-2 -ml-2 mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-base sm:text-lg lg:text-xl font-bold text-white">Elite</span>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 ml-auto">
            <ThemeToggle />
            <div className="relative">
              <button
                onClick={() => setIsNotificationMenuOpen(!isNotificationMenuOpen)}
                className={`cursor-pointer text-zinc-400 hover:text-cyan-400 transition-colors relative ${isNotificationMenuOpen ? 'text-cyan-400' : ''}`}
              >
                <Bell className="w-5 h-5" />
                {hasUnreadNotifications && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950"></span>
                )}
              </button>

              <NotificationMenu
                isOpen={isNotificationMenuOpen}
                onClose={() => setIsNotificationMenuOpen(false)}
              />
            </div>

            <div className="h-6 w-px bg-zinc-800"></div>

            <Link href="/profile" className="relative group shrink-0">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Profile"
                  className="w-9 h-9 rounded-full border border-zinc-700 group-hover:border-cyan-500 group-hover:ring-2 group-hover:ring-cyan-500/20 transition-all object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-cyan-400 text-zinc-950 shadow-md flex items-center justify-center text-cyan-400 font-bold group-hover:border-cyan-500 group-hover:bg-cyan-900 group-hover:ring-2 group-hover:ring-cyan-500/20 transition-all">
                  {user.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          {children}
        </main>
      </div>
    </>
  );
}
