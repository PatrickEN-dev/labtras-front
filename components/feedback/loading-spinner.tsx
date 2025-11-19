import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
  inline?: boolean;
}

export function LoadingSpinner({
  size = "md",
  className,
  text,
  inline = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const Wrapper = inline ? "span" : "div";
  const wrapperClasses = inline
    ? "inline-flex items-center gap-2"
    : "flex flex-col items-center justify-center gap-3";

  return (
    <Wrapper className={cn(wrapperClasses, className)}>
      <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
      {text && (
        <span
          className={cn(
            "text-gray-600",
            size === "sm" ? "text-xs" : size === "lg" ? "text-lg" : "text-sm"
          )}
        >
          {text}
        </span>
      )}
    </Wrapper>
  );
}
