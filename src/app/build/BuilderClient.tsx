"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BuilderProvider,
  BuilderShell,
  useBuilder,
  BagSize,
  BagColour,
  RoastProfile,
  GrindOption,
  BuilderSettings,
} from "@/components/builder";
import type { PricingData } from "@/lib/pricing";
import { getPriceForQuantity } from "@/lib/pricing";
import {
  Step1BrandName,
  Step2Size,
  Step3Colour,
  Step4Label,
  Step5RoastProfile,
  Step6Grind,
  Step7Quantity,
  Step8Summary,
  Step9Auth,
} from "@/components/builder/steps";
import { createBrowserClient } from "@/lib/supabase";

interface BuilderClientProps {
  bagSizes: BagSize[];
  bagColours: BagColour[];
  roastProfiles: RoastProfile[];
  grindOptions: GrindOption[];
  pricingData: PricingData;
  builderSettings: BuilderSettings;
}

function StepParamReader() {
  const { state, dispatch } = useBuilder();
  const searchParams = useSearchParams();

  // Handle ?step= query param (for Stripe cancel redirect)
  useEffect(() => {
    const stepParam = searchParams.get("step");
    if (stepParam) {
      const step = parseInt(stepParam, 10);
      if (step >= 1 && step <= 9 && step !== state.currentStep) {
        dispatch({ type: "SET_STEP", step });
      }
    }
  }, [searchParams, dispatch, state.currentStep]);

  return null;
}

function ReorderHandler() {
  const {
    dispatch,
    bagSizes,
    bagColours,
    roastProfiles,
    grindOptions,
    pricingData,
  } = useBuilder();
  const searchParams = useSearchParams();
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const reorderId = searchParams.get("reorder");
    if (!reorderId || processed) return;

    setProcessed(true);
    const startFromBeginning = searchParams.get("start") === "1";

    const supabase = createBrowserClient();
    supabase
      .from("ghost_orders")
      .select("*")
      .eq("id", reorderId)
      .single()
      .then(({ data: order }) => {
        if (!order) return;

        let earliestUnmatched = 8; // default: jump to summary (step 8)

        // Set brand name
        if (order.brand_name) {
          dispatch({ type: "SET_BRAND_NAME", name: order.brand_name });
        } else {
          earliestUnmatched = Math.min(earliestUnmatched, 1);
        }

        // Match bag size
        const matchedSize = bagSizes.find((s) => s.name === order.bag_size);
        if (matchedSize) {
          dispatch({
            type: "SET_BAG_SIZE",
            size: matchedSize.name,
            name: matchedSize.name,
          });
        } else {
          earliestUnmatched = Math.min(earliestUnmatched, 2);
        }

        // Match bag colour
        const matchedColour = bagColours.find(
          (c) => c.name === order.bag_colour
        );
        if (matchedColour) {
          dispatch({
            type: "SET_BAG_COLOUR",
            id: matchedColour._id,
            name: matchedColour.name,
            hex: matchedColour.hex,
            photoUrl: matchedColour.bagPhotoUrl,
            actualPhotoUrl: matchedColour.actualBagPhotoUrl,
          });
        } else {
          earliestUnmatched = Math.min(earliestUnmatched, 3);
        }

        // Skip label (can't restore File object)
        dispatch({ type: "SKIP_LABEL" });

        // Match roast profile
        const matchedRoast = roastProfiles.find(
          (r) => r.name === order.roast_profile
        );
        if (matchedRoast) {
          dispatch({
            type: "SET_ROAST_PROFILE",
            slug: matchedRoast.slug,
            name: matchedRoast.name,
            descriptor: matchedRoast.descriptor,
          });
        } else {
          earliestUnmatched = Math.min(earliestUnmatched, 5);
        }

        // Match grind
        const matchedGrind = grindOptions.find(
          (g) => g.name === order.grind
        );
        if (matchedGrind) {
          dispatch({
            type: "SET_GRIND",
            id: matchedGrind.id,
            name: matchedGrind.name,
          });
        } else {
          earliestUnmatched = Math.min(earliestUnmatched, 6);
        }

        // Set quantity
        dispatch({ type: "SET_QUANTITY", quantity: order.quantity });

        // Recalculate pricing using dynamic brackets
        if (matchedSize) {
          const result = getPriceForQuantity(
            order.quantity,
            matchedSize.name,
            pricingData
          );
          if (result) {
            dispatch({
              type: "SET_PRICING",
              pricePerBag: result.pricePerBag,
              totalPrice: result.pricePerBag * order.quantity,
            });
          }
        }

        // "Use as starting point" → step 1, "Reorder this" → summary or earliest unmatched
        dispatch({
          type: "SET_STEP",
          step: startFromBeginning ? 1 : earliestUnmatched,
        });
      });
  }, [
    searchParams,
    processed,
    dispatch,
    bagSizes,
    bagColours,
    roastProfiles,
    grindOptions,
    pricingData,
  ]);

  return null;
}

function BuilderSteps() {
  const { state } = useBuilder();

  switch (state.currentStep) {
    case 1:
      return <Step1BrandName />;
    case 2:
      return <Step2Size />;
    case 3:
      return <Step3Colour />;
    case 4:
      return <Step4Label />;
    case 5:
      return <Step5RoastProfile />;
    case 6:
      return <Step6Grind />;
    case 7:
      return <Step7Quantity />;
    case 8:
      return <Step8Summary />;
    case 9:
      return <Step9Auth />;
    default:
      return <Step1BrandName />;
  }
}

export function BuilderClient({
  bagSizes,
  bagColours,
  roastProfiles,
  grindOptions,
  pricingData,
  builderSettings,
}: BuilderClientProps) {
  return (
    <BuilderProvider
      bagSizes={bagSizes}
      bagColours={bagColours}
      roastProfiles={roastProfiles}
      grindOptions={grindOptions}
      pricingData={pricingData}
      builderSettings={builderSettings}
    >
      <Suspense fallback={null}>
        <StepParamReader />
      </Suspense>
      <Suspense fallback={null}>
        <ReorderHandler />
      </Suspense>
      <BuilderShell>
        <BuilderSteps />
      </BuilderShell>
    </BuilderProvider>
  );
}
