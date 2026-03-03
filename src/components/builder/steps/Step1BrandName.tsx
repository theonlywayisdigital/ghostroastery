"use client";

import { motion } from "framer-motion";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";

export function Step1BrandName() {
  const { state, dispatch } = useBuilder();

  return (
    <div>
      <StepHeading
        heading="Let's start with the basics."
        subheading="What's the name of your brand or business?"
      />

      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <input
          type="text"
          value={state.brandName}
          onChange={(e) => {
            const value = e.target.value.slice(0, 50);
            dispatch({ type: "SET_BRAND_NAME", name: value });
          }}
          placeholder="e.g. Off Your Bean"
          maxLength={50}
          autoFocus
          className="w-full px-5 py-4 bg-neutral-900 border border-neutral-700 rounded-xl text-foreground text-lg placeholder:text-neutral-500 focus:outline-none focus:border-accent transition-colors"
        />
        <div className="flex justify-between mt-2 text-xs text-neutral-500">
          <p>This helps us keep your orders organised. It won&apos;t appear on your bag unless your label includes it.</p>
          <p className="ml-4 shrink-0">{state.brandName.length}/50</p>
        </div>
      </motion.div>
    </div>
  );
}
