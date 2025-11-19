import React from "react";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { LoadingSpinner } from "@/components/feedback/loading-spinner";

interface SocialAuthButtonsProps {
  onGoogleAuth: () => void;
  onGithubAuth: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function SocialAuthButtons({
  onGoogleAuth,
  onGithubAuth,
  isLoading,
  disabled,
}: SocialAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={onGoogleAuth}
        disabled={isLoading || disabled}
        className="w-full h-12 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-colors"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" inline />
        ) : (
          <>
            <FcGoogle className="w-5 h-5 mr-3" />
            Continuar com Google
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onGithubAuth}
        disabled={isLoading || disabled}
        className="w-full h-12 text-sm font-medium border-gray-300 hover:bg-gray-50 transition-colors"
      >
        {isLoading ? (
          <LoadingSpinner size="sm" inline />
        ) : (
          <>
            <FaGithub className="w-5 h-5 mr-3" />
            Continuar com GitHub
          </>
        )}
      </Button>
    </div>
  );
}
