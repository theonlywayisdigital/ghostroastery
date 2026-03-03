"use client";

import Image from "next/image";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { SelectionCard } from "../SelectionCard";
import { BagVisualisation } from "../BagVisualisation";
import { Coffee } from "lucide-react";

export function Step5Grind() {
  const { state, dispatch, grindOptions, builderSettings } = useBuilder();

  const handleSelect = (grind: (typeof grindOptions)[0]) => {
    dispatch({
      type: "SET_GRIND",
      id: grind.id,
      name: grind.name,
    });
  };

  const heading =
    builderSettings.step5Heading ||
    "How will your customers brew it?";
  const subheading = builderSettings.step5Subheading || undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <StepHeading heading={heading} subheading={subheading} />

        <div className="grid grid-cols-2 gap-4 max-w-xl">
          {grindOptions.map((grind, index) => (
            <SelectionCard
              key={grind.id}
              selected={state.grind === grind.id}
              onClick={() => handleSelect(grind)}
              delay={index * 0.08}
            >
              <div className="flex flex-col items-center text-center">
                {/* Image from Sanity or fallback icon */}
                <div className="w-16 h-16 mb-3 relative">
                  {grind.imageUrl ? (
                    <Image
                      src={grind.imageUrl}
                      alt={grind.name}
                      fill
                      className="object-contain"
                    />
                  ) : (
                    <div
                      className={`w-full h-full rounded-full flex items-center justify-center ${
                        state.grind === grind.id
                          ? "bg-accent/20 text-accent"
                          : "bg-neutral-800 text-neutral-400"
                      }`}
                    >
                      <Coffee className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  {grind.name}
                </h3>
                <p className="text-sm text-neutral-400 mt-1">
                  {grind.description}
                </p>
              </div>
            </SelectionCard>
          ))}
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
        />
      </div>

      {/* Mobile visualisation */}
      <BagVisualisation
        bagPhotoUrl={state.bagPhotoUrl}
        bagColourHex={state.bagColourHex}
        bagColourName={state.bagColourName}
        actualBagPhotoUrl={state.actualBagPhotoUrl}
        labelFileURL={state.labelFileURL}
        size="small"
        collapsible
      />
    </div>
  );
}
