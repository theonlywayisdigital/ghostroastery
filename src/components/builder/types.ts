// Sanity document types
export interface BagSize {
  _id: string;
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

export interface BagColour {
  _id: string;
  name: string;
  hex: string;
  bagPhotoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface RoastProfile {
  _id: string;
  name: string;
  slug: { current: string };
  descriptor: string;
  tastingNotes: string;
  roastLevel: number;
  isDecaf: boolean;
  badge: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface GrindOption {
  _id: string;
  name: string;
  description: string;
  icon: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface PricingTier {
  _id: string;
  bagSize: string;
  tier_10_24: number;
  tier_25_49: number;
  tier_50_99: number;
  tier_100_150: number;
  shippingCost: number;
}

export interface SiteSettings {
  minOrderQuantity: number;
  maxOrderQuantity: number;
  wholesaleThreshold: number;
  turnaroundDays: string;
  labelMakerUrl: string;
  builderCopy: {
    step1Heading?: string;
    step1Subheading?: string;
    step2Heading?: string;
    step2Subheading?: string;
    step3Heading?: string;
    step3Subheading?: string;
    step4Heading?: string;
    step4Subheading?: string;
    step5Heading?: string;
    step5Subheading?: string;
    step6Heading?: string;
    step6Subheading?: string;
    step7Heading?: string;
    step7Subheading?: string;
  } | null;
}

// Builder state
export interface BuilderState {
  currentStep: number;
  // Step 1: Size
  bagSize: string | null;
  bagSizeName: string | null;
  // Step 2: Colour
  bagColourId: string | null;
  bagColourName: string | null;
  bagColourHex: string | null;
  bagPhotoUrl: string | null;
  // Step 3: Label
  labelFile: File | null;
  labelFileURL: string | null;
  labelSkipped: boolean;
  // Step 4: Roast
  roastProfile: string | null;
  roastProfileName: string | null;
  roastDescriptor: string | null;
  // Step 5: Grind
  grind: string | null;
  grindName: string | null;
  // Step 6: Quantity
  quantity: number;
  pricePerBag: number | null;
  totalPrice: number | null;
}

export type BuilderAction =
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_BAG_SIZE"; size: string; name: string }
  | {
      type: "SET_BAG_COLOUR";
      id: string;
      name: string;
      hex: string;
      photoUrl: string | null;
    }
  | { type: "SET_LABEL_FILE"; file: File; url: string }
  | { type: "REMOVE_LABEL_FILE" }
  | { type: "SKIP_LABEL" }
  | {
      type: "SET_ROAST_PROFILE";
      slug: string;
      name: string;
      descriptor: string;
    }
  | { type: "SET_GRIND"; id: string; name: string }
  | { type: "SET_QUANTITY"; quantity: number }
  | { type: "SET_PRICING"; pricePerBag: number; totalPrice: number }
  | { type: "RESET" };

export const TOTAL_STEPS = 9;

// Step names for progress bar
export const STEP_NAMES: Record<number, string> = {
  1: "Choose Your Size",
  2: "Choose Your Colour",
  3: "Upload Your Label",
  4: "Choose Your Flavour Profile",
  5: "Choose Your Grind",
  6: "Choose Your Quantity",
  7: "Order Summary",
  8: "Checkout",
  9: "Confirmation",
};

// Step configuration for navigation
export interface StepConfig {
  showBack: boolean;
  showContinue: boolean;
  continueLabel?: string;
  customNav?: boolean; // Step has its own navigation (e.g., Summary, Checkout, Confirmation)
}

export const STEP_CONFIG: Record<number, StepConfig> = {
  1: { showBack: false, showContinue: true },
  2: { showBack: true, showContinue: true },
  3: { showBack: true, showContinue: true },
  4: { showBack: true, showContinue: true },
  5: { showBack: true, showContinue: true },
  6: { showBack: true, showContinue: true },
  7: { showBack: true, showContinue: true, continueLabel: "Proceed to Checkout", customNav: true },
  8: { showBack: true, showContinue: true, continueLabel: "See Confirmation", customNav: true },
  9: { showBack: false, showContinue: false, customNav: true },
};
