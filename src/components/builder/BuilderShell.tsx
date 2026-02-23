"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowLeft, ArrowRight } from "lucide-react";
import { useBuilder } from "./BuilderContext";
import { ProgressBar } from "./ProgressBar";
import { ExitModal } from "./ExitModal";
import { STEP_NAMES, STEP_CONFIG } from "./types";

interface BuilderShellProps {
  children: React.ReactNode;
}

export function BuilderShell({ children }: BuilderShellProps) {
  const router = useRouter();
  const { state, dispatch, canContinue } = useBuilder();
  const [showExitModal, setShowExitModal] = useState(false);

  const hasSelections =
    state.bagSize ||
    state.bagColourId ||
    state.roastProfile ||
    state.grind ||
    state.labelFile;

  const handleExitClick = () => {
    if (hasSelections) {
      setShowExitModal(true);
    } else {
      router.push("/");
    }
  };

  const handleConfirmExit = () => {
    router.push("/");
  };

  const handleBack = () => {
    dispatch({ type: "PREV_STEP" });
  };

  const handleContinue = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  const stepConfig = STEP_CONFIG[state.currentStep];
  const showNavigation = !stepConfig.customNav;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header - Fixed */}
      <header className="flex-shrink-0 z-40 bg-background/80 backdrop-blur-md border-b border-neutral-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-foreground font-bold text-lg">
            Ghost Roasting UK
          </Link>

          {/* Exit button */}
          <button
            onClick={handleExitClick}
            className="flex items-center gap-2 text-neutral-400 hover:text-foreground transition-colors"
          >
            <span className="text-sm">Exit</span>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto">
            <ProgressBar
              currentStep={state.currentStep}
              stepName={STEP_NAMES[state.currentStep]}
            />
          </div>
        </div>
      </header>

      {/* Main content - Fixed height with internal scroll */}
      <main className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-y-auto px-4 py-8 pb-28">
          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={state.currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Fixed Navigation Footer */}
      {showNavigation && (
        <div className="flex-shrink-0 border-t border-neutral-800 bg-background">
          <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
            {/* Back button */}
            {stepConfig.showBack ? (
              <motion.button
                onClick={handleBack}
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
            {stepConfig.showContinue && (
              <motion.button
                onClick={handleContinue}
                disabled={!canContinue}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  !canContinue
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-accent text-background hover:opacity-90"
                }`}
                whileHover={canContinue ? { scale: 1.02 } : {}}
                whileTap={canContinue ? { scale: 0.98 } : {}}
              >
                <span>{stepConfig.continueLabel || "Continue"}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      )}

      {/* Exit confirmation modal */}
      <ExitModal
        isOpen={showExitModal}
        onClose={() => setShowExitModal(false)}
        onConfirm={handleConfirmExit}
      />
    </div>
  );
}
