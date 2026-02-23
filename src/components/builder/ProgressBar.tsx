"use client";

import { motion } from "framer-motion";
import { TOTAL_STEPS } from "./types";

interface ProgressBarProps {
  currentStep: number;
  stepName: string;
}

export function ProgressBar({ currentStep, stepName }: ProgressBarProps) {
  const progress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        />
      </div>

      {/* Step indicator */}
      <div className="mt-4 text-center">
        <p className="text-sm text-neutral-400">
          Step {currentStep} of {TOTAL_STEPS}
        </p>
        <p className="text-lg font-medium text-foreground mt-1">{stepName}</p>
      </div>
    </div>
  );
}
