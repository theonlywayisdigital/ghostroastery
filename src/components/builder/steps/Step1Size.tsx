"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { SelectionCard } from "../SelectionCard";
import { BagVisualisation } from "../BagVisualisation";

export function Step1Size() {
  const { state, dispatch, bagSizes, builderSettings } = useBuilder();

  // Filter out 1kg — only 250g and 500g are self-serve
  const availableSizes = useMemo(
    () => bagSizes.filter((s) => s.name !== "1kg"),
    [bagSizes]
  );

  const handleSelect = (size: { name: string }) => {
    dispatch({
      type: "SET_BAG_SIZE",
      size: size.name,
      name: size.name,
    });
  };

  const heading =
    builderSettings.step1Heading || "How much coffee per bag?";
  const subheading = builderSettings.step1Subheading || undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <StepHeading heading={heading} subheading={subheading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {availableSizes.map((size, index) => (
            <SelectionCard
              key={size.id}
              selected={state.bagSize === size.name}
              onClick={() => handleSelect(size)}
              delay={index * 0.1}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-foreground">
                  {size.name}
                </h3>
                <p className="text-sm text-neutral-400 mt-2">
                  {size.description}
                </p>
              </div>
            </SelectionCard>
          ))}

          {/* Wholesale CTA card */}
          <motion.div
            className="rounded-2xl border-2 border-dashed border-neutral-700 p-6 opacity-80 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.8, y: 0 }}
            transition={{ duration: 0.3, delay: availableSizes.length * 0.1 }}
          >
            <h3 className="text-2xl font-bold text-foreground">1kg+</h3>
            <p className="text-sm font-medium text-neutral-300 mt-1">
              Ordering in bulk?
            </p>
            <p className="text-xs text-neutral-400 mt-2">
              Our wholesale service offers better pricing for larger orders.
            </p>
            <a
              href="/wholesale"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-accent/15 text-accent text-sm font-medium rounded-lg hover:bg-accent/25 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Get a wholesale quote
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
