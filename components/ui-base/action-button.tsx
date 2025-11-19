import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  onClick?: () => void;
}

export function ActionButton({
  icon: Icon,
  children,
  variant = "default",
  size = "default",
  className = "",
  onClick,
}: ActionButtonProps) {
  return (
    <Button variant={variant} size={size} className={className} onClick={onClick}>
      <Icon className="h-4 w-4 mr-2" />
      {children}
    </Button>
  );
}
