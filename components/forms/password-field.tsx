import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  disabled?: boolean;
}

export function PasswordField({
  value,
  onChange,
  placeholder = "Digite sua senha",
  label = "Senha",
  error,
  showPassword,
  onTogglePassword,
  disabled,
}: PasswordFieldProps) {
  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`pr-12 ${error ? "border-red-500" : ""}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        >
          {showPassword ? (
            <FaEyeSlash className="h-4 w-4 text-gray-400" />
          ) : (
            <FaEye className="h-4 w-4 text-gray-400" />
          )}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
