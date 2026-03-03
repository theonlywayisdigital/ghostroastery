// Builder product types (served from Supabase)
export interface BagSize {
  id: string;
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
  actualBagPhotoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface RoastProfile {
  id: string;
  name: string;
  slug: string;
  descriptor: string;
  tastingNotes: string;
  roastLevel: number;
  isDecaf: boolean;
  badge: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface GrindOption {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export type { PricingBracket, BracketPrice, PricingData } from "@/lib/pricing";

export interface BuilderSettings {
  maxOrderQuantity: number;
  wholesaleThreshold: number;
  turnaroundDays: string;
  labelMakerUrl: string;
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
}

// Builder state
export interface BuilderState {
  currentStep: number;
  // Step 1: Brand Name
  brandName: string;
  // Step 2: Size
  bagSize: string | null;
  bagSizeName: string | null;
  // Step 3: Colour
  bagColourId: string | null;
  bagColourName: string | null;
  bagColourHex: string | null;
  bagPhotoUrl: string | null;
  actualBagPhotoUrl: string | null;
  // Step 4: Label
  labelFile: File | null;
  labelFileURL: string | null;
  labelSkipped: boolean;
  /** PDF URL from label maker export (alternative to file upload) */
  labelPdfUrl: string | null;
  /** Preview PNG URL from label maker export */
  labelPreviewUrl: string | null;
  /** ID of a saved label selected from user's profile */
  savedLabelId: string | null;
  // Step 5: Roast
  roastProfile: string | null;
  roastProfileName: string | null;
  roastDescriptor: string | null;
  // Step 6: Grind
  grind: string | null;
  grindName: string | null;
  // Step 7: Quantity
  quantity: number;
  pricePerBag: number | null;
  totalPrice: number | null;
}

export type BuilderAction =
  | { type: "SET_STEP"; step: number }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SET_BRAND_NAME"; name: string }
  | { type: "SET_BAG_SIZE"; size: string; name: string }
  | {
      type: "SET_BAG_COLOUR";
      id: string;
      name: string;
      hex: string;
      photoUrl: string | null;
      actualPhotoUrl: string | null;
    }
  | { type: "SET_LABEL_FILE"; file: File; url: string }
  | { type: "SET_LABEL_FROM_MAKER"; pdfUrl: string; previewUrl: string }
  | { type: "SET_LABEL_FROM_SAVED"; pdfUrl: string; previewUrl: string; savedLabelId: string }
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
  1: "Name Your Brand",
  2: "Choose Your Size",
  3: "Choose Your Colour",
  4: "Design Your Label",
  5: "Choose Your Flavour Profile",
  6: "Choose Your Grind",
  7: "Choose Your Quantity",
  8: "Order Summary",
  9: "Account",
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
  7: { showBack: true, showContinue: true },
  8: { showBack: true, showContinue: false, customNav: true },
  9: { showBack: true, showContinue: false, customNav: true },
};
