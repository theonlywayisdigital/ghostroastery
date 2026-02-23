"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useMemo,
} from "react";
import {
  BuilderState,
  BuilderAction,
  BagSize,
  BagColour,
  RoastProfile,
  GrindOption,
  PricingTier,
  SiteSettings,
} from "./types";
import { builderReducer, initialBuilderState } from "./builderReducer";

interface BuilderContextType {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
  bagSizes: BagSize[];
  bagColours: BagColour[];
  roastProfiles: RoastProfile[];
  grindOptions: GrindOption[];
  pricingTiers: PricingTier[];
  siteSettings: SiteSettings;
  canContinue: boolean;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

interface BuilderProviderProps {
  children: ReactNode;
  bagSizes: BagSize[];
  bagColours: BagColour[];
  roastProfiles: RoastProfile[];
  grindOptions: GrindOption[];
  pricingTiers: PricingTier[];
  siteSettings: SiteSettings;
}

export function BuilderProvider({
  children,
  bagSizes,
  bagColours,
  roastProfiles,
  grindOptions,
  pricingTiers,
  siteSettings,
}: BuilderProviderProps) {
  // Initialize with site settings for quantity bounds
  const initialState = {
    ...initialBuilderState,
    quantity: siteSettings.minOrderQuantity || 10,
  };

  const [state, dispatch] = useReducer(builderReducer, initialState);

  // Compute whether the user can continue from the current step
  const canContinue = useMemo(() => {
    switch (state.currentStep) {
      case 1:
        return !!state.bagSize;
      case 2:
        return !!state.bagColourId;
      case 3:
        return !!state.labelFile || state.labelSkipped;
      case 4:
        return !!state.roastProfile;
      case 5:
        return !!state.grind;
      case 6:
        return state.quantity >= (siteSettings.minOrderQuantity || 10);
      case 7:
      case 8:
        return true;
      default:
        return true;
    }
  }, [state, siteSettings.minOrderQuantity]);

  return (
    <BuilderContext.Provider
      value={{
        state,
        dispatch,
        bagSizes,
        bagColours,
        roastProfiles,
        grindOptions,
        pricingTiers,
        siteSettings,
        canContinue,
      }}
    >
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useBuilder must be used within a BuilderProvider");
  }
  return context;
}
