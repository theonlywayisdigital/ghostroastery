"use client";

import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { SelectionCard } from "../SelectionCard";
import { BagVisualisation } from "../BagVisualisation";

export function Step1Size() {
  const { state, dispatch, bagSizes, siteSettings } = useBuilder();

  const handleSelect = (size: { name: string }) => {
    dispatch({
      type: "SET_BAG_SIZE",
      size: size.name,
      name: size.name,
    });
  };

  const heading =
    siteSettings.builderCopy?.step1Heading || "How much coffee per bag?";
  const subheading = siteSettings.builderCopy?.step1Subheading || undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <StepHeading heading={heading} subheading={subheading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {bagSizes.map((size, index) => (
            <SelectionCard
              key={size._id}
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
        </div>
      </div>

      {/* Visualisation panel */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <BagVisualisation
          bagPhotoUrl={state.bagPhotoUrl}
          bagColourHex={state.bagColourHex}
          labelFileURL={state.labelFileURL}
          size="medium"
          showPlaceholder
        />
      </div>
    </div>
  );
}
