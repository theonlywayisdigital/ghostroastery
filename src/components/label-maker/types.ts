export interface LabelDimensions {
  /** Label width in mm (trim area) */
  widthMm: number;
  /** Label height in mm (trim area) */
  heightMm: number;
  /** Bleed in mm (added on all sides outside the trim area) */
  bleedMm: number;
  /** Safe zone inset from trim in mm */
  safeZoneMm: number;
}

/** Convert mm to pixels at 300 DPI */
export function mmToPx(mm: number): number {
  return Math.round((mm / 25.4) * 300);
}

/** Convert px (at 300 DPI) to mm */
export function pxToMm(px: number): number {
  return (px * 25.4) / 300;
}

/**
 * Fixed print dimensions — confirmed by printer template.
 *
 * Trim:    102mm × 152mm  (1205×1795px at 300 DPI)
 * Bleed:   2mm on all sides (external)
 * Total:   106mm × 156mm  (1252×1843px at 300 DPI) — canvas & PDF page size
 * Safe:    4mm inside trim → 94mm × 144mm
 * Resolution: 300 DPI
 */
export const LABEL_DIMENSIONS: LabelDimensions = {
  widthMm: 102,
  heightMm: 152,
  bleedMm: 2,
  safeZoneMm: 4,
};

export interface CanvasHistoryEntry {
  json: string;
  timestamp: number;
}

export type ZoomLevel = "fit" | 50 | 100 | 200;

// ─── Phase B types ───

export interface LabelTemplate {
  _id: string;
  name: string;
  category: string;
  thumbnailUrl: string | null;
  canvasJSON: string;
  bagTypeSlug: string | null;
  sortOrder: number;
}

export interface SvgElement {
  _id: string;
  name: string;
  category: string;
  svgMarkup: string;
  thumbnailUrl: string | null;
  sortOrder: number;
}

/** Left panel tab IDs */
export type LeftPanelTab = "templates" | "elements" | "text" | "upload" | "ai";

// Font types, library, and loading functions — imported from shared lib
export type { FontOption } from "@/lib/fonts";
export { FONT_LIBRARY, FONT_CATEGORIES, loadGoogleFont, loadGoogleFontAsync } from "@/lib/fonts";
// Local import for use within this file (re-exports above don't create local bindings)
import { loadGoogleFontAsync } from "@/lib/fonts";
// Fabric's global character-width cache — must be cleared when fonts change
import { cache as fabricCache } from "fabric";

/**
 * After loading canvas JSON (from DB, localStorage, or undo/redo), Google Fonts
 * referenced by text objects won't be available yet. This function loads all
 * required fonts, forces Fabric to recalculate text dimensions with the correct
 * metrics, and re-renders the canvas.
 *
 * Call this after every `canvas.loadFromJSON()` resolves.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RehydrateAny = any;

export async function rehydrateFontsOnCanvas(canvas: {
  getObjects: () => RehydrateAny[];
  renderAll: () => void;
  requestRenderAll: () => void;
}): Promise<void> {
  const objects = canvas.getObjects();

  // Collect unique font families from all text-like objects
  const families = new Set<string>();
  const textObjects: RehydrateAny[] = [];

  for (const obj of objects) {
    const t = (obj.type ?? "").toLowerCase();
    if (t === "textbox" || t === "i-text" || t === "text") {
      if (obj.fontFamily) families.add(obj.fontFamily);
      textObjects.push(obj);
    }
  }

  if (families.size === 0) return;

  // Load all fonts in parallel
  await Promise.all(
    Array.from(families).map((f) => loadGoogleFontAsync(f))
  );

  // Clear Fabric's GLOBAL character-width cache for each font family.
  // Without this, stale measurements (made with fallback fonts before the real
  // Google Font loaded) persist and cause wrong line widths / centering offsets.
  for (const family of families) {
    fabricCache.clearFontCache(family);
  }

  // Force Fabric to fully recalculate text dimensions with the real fonts.
  for (const obj of textObjects) {
    obj.dirty = true;
    if (typeof obj.initDimensions === "function") obj.initDimensions();
    if (typeof obj.setCoords === "function") obj.setCoords();
  }

  canvas.requestRenderAll();
}

/** SVG element categories */
export const SVG_CATEGORIES = [
  { value: "coffee", label: "Coffee" },
  { value: "borders", label: "Borders" },
  { value: "dividers", label: "Dividers" },
  { value: "badges", label: "Badges" },
  { value: "shapes", label: "Shapes" },
  { value: "icons", label: "Icons" },
] as const;

/** Template categories */
export const TEMPLATE_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "elegant", label: "Elegant" },
  { value: "retro", label: "Retro" },
  { value: "corporate", label: "Corporate" },
] as const;
