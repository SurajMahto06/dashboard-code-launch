"use client";

import { useState } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { authService, AuthError } from "@/services/auth";
import { PlayCircle, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.login(email, password);
      login(user);
      router.push("/");
    } catch (err) {
      if (err instanceof AuthError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-zinc-950 mb-6 shadow-lg shadow-cyan-500/20">
            <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">Sign in to your elite mentorship portal</p>
        </div>

        <form onSubmit={handleLogin} className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none"></div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-900/50 flex items-start relative z-10">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-[13px] text-red-200 leading-relaxed">{error}</p>
            </div>
          )}

          <div className="space-y-5 mb-8 relative z-10">
            <div>
              <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300 mb-2" htmlFor="email">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-[13px] lg:text-sm font-medium text-zinc-300" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-[10px] sm:text-[11px] lg:text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-medium">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-zinc-950/50 border border-zinc-800 rounded-xl text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="relative z-10 w-full flex justify-center items-center px-4 py-3 sm:py-3.5 border border-transparent rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] text-xs sm:text-[13px] lg:text-sm font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>

        <div className="mt-8 text-center bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-4 sm:p-5">
          <p className="text-[10px] sm:text-[11px] lg:text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3">Quick Demo Access</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <button type="button" onClick={() => fillDemoCredentials("student1@elite.com")} className="text-[10px] sm:text-[11px] lg:text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700/50">Student 1</button>
            <button type="button" onClick={() => fillDemoCredentials("student2@elite.com")} className="text-[10px] sm:text-[11px] lg:text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700/50">Student 2</button>
            <button type="button" onClick={() => fillDemoCredentials("mentor@elite.com")} className="text-[10px] sm:text-[11px] lg:text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700/50">Mentor</button>
            <button type="button" onClick={() => fillDemoCredentials("admin@elite.com")} className="text-[10px] sm:text-[11px] lg:text-xs font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-all border border-zinc-700/50">Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
