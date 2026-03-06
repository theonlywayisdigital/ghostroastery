"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react";

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExitModal({ isOpen, onClose, onConfirm }: ExitModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-neutral-900 rounded-2xl p-6 md:p-8 max-w-md w-full border border-neutral-800"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-foreground transition-colors"
              >
                <X size={24} weight="duotone" />
              </button>

              <h2 className="text-2xl font-bold text-foreground mb-4">
                Leave the builder?
              </h2>
              <p className="text-neutral-400 mb-8">
                Your selections haven&apos;t been saved. Are you sure you want
                to exit?
              </p>

              <div className="flex gap-4">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-lg border border-neutral-700 text-foreground hover:bg-neutral-800 transition-colors"
                >
                  Keep building
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Exit
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
