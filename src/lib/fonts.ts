/**
 * Shared font library — single source of truth for all available fonts.
 * Used by the label maker and any font-related UI.
 *
 * NOTE: This file is kept in sync with ghost-roasting-portal/src/lib/fonts.ts.
 * If you add or remove fonts, update both files.
 */

export interface FontOption {
  family: string;
  label: string;
  weights: number[];
  category: "sans-serif" | "serif" | "display" | "script";
}

export const FONT_CATEGORIES = [
  "sans-serif",
  "serif",
  "display",
  "script",
] as const;

/** Curated library of 50 Google Fonts */
export const FONT_LIBRARY: FontOption[] = [
  // Sans-serif
  { family: "Inter", label: "Inter", weights: [400, 500, 600, 700], category: "sans-serif" },
  { family: "Montserrat", label: "Montserrat", weights: [400, 500, 600, 700, 800, 900], category: "sans-serif" },
  { family: "Raleway", label: "Raleway", weights: [400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Poppins", label: "Poppins", weights: [400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Nunito", label: "Nunito", weights: [400, 600, 700, 800], category: "sans-serif" },
  { family: "Quicksand", label: "Quicksand", weights: [400, 500, 600, 700], category: "sans-serif" },
  { family: "Josefin Sans", label: "Josefin Sans", weights: [400, 600, 700], category: "sans-serif" },
  { family: "Figtree", label: "Figtree", weights: [400, 500, 600, 700, 800, 900], category: "sans-serif" },
  { family: "DM Sans", label: "DM Sans", weights: [400, 500, 600, 700], category: "sans-serif" },
  { family: "Space Grotesk", label: "Space Grotesk", weights: [400, 500, 600, 700], category: "sans-serif" },
  { family: "Outfit", label: "Outfit", weights: [400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Manrope", label: "Manrope", weights: [400, 500, 600, 700, 800], category: "sans-serif" },
  { family: "Work Sans", label: "Work Sans", weights: [400, 500, 600, 700, 800], category: "sans-serif" },
  // Serif
  { family: "Playfair Display", label: "Playfair Display", weights: [400, 500, 600, 700, 800, 900], category: "serif" },
  { family: "Libre Baskerville", label: "Libre Baskerville", weights: [400, 700], category: "serif" },
  { family: "Merriweather", label: "Merriweather", weights: [400, 700, 900], category: "serif" },
  { family: "Lora", label: "Lora", weights: [400, 500, 600, 700], category: "serif" },
  { family: "EB Garamond", label: "EB Garamond", weights: [400, 500, 600, 700, 800], category: "serif" },
  { family: "Cormorant Garamond", label: "Cormorant Garamond", weights: [400, 500, 600, 700], category: "serif" },
  { family: "Bitter", label: "Bitter", weights: [400, 500, 600, 700, 800], category: "serif" },
  { family: "Crimson Text", label: "Crimson Text", weights: [400, 600, 700], category: "serif" },
  { family: "DM Serif Display", label: "DM Serif Display", weights: [400], category: "serif" },
  { family: "Bodoni Moda", label: "Bodoni Moda", weights: [400, 500, 600, 700, 800, 900], category: "serif" },
  // Display
  { family: "Oswald", label: "Oswald", weights: [400, 500, 600, 700], category: "display" },
  { family: "Bebas Neue", label: "Bebas Neue", weights: [400], category: "display" },
  { family: "Anton", label: "Anton", weights: [400], category: "display" },
  { family: "Abril Fatface", label: "Abril Fatface", weights: [400], category: "display" },
  { family: "Righteous", label: "Righteous", weights: [400], category: "display" },
  { family: "Permanent Marker", label: "Permanent Marker", weights: [400], category: "display" },
  { family: "Lobster", label: "Lobster", weights: [400], category: "display" },
  { family: "Russo One", label: "Russo One", weights: [400], category: "display" },
  { family: "Fredoka", label: "Fredoka", weights: [400, 500, 600, 700], category: "display" },
  { family: "Archivo Black", label: "Archivo Black", weights: [400], category: "display" },
  { family: "Secular One", label: "Secular One", weights: [400], category: "display" },
  { family: "Bungee", label: "Bungee", weights: [400], category: "display" },
  { family: "Dela Gothic One", label: "Dela Gothic One", weights: [400], category: "display" },
  { family: "Syne", label: "Syne", weights: [400, 500, 600, 700, 800], category: "display" },
  { family: "Teko", label: "Teko", weights: [400, 500, 600, 700], category: "display" },
  { family: "Barlow Condensed", label: "Barlow Condensed", weights: [400, 500, 600, 700, 800], category: "display" },
  // Script / handwriting
  { family: "Pacifico", label: "Pacifico", weights: [400], category: "script" },
  { family: "Dancing Script", label: "Dancing Script", weights: [400, 500, 600, 700], category: "script" },
  { family: "Great Vibes", label: "Great Vibes", weights: [400], category: "script" },
  { family: "Sacramento", label: "Sacramento", weights: [400], category: "script" },
  { family: "Satisfy", label: "Satisfy", weights: [400], category: "script" },
  { family: "Caveat", label: "Caveat", weights: [400, 500, 600, 700], category: "script" },
  { family: "Kaushan Script", label: "Kaushan Script", weights: [400], category: "script" },
  { family: "Shadows Into Light", label: "Shadows Into Light", weights: [400], category: "script" },
  { family: "Amatic SC", label: "Amatic SC", weights: [400, 700], category: "script" },
  { family: "Courgette", label: "Courgette", weights: [400], category: "script" },
  { family: "Allura", label: "Allura", weights: [400], category: "script" },
];

/** Track which Google Fonts have been loaded to avoid duplicates */
const loadedFonts = new Set<string>();

/** Dynamically load a Google Font via the CSS API */
export function loadGoogleFont(family: string, weights?: number[]): void {
  if (typeof document === "undefined") return;
  if (loadedFonts.has(family)) return;
  loadedFonts.add(family);

  const fontEntry = FONT_LIBRARY.find((f) => f.family === family);
  const w = weights ?? fontEntry?.weights ?? [400, 700];
  const wStr = w.join(";");
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,${wStr};1,${wStr}&display=swap`;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Load a Google Font and wait for it to be available for rendering.
 */
export async function loadGoogleFontAsync(family: string, weights?: number[]): Promise<void> {
  if (typeof document === "undefined") return;

  loadGoogleFont(family, weights);

  try {
    await document.fonts.load(`16px "${family}"`);
  } catch {
    await new Promise((r) => setTimeout(r, 150));
  }
}
