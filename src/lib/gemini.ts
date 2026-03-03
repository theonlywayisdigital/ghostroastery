import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY not set — AI features will be unavailable");
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

/** Get a Gemini Flash model instance for text generation */
export function getTextModel() {
  if (!genAI) throw new Error("Gemini API key not configured");
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

/** Get a Gemini Flash model with vision capability */
export function getVisionModel() {
  if (!genAI) throw new Error("Gemini API key not configured");
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
}

/** Get a Gemini model configured for native image generation */
export function getImageModel() {
  if (!genAI) throw new Error("Gemini API key not configured");
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image",
    generationConfig: {
      responseModalities: ["Text", "Image"],
    } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
  });
}

/** Convert a base64 data URL to Gemini-compatible inline data */
export function base64ToInlineData(dataUrl: string) {
  // Strip the data:image/xxx;base64, prefix
  const match = dataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid base64 data URL");
  return {
    inlineData: {
      mimeType: match[1],
      data: match[2],
    },
  };
}
