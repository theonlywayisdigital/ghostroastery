"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowSquareOut } from "@phosphor-icons/react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { BagVisualisation } from "../BagVisualisation";
import { getPriceForQuantity, getBracketLabel } from "@/lib/pricing";

export function Step6Quantity() {
  const { state, dispatch, pricingData, builderSettings } = useBuilder();

  const minQty = pricingData.minOrder || 25;
  const maxQty = builderSettings.maxOrderQuantity || 99;
  const wholesaleThreshold = builderSettings.wholesaleThreshold || 99;

  // Calculate pricing based on quantity and size
  const pricing = useMemo(() => {
    if (!state.bagSize) return null;

    const result = getPriceForQuantity(state.quantity, state.bagSize, pricingData);
    if (!result) return null;

    const tierName = getBracketLabel(result.bracket);

    // Calculate savings vs. first bracket price
    const firstBracket = pricingData.brackets[0];
    const firstPrice = firstBracket
      ? pricingData.prices.find(
          (p) => p.bracketId === firstBracket.id && p.bagSize === state.bagSize
        )
      : null;
    const maxTierPrice = firstPrice?.pricePerBag ?? result.pricePerBag;

    const totalPrice = result.pricePerBag * state.quantity;
    const savings =
      result.bracket.sortOrder > (firstBracket?.sortOrder ?? 0)
        ? (maxTierPrice - result.pricePerBag) * state.quantity
        : 0;

    return { pricePerBag: result.pricePerBag, totalPrice, tierName, savings, bracket: result.bracket };
  }, [state.bagSize, state.quantity, pricingData]);

  // Update pricing in state
  useEffect(() => {
    if (pricing) {
      dispatch({
        type: "SET_PRICING",
        pricePerBag: pricing.pricePerBag,
        totalPrice: pricing.totalPrice,
      });
    }
  }, [pricing, dispatch]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: "SET_QUANTITY", quantity: parseInt(e.target.value) });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || minQty;
    const clampedValue = Math.min(Math.max(value, minQty), maxQty);
    dispatch({ type: "SET_QUANTITY", quantity: clampedValue });
  };

  // Get tier highlight class
  const getTierClass = (bracketId: string) => {
    if (!pricing) return "text-neutral-400";
    return pricing.bracket.id === bracketId
      ? "text-accent font-medium bg-accent/10"
      : "text-neutral-400";
  };

  const heading =
    builderSettings.step6Heading || "How many bags do you need?";
  const subheading = builderSettings.step6Subheading || undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main content */}
      <div className="lg:col-span-2">
        <StepHeading heading={heading} subheading={subheading} />

        <div className="max-w-xl">
          {/* Quantity display */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span className="text-6xl md:text-7xl font-bold text-foreground">
              {state.quantity}
            </span>
            <span className="text-2xl text-neutral-400 ml-2">bags</span>
          </motion.div>

          {/* Slider */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <input
              type="range"
              min={minQty}
              max={maxQty}
              step="1"
              value={state.quantity}
              onChange={handleSliderChange}
              className="w-full h-3 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-accent
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6
                [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-accent/30
                [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:bg-accent
                [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-none"
            />
            <div className="flex justify-between mt-2 text-sm text-neutral-500">
              <span>{minQty} (min)</span>
              <span>{maxQty} (max)</span>
            </div>
          </motion.div>

          {/* Or type directly */}
          <motion.div
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-neutral-400">or type:</span>
            <input
              type="number"
              min={minQty}
              max={maxQty}
              value={state.quantity}
              onChange={handleInputChange}
              className="w-24 px-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-center text-foreground font-medium focus:outline-none focus:border-accent"
            />
          </motion.div>

          {/* Pricing breakdown */}
          {pricing && (
            <motion.div
              className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-lg text-foreground text-center">
                <span className="font-bold">{state.quantity}</span> ×{" "}
                <span className="font-bold">{state.bagSize}</span> bags at{" "}
                <span className="text-accent font-bold">
                  £{pricing.pricePerBag.toFixed(2)}
                </span>{" "}
                each
              </p>
              <p className="text-3xl font-bold text-foreground text-center mt-4">
                Total: £{pricing.totalPrice.toFixed(2)}
              </p>

              {pricing.savings > 0 && (
                <p className="text-green-500 text-center mt-2 text-sm">
                  {`You're in the ${pricing.tierName} tier — saving £${pricing.savings.toFixed(2)} vs. minimum order price`}
                </p>
              )}

              {/* Dynamic tier indicators */}
              <div className={`mt-6 grid gap-2 text-center text-xs sm:text-sm`} style={{ gridTemplateColumns: `repeat(${pricingData.brackets.length}, minmax(0, 1fr))` }}>
                {pricingData.brackets.map((bracket) => (
                  <div
                    key={bracket.id}
                    className={`py-2 px-2 rounded-lg ${getTierClass(bracket.id)}`}
                  >
                    {getBracketLabel(bracket)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Wholesale nudge */}
          {state.quantity >= wholesaleThreshold && (
            <motion.div
              className="mt-6 p-5 bg-accent/10 border-2 border-accent/30 rounded-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-foreground font-semibold">
                You&apos;ve hit our maximum online order.
              </p>
              <p className="text-neutral-300 text-sm mt-2">
                For 100+ bags, our wholesale service offers better pricing,
                dedicated account management and flexible delivery schedules.
              </p>
              <a
                href="/wholesale"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-accent/15 text-accent text-sm font-medium rounded-lg hover:bg-accent/25 transition-colors"
              >
                View wholesale options →
                <ArrowSquareOut size={20} weight="duotone" />
              </a>
            </motion.div>
          )}

          {/* Minimum order note */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            {`Minimum order is ${minQty} bags — perfect for gifting and sampling runs.`}
          </p>
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
