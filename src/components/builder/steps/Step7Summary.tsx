"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Loader2 } from "lucide-react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { BagVisualisation } from "../BagVisualisation";

interface SummaryRowProps {
  label: string;
  value: string | null;
  step: number;
  onEdit: (step: number) => void;
}

function SummaryRow({ label, value, step, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-neutral-800">
      <div>
        <p className="text-sm text-neutral-400">{label}</p>
        <p className="text-foreground font-medium">{value || "Not selected"}</p>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-sm text-accent hover:underline"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
    </div>
  );
}

export function Step7Summary() {
  const { state, dispatch, builderSettings, user } = useBuilder();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = (step: number) => {
    dispatch({ type: "SET_STEP", step });
  };

  const handleProceedToCheckout = async () => {
    if (user) {
      // Already signed in — skip auth step and go directly to Stripe
      setIsLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("brandName", state.brandName);
        formData.append("bagSize", state.bagSize || "");
        formData.append("bagSizeName", state.bagSizeName || "");
        formData.append("bagColour", state.bagColourName || "");
        formData.append("roastProfile", state.roastProfileName || "");
        formData.append("roastProfileSlug", state.roastProfile || "");
        formData.append("grind", state.grindName || "");
        formData.append("grindId", state.grind || "");
        formData.append("quantity", String(state.quantity));
        formData.append("pricePerBag", String(state.pricePerBag || 0));
        formData.append("totalPrice", String(state.totalPrice || 0));
        formData.append("customerEmail", user.email!);
        formData.append("userId", user.id);
        if (state.labelFile) {
          formData.append("labelFile", state.labelFile);
        } else if (state.labelPdfUrl) {
          formData.append("labelPdfUrl", state.labelPdfUrl);
        }
        if (state.savedLabelId) {
          formData.append("labelId", state.savedLabelId);
        }
        if (state.labelPreviewUrl) {
          formData.append("labelPreviewUrl", state.labelPreviewUrl);
        }

        const res = await fetch("/api/create-checkout", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        window.location.href = data.url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
        setIsLoading(false);
      }
    } else {
      // Not signed in — go to auth step
      dispatch({ type: "NEXT_STEP" });
    }
  };

  const heading =
    builderSettings.step7Heading || "Here's your order.";
  const subheading =
    builderSettings.step7Subheading ||
    "Check everything looks right before checkout.";

  return (
    <div>
      <StepHeading heading={heading} subheading={subheading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Bag preview */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <BagVisualisation
            bagPhotoUrl={state.bagPhotoUrl}
            bagColourHex={state.bagColourHex}
            bagColourName={state.bagColourName}
            actualBagPhotoUrl={state.actualBagPhotoUrl}
            labelFileURL={state.labelFileURL}
            size="large"
          />
          <div className="mt-4 text-center">
            <p className="text-foreground font-medium">{state.bagColourName}</p>
            <p className="text-sm text-neutral-400">{state.bagSize}</p>
          </div>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800">
            <SummaryRow
              label="Brand"
              value={state.brandName || null}
              step={1}
              onEdit={handleEdit}
            />
            <SummaryRow
              label="Bag Size"
              value={state.bagSizeName}
              step={2}
              onEdit={handleEdit}
            />
            <SummaryRow
              label="Bag Colour"
              value={state.bagColourName}
              step={3}
              onEdit={handleEdit}
            />
            <SummaryRow
              label="Label"
              value={
                state.labelFile
                  ? state.labelFile.name
                  : state.labelPdfUrl
                  ? "Designed in Label Maker"
                  : state.labelSkipped
                  ? "Skipped"
                  : "Not uploaded"
              }
              step={4}
              onEdit={handleEdit}
            />
            <SummaryRow
              label="Flavour Profile"
              value={
                state.roastProfileName
                  ? `${state.roastProfileName} — ${state.roastDescriptor}`
                  : null
              }
              step={5}
              onEdit={handleEdit}
            />
            <SummaryRow
              label="Grind"
              value={state.grindName}
              step={6}
              onEdit={handleEdit}
            />
            <SummaryRow
              label="Quantity"
              value={`${state.quantity} bags`}
              step={7}
              onEdit={handleEdit}
            />

            {/* Pricing breakdown */}
            <div className="mt-6 pt-4 border-t border-neutral-700">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">
                  {state.quantity} × {state.bagSize} bags @{" "}
                  £{state.pricePerBag?.toFixed(2) || "0.00"} each
                </span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-400">Subtotal</span>
                <span className="text-foreground">
                  £{state.totalPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span className="text-neutral-400">Shipping</span>
                <span className="text-neutral-400">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-neutral-700 pt-4">
                <span className="text-foreground">Estimated total</span>
                <span className="text-foreground">
                  £{state.totalPrice?.toFixed(2) || "0.00"} + shipping
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4">
          <p className="text-red-400 text-sm text-center">{error}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="flex items-center gap-2 px-4 py-3 text-neutral-400 hover:text-foreground transition-colors"
          >
            ← Back to edit
          </button>

          <motion.button
            onClick={handleProceedToCheckout}
            disabled={isLoading}
            className="flex items-center gap-2 px-8 py-4 bg-accent text-background rounded-lg font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Redirecting…
              </>
            ) : (
              "Proceed to Checkout"
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
