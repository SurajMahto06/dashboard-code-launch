import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "danger" | "warning"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        {
          "bg-cyan-400/15 text-cyan-700 dark:text-cyan-400": variant === "default",
          "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300": variant === "secondary",
          "border border-zinc-300 text-zinc-700 dark:border-zinc-700 dark:text-zinc-300": variant === "outline",
          "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400": variant === "success",
          "bg-rose-500/15 text-rose-700 dark:text-rose-400": variant === "danger",
          "bg-amber-500/15 text-amber-700 dark:text-amber-400": variant === "warning",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
