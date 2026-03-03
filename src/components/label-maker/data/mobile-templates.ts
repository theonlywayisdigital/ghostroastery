import { mmToPx } from "../types";
import type { TemplateDefinition } from "./templates";
import { logoZone } from "./templates";

// ─── Canvas constants (94mm × 140mm trim, 3mm bleed, 4mm safe) ───
const BLEED = mmToPx(3);
const TRIM_W = mmToPx(94);
const TRIM_H = mmToPx(140);
const CANVAS_W = TRIM_W + BLEED * 2;
const CANVAS_H = TRIM_H + BLEED * 2;
const SAFE = mmToPx(4);

const trimLeft = BLEED;
const trimTop = BLEED;
const trimCenterX = BLEED + TRIM_W / 2;
const safeLeft = BLEED + SAFE;
const safeTop = BLEED + SAFE;
const safeW = TRIM_W - SAFE * 2;

// ─────────────────────────────────────────────────────────
// Mobile Template 1 — "Stack" (Minimal vertical stack)
// White bg, black text, pure typography
// ─────────────────────────────────────────────────────────
const stack: TemplateDefinition = {
  id: "tpl-mobile-stack",
  name: "Stack",
  category: "mobile",
  description: "Minimal vertical stack: brand, coffee name, origin, notes, weight",
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
    // Brand name — small caps, spaced
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(12),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(4),
      fontFamily: "Inter",
      fontWeight: 500,
      fill: "#1A1A1A",
      textAlign: "center",
      charSpacing: 300,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Logo zone
    ...logoZone(trimCenterX, safeTop + mmToPx(24), 40, 15, "#999999", "#999999"),
    // Coffee name — large display
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(48),
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
      data: { elementType: "text" },
    },
    // Origin
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(73),
      width: safeW,
      text: "Single Origin \u2022 Ethiopia Yirgacheffe",
      fontSize: mmToPx(3.5),
      fontFamily: "Inter",
      fontWeight: 400,
      fill: "#666666",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Tasting notes
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(95),
      width: safeW,
      text: "Blueberry \u2022 Dark Chocolate \u2022 Honey",
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
      top: trimTop + TRIM_H - mmToPx(12),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(3.5),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#1A1A1A",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
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
  description: "Top half solid colour block with reversed brand name; bottom half white with details",
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
    // Top colour block (full bleed)
    {
      type: "rect",
      left: 0,
      top: 0,
      width: CANVAS_W,
      height: Math.round(CANVAS_H * 0.45),
      fill: "#1B3D2F",
      data: { elementType: "shape" },
    },
    // Brand name — reversed on colour block
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(20),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(4),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#FFFFFF",
      textAlign: "center",
      charSpacing: 400,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Logo zone in colour block
    ...logoZone(trimCenterX, trimTop + mmToPx(35), 40, 15, "#FFFFFF", "#FFFFFF"),
    // Coffee name on colour block
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(50),
      width: safeW,
      text: "COFFEE NAME",
      fontSize: mmToPx(10),
      fontFamily: "Bebas Neue",
      fontWeight: 400,
      fill: "#FFFFFF",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Origin below the split
    {
      type: "textbox",
      left: safeLeft,
      top: trimTop + mmToPx(78),
      width: safeW,
      text: "ORIGIN",
      fontSize: mmToPx(2.5),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#999999",
      textAlign: "left",
      charSpacing: 200,
      data: { elementType: "text" },
    },
    {
      type: "textbox",
      left: safeLeft,
      top: trimTop + mmToPx(84),
      width: safeW,
      text: "Ethiopia Yirgacheffe",
      fontSize: mmToPx(4),
      fontFamily: "Inter",
      fontWeight: 500,
      fill: "#1A1A1A",
      textAlign: "left",
      data: { elementType: "text" },
    },
    // Tasting notes
    {
      type: "textbox",
      left: safeLeft,
      top: trimTop + mmToPx(96),
      width: safeW,
      text: "NOTES",
      fontSize: mmToPx(2.5),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#999999",
      textAlign: "left",
      charSpacing: 200,
      data: { elementType: "text" },
    },
    {
      type: "textbox",
      left: safeLeft,
      top: trimTop + mmToPx(102),
      width: safeW,
      text: "Blueberry, Dark Chocolate, Honey",
      fontSize: mmToPx(3.5),
      fontFamily: "Inter",
      fontWeight: 400,
      fill: "#1A1A1A",
      textAlign: "left",
      data: { elementType: "text" },
    },
    // Weight at bottom
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + TRIM_H - mmToPx(10),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(3.5),
      fontFamily: "Inter",
      fontWeight: 600,
      fill: "#1B3D2F",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
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
  description: "Large circle center with coffee name inside. Brand above, details below.",
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
    // Brand name above circle
    {
      type: "textbox",
      left: trimCenterX,
      top: safeTop + mmToPx(10),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(3.5),
      fontFamily: "Space Grotesk",
      fontWeight: 500,
      fill: "#2A2A2A",
      textAlign: "center",
      charSpacing: 300,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Logo zone below brand name
    ...logoZone(trimCenterX, safeTop + mmToPx(22), 40, 15, "#7A7A7A", "#7A7A7A"),
    // Large dark circle
    {
      type: "circle",
      left: trimCenterX,
      top: trimTop + mmToPx(55),
      radius: mmToPx(30),
      fill: "#2A2A2A",
      originX: "center",
      originY: "center",
      data: { elementType: "shape" },
    },
    // Coffee name inside circle
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(55),
      width: mmToPx(45),
      text: "Coffee\nName",
      fontSize: mmToPx(8),
      fontFamily: "Space Grotesk",
      fontWeight: 700,
      fill: "#F5F3EF",
      textAlign: "center",
      lineHeight: 1.1,
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Details below circle
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + mmToPx(100),
      width: safeW,
      text: "Single Origin \u2022 Ethiopia",
      fontSize: mmToPx(3),
      fontFamily: "Space Grotesk",
      fontWeight: 400,
      fill: "#7A7A7A",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
    },
    // Weight
    {
      type: "textbox",
      left: trimCenterX,
      top: trimTop + TRIM_H - mmToPx(12),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(3),
      fontFamily: "Space Grotesk",
      fontWeight: 500,
      fill: "#2A2A2A",
      textAlign: "center",
      originX: "center",
      originY: "center",
      data: { elementType: "text" },
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
  description: "Pure typography with font size hierarchy. No shapes. Showcases font pairing.",
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
    // Brand name — tiny, spaced
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(8),
      width: safeW,
      text: "YOUR BRAND",
      fontSize: mmToPx(2.8),
      fontFamily: "EB Garamond",
      fontWeight: 400,
      fill: "#999999",
      textAlign: "left",
      charSpacing: 400,
      data: { elementType: "text" },
    },
    // Thin rule
    {
      type: "line",
      left: safeLeft,
      top: safeTop + mmToPx(15),
      width: safeW,
      height: 0,
      stroke: "#E0E0E0",
      strokeWidth: 1,
      data: { elementType: "shape" },
    },
    // Logo zone below rule, left-aligned
    ...logoZone(safeLeft + mmToPx(20), safeTop + mmToPx(26), 40, 15, "#999999", "#999999"),
    // Coffee name — massive serif
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(42),
      width: safeW,
      text: "Ethiopian\nYirgacheffe",
      fontSize: mmToPx(12),
      fontFamily: "Playfair Display",
      fontWeight: 700,
      fill: "#1A1A1A",
      textAlign: "left",
      lineHeight: 1.05,
      data: { elementType: "text" },
    },
    // Origin subtitle
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(72),
      width: safeW,
      text: "Single Origin \u2014 Washed Process",
      fontSize: mmToPx(3.2),
      fontFamily: "EB Garamond",
      fontWeight: 400,
      fontStyle: "italic",
      fill: "#666666",
      textAlign: "left",
      data: { elementType: "text" },
    },
    // Tasting notes
    {
      type: "textbox",
      left: safeLeft,
      top: safeTop + mmToPx(88),
      width: safeW,
      text: "Blueberry \u2022 Jasmine \u2022 Dark Chocolate",
      fontSize: mmToPx(3),
      fontFamily: "EB Garamond",
      fontWeight: 400,
      fill: "#999999",
      textAlign: "left",
      data: { elementType: "text" },
    },
    // Weight + batch at bottom
    {
      type: "textbox",
      left: safeLeft,
      top: trimTop + TRIM_H - mmToPx(12),
      width: safeW,
      text: "250g",
      fontSize: mmToPx(3),
      fontFamily: "EB Garamond",
      fontWeight: 500,
      fill: "#1A1A1A",
      textAlign: "left",
      data: { elementType: "text" },
    },
  ],
};

export const MOBILE_TEMPLATES: TemplateDefinition[] = [
  stack,
  boldSplit,
  circleMark,
  typeOnly,
];
