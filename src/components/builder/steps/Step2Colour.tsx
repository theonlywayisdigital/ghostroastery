"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { BagVisualisation } from "../BagVisualisation";
import type { BagColour } from "../types";

function getSwatchClass(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("holo")) return "swatch-holo";
  if (n.includes("shiny")) return "swatch-shiny";
  return "";
}

export function Step2Colour() {
  const { state, dispatch, bagColours, builderSettings } = useBuilder();
  const [hoveredColour, setHoveredColour] = useState<BagColour | null>(null);

  const handleSelect = (colour: BagColour) => {
    dispatch({
      type: "SET_BAG_COLOUR",
      id: colour._id,
      name: colour.name,
      hex: colour.hex,
      photoUrl: colour.bagPhotoUrl,
      actualPhotoUrl: colour.actualBagPhotoUrl,
    });
  };

  const heading =
    builderSettings.step2Heading || "Pick your bag colour.";
  const subheading =
    builderSettings.step2Subheading ||
    "This is the base colour of your bag.";

  // Get the photo URL to display (hovered or selected)
  const previewPhotoUrl =
    hoveredColour?.bagPhotoUrl || state.bagPhotoUrl || null;
  const previewActualPhotoUrl =
    hoveredColour?.actualBagPhotoUrl || state.actualBagPhotoUrl || null;
  const previewHex = hoveredColour?.hex || state.bagColourHex || null;
  const previewName = hoveredColour?.name || state.bagColourName || null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Main content */}
      <div>
        <StepHeading heading={heading} subheading={subheading} />

        {/* Colour swatches grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 md:gap-6 max-w-md">
          {bagColours.map((colour, index) => (
            <motion.button
              key={colour._id}
              onClick={() => handleSelect(colour)}
              onMouseEnter={() => setHoveredColour(colour)}
              onMouseLeave={() => setHoveredColour(null)}
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-full transition-all ${
                  state.bagColourId === colour._id
                    ? "ring-4 ring-accent ring-offset-4 ring-offset-background"
                    : "ring-2 ring-neutral-700 hover:ring-neutral-500"
                } ${getSwatchClass(colour.name)}`}
                style={{ backgroundColor: colour.hex }}
              />
              <span
                className={`mt-2 text-xs md:text-sm text-center ${
                  state.bagColourId === colour._id
                    ? "text-foreground font-medium"
                    : "text-neutral-400"
                }`}
              >
                {colour.name}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Info note */}
        <motion.p
          className="mt-8 text-sm text-neutral-500 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Your label will be printed and applied over this base colour. The bag
          colour shows around the edges and back.
        </motion.p>
      </div>

      {/* Visualisation panel */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={previewPhotoUrl || "placeholder"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <BagVisualisation
              bagPhotoUrl={previewPhotoUrl}
              bagColourHex={previewHex}
              bagColourName={previewName}
              actualBagPhotoUrl={previewActualPhotoUrl}
              labelFileURL={null}
              size="large"
              showPlaceholder
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Mobile visualisation */}
      <BagVisualisation
        bagPhotoUrl={previewPhotoUrl}
        bagColourHex={previewHex}
        bagColourName={previewName}
        actualBagPhotoUrl={previewActualPhotoUrl}
        labelFileURL={null}
        size="medium"
        collapsible
      />
    </div>
  );
}
