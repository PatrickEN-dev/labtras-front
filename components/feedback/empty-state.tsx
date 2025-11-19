import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  };
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        {Icon && <Icon className="h-12 w-12 text-gray-400 mb-4" />}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        {description && <p className="text-gray-600 mb-4 max-w-md">{description}</p>}
        {action && (
          <Button
            onClick={action.onClick}
            variant={action.variant || "default"}
            className="flex items-center gap-2"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
