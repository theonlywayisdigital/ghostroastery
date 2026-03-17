import { mmToPx } from "../types";

/**
 * Template builder types.
 * Templates are functions that return an array of Fabric.js-compatible object configs.
 * These get applied to the canvas via addObjectsFromTemplate() in LabelCanvas.
 */

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  /** Background colour for the canvas */
  backgroundColor: string;
  /** Array of Fabric.js-compatible object configs */
  objects: TemplateFabricObject[];
}

/** A serializable Fabric.js object config used for template creation */
export interface TemplateFabricObject {
  type: "textbox" | "rect" | "line" | "circle" | "group" | "path" | "ellipse" | "polygon";
  left: number;
  top: number;
  width?: number;
  height?: number;
  radius?: number;
  rx?: number;
  ry?: number;
  points?: Array<{ x: number; y: number }>;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  strokeDashArray?: number[];
  strokeLineCap?: string;
  opacity?: number;
  angle?: number;
  scaleX?: number;
  scaleY?: number;
  originX?: string;
  originY?: string;
  // Text properties
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string | number;
  fontStyle?: string;
  textAlign?: string;
  charSpacing?: number;
  lineHeight?: number;
  // Custom data
  data?: Record<string, unknown>;
  selectable?: boolean;
  evented?: boolean;
}

// ─── Canvas constants (106mm × 156mm total, with 2mm bleed on each side) ───
const TRIM_W = mmToPx(102);
const TRIM_H = mmToPx(152);
const BLEED = mmToPx(2);
const CANVAS_W = TRIM_W + BLEED * 2;
const CANVAS_H = TRIM_H + BLEED * 2;
const SAFE = mmToPx(4);

// Helper to position relative to trim (offset by BLEED from canvas edge)
const trimLeft = BLEED;
const trimTop = BLEED;
const trimCenterX = BLEED + TRIM_W / 2;
const safeLeft = BLEED + SAFE;
const safeTop = BLEED + SAFE;
const safeRight = BLEED + TRIM_W - SAFE;
const safeBottom = BLEED + TRIM_H - SAFE;
const safeW = TRIM_W - SAFE * 2;

// Logo zone helper
export function logoZone(
  left: number,
  top: number,
  widthMm: number,
  heightMm: number,
  borderColor: string = "#999999",
  textColor: string = "#999999",
): TemplateFabricObject[] {
  const w = mmToPx(widthMm);
  const h = mmToPx(heightMm);
  return [
    {
      type: "rect",
      left,
      top,
      width: w,
      height: h,
      fill: "transparent",
      stroke: borderColor,
      strokeWidth: 2,
      strokeDashArray: [8, 6],
      originX: "center",
      originY: "center",
      selectable: false,
      evented: true,
      data: { elementType: "logoZone", isLogoZone: true },
    },
    {
      type: "textbox",
      left,
      top,
      width: w,
      text: "Click to replace with logo or image",
      fontSize: mmToPx(2.8),
      fontFamily: "Inter",
      fontWeight: "normal",
      fill: textColor,
      textAlign: "center",
      originX: "center",
      originY: "center",
      selectable: false,
      evented: true,
      data: { elementType: "logoZoneLabel", isLogoZoneLabel: true },
    },
  ];
}

// ─────────────────────────────────────────────────────────
// Template 1 — "Classic" (Gold on dark brown, framed)
// ─────────────────────────────────────────────────────────
const classic: TemplateDefinition = {
  id: "tpl-classic",
  name: "Classic",
  category: "vintage",
  description: "Gold on dark chocolate brown with elegant framed border",
  backgroundColor: "#2C1810",
  objects: [
    // Full-bleed dark brown background
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#2C1810",
      data: { elementType: "shape", isBackground: true },
    },
    // Gold frame — 8mm inset from trim
    {
      type: "rect",
      left: trimLeft + mmToPx(8),
      top: trimTop + mmToPx(8),
      width: TRIM_W - mmToPx(16),
      height: TRIM_H - mmToPx(16),
      fill: "transparent",
      stroke: "#C9A96E",
      strokeWidth: 1.5,
      data: { elementType: "shape" },
    },
    // Logo zone — square, centered upper area
    ...logoZone(trimCenterX, safeTop + mmToPx(30), 40, 35, "#8B7348", "#8B7348"),
    // Divider — thin gold line
    {
      type: "line",
      left: trimCenterX - mmToPx(18),
      top: safeTop + mmToPx(58),
      width: mmToPx(36),
      height: 0,
      stroke: "#C9A96E",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Coffee name — centered
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(78),
      width: safeW - mmToPx(8),
      text: "Coffee Name",
      fontSize: mmToPx(10),
      fontFamily: "Playfair Display",
      fontWeight: "700",
      fill: "#C9A96E",
      textAlign: "center",
      lineHeight: 1.15,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(95),
      width: safeW,
      text: "Your Tagline Here",
      fontSize: mmToPx(3),
      fontFamily: "Cormorant Garamond",
      fontWeight: "400",
      fontStyle: "italic",
      fill: "#A0845C",
      textAlign: "center",
      charSpacing: 80,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Weight at bottom
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(8),
      width: safeW,
      text: "250G",
      fontSize: mmToPx(2.5),
      fontFamily: "Playfair Display",
      fontWeight: "400",
      fill: "#C9A96E",
      textAlign: "center",
      charSpacing: 250,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 2 — "Editorial" (Clean white, massive typography)
// ─────────────────────────────────────────────────────────
const editorial: TemplateDefinition = {
  id: "tpl-editorial",
  name: "Editorial",
  category: "modern",
  description: "Clean white with massive display typography and structured layout",
  backgroundColor: "#FFFFFF",
  objects: [
    // Brand tagline top
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(8),
      width: safeW,
      text: "YOUR TAGLINE",
      fontSize: mmToPx(2),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#6B6B6B",
      textAlign: "center",
      charSpacing: 350,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Thin full-width rule
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(14),
      width: safeW,
      height: 0,
      stroke: "#0A0A0A",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Logo zone — square, taller
    ...logoZone(trimCenterX, safeTop + mmToPx(38), 42, 35, "#999999", "#999999"),
    // HUGE coffee name — more central
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(82),
      width: safeW,
      text: "COFFEE\nNAME",
      fontSize: mmToPx(16),
      fontFamily: "Bebas Neue",
      fontWeight: "400",
      fill: "#0A0A0A",
      textAlign: "center",
      lineHeight: 1.0,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Thin rule below name
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(105),
      width: safeW,
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(8),
      width: safeW,
      text: "250G",
      fontSize: mmToPx(2.5),
      fontFamily: "Bebas Neue",
      fontWeight: "400",
      fill: "#0A0A0A",
      textAlign: "center",
      charSpacing: 200,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 3 — "Nordic" (Scandinavian minimal, dark circle accent)
// ─────────────────────────────────────────────────────────
const nordic: TemplateDefinition = {
  id: "tpl-nordic",
  name: "Nordic",
  category: "minimal",
  description: "Warm off-white with dark circle accent and clean Scandinavian type",
  backgroundColor: "#F5F3EF",
  objects: [
    // Background rect
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#F5F3EF",
      data: { elementType: "shape", isBackground: true },
    },
    // Large filled dark circle — contains logo
    {
      type: "circle",
      left: trimCenterX,
      top: safeTop + mmToPx(38),
      radius: mmToPx(28),
      fill: "#2A2A2A",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Logo zone inside circle — square
    ...logoZone(trimCenterX, safeTop + mmToPx(38), 36, 32, "#555555", "#555555"),
    // Coffee name below circle — more central
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(82),
      width: safeW,
      text: "COFFEE NAME",
      fontSize: mmToPx(8),
      fontFamily: "Space Grotesk",
      fontWeight: "700",
      fill: "#1C1C1C",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(95),
      width: safeW,
      text: "A short description or tagline goes here",
      fontSize: mmToPx(2.5),
      fontFamily: "Inter",
      fontWeight: "400",
      fill: "#7A7A7A",
      textAlign: "left",
      lineHeight: 1.5,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Full-width rule
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(103),
      width: safeW,
      height: 0,
      stroke: "#1C1C1C",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // Weight bottom-left
    {
      type: "textbox",
      left: safeLeft,
      top: safeBottom - mmToPx(8),
      width: mmToPx(25),
      text: "250G",
      fontSize: mmToPx(2.5),
      fontFamily: "Space Grotesk",
      fontWeight: "500",
      fill: "#1C1C1C",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 4 — "Foundry" (Industrial, bold contrast)
// ─────────────────────────────────────────────────────────
const foundry: TemplateDefinition = {
  id: "tpl-foundry",
  name: "Foundry",
  category: "bold",
  description: "Deep black with warm rust accent bars and stencil-style type",
  backgroundColor: "#111111",
  objects: [
    // Full-bleed black background
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#111111",
      data: { elementType: "shape", isBackground: true },
    },
    // Top accent bar — rust (extends into bleed)
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: mmToPx(8) + BLEED,
      fill: "#B85C38",
      data: { elementType: "shape" },
    },
    // Logo zone — square, taller
    ...logoZone(trimCenterX, safeTop + mmToPx(35), 40, 35, "#F5F5F5", "#666666"),
    // Thick white rule
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(62),
      width: safeW,
      height: 0,
      stroke: "#F5F5F5",
      strokeWidth: 3,
      data: { elementType: "shape" },
    },
    // Massive coffee name — more central
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(86),
      width: safeW,
      text: "HOUSE\nBLEND",
      fontSize: mmToPx(16),
      fontFamily: "Archivo Black",
      fontWeight: "400",
      fill: "#F5F5F5",
      textAlign: "center",
      lineHeight: 0.95,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Bottom accent bar with weight (extends into bleed)
    {
      type: "rect",
      left: 0,
      top: CANVAS_H - mmToPx(12) - BLEED,
      width: CANVAS_W,
      height: mmToPx(12) + BLEED,
      fill: "#B85C38",
      data: { elementType: "shape" },
    },
    // Weight in bottom bar
    {
      type: "textbox",
      left: trimCenterX,
      top: CANVAS_H - BLEED - mmToPx(6),
      width: safeW,
      text: "NET WT. 250G",
      fontSize: mmToPx(3),
      fontFamily: "Archivo Black",
      fontWeight: "400",
      fill: "#111111",
      textAlign: "center",
      charSpacing: 200,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 5 — "Atelier" (Boutique / artisan, script hero)
// ─────────────────────────────────────────────────────────
const atelier: TemplateDefinition = {
  id: "tpl-atelier",
  name: "Atelier",
  category: "elegant",
  description: "Warm ivory with hairline frame, calligraphic script and delicate ornaments",
  backgroundColor: "#FAF8F5",
  objects: [
    // Background rect
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#FAF8F5",
      data: { elementType: "shape", isBackground: true },
    },
    // Hairline frame — 8mm inset
    {
      type: "rect",
      left: trimLeft + mmToPx(8),
      top: trimTop + mmToPx(8),
      width: TRIM_W - mmToPx(16),
      height: TRIM_H - mmToPx(16),
      fill: "transparent",
      stroke: "#B8A080",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // 3 tiny circle ornaments at top
    {
      type: "circle",
      left: trimCenterX - mmToPx(4),
      top: trimTop + mmToPx(12),
      radius: mmToPx(0.8),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    {
      type: "circle",
      left: trimCenterX,
      top: trimTop + mmToPx(12),
      radius: mmToPx(0.8),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    {
      type: "circle",
      left: trimCenterX + mmToPx(4),
      top: trimTop + mmToPx(12),
      radius: mmToPx(0.8),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Logo zone — square, taller
    ...logoZone(trimCenterX, safeTop + mmToPx(36), 40, 35, "#B8A080", "#B8A080"),
    // Thin divider
    {
      type: "line",
      left: trimCenterX - mmToPx(12),
      top: safeTop + mmToPx(64),
      width: mmToPx(24),
      height: 0,
      stroke: "#B8A080",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Script coffee name — more central
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(82),
      width: safeW,
      text: "Coffee Name",
      fontSize: mmToPx(10),
      fontFamily: "Dancing Script",
      fontWeight: "700",
      fill: "#2B2B2B",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Ornament circle below name
    {
      type: "circle",
      left: trimCenterX,
      top: safeTop + mmToPx(98),
      radius: mmToPx(1.5),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(8),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(2.3),
      fontFamily: "EB Garamond",
      fontWeight: "400",
      fill: "#9A8E80",
      textAlign: "center",
      charSpacing: 150,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 6 — "Bloc" (Bauhaus / Swiss — bold geometry)
// ─────────────────────────────────────────────────────────
const bloc: TemplateDefinition = {
  id: "tpl-bloc",
  name: "Bloc",
  category: "retro",
  description: "Off-white with deep green block header and golden accents",
  backgroundColor: "#F0EDE8",
  objects: [
    // Background rect
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#F0EDE8",
      data: { elementType: "shape", isBackground: true },
    },
    // Large green block — full-width, upper portion with logo (extends into bleed)
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: mmToPx(65) + BLEED,
      fill: "#1B3D2F",
      data: { elementType: "shape" },
    },
    // Logo zone inside green block — square, taller
    ...logoZone(trimCenterX, BLEED + mmToPx(30), 40, 35, "#4A7A5C", "#4A7A5C"),
    // Thin golden accent line
    {
      type: "line",
      left: trimCenterX - mmToPx(15),
      top: BLEED + mmToPx(56),
      width: mmToPx(30),
      height: 0,
      stroke: "#D4A853",
      strokeWidth: 1.5,
      data: { elementType: "shape" },
    },
    // Large product name below block — more central
    {
      type: "textbox",
      left: safeLeft,
      top: BLEED + mmToPx(84),
      width: safeW,
      text: "COFFEE NAME",
      fontSize: mmToPx(8),
      fontFamily: "Barlow Condensed",
      fontWeight: "700",
      fill: "#1B3D2F",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: safeLeft,
      top: BLEED + mmToPx(98),
      width: safeW,
      text: "Your tagline here",
      fontSize: mmToPx(2.8),
      fontFamily: "Work Sans",
      fontWeight: "400",
      fill: "#1B3D2F",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Bottom golden accent bar (extends into bleed)
    {
      type: "rect",
      left: 0,
      top: CANVAS_H - mmToPx(12) - BLEED,
      width: CANVAS_W,
      height: mmToPx(12) + BLEED,
      fill: "#D4A853",
      data: { elementType: "shape" },
    },
    // Weight in bottom bar
    {
      type: "textbox",
      left: trimCenterX,
      top: CANVAS_H - BLEED - mmToPx(6),
      width: safeW,
      text: "NET WT. 250G",
      fontSize: mmToPx(3),
      fontFamily: "Barlow Condensed",
      fontWeight: "700",
      fill: "#1B3D2F",
      textAlign: "center",
      charSpacing: 200,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 7 — "Terroir" (Organic shapes, earth tones)
// ─────────────────────────────────────────────────────────
const terroir: TemplateDefinition = {
  id: "tpl-terroir",
  name: "Terroir",
  category: "minimal",
  description: "Warm greige with oversized clay ellipse and playful organic type",
  backgroundColor: "#E8E4DA",
  objects: [
    // Background rect
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#E8E4DA",
      data: { elementType: "shape", isBackground: true },
    },
    // Logo zone — square, taller, pushed down
    ...logoZone(trimCenterX, safeTop + mmToPx(28), 40, 35, "#A0785C", "#A0785C"),
    // Oversized filled ellipse — more central
    {
      type: "ellipse",
      left: trimCenterX,
      top: safeTop + mmToPx(78),
      rx: mmToPx(24),
      ry: mmToPx(24),
      fill: "#A0785C",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Product name in white inside ellipse
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(78),
      width: mmToPx(38),
      text: "COFFEE\nNAME",
      fontSize: mmToPx(8),
      fontFamily: "Syne",
      fontWeight: "700",
      fill: "#FFFFFF",
      textAlign: "center",
      lineHeight: 1.1,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Scattered accent circles
    {
      type: "circle",
      left: safeLeft + mmToPx(5),
      top: safeTop + mmToPx(58),
      radius: mmToPx(4),
      fill: "#6B8F71",
      opacity: 0.6,
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    {
      type: "circle",
      left: safeRight - mmToPx(8),
      top: safeTop + mmToPx(88),
      radius: mmToPx(3),
      fill: "#6B8F71",
      opacity: 0.5,
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(8),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(2.3),
      fontFamily: "Outfit",
      fontWeight: "400",
      fill: "#2E2418",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 8 — "Dossier" (Aesop-inspired minimal typography)
// ─────────────────────────────────────────────────────────
const dossier: TemplateDefinition = {
  id: "tpl-dossier",
  name: "Dossier",
  category: "corporate",
  description: "Clean white with thin border and structured typographic layout",
  backgroundColor: "#FFFFFF",
  objects: [
    // Thin border — 6mm inset
    {
      type: "rect",
      left: trimLeft + mmToPx(6),
      top: trimTop + mmToPx(6),
      width: TRIM_W - mmToPx(12),
      height: TRIM_H - mmToPx(12),
      fill: "transparent",
      stroke: "#1A1A1A",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Logo zone — square, taller
    ...logoZone(trimCenterX, safeTop + mmToPx(35), 42, 35, "#999999", "#999999"),
    // Full-width hairline rule
    {
      type: "line",
      left: trimLeft + mmToPx(6),
      top: safeTop + mmToPx(62),
      width: TRIM_W - mmToPx(12),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Product name left-aligned — more central
    {
      type: "textbox",
      left: safeLeft + mmToPx(4),
      top: safeTop + mmToPx(80),
      width: safeW - mmToPx(8),
      text: "Coffee Name",
      fontSize: mmToPx(8),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: safeLeft + mmToPx(4),
      top: safeTop + mmToPx(94),
      width: safeW - mmToPx(8),
      text: "Your tagline or description",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#999999",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Rule
    {
      type: "line",
      left: trimLeft + mmToPx(6),
      top: safeTop + mmToPx(104),
      width: TRIM_W - mmToPx(12),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Weight bottom-left
    {
      type: "textbox",
      left: safeLeft + mmToPx(4),
      top: safeBottom - mmToPx(10),
      width: mmToPx(25),
      text: "250g",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "500",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─── Export all templates ───
export const TEMPLATES: TemplateDefinition[] = [
  classic,
  editorial,
  nordic,
  foundry,
  atelier,
  bloc,
  terroir,
  dossier,
];
