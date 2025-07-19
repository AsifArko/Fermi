"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
  progress: number;
  variant?: "default" | "success";
  size?: "default" | "sm";
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export function CourseProgress({
  progress,
  variant = "default",
  size = "default",
  showPercentage = true,
  label,
  className,
}: CourseProgressProps) {
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3 w-full max-w-md mx-auto",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {label && (
          <span className="text-[11px] font-normal text-muted-foreground/80 uppercase tracking-widest">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1">
          {showPercentage && (
            <span className="text-[11px] font-normal text-muted-foreground/80 uppercase tracking-widest">
              {progress}%
            </span>
          )}
        </div>
      </div>
      <Progress
        value={progress}
        className={cn(
          "h-1 rounded-full bg-muted [&>div]:rounded-full shadow-inner transition-all",
          size === "sm" && "h-0.5",
          variant === "success" && "[&>div]:bg-emerald-600"
        )}
      />
    </div>
  );
}
