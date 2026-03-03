"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
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
  BuilderSettings,
} from "./types";
import type { PricingData } from "@/lib/pricing";
import { builderReducer, initialBuilderState } from "./builderReducer";
import { createBrowserClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface BuilderContextType {
  state: BuilderState;
  dispatch: Dispatch<BuilderAction>;
  bagSizes: BagSize[];
  bagColours: BagColour[];
  roastProfiles: RoastProfile[];
  grindOptions: GrindOption[];
  pricingData: PricingData;
  builderSettings: BuilderSettings;
  canContinue: boolean;
  user: User | null;
  isCheckingAuth: boolean;
}

const BuilderContext = createContext<BuilderContextType | null>(null);

interface BuilderProviderProps {
  children: ReactNode;
  bagSizes: BagSize[];
  bagColours: BagColour[];
  roastProfiles: RoastProfile[];
  grindOptions: GrindOption[];
  pricingData: PricingData;
  builderSettings: BuilderSettings;
}

export function BuilderProvider({
  children,
  bagSizes,
  bagColours,
  roastProfiles,
  grindOptions,
  pricingData,
  builderSettings,
}: BuilderProviderProps) {
  // Initialize with site settings for quantity bounds and default colour
  const defaultColour = bagColours.find((c) => c.name === "Black Matt") || bagColours[0] || null;
  const initialState = {
    ...initialBuilderState,
    quantity: pricingData.minOrder || 25,
    ...(defaultColour && {
      bagColourId: defaultColour._id,
      bagColourName: defaultColour.name,
      bagColourHex: defaultColour.hex,
      bagPhotoUrl: defaultColour.bagPhotoUrl,
    }),
  };

  const [state, dispatch] = useReducer(builderReducer, initialState);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth session on mount and listen for changes
  useEffect(() => {
    const supabase = createBrowserClient();

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsCheckingAuth(false);
    });

    // Listen for auth state changes (needed for OAuth redirect flow)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Compute whether the user can continue from the current step
  const canContinue = useMemo(() => {
    switch (state.currentStep) {
      case 1:
        return state.brandName.trim().length >= 1;
      case 2:
        return !!state.bagSize;
      case 3:
        return !!state.bagColourId;
      case 4:
        return !!state.labelFile || !!state.labelPdfUrl || state.labelSkipped;
      case 5:
        return !!state.roastProfile;
      case 6:
        return !!state.grind;
      case 7:
        return state.quantity >= (pricingData.minOrder || 25);
      case 8:
      case 9:
        return true;
      default:
        return true;
    }
  }, [state, pricingData.minOrder]);

  return (
    <BuilderContext.Provider
      value={{
        state,
        dispatch,
        bagSizes,
        bagColours,
        roastProfiles,
        grindOptions,
        pricingData,
        builderSettings,
        canContinue,
        user,
        isCheckingAuth,
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
