import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function AuthLayout({ children, title, description, className = "" }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LabTras
          </h1>
          <p className="text-gray-600 mt-2">Sistema de Reservas de Salas</p>
        </div>

        <Card className={`shadow-xl border-0 ${className}`}>
          <CardHeader className="space-y-3 text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
            {description && (
              <CardDescription className="text-gray-600 text-base">{description}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
