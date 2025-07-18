"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { getLessonCompletionStatusAction } from "@/actions/getLessonCompletionStatusAction";
import { completeLessonAction } from "@/actions/completeLessonAction";
import { uncompleteLessonAction } from "@/actions/uncompleteLessonAction";

interface LessonCompleteButtonProps {
  lessonId: string;
  clerkId: string;
}

export function LessonCompleteButton({
  lessonId,
  clerkId,
}: LessonCompleteButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [isCompleted, setIsCompleted] = useState<boolean | null>(null);
  const [isPendingTransition, startTransition] = useTransition();
  const router = useRouter();

  // Fetch the latest status on mount and when IDs change
  useEffect(() => {
    let isMounted = true;
    startTransition(async () => {
      try {
        const status = await getLessonCompletionStatusAction(lessonId, clerkId);
        if (isMounted) setIsCompleted(status);
      } catch {
        if (isMounted) setIsCompleted(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [lessonId, clerkId]);

  const handleToggle = async () => {
    try {
      setIsPending(true);
      if (isCompleted) {
        await uncompleteLessonAction(lessonId, clerkId);
      } else {
        await completeLessonAction(lessonId, clerkId);
      }
      startTransition(async () => {
        const newStatus = await getLessonCompletionStatusAction(
          lessonId,
          clerkId
        );
        setIsCompleted(newStatus);
      });
      router.refresh();
    } catch {
      // Optionally handle error (e.g., show a toast)
    } finally {
      setIsPending(false);
    }
  };

  const isLoading = isCompleted === null || isPendingTransition;

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending || isLoading}
      size="icon"
      variant="default"
      className={cn(
        "fixed bottom-4 right-4 z-50 rounded-full shadow-lg transition-all duration-200 ease-in-out",
        isCompleted
          ? "bg-gray-600 hover:bg-gray-700 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
      )}
      aria-label={
        isLoading
          ? "Updating lesson status"
          : isCompleted
            ? "Mark as Not Complete"
            : "Mark as Complete"
      }
    >
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : isPending ? (
        <Loader2 className="h-6 w-6 animate-spin" />
      ) : isCompleted ? (
        <XCircle className="h-6 w-6" />
      ) : (
        <CheckCircle className="h-6 w-6" />
      )}
    </Button>
  );
}
