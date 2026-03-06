"use client";

import { Suspense, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowSquareOut } from "@phosphor-icons/react";
import { LabelMakerClient } from "@/components/label-maker/LabelMakerClient";

interface LabelMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportComplete: (result: {
    pdfUrl: string;
    previewPngUrl: string | null;
    filename: string;
  }) => void;
}

export function LabelMakerModal({
  isOpen,
  onClose,
  onExportComplete,
}: LabelMakerModalProps) {
  const handleExportComplete = useCallback(
    (result: { pdfUrl: string; previewPngUrl: string | null; filename: string }) => {
      onExportComplete(result);
      // Small delay to let the user see the success state
      setTimeout(() => onClose(), 1500);
    },
    [onExportComplete, onClose]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/90 z-[60]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Full-screen modal */}
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal top bar */}
            <div className="flex items-center justify-between px-4 h-10 bg-neutral-950 border-b border-neutral-800 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">
                  Designing label for your bag
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/label-maker"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-neutral-400 hover:text-foreground hover:bg-neutral-800 rounded transition-colors"
                >
                  <ArrowSquareOut size={12} weight="duotone" />
                  Open in new tab
                </a>
                <button
                  onClick={onClose}
                  className="p-1.5 text-white hover:text-foreground hover:bg-neutral-800 rounded transition-colors"
                >
                  <X size={16} weight="duotone" />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={null}>
                <LabelMakerClient
                  onExportComplete={handleExportComplete}
                />
              </Suspense>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
