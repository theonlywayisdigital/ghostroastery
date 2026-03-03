import { BuilderState, BuilderAction, TOTAL_STEPS } from "./types";

export const initialBuilderState: BuilderState = {
  currentStep: 1,
  // Step 1: Brand Name
  brandName: "",
  // Step 2: Size
  bagSize: null,
  bagSizeName: null,
  // Step 3: Colour
  bagColourId: null,
  bagColourName: null,
  bagColourHex: null,
  bagPhotoUrl: null,
  actualBagPhotoUrl: null,
  // Step 4: Label
  labelFile: null,
  labelFileURL: null,
  labelSkipped: false,
  labelPdfUrl: null,
  labelPreviewUrl: null,
  savedLabelId: null,
  // Step 5: Roast
  roastProfile: null,
  roastProfileName: null,
  roastDescriptor: null,
  // Step 6: Grind
  grind: null,
  grindName: null,
  // Step 7: Quantity
  quantity: 25,
  pricePerBag: null,
  totalPrice: null,
};

export function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        currentStep: Math.min(Math.max(1, action.step), TOTAL_STEPS),
      };

    case "NEXT_STEP":
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS),
      };

    case "PREV_STEP":
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };

    case "SET_BRAND_NAME":
      return {
        ...state,
        brandName: action.name,
      };

    case "SET_BAG_SIZE":
      return {
        ...state,
        bagSize: action.size,
        bagSizeName: action.name,
      };

    case "SET_BAG_COLOUR":
      return {
        ...state,
        bagColourId: action.id,
        bagColourName: action.name,
        bagColourHex: action.hex,
        bagPhotoUrl: action.photoUrl,
        actualBagPhotoUrl: action.actualPhotoUrl,
      };

    case "SET_LABEL_FILE":
      // Revoke old URL if exists
      if (state.labelFileURL) {
        URL.revokeObjectURL(state.labelFileURL);
      }
      return {
        ...state,
        labelFile: action.file,
        labelFileURL: action.url,
        labelSkipped: false,
        labelPdfUrl: null,
        labelPreviewUrl: null,
      };

    case "SET_LABEL_FROM_MAKER":
      // Label created via label maker — store PDF + preview URLs
      if (state.labelFileURL) {
        URL.revokeObjectURL(state.labelFileURL);
      }
      return {
        ...state,
        labelFile: null,
        labelFileURL: action.previewUrl,
        labelSkipped: false,
        labelPdfUrl: action.pdfUrl,
        labelPreviewUrl: action.previewUrl,
        savedLabelId: null,
      };

    case "SET_LABEL_FROM_SAVED":
      // Label selected from saved labels
      if (state.labelFileURL) {
        URL.revokeObjectURL(state.labelFileURL);
      }
      return {
        ...state,
        labelFile: null,
        labelFileURL: action.previewUrl,
        labelSkipped: false,
        labelPdfUrl: action.pdfUrl,
        labelPreviewUrl: action.previewUrl,
        savedLabelId: action.savedLabelId,
      };

    case "REMOVE_LABEL_FILE":
      if (state.labelFileURL) {
        URL.revokeObjectURL(state.labelFileURL);
      }
      return {
        ...state,
        labelFile: null,
        labelFileURL: null,
        labelSkipped: false,
        labelPdfUrl: null,
        labelPreviewUrl: null,
      };

    case "SKIP_LABEL":
      return {
        ...state,
        labelSkipped: true,
      };

    case "SET_ROAST_PROFILE":
      return {
        ...state,
        roastProfile: action.slug,
        roastProfileName: action.name,
        roastDescriptor: action.descriptor,
      };

    case "SET_GRIND":
      return {
        ...state,
        grind: action.id,
        grindName: action.name,
      };

    case "SET_QUANTITY":
      return {
        ...state,
        quantity: action.quantity,
      };

    case "SET_PRICING":
      return {
        ...state,
        pricePerBag: action.pricePerBag,
        totalPrice: action.totalPrice,
      };

    case "RESET":
      if (state.labelFileURL) {
        URL.revokeObjectURL(state.labelFileURL);
      }
      return initialBuilderState;

    default:
      return state;
  }
}
