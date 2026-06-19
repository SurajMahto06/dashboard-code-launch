"use client";

import { useState } from "react";
import { useAuth } from "@/components/dashboard/auth-provider";
import { authService, AuthError } from "@/services/auth";
import { PlayCircle, Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onChange",
  });

  const onSubmit = async (data: LoginValues) => {
    setError(null);
    setIsLoading(true);

    try {
      const user = await authService.login(data.email, data.password);
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

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4 pt-8 pb-16 sm:pt-12 sm:pb-24">
      <div className="w-full max-w-[420px] relative">
        {/* Subtle background glow outside the card */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none z-0"></div>

        <div className="text-center mb-8 sm:mb-10 relative z-10">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-zinc-950 mb-6 shadow-lg shadow-cyan-500/20">
            <PlayCircle className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
          <p className="text-xs sm:text-[13px] lg:text-sm text-zinc-400">Sign in to your elite mentorship portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/80 rounded-[2rem] p-6 sm:p-8 shadow-2xl">

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
                  {...register("email")}
                  className={`block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-zinc-950/50 border rounded-xl text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
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
                  {...register("password")}
                  className={`block w-full pl-11 pr-4 py-3 sm:py-3.5 bg-zinc-950/50 border rounded-xl text-xs sm:text-[13px] lg:text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 transition-all ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-zinc-800 focus:border-cyan-500 focus:ring-cyan-500'}`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !isValid}
            className="relative z-10 w-full flex justify-center items-center px-4 py-3 sm:py-3.5 border border-transparent rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)] text-xs sm:text-[13px] lg:text-sm font-bold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Sign In to Dashboard"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

