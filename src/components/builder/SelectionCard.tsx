"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SelectionCardProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function SelectionCard({
  selected,
  onClick,
  children,
  className = "",
  delay = 0,
}: SelectionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative w-full p-6 rounded-2xl border-2 text-left transition-all ${
        selected
          ? "border-accent bg-accent/10"
          : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 hover:bg-neutral-900"
      } ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Selection indicator */}
      {selected && (
        <motion.div
          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <svg
            className="w-4 h-4 text-background"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
      )}
      {children}
    </motion.button>
  );
}
