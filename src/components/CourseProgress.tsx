"use client";

import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

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
  const isComplete = progress >= 100 && variant === "success";
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col gap-3 w-full max-w-md mx-auto",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        {label && (
          <span className="text-muted-foreground font-semibold text-sm tracking-wide">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1">
          {showPercentage && (
            <span
              className={cn(
                "font-bold text-sm",
                isComplete ? "text-emerald-600" : "text-primary"
              )}
            >
              {progress}%
            </span>
          )}
          {isComplete && (
            <CheckCircle2
              className="w-4 h-4 text-emerald-600 ml-1"
              aria-label="Completed"
            />
          )}
        </div>
      </div>
      <Progress
        value={progress}
        className={cn(
          "h-3 rounded-full bg-muted [&>div]:rounded-full shadow-inner transition-all",
          size === "sm" && "h-2",
          variant === "success" && "[&>div]:bg-emerald-600"
        )}
      />
    </div>
  );
}
