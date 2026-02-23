"use client";

import { motion } from "framer-motion";
import { Check, Package, Coffee, Truck } from "lucide-react";
import Link from "next/link";
import { useBuilder } from "../BuilderContext";
import { BagVisualisation } from "../BagVisualisation";

// Animated checkmark SVG
function AnimatedCheckmark() {
  return (
    <motion.div
      className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.svg
        className="w-12 h-12 text-green-500"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M5 13l4 4L19 7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  );
}

// Timeline step component
function TimelineStep({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      className="flex gap-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.15 }}
    >
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        {index < 2 && <div className="w-px h-8 bg-neutral-700 my-2" />}
      </div>
      <div className="pb-8">
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-neutral-400">{description}</p>
      </div>
    </motion.div>
  );
}

export function Step9MockConfirmation() {
  const { state, dispatch, siteSettings } = useBuilder();

  const handleStartNew = () => {
    dispatch({ type: "RESET" });
  };

  // Generate a demo order number
  const demoOrderNumber = "GR-2026-DEMO";
  const turnaround = siteSettings.turnaroundDays || "7–10 working days";

  return (
    <div className="pb-32">
      {/* Success header */}
      <div className="text-center mb-12">
        <AnimatedCheckmark />
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Your order would be confirmed.
        </motion.h1>
        <motion.p
          className="mt-4 text-neutral-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Order number:{" "}
          <span className="font-mono text-foreground">{demoOrderNumber}</span>
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Order summary */}
        <motion.div
          className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Bag preview */}
          <div className="flex justify-center mb-6">
            <BagVisualisation
              bagPhotoUrl={state.bagPhotoUrl}
              bagColourHex={state.bagColourHex}
              labelFileURL={state.labelFileURL}
              
              size="medium"
            />
          </div>

          <h3 className="font-semibold text-foreground mb-4">Order Details</h3>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-400">Bag Size</span>
              <span className="text-foreground">{state.bagSizeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Colour</span>
              <span className="text-foreground">{state.bagColourName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Flavour Profile</span>
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
            <div className="flex justify-between">
              <span className="text-neutral-400">Label</span>
              <span className="text-foreground">
                {state.labelFile
                  ? state.labelFile.name
                  : state.labelSkipped
                  ? "To be provided"
                  : "Not uploaded"}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-700">
            <div className="flex justify-between font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">
                £{state.totalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-semibold text-foreground mb-6">
            What happens next
          </h3>

          <TimelineStep
            icon={Package}
            title="We receive your order and label file"
            description="Our team reviews your specifications and prepares your order"
            index={0}
          />
          <TimelineStep
            icon={Coffee}
            title="Your coffee is roasted fresh to your profile"
            description="Small-batch roasted to your exact specifications"
            index={1}
          />
          <TimelineStep
            icon={Truck}
            title="Packed and shipped to your door"
            description="Carefully packaged with your custom labels applied"
            index={2}
          />

          <motion.div
            className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm font-medium text-foreground">
              Estimated turnaround
            </p>
            <p className="text-2xl font-bold text-accent mt-1">{turnaround}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* CTAs */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-4">
          <motion.button
            onClick={handleStartNew}
            className="px-8 py-4 bg-accent text-background rounded-lg font-semibold hover:opacity-90 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a new order
          </motion.button>
          <Link
            href="/"
            className="px-8 py-4 border border-neutral-700 text-foreground rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
