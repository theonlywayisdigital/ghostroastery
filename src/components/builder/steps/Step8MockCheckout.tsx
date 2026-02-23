"use client";

import { motion } from "framer-motion";
import { Lock, AlertTriangle } from "lucide-react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";

export function Step8MockCheckout() {
  const { state, dispatch } = useBuilder();

  const handleSeeConfirmation = () => {
    dispatch({ type: "NEXT_STEP" });
  };

  return (
    <div>
      {/* Construction banner */}
      <motion.div
        className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-8 flex items-center gap-3 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <p className="text-amber-200 text-sm">
          Checkout coming in the next build phase. Your selections have been
          saved.
        </p>
      </motion.div>

      <StepHeading
        heading="Almost there."
        subheading="In the live version, you would complete payment here."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Mock checkout form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Payment Details
          </h3>

          {/* Name on card */}
          <div className="mb-4">
            <label className="block text-sm text-neutral-400 mb-2">
              Name on card
            </label>
            <input
              type="text"
              disabled
              placeholder="John Smith"
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-500 cursor-not-allowed"
            />
          </div>

          {/* Card number */}
          <div className="mb-4">
            <label className="block text-sm text-neutral-400 mb-2">
              Card number
            </label>
            <input
              type="text"
              disabled
              placeholder="4242 4242 4242 4242"
              className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-500 cursor-not-allowed"
            />
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-neutral-400 mb-2">
                Expiry date
              </label>
              <input
                type="text"
                disabled
                placeholder="MM/YY"
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm text-neutral-400 mb-2">CVC</label>
              <input
                type="text"
                disabled
                placeholder="123"
                className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-700 rounded-lg text-neutral-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Disabled pay button */}
          <button
            disabled
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-neutral-700 text-neutral-500 rounded-lg font-medium cursor-not-allowed"
          >
            <Lock className="w-4 h-4" />
            Pay £{state.totalPrice?.toFixed(2) || "0.00"}
          </button>

          <p className="text-xs text-neutral-500 text-center mt-4">
            Powered by Stripe (coming soon)
          </p>
        </motion.div>

        {/* Order summary sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Order Summary
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Bag Size</span>
              <span className="text-foreground">{state.bagSizeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Colour</span>
              <span className="text-foreground">{state.bagColourName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Flavour</span>
              <span className="text-foreground">{state.roastProfileName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Grind</span>
              <span className="text-foreground">{state.grindName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Quantity</span>
              <span className="text-foreground">{state.quantity} bags</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-700">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-400">Subtotal</span>
              <span className="text-foreground">
                £{state.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral-400">Shipping</span>
              <span className="text-neutral-400">TBC</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-4 border-t border-neutral-700">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                £{state.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="flex items-center gap-2 px-4 py-3 text-neutral-400 hover:text-foreground transition-colors"
          >
            ← Back
          </button>

          <motion.button
            onClick={handleSeeConfirmation}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            See confirmation page →
          </motion.button>
        </div>
      </div>
    </div>
  );
}
