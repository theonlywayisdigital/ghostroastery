"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { SelectionCard } from "../SelectionCard";
import { BagVisualisation } from "../BagVisualisation";

export function Step1Size() {
  const { state, dispatch, builderSettings } = useBuilder();

  // Auto-select 250g since it's the only option
  useEffect(() => {
    if (!state.bagSize) {
      dispatch({ type: "SET_BAG_SIZE", size: "250g", name: "250g" });
    }
  }, [state.bagSize, dispatch]);

  const handleSelect = () => {
    dispatch({ type: "SET_BAG_SIZE", size: "250g", name: "250g" });
  };

  const heading =
    builderSettings.step1Heading || "250g Bags";
  const subheading =
    builderSettings.step1Subheading ||
    "Our bags are perfect for one-off orders, events, client gifting and weddings.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <StepHeading heading={heading} subheading={subheading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-md mx-auto">
          {/* 250g card */}
          <SelectionCard
            selected={state.bagSize === "250g"}
            onClick={handleSelect}
            delay={0}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-foreground">250g</h3>
              <p className="text-sm text-neutral-400 mt-2">
                Perfect for events, client gifting and weddings
              </p>
            </div>
          </SelectionCard>

          {/* Wholesale CTA card */}
          <motion.div
            className="rounded-2xl border-2 border-dashed border-neutral-700 p-6 opacity-80 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <p className="text-sm font-medium text-neutral-300">
              Ordering in bulk?
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              For cafes, restaurants and ongoing wholesale accounts.
            </p>
            <a
              href="/wholesale/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-accent/15 text-accent text-sm font-medium rounded-lg hover:bg-accent/25 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Request wholesale access
              <ArrowSquareOut size={16} weight="duotone" />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Visualisation panel */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <BagVisualisation
          bagPhotoUrl={state.bagPhotoUrl}
          bagColourHex={state.bagColourHex}
          bagColourName={state.bagColourName}
          actualBagPhotoUrl={state.actualBagPhotoUrl}
          labelFileURL={state.labelFileURL}
          size="medium"
          showPlaceholder
        />
      </div>
    </div>
  );
}
