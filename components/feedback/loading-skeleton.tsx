import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
  showHeader?: boolean;
}

export function LoadingSkeleton({
  lines = 3,
  className,
  showHeader = false,
}: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      {showHeader && <div className="h-8 bg-gray-200 rounded w-1/3"></div>}
      <div className="space-y-4">
        {Array.from({ length: lines }, (_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

interface PageLoadingProps {
  title?: string;
  subtitle?: string;
  cards?: number;
}

export function PageLoading({ subtitle, cards = 3 }: PageLoadingProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          {subtitle && <div className="h-4 bg-gray-200 rounded w-1/4"></div>}
        </div>
        <div className="grid gap-4">
          {Array.from({ length: cards }, (_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
