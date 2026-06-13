"use client";

import { useEffect, useState } from "react";
import { LogOut, Bell, Menu } from "lucide-react";
import { useAuth } from "./auth-provider";
import { DashboardSidebar } from "./sidebar";
import { usePathname, useRouter } from "next/navigation";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <header className="h-16 px-4 lg:px-8 flex items-center justify-between lg:justify-end border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center lg:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-zinc-400 hover:text-white transition-colors p-2 -ml-2 mr-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-white">Elite</span>
          </div>

          <div className="flex items-center gap-4 lg:gap-6 ml-auto">
            <button className="text-zinc-400 hover:text-cyan-400 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-zinc-950"></span>
            </button>
            
            <div className="h-6 w-px bg-zinc-800"></div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-white">{user.name}</span>
                <span className="text-xs font-medium text-cyan-400 capitalize tracking-wide">{user.role}</span>
              </div>
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="w-9 h-9 rounded-full border border-zinc-700" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-900 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="ml-2 p-2.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors group"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
          {children}
        </main>
      </div>
    </>
  );
}
