"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { BagVisualisation } from "../BagVisualisation";

export function Step6Quantity() {
  const { state, dispatch, pricingTiers, siteSettings } = useBuilder();

  const minQty = siteSettings.minOrderQuantity || 10;
  const maxQty = siteSettings.maxOrderQuantity || 150;
  const wholesaleThreshold = siteSettings.wholesaleThreshold || 150;

  // Calculate pricing based on quantity and size
  const pricing = useMemo(() => {
    if (!state.bagSize) return null;

    const tier = pricingTiers.find((p) => p.bagSize === state.bagSize);
    if (!tier) return null;

    let pricePerBag: number;
    let tierName: string;
    const maxTierPrice: number = tier.tier_10_24 || tier.tier_25_49;

    if (state.quantity >= 100) {
      pricePerBag = tier.tier_100_150;
      tierName = "100–150";
    } else if (state.quantity >= 50) {
      pricePerBag = tier.tier_50_99;
      tierName = "50–99";
    } else if (state.quantity >= 25) {
      pricePerBag = tier.tier_25_49;
      tierName = "25–49";
    } else {
      pricePerBag = tier.tier_10_24 || tier.tier_25_49;
      tierName = "10–24";
    }

    const totalPrice = pricePerBag * state.quantity;
    const savings =
      state.quantity >= 25 ? (maxTierPrice - pricePerBag) * state.quantity : 0;

    return { pricePerBag, totalPrice, tierName, savings };
  }, [state.bagSize, state.quantity, pricingTiers]);

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
  const getTierClass = (tier: string) => {
    if (!pricing) return "text-neutral-400";
    return pricing.tierName === tier
      ? "text-accent font-medium bg-accent/10"
      : "text-neutral-400";
  };

  const heading =
    siteSettings.builderCopy?.step6Heading || "How many bags do you need?";
  const subheading = siteSettings.builderCopy?.step6Subheading || undefined;

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
                  You&apos;re in the {pricing.tierName} tier — saving £
                  {pricing.savings.toFixed(2)} vs. minimum order price
                </p>
              )}

              {/* Tier indicator - 4 tiers */}
              <div className="mt-6 grid grid-cols-4 gap-2 text-center text-xs sm:text-sm">
                <div
                  className={`py-2 px-2 rounded-lg ${getTierClass("10–24")}`}
                >
                  10–24
                </div>
                <div
                  className={`py-2 px-2 rounded-lg ${getTierClass("25–49")}`}
                >
                  25–49
                </div>
                <div
                  className={`py-2 px-2 rounded-lg ${getTierClass("50–99")}`}
                >
                  50–99
                </div>
                <div
                  className={`py-2 px-2 rounded-lg ${getTierClass("100–150")}`}
                >
                  100–150
                </div>
              </div>
            </motion.div>
          )}

          {/* Wholesale nudge */}
          {state.quantity >= wholesaleThreshold && (
            <motion.div
              className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-foreground">
                Need more than {maxQty} bags? Our wholesale service offers
                better pricing at volume.
              </p>
              <a
                href="/wholesale"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-accent hover:underline"
              >
                View wholesale options
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}

          {/* Minimum order note */}
          <p className="text-center text-sm text-neutral-500 mt-6">
            Minimum order is {minQty} bags — perfect for gifting and sampling runs.
          </p>
        </div>
      </div>

      {/* Visualisation panel */}
      <div className="hidden lg:flex flex-col items-center justify-center">
        <BagVisualisation
          bagPhotoUrl={state.bagPhotoUrl}
          bagColourHex={state.bagColourHex}
          labelFileURL={state.labelFileURL}
          size="medium"
        />
      </div>

      {/* Mobile visualisation */}
      <BagVisualisation
        bagPhotoUrl={state.bagPhotoUrl}
        bagColourHex={state.bagColourHex}
        labelFileURL={state.labelFileURL}
        size="small"
        collapsible
      />
    </div>
  );
}
