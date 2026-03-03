"use client";

import { motion } from "framer-motion";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { SelectionCard } from "../SelectionCard";
import { BagVisualisation } from "../BagVisualisation";

// Roast level indicator component
function RoastIndicator({ level }: { level: number }) {
  return (
    <div className="flex gap-1 mt-3">
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={`w-6 h-2 rounded-full ${
            bar <= level ? "bg-accent" : "bg-neutral-700"
          }`}
        />
      ))}
    </div>
  );
}

export function Step4RoastProfile() {
  const { state, dispatch, roastProfiles, builderSettings } = useBuilder();

  const handleSelect = (profile: (typeof roastProfiles)[0]) => {
    dispatch({
      type: "SET_ROAST_PROFILE",
      slug: profile.slug,
      name: profile.name,
      descriptor: profile.descriptor,
    });
  };

  const heading =
    builderSettings.step4Heading ||
    "What does your coffee taste like?";
  const subheading =
    builderSettings.step4Subheading ||
    "This is the roast profile your beans will be roasted to.";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <StepHeading heading={heading} subheading={subheading} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl">
          {roastProfiles.map((profile, index) => (
            <SelectionCard
              key={profile.id}
              selected={state.roastProfile === profile.slug}
              onClick={() => handleSelect(profile)}
              delay={index * 0.1}
            >
              <div className="relative">
                {/* Badge */}
                {profile.badge && (
                  <motion.span
                    className="absolute -top-2 -right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {profile.badge}
                  </motion.span>
                )}

                <h3 className="text-lg font-semibold text-foreground">
                  {profile.name}
                </h3>
                <p className="text-accent font-medium mt-1">
                  {profile.descriptor}
                </p>
                <p className="text-sm text-neutral-400 mt-2">
                  {profile.tastingNotes}
                </p>
                <RoastIndicator level={profile.roastLevel} />
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
