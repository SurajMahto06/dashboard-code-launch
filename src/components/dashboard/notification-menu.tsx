"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Info, AlertTriangle, CheckCircle2, X, BellDot } from "lucide-react";
import { useAuth } from "./auth-provider";
import { AppNotification, mockNotifications } from "@/data/mock-dashboard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface NotificationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationMenu({ isOpen, onClose }: NotificationMenuProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  // Initialize and filter notifications
  useEffect(() => {
    if (!user) return;

    // Load from localStorage or use mock
    const saved = localStorage.getItem("mockNotifications");
    const allNotifications: AppNotification[] = saved ? JSON.parse(saved) : mockNotifications;

    // Filter for current user
    const userNotifications = allNotifications.filter(
      (n) => n.userId === user.id || (n.userId === "all" && n.targetRole === user.role)
    );

    // Sort by date descending
    userNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setNotifications(userNotifications);

    if (!saved) {
      localStorage.setItem("mockNotifications", JSON.stringify(mockNotifications));
    }
  }, [user, isOpen]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    setNotifications(updated);

    const saved = localStorage.getItem("mockNotifications");
    if (saved) {
      const all: AppNotification[] = JSON.parse(saved);
      const newAll = all.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      localStorage.setItem("mockNotifications", JSON.stringify(newAll));
    }
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);

    const saved = localStorage.getItem("mockNotifications");
    if (saved) {
      const all: AppNotification[] = JSON.parse(saved);
      const newAll = all.map((n) => {
        if (n.userId === user?.id || (n.userId === "all" && n.targetRole === user?.role)) {
          return { ...n, isRead: true };
        }
        return n;
      });
      localStorage.setItem("mockNotifications", JSON.stringify(newAll));
    }
  };

  const getIconInfo = (type: string) => {
    switch (type) {
      case "success": return { icon: <CheckCircle2 className="w-5 h-5" />, bg: "bg-emerald-500/10", text: "text-emerald-400" };
      case "warning": return { icon: <AlertTriangle className="w-5 h-5" />, bg: "bg-amber-500/10", text: "text-amber-400" };
      case "alert": return { icon: <AlertTriangle className="w-5 h-5" />, bg: "bg-rose-500/10", text: "text-rose-400" };
      default: return { icon: <Info className="w-5 h-5" />, bg: "bg-cyan-950", text: "text-cyan-400" };
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={menuRef}
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-[calc(100%+0.5rem)] right-0 w-[340px] sm:w-[400px] bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden z-50 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-base font-semibold text-white flex items-center tracking-tight">
              Notifications
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2.5 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold px-2 py-0.5 rounded-full"
                >
                  {unreadCount} New
                </motion.span>
              )}
            </h3>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="text-xs font-medium text-zinc-400 hover:text-white transition-colors flex items-center px-2 py-1 rounded-md hover:bg-white/5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                  Mark all read
                </button>
              )}
              <div className="w-px h-4 bg-white/10 mx-1"></div>
              <button 
                onClick={onClose} 
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded-md transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 relative">
            {notifications.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                  <BellDot className="w-8 h-8 text-zinc-500" />
                </div>
                <p className="text-sm font-medium text-white mb-1">You're all caught up!</p>
                <p className="text-xs text-zinc-400">No new notifications right now.</p>
              </div>
            ) : (
              <motion.div layout className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                  {notifications.map((notification) => {
                    const style = getIconInfo(notification.type);
                    
                    return (
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={notification.id} 
                        className={`group p-5 flex gap-4 transition-all relative overflow-hidden ${
                          notification.isRead 
                            ? 'opacity-70 bg-transparent hover:bg-white/[0.02]' 
                            : 'bg-cyan-950/10 hover:bg-cyan-950/20'
                        }`}
                      >
                        {!notification.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
                        )}
                        
                        <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 shadow-sm ${style.bg} ${style.text}`}>
                          {style.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className={`text-sm tracking-tight ${notification.isRead ? 'text-zinc-300 font-medium' : 'text-white font-semibold'}`}>
                              {notification.title}
                            </p>
                            <span className="text-[10px] text-zinc-500 font-medium whitespace-nowrap mt-0.5">
                              {formatTimeAgo(notification.date)}
                            </span>
                          </div>
                          
                          <p className={`text-xs leading-relaxed line-clamp-2 ${notification.isRead ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {notification.message}
                          </p>
                          
                          {!notification.isRead && (
                            <button 
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="mt-3 text-[11px] font-semibold text-cyan-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
                            >
                              <Check className="w-3 h-3 mr-1" />
                              Mark as read
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
          
          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/5 bg-zinc-950/50 text-center">
              <Link 
                href="/notifications" 
                onClick={onClose}
                className="text-xs font-medium text-zinc-400 hover:text-white transition-colors"
              >
                View all notifications
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
