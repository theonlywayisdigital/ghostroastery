"use client";

import { motion } from "framer-motion";

interface StepHeadingProps {
  heading: string;
  subheading?: string;
}

export function StepHeading({ heading, subheading }: StepHeadingProps) {
  return (
    <div className="text-center mb-8 md:mb-12">
      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {heading}
      </motion.h1>
      {subheading && (
        <motion.p
          className="mt-4 text-lg md:text-xl text-neutral-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {subheading}
        </motion.p>
      )}
    </div>
  );
}
