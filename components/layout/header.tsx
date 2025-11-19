"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle: string;
  logoText: string;
  loginHref?: string;
  showTerms?: boolean;
  termsComponent?: React.ReactNode;
}

export function Header({
  title,
  subtitle,
  logoText,
  loginHref = "/login",
  showTerms = false,
  termsComponent,
}: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">{logoText}</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
              <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {showTerms && termsComponent}
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={loginHref}>Entrar</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
