import { mmToPx } from "../types";
import type { TemplateDefinition } from "./templates";
import { logoZone } from "./templates";

// ─── Canvas constants (106mm × 156mm total, with 2mm bleed on each side) ───
const TRIM_W = mmToPx(102);
const TRIM_H = mmToPx(152);
const BLEED = mmToPx(2);
const CANVAS_W = TRIM_W + BLEED * 2;
const CANVAS_H = TRIM_H + BLEED * 2;
const SAFE = mmToPx(4);

const trimTop = BLEED;
const trimCenterX = BLEED + TRIM_W / 2;
const safeLeft = BLEED + SAFE;
const safeTop = BLEED + SAFE;
const safeBottom = BLEED + TRIM_H - SAFE;
const safeW = TRIM_W - SAFE * 2;

// ─────────────────────────────────────────────────────────
// Mobile Template 1 — "Stack" (Minimal vertical stack)
// ─────────────────────────────────────────────────────────
const stack: TemplateDefinition = {
  id: "tpl-mobile-stack",
  name: "Stack",
  category: "mobile",
  description: "Minimal vertical stack with logo, coffee name and weight",
  backgroundColor: "#FFFFFF",
  objects: [
    // White background
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#FFFFFF",
      data: { elementType: "shape", isBackground: true },
    },
    // Logo zone — square, taller
    ...logoZone(trimCenterX, safeTop + mmToPx(30), 40, 35, "#999999", "#999999"),
    // Coffee name — more central
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(72),
      width: safeW,
      text: "Coffee\nName",
      fontSize: mmToPx(14),
      fontFamily: "DM Serif Display",
      fontWeight: 400,
      fill: "#1A1A1A",
      textAlign: "center",
      lineHeight: 1.0,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(96),
      width: safeW,
      text: "Your tagline here",
      fontSize: mmToPx(3),
      fontFamily: "Inter",
      fontWeight: 400,
      fill: "#999999",
      textAlign: "center",
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
      text: "250g",
      fontSize: mmToPx(3.5),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#1A1A1A",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Mobile Template 2 — "Bold Split" (Top colour block + white bottom)
// ─────────────────────────────────────────────────────────
const boldSplit: TemplateDefinition = {
  id: "tpl-mobile-bold-split",
  name: "Bold Split",
  category: "mobile",
  description: "Top half solid colour block with logo; bottom half with coffee name and weight",
  backgroundColor: "#FFFFFF",
  objects: [
    // White background
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#FFFFFF",
      data: { elementType: "shape", isBackground: true },
    },
    // Top colour block (full bleed, taller to fit square logo)
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: Math.round(CANVAS_H * 0.50),
      fill: "#1B3D2F",
      data: { elementType: "shape" },
    },
    // Logo zone in colour block — square, taller
    ...logoZone(trimCenterX, trimTop + mmToPx(32), 40, 35, "#FFFFFF", "#FFFFFF"),
    // Coffee name below the split — more central
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(92),
      width: safeW,
      text: "COFFEE NAME",
      fontSize: mmToPx(10),
      fontFamily: "Bebas Neue",
      fontWeight: 400,
      fill: "#1B3D2F",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(106),
      width: safeW,
      text: "Your tagline here",
      fontSize: mmToPx(3),
      fontFamily: "Inter",
      fontWeight: 400,
      fill: "#999999",
      textAlign: "center",
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
      text: "250g",
      fontSize: mmToPx(3.5),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#1B3D2F",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Mobile Template 3 — "Circle Mark" (Modern, large circle center)
// ─────────────────────────────────────────────────────────
const circleMark: TemplateDefinition = {
  id: "tpl-mobile-circle-mark",
  name: "Circle Mark",
  category: "mobile",
  description: "Large circle with coffee name inside, logo above, weight below",
  backgroundColor: "#F5F3EF",
  objects: [
    // Warm off-white background
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#F5F3EF",
      data: { elementType: "shape", isBackground: true },
    },
    // Logo zone above circle — square, taller
    ...logoZone(trimCenterX, safeTop + mmToPx(24), 36, 30, "#7A7A7A", "#7A7A7A"),
    // Large dark circle — more central
    {
      type: "circle",
      left: trimCenterX,
      top: trimTop + mmToPx(75),
      radius: mmToPx(28),
      fill: "#2A2A2A",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Coffee name inside circle
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(75),
      width: mmToPx(42),
      text: "Coffee\nName",
      fontSize: mmToPx(8),
      fontFamily: "Space Grotesk",
      fontWeight: 700,
      fill: "#F5F3EF",
      textAlign: "center",
      lineHeight: 1.1,
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: safeBottom - mmToPx(8),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(3),
      fontFamily: "Space Grotesk",
      fontWeight: 500,
      fill: "#2A2A2A",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

// ─────────────────────────────────────────────────────────
// Mobile Template 4 — "Type Only" (Elegant font pairing, no shapes)
// ─────────────────────────────────────────────────────────
const typeOnly: TemplateDefinition = {
  id: "tpl-mobile-type-only",
  name: "Type Only",
  category: "mobile",
  description: "Pure typography with font size hierarchy and logo zone",
  backgroundColor: "#FAFAFA",
  objects: [
    // Near-white background
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: CANVAS_H,
      fill: "#FAFAFA",
      data: { elementType: "shape", isBackground: true },
    },
    // Thin rule
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(12),
      width: safeW,
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // Logo zone — square, taller
    ...logoZone(safeLeft + mmToPx(20), safeTop + mmToPx(34), 40, 32, "#999999", "#999999"),
    // Coffee name — more central
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(72),
      width: safeW,
      text: "Coffee\nName",
      fontSize: mmToPx(12),
      fontFamily: "Playfair Display",
      fontWeight: 700,
      fill: "#1A1A1A",
      textAlign: "left",
      lineHeight: 1.05,
      data: { elementType: "text", fieldName: "Coffee Name" },
    },
    // Tagline
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(98),
      width: safeW,
      text: "Your tagline here",
      fontSize: mmToPx(3.2),
      fontFamily: "EB Garamond",
      fontWeight: 400,
      fontStyle: "italic",
      fill: "#666666",
      textAlign: "left",
      data: { elementType: "text" },
    },
    // Weight
    {
      type: "textbox",
      left: safeLeft,
      top: safeBottom - mmToPx(8),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(3),
      fontFamily: "EB Garamond",
      fontWeight: 500,
      fill: "#1A1A1A",
      textAlign: "left",
      data: { elementType: "text", fieldName: "Weight" },
    },
  ],
};

export const MOBILE_TEMPLATES: TemplateDefinition[] = [
  stack,
  boldSplit,
  circleMark,
  typeOnly,
];
