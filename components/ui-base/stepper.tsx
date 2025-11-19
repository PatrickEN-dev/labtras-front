import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  id: string;
  title: string;
  description?: string;
  icon?: React.ElementType;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  allowStepClick?: boolean;
  className?: string;
}

export function Stepper({
  steps,
  currentStep,
  onStepClick,
  allowStepClick = false,
  className,
}: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progresso">
        <ol role="list" className="flex items-center justify-between">
          {steps.map((step, stepIndex) => {
            const isComplete = stepIndex < currentStep;
            const isCurrent = stepIndex === currentStep;
            const isUpcoming = stepIndex > currentStep;

            return (
              <li
                key={step.id}
                className={cn("relative flex-1", {
                  "pr-4": stepIndex < steps.length - 1,
                })}
              >
                {/* Linha conectora */}
                {stepIndex < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 right-0 h-0.5 w-4 transition-colors duration-200",
                      {
                        "bg-blue-600": isComplete,
                        "bg-gray-300": !isComplete,
                      }
                    )}
                    aria-hidden="true"
                  />
                )}

                <div
                  className={cn("group flex flex-col items-center", {
                    "cursor-pointer": allowStepClick && onStepClick,
                  })}
                  onClick={() => {
                    if (allowStepClick && onStepClick) {
                      onStepClick(stepIndex);
                    }
                  }}
                >
                  {/* Círculo do step */}
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200",
                      {
                        "border-blue-600 bg-blue-600 text-white": isComplete,
                        "border-blue-600 bg-white text-blue-600": isCurrent,
                        "border-gray-300 bg-white text-gray-400": isUpcoming,
                        "group-hover:border-blue-500": allowStepClick && onStepClick,
                      }
                    )}
                  >
                    {isComplete ? (
                      <Check className="h-5 w-5" />
                    ) : step.icon ? (
                      <step.icon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-semibold">{stepIndex + 1}</span>
                    )}
                  </div>

                  {/* Título e descrição */}
                  <div className="mt-2 text-center">
                    <div
                      className={cn("text-sm font-medium transition-colors duration-200", {
                        "text-blue-600": isComplete || isCurrent,
                        "text-gray-500": isUpcoming,
                        "group-hover:text-blue-600": allowStepClick && onStepClick,
                      })}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div
                        className={cn("text-xs transition-colors duration-200", {
                          "text-blue-500": isComplete || isCurrent,
                          "text-gray-400": isUpcoming,
                        })}
                      >
                        {step.description}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
