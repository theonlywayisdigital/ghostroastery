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

// ─── Canvas constants (94mm × 140mm trim, 3mm bleed, 4mm safe) ───
const BLEED = mmToPx(3);
const TRIM_W = mmToPx(94);
const TRIM_H = mmToPx(140);
const CANVAS_W = TRIM_W + BLEED * 2;
const CANVAS_H = TRIM_H + BLEED * 2;
const SAFE = mmToPx(4);

// Helper to position relative to trim area
const trimLeft = BLEED;
const trimTop = BLEED;
const trimCenterX = BLEED + TRIM_W / 2;
const trimCenterY = BLEED + TRIM_H / 2;
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
// Template 1 — "Classic Roast" (Gold on dark brown, framed borders)
// Inspired by Roast & Bean Co. reference
// ─────────────────────────────────────────────────────────
const classicRoast: TemplateDefinition = {
  id: "tpl-classic-roast",
  name: "Classic Roast",
  category: "vintage",
  description: "Gold on dark chocolate brown with double framed borders and diamond ornaments",
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
    // Outer gold frame — 6mm inset from trim
    {
      type: "rect",
      left: trimLeft + mmToPx(6),
      top: trimTop + mmToPx(6),
      width: TRIM_W - mmToPx(12),
      height: TRIM_H - mmToPx(12),
      fill: "transparent",
      stroke: "#C9A96E",
      strokeWidth: 2,
      data: { elementType: "shape" },
    },
    // Inner gold frame — 9mm inset from trim
    {
      type: "rect",
      left: trimLeft + mmToPx(9),
      top: trimTop + mmToPx(9),
      width: TRIM_W - mmToPx(18),
      height: TRIM_H - mmToPx(18),
      fill: "transparent",
      stroke: "#C9A96E",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Diamond corner ornament — top-left
    {
      type: "polygon",
      left: trimLeft + mmToPx(7.5),
      top: trimTop + mmToPx(7.5),
      points: [
        { x: 0, y: -mmToPx(1.5) },
        { x: mmToPx(1.5), y: 0 },
        { x: 0, y: mmToPx(1.5) },
        { x: -mmToPx(1.5), y: 0 },
      ],
      fill: "#C9A96E",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Diamond corner ornament — top-right
    {
      type: "polygon",
      left: trimLeft + TRIM_W - mmToPx(7.5),
      top: trimTop + mmToPx(7.5),
      points: [
        { x: 0, y: -mmToPx(1.5) },
        { x: mmToPx(1.5), y: 0 },
        { x: 0, y: mmToPx(1.5) },
        { x: -mmToPx(1.5), y: 0 },
      ],
      fill: "#C9A96E",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Diamond corner ornament — bottom-left
    {
      type: "polygon",
      left: trimLeft + mmToPx(7.5),
      top: trimTop + TRIM_H - mmToPx(7.5),
      points: [
        { x: 0, y: -mmToPx(1.5) },
        { x: mmToPx(1.5), y: 0 },
        { x: 0, y: mmToPx(1.5) },
        { x: -mmToPx(1.5), y: 0 },
      ],
      fill: "#C9A96E",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Diamond corner ornament — bottom-right
    {
      type: "polygon",
      left: trimLeft + TRIM_W - mmToPx(7.5),
      top: trimTop + TRIM_H - mmToPx(7.5),
      points: [
        { x: 0, y: -mmToPx(1.5) },
        { x: mmToPx(1.5), y: 0 },
        { x: 0, y: mmToPx(1.5) },
        { x: -mmToPx(1.5), y: 0 },
      ],
      fill: "#C9A96E",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Brand name in gold caps
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(8),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(4),
      fontFamily: "Playfair Display",
      fontWeight: "700",
      fill: "#C9A96E",
      textAlign: "center",
      charSpacing: 300,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // Logo zone
    ...logoZone(trimCenterX, safeTop + mmToPx(28), 50, 25, "#8B7348", "#8B7348"),
    // Flourish divider — left line
    {
      type: "line",
      left: trimCenterX - mmToPx(25),
      top: safeTop + mmToPx(48),
      width: mmToPx(19),
      height: 0,
      stroke: "#C9A96E",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // Flourish divider — diamond
    {
      type: "polygon",
      left: trimCenterX,
      top: safeTop + mmToPx(48),
      points: [
        { x: 0, y: -mmToPx(1.5) },
        { x: mmToPx(1.5), y: 0 },
        { x: 0, y: mmToPx(1.5) },
        { x: -mmToPx(1.5), y: 0 },
      ],
      fill: "#C9A96E",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Flourish divider — right line
    {
      type: "line",
      left: trimCenterX + mmToPx(6),
      top: safeTop + mmToPx(48),
      width: mmToPx(19),
      height: 0,
      stroke: "#C9A96E",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // Large italic coffee name hero
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(5),
      width: safeW,
      text: "Ethiopian\nYirgacheffe",
      fontSize: mmToPx(9),
      fontFamily: "Playfair Display",
      fontWeight: "400",
      fontStyle: "italic",
      fill: "#C9A96E",
      textAlign: "center",
      lineHeight: 1.15,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Origin text
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(28),
      width: safeW,
      text: "Single Origin • Washed Process",
      fontSize: mmToPx(2.8),
      fontFamily: "Cormorant Garamond",
      fontWeight: "500",
      fill: "#A0845C",
      textAlign: "center",
      charSpacing: 80,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // Tasting notes
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(38),
      width: safeW,
      text: "Blueberry • Jasmine • Dark Chocolate",
      fontSize: mmToPx(2.5),
      fontFamily: "Cormorant Garamond",
      fontWeight: "400",
      fontStyle: "italic",
      fill: "#8B7348",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Weight at bottom
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(5),
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
// Template 2 — "Editorial" (Clean white, massive typography, data rows)
// Inspired by Espresso Blend reference
// ─────────────────────────────────────────────────────────
const editorial: TemplateDefinition = {
  id: "tpl-editorial",
  name: "Editorial",
  category: "modern",
  description: "Clean white with massive display typography, structured data rows and vertical side text",
  backgroundColor: "#FFFFFF",
  objects: [
    // Small brand name top
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(5),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(3.5),
      fontFamily: "DM Sans",
      fontWeight: "500",
      fill: "#0A0A0A",
      textAlign: "center",
      charSpacing: 200,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // "COFFEE ROASTER" subtitle
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(12),
      width: safeW,
      text: "COFFEE ROASTER",
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
      top: safeTop + mmToPx(18),
      width: safeW,
      height: 0,
      stroke: "#0A0A0A",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Logo zone
    ...logoZone(trimCenterX, safeTop + mmToPx(32), 50, 20, "#999999", "#999999"),
    // HUGE coffee name hero
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(2),
      width: safeW,
      text: "ESPRESSO\nBLEND",
      fontSize: mmToPx(14),
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
      top: trimCenterY + mmToPx(25),
      width: safeW,
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Notes label
    {
      type: "textbox",
      left: safeLeft,
      top: trimCenterY + mmToPx(32),
      width: mmToPx(20),
      text: "NOTES",
      fontSize: mmToPx(2),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#6B6B6B",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Notes value
    {
      type: "textbox",
      left: safeLeft + mmToPx(22),
      top: trimCenterY + mmToPx(32),
      width: safeW - mmToPx(22),
      text: "Chocolate, Caramel, Nutty",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Thin rule
    {
      type: "line",
      left: safeLeft,
      top: trimCenterY + mmToPx(38),
      width: safeW,
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Origin label
    {
      type: "textbox",
      left: safeLeft,
      top: trimCenterY + mmToPx(44),
      width: mmToPx(20),
      text: "ORIGIN",
      fontSize: mmToPx(2),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#6B6B6B",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Origin value
    {
      type: "textbox",
      left: safeLeft + mmToPx(22),
      top: trimCenterY + mmToPx(44),
      width: safeW - mmToPx(22),
      text: "Brazil & Colombia Blend",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(5),
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
    // Vertical rotated text on left edge
    {
      type: "textbox",
      left: trimLeft + mmToPx(2),
      top: trimCenterY,
      width: mmToPx(100),
      text: "WHOLE BEAN  |  MEDIUM ROAST",
      fontSize: mmToPx(1.8),
      fontFamily: "DM Sans",
      fontWeight: "500",
      fill: "#6B6B6B",
      textAlign: "center",
      charSpacing: 150,
      angle: 270,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 3 — "Nordic" (Scandinavian minimal, large dark circle)
// Inspired by Nordfell reference
// ─────────────────────────────────────────────────────────
const nordic: TemplateDefinition = {
  id: "tpl-nordic",
  name: "Nordic",
  category: "minimal",
  description: "Warm off-white with large dark circle hero, structured data grid and Scandinavian type",
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
    // Brand name top-left
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(5),
      width: mmToPx(50),
      text: "YOUR BRAND",
      fontSize: mmToPx(3),
      fontFamily: "Space Grotesk",
      fontWeight: "700",
      fill: "#1C1C1C",
      textAlign: "left",
      charSpacing: 200,
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // Large filled dark circle as hero graphic
    {
      type: "circle",
      left: trimCenterX,
      top: safeTop + mmToPx(40),
      radius: mmToPx(28),
      fill: "#2A2A2A",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Logo zone inside circle
    ...logoZone(trimCenterX, safeTop + mmToPx(40), 40, 20, "#555555", "#555555"),
    // Bold caps product name left-aligned below circle
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(76),
      width: safeW,
      text: "DARK ROAST",
      fontSize: mmToPx(7),
      fontFamily: "Space Grotesk",
      fontWeight: "700",
      fill: "#1C1C1C",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Body description
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(87),
      width: safeW,
      text: "A bold, full-bodied blend with deep earthy undertones",
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
      top: safeTop + mmToPx(95),
      width: safeW,
      height: 0,
      stroke: "#1C1C1C",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // 2-column data grid — left col label: Tasting Notes
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(101),
      width: mmToPx(18),
      text: "NOTES",
      fontSize: mmToPx(1.8),
      fontFamily: "Space Grotesk",
      fontWeight: "700",
      fill: "#7A7A7A",
      textAlign: "left",
      charSpacing: 100,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Left col value: Tasting Notes
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(107),
      width: mmToPx(38),
      text: "Dark Choc, Walnut",
      fontSize: mmToPx(2.5),
      fontFamily: "Inter",
      fontWeight: "400",
      fill: "#1C1C1C",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Right col label: Origin
    {
      type: "textbox",
      left: trimCenterX + mmToPx(2),
      top: safeTop + mmToPx(101),
      width: mmToPx(18),
      text: "ORIGIN",
      fontSize: mmToPx(1.8),
      fontFamily: "Space Grotesk",
      fontWeight: "700",
      fill: "#7A7A7A",
      textAlign: "left",
      charSpacing: 100,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Right col value: Origin
    {
      type: "textbox",
      left: trimCenterX + mmToPx(2),
      top: safeTop + mmToPx(107),
      width: mmToPx(38),
      text: "Sumatra",
      fontSize: mmToPx(2.5),
      fontFamily: "Inter",
      fontWeight: "400",
      fill: "#1C1C1C",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // Thin rule below grid
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(114),
      width: safeW,
      height: 0,
      stroke: "#1C1C1C",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Weight bottom-left
    {
      type: "textbox",
      left: safeLeft,
      top: safeBottom - mmToPx(6),
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
    // Website bottom-right
    {
      type: "textbox",
      left: safeRight,
      top: safeBottom - mmToPx(6),
      width: mmToPx(40),
      text: "yourbrand.com",
      fontSize: mmToPx(2),
      fontFamily: "Inter",
      fontWeight: "400",
      fill: "#7A7A7A",
      textAlign: "right",
      originX: "right",
      originY: "center",
      data: { elementType: "text" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 4 — "Foundry" (Industrial craft, thick bars, high contrast)
// ─────────────────────────────────────────────────────────
const foundry: TemplateDefinition = {
  id: "tpl-foundry",
  name: "Foundry",
  category: "bold",
  description: "Deep black with warm rust accent bars, stencil-style type and info pills",
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
    // Top accent bar — rust, full bleed, 20mm
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: mmToPx(20) + BLEED,
      fill: "#B85C38",
      data: { elementType: "shape" },
    },
    // Brand name reversed in bar
    {
      type: "textbox",
      left: trimCenterX,
      top: BLEED + mmToPx(8),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(5),
      fontFamily: "Archivo Black",
      fontWeight: "400",
      fill: "#111111",
      textAlign: "center",
      charSpacing: 250,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // Logo zone
    ...logoZone(trimCenterX, BLEED + mmToPx(36), 50, 22, "#F5F5F5", "#666666"),
    // Thick white rule
    {
      type: "line",
      left: safeLeft,
      top: BLEED + mmToPx(54),
      width: safeW,
      height: 0,
      stroke: "#F5F5F5",
      strokeWidth: 3,
      data: { elementType: "shape" },
    },
    // Massive stacked product name
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(5),
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
    // Thin rule below name
    {
      type: "line",
      left: safeLeft,
      top: trimCenterY + mmToPx(28),
      width: safeW,
      height: 0,
      stroke: "#777777",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // 3 info pills — pill 1 bg
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "rect" as const,
        left: safeLeft,
        top: trimCenterY + mmToPx(35),
        width: pillW,
        height: mmToPx(10),
        rx: mmToPx(2),
        ry: mmToPx(2),
        fill: "transparent",
        stroke: "#777777",
        strokeWidth: 1,
        data: { elementType: "shape" },
      };
    })(),
    // Pill 1 label
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "textbox" as const,
        left: safeLeft + pillW / 2,
        top: trimCenterY + mmToPx(37),
        width: pillW - mmToPx(2),
        text: "ORIGIN",
        fontSize: mmToPx(1.6),
        fontFamily: "Manrope",
        fontWeight: "700",
        fill: "#B85C38",
        textAlign: "center",
        charSpacing: 100,
        originX: "center",
        originY: "center",
        data: { elementType: "text" },
      };
    })(),
    // Pill 1 value
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "textbox" as const,
        left: safeLeft + pillW / 2,
        top: trimCenterY + mmToPx(42),
        width: pillW - mmToPx(2),
        text: "Colombia",
        fontSize: mmToPx(2),
        fontFamily: "Manrope",
        fontWeight: "400",
        fill: "#F5F5F5",
        textAlign: "center",
        originX: "center",
        originY: "center",
        data: { elementType: "text", fieldName: "Origin" },
      };
    })(),
    // Pill 2 bg
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "rect" as const,
        left: safeLeft + pillW + mmToPx(2),
        top: trimCenterY + mmToPx(35),
        width: pillW,
        height: mmToPx(10),
        rx: mmToPx(2),
        ry: mmToPx(2),
        fill: "transparent",
        stroke: "#777777",
        strokeWidth: 1,
        data: { elementType: "shape" },
      };
    })(),
    // Pill 2 label
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "textbox" as const,
        left: safeLeft + pillW + mmToPx(2) + pillW / 2,
        top: trimCenterY + mmToPx(37),
        width: pillW - mmToPx(2),
        text: "PROCESS",
        fontSize: mmToPx(1.6),
        fontFamily: "Manrope",
        fontWeight: "700",
        fill: "#B85C38",
        textAlign: "center",
        charSpacing: 100,
        originX: "center",
        originY: "center",
        data: { elementType: "text" },
      };
    })(),
    // Pill 2 value
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "textbox" as const,
        left: safeLeft + pillW + mmToPx(2) + pillW / 2,
        top: trimCenterY + mmToPx(42),
        width: pillW - mmToPx(2),
        text: "Washed",
        fontSize: mmToPx(2),
        fontFamily: "Manrope",
        fontWeight: "400",
        fill: "#F5F5F5",
        textAlign: "center",
        originX: "center",
        originY: "center",
        data: { elementType: "text" },
      };
    })(),
    // Pill 3 bg
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "rect" as const,
        left: safeLeft + pillW * 2 + mmToPx(4),
        top: trimCenterY + mmToPx(35),
        width: pillW,
        height: mmToPx(10),
        rx: mmToPx(2),
        ry: mmToPx(2),
        fill: "transparent",
        stroke: "#777777",
        strokeWidth: 1,
        data: { elementType: "shape" },
      };
    })(),
    // Pill 3 label
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "textbox" as const,
        left: safeLeft + pillW * 2 + mmToPx(4) + pillW / 2,
        top: trimCenterY + mmToPx(37),
        width: pillW - mmToPx(2),
        text: "NOTES",
        fontSize: mmToPx(1.6),
        fontFamily: "Manrope",
        fontWeight: "700",
        fill: "#B85C38",
        textAlign: "center",
        charSpacing: 100,
        originX: "center",
        originY: "center",
        data: { elementType: "text" },
      };
    })(),
    // Pill 3 value
    (() => {
      const pillW = (safeW - mmToPx(4)) / 3;
      return {
        type: "textbox" as const,
        left: safeLeft + pillW * 2 + mmToPx(4) + pillW / 2,
        top: trimCenterY + mmToPx(42),
        width: pillW - mmToPx(2),
        text: "Nutty, Cocoa",
        fontSize: mmToPx(2),
        fontFamily: "Manrope",
        fontWeight: "400",
        fill: "#F5F5F5",
        textAlign: "center",
        originX: "center",
        originY: "center",
        data: { elementType: "text", fieldName: "Tasting Notes" },
      };
    })(),
    // Bottom accent bar with weight reversed
    {
      type: "rect",
      left: 0,
      top: CANVAS_H - mmToPx(14) - BLEED,
      width: CANVAS_W,
      height: mmToPx(14) + BLEED,
      fill: "#B85C38",
      data: { elementType: "shape" },
    },
    // Weight reversed in bottom bar
    {
      type: "textbox",
      left: trimCenterX,
      top: CANVAS_H - BLEED - mmToPx(7),
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
// Template 5 — "Atelier" (Boutique patisserie / artisan gift label)
// ─────────────────────────────────────────────────────────
const atelier: TemplateDefinition = {
  id: "tpl-atelier",
  name: "Atelier",
  category: "elegant",
  description: "Warm ivory with hairline frame, calligraphic script hero and delicate ornaments",
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
    // Hairline frame — 7mm inset
    {
      type: "rect",
      left: trimLeft + mmToPx(7),
      top: trimTop + mmToPx(7),
      width: TRIM_W - mmToPx(14),
      height: TRIM_H - mmToPx(14),
      fill: "transparent",
      stroke: "#B8A080",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // 3 tiny circle ornaments at top
    {
      type: "circle",
      left: trimCenterX - mmToPx(4),
      top: trimTop + mmToPx(11),
      radius: mmToPx(0.8),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    {
      type: "circle",
      left: trimCenterX,
      top: trimTop + mmToPx(11),
      radius: mmToPx(0.8),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    {
      type: "circle",
      left: trimCenterX + mmToPx(4),
      top: trimTop + mmToPx(11),
      radius: mmToPx(0.8),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Brand name in spaced serif
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(12),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(3.5),
      fontFamily: "EB Garamond",
      fontWeight: "500",
      fill: "#2B2B2B",
      textAlign: "center",
      charSpacing: 300,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // "EST. 2024"
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(19),
      width: safeW,
      text: "EST. 2024",
      fontSize: mmToPx(2),
      fontFamily: "EB Garamond",
      fontWeight: "400",
      fontStyle: "italic",
      fill: "#9A8E80",
      textAlign: "center",
      charSpacing: 200,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Logo zone
    ...logoZone(trimCenterX, safeTop + mmToPx(35), 48, 22, "#B8A080", "#B8A080"),
    // Thin divider
    {
      type: "line",
      left: trimCenterX - mmToPx(12),
      top: safeTop + mmToPx(52),
      width: mmToPx(24),
      height: 0,
      stroke: "#B8A080",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // SCRIPT coffee name hero (~9mm)
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(5),
      width: safeW,
      text: "Morning Bloom",
      fontSize: mmToPx(9),
      fontFamily: "Dancing Script",
      fontWeight: "700",
      fill: "#2B2B2B",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Ornament divider — left line
    {
      type: "line",
      left: trimCenterX - mmToPx(20),
      top: trimCenterY + mmToPx(18),
      width: mmToPx(15),
      height: 0,
      stroke: "#B8A080",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Ornament divider — circle
    {
      type: "circle",
      left: trimCenterX,
      top: trimCenterY + mmToPx(18),
      radius: mmToPx(1.5),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Ornament divider — right line
    {
      type: "line",
      left: trimCenterX + mmToPx(5),
      top: trimCenterY + mmToPx(18),
      width: mmToPx(15),
      height: 0,
      stroke: "#B8A080",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Origin
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(28),
      width: safeW,
      text: "Single Origin • Ethiopia",
      fontSize: mmToPx(2.5),
      fontFamily: "EB Garamond",
      fontWeight: "400",
      fill: "#9A8E80",
      textAlign: "center",
      charSpacing: 100,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // Tasting notes
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(36),
      width: safeW,
      text: "Floral, Citrus, Honey",
      fontSize: mmToPx(2.3),
      fontFamily: "EB Garamond",
      fontWeight: "400",
      fontStyle: "italic",
      fill: "#B8A080",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(12),
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
    // Small circle at bottom
    {
      type: "circle",
      left: trimCenterX,
      top: safeBottom - mmToPx(4),
      radius: mmToPx(1.2),
      fill: "#B8A080",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Template 6 — "Bloc" (1960s Swiss/Bauhaus — bold geometry, strong grid)
// ─────────────────────────────────────────────────────────
const bloc: TemplateDefinition = {
  id: "tpl-bloc",
  name: "Bloc",
  category: "retro",
  description: "Warm off-white with deep green block header, golden accents and Bauhaus grid",
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
    // Large green block — full-width bleed, top 55mm
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: mmToPx(55) + BLEED,
      fill: "#1B3D2F",
      data: { elementType: "shape" },
    },
    // Brand name reversed in block
    {
      type: "textbox",
      left: trimCenterX,
      top: BLEED + mmToPx(14),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(5),
      fontFamily: "Barlow Condensed",
      fontWeight: "700",
      fill: "#F0EDE8",
      textAlign: "center",
      charSpacing: 350,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // Thin golden accent line below brand
    {
      type: "line",
      left: trimCenterX - mmToPx(15),
      top: BLEED + mmToPx(22),
      width: mmToPx(30),
      height: 0,
      stroke: "#D4A853",
      strokeWidth: 1.5,
      data: { elementType: "shape" },
    },
    // Logo zone in green block
    ...logoZone(trimCenterX, BLEED + mmToPx(38), 50, 22, "#4A7A5C", "#4A7A5C"),
    // Large product name left-aligned below block
    {
      type: "textbox",
      left: safeLeft,
      top: BLEED + mmToPx(66),
      width: safeW,
      text: "SINGLE ORIGIN",
      fontSize: mmToPx(8),
      fontFamily: "Barlow Condensed",
      fontWeight: "700",
      fill: "#1B3D2F",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // ORIGIN label + value
    {
      type: "textbox",
      left: safeLeft,
      top: BLEED + mmToPx(80),
      width: mmToPx(20),
      text: "ORIGIN",
      fontSize: mmToPx(1.8),
      fontFamily: "Work Sans",
      fontWeight: "600",
      fill: "#D4A853",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    {
      type: "textbox",
      left: safeLeft + mmToPx(22),
      top: BLEED + mmToPx(80),
      width: safeW - mmToPx(22),
      text: "Guatemala Huehuetenango",
      fontSize: mmToPx(2.5),
      fontFamily: "Work Sans",
      fontWeight: "400",
      fill: "#1B3D2F",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // NOTES label + value
    {
      type: "textbox",
      left: safeLeft,
      top: BLEED + mmToPx(88),
      width: mmToPx(20),
      text: "NOTES",
      fontSize: mmToPx(1.8),
      fontFamily: "Work Sans",
      fontWeight: "600",
      fill: "#D4A853",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    {
      type: "textbox",
      left: safeLeft + mmToPx(22),
      top: BLEED + mmToPx(88),
      width: safeW - mmToPx(22),
      text: "Caramel, Stone Fruit, Almond",
      fontSize: mmToPx(2.5),
      fontFamily: "Work Sans",
      fontWeight: "400",
      fill: "#1B3D2F",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Bottom golden accent bar
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
// Template 7 — "Terroir" (Natural wine label — organic shapes, earth tones)
// ─────────────────────────────────────────────────────────
const terroir: TemplateDefinition = {
  id: "tpl-terroir",
  name: "Terroir",
  category: "minimal",
  description: "Warm greige with oversized clay ellipse, organic scattered accents and playful type",
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
    // Brand name top centre
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(6),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(3),
      fontFamily: "Syne",
      fontWeight: "700",
      fill: "#2E2418",
      textAlign: "center",
      charSpacing: 250,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // Logo zone
    ...logoZone(trimCenterX, safeTop + mmToPx(22), 48, 20, "#A0785C", "#A0785C"),
    // Oversized filled ellipse hero — must come BEFORE text inside it
    {
      type: "ellipse",
      left: trimCenterX,
      top: trimCenterY + mmToPx(2),
      rx: mmToPx(22),
      ry: mmToPx(28),
      fill: "#A0785C",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Product name in white INSIDE ellipse
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(2),
      width: mmToPx(36),
      text: "NATURAL\nPROCESS",
      fontSize: mmToPx(7),
      fontFamily: "Syne",
      fontWeight: "700",
      fill: "#FFFFFF",
      textAlign: "center",
      lineHeight: 1.1,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // 3 scattered accent circles
    {
      type: "circle",
      left: safeLeft + mmToPx(5),
      top: trimCenterY - mmToPx(20),
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
      top: trimCenterY + mmToPx(15),
      radius: mmToPx(3),
      fill: "#6B8F71",
      opacity: 0.5,
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    {
      type: "circle",
      left: safeLeft + mmToPx(12),
      top: trimCenterY + mmToPx(25),
      radius: mmToPx(2),
      fill: "#2E2418",
      opacity: 0.3,
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Tasting notes
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(40),
      width: safeW,
      text: "Berry, Wine, Funky",
      fontSize: mmToPx(2.5),
      fontFamily: "Outfit",
      fontWeight: "500",
      fill: "#2E2418",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Origin in sage green
    {
      type: "textbox",
      left: trimCenterX,
      top: trimCenterY + mmToPx(48),
      width: safeW,
      text: "Ethiopia • Sidamo",
      fontSize: mmToPx(2.3),
      fontFamily: "Outfit",
      fontWeight: "400",
      fill: "#6B8F71",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(5),
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
// Template 8 — "Dossier" (Aesop-inspired dense typography, zero decoration)
// ─────────────────────────────────────────────────────────
const dossier: TemplateDefinition = {
  id: "tpl-dossier",
  name: "Dossier",
  category: "corporate",
  description: "Clean white with thin border, dense label/value typography pairs and hairline rules",
  backgroundColor: "#FFFFFF",
  objects: [
    // Thin border — 5mm inset
    {
      type: "rect",
      left: trimLeft + mmToPx(5),
      top: trimTop + mmToPx(5),
      width: TRIM_W - mmToPx(10),
      height: TRIM_H - mmToPx(10),
      fill: "transparent",
      stroke: "#1A1A1A",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Brand name left-aligned
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(8),
      width: safeW - mmToPx(6),
      text: "YOUR BRAND",
      fontSize: mmToPx(3.5),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#1A1A1A",
      textAlign: "left",
      charSpacing: 200,
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Roaster Name" },
    },
    // Full-width hairline rule
    {
      type: "line",
      left: trimLeft + mmToPx(5),
      top: safeTop + mmToPx(15),
      width: TRIM_W - mmToPx(10),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Logo zone
    ...logoZone(trimCenterX, safeTop + mmToPx(30), 50, 22, "#999999", "#999999"),
    // Product name left-aligned (~7mm)
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(50),
      width: safeW - mmToPx(6),
      text: "House Blend No. 1",
      fontSize: mmToPx(7),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Rule below name
    {
      type: "line",
      left: trimLeft + mmToPx(5),
      top: safeTop + mmToPx(60),
      width: TRIM_W - mmToPx(10),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // ORIGIN label
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(67),
      width: mmToPx(20),
      text: "ORIGIN",
      fontSize: mmToPx(1.8),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#999999",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Origin value
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(73),
      width: safeW - mmToPx(6),
      text: "Colombia, Huila Region",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Origin" },
    },
    // Rule
    {
      type: "line",
      left: trimLeft + mmToPx(5),
      top: safeTop + mmToPx(79),
      width: TRIM_W - mmToPx(10),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // TASTING NOTES label
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(86),
      width: mmToPx(30),
      text: "TASTING NOTES",
      fontSize: mmToPx(1.8),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#999999",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Tasting notes value
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(92),
      width: safeW - mmToPx(6),
      text: "Chocolate, Brown Sugar, Walnut",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text", fieldName: "Tasting Notes" },
    },
    // Rule
    {
      type: "line",
      left: trimLeft + mmToPx(5),
      top: safeTop + mmToPx(98),
      width: TRIM_W - mmToPx(10),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // PROCESS label
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(105),
      width: mmToPx(20),
      text: "PROCESS",
      fontSize: mmToPx(1.8),
      fontFamily: "DM Sans",
      fontWeight: "700",
      fill: "#999999",
      textAlign: "left",
      charSpacing: 150,
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Process value
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeTop + mmToPx(111),
      width: safeW - mmToPx(6),
      text: "Fully Washed, Sun Dried",
      fontSize: mmToPx(2.5),
      fontFamily: "DM Sans",
      fontWeight: "500",
      fill: "#1A1A1A",
      textAlign: "left",
      originX: "left",
      originY: "center",
      data: { elementType: "text" },
    },
    // Rule
    {
      type: "line",
      left: trimLeft + mmToPx(5),
      top: safeTop + mmToPx(117),
      width: TRIM_W - mmToPx(10),
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 0.5,
      data: { elementType: "shape" },
    },
    // Weight + batch at bottom
    {
      type: "textbox",
      left: safeLeft + mmToPx(3),
      top: safeBottom - mmToPx(8),
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
    {
      type: "textbox",
      left: safeRight - mmToPx(3),
      top: safeBottom - mmToPx(8),
      width: mmToPx(30),
      text: "Batch 001",
      fontSize: mmToPx(2),
      fontFamily: "DM Sans",
      fontWeight: "400",
      fill: "#999999",
      textAlign: "right",
      originX: "right",
      originY: "center",
      data: { elementType: "text" },
    },
  ],
};

// ─── Export all templates ───
export const TEMPLATES: TemplateDefinition[] = [
  classicRoast,
  editorial,
  nordic,
  foundry,
  atelier,
  bloc,
  terroir,
  dossier,
];
