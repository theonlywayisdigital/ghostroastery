"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface BuilderNavProps {
  currentStep: number;
  onBack: () => void;
  onContinue: () => void;
  continueDisabled?: boolean;
  continueLabel?: string;
  showBack?: boolean;
}

export function BuilderNav({
  currentStep,
  onBack,
  onContinue,
  continueDisabled = false,
  continueLabel = "Continue",
  showBack = true,
}: BuilderNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Back button */}
        {showBack && currentStep > 1 ? (
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-3 text-neutral-400 hover:text-foreground transition-colors"
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </motion.button>
        ) : (
          <div />
        )}

        {/* Continue button */}
        <motion.button
          onClick={onContinue}
          disabled={continueDisabled}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
            continueDisabled
              ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              : "bg-accent text-background hover:opacity-90"
          }`}
          whileHover={continueDisabled ? {} : { scale: 1.02 }}
          whileTap={continueDisabled ? {} : { scale: 0.98 }}
        >
          <span>{continueLabel}</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
}
