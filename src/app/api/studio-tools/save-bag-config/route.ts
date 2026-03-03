import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface PointPayload { x: number; y: number }

interface LabelRectPayload {
  topLeft: PointPayload;
  topRight: PointPayload;
  bottomLeft: PointPayload;
  bottomRight: PointPayload;
}

interface BagConfigPayload {
  labelRect: LabelRectPayload;
  warpMapDataUrl?: string;
  lightingMapDataUrl?: string;
  lightingOpacity?: number;
  bags: {
    name: string;
    isShiny: boolean;
    labelOpacity: number;
    specularOpacity?: number;
  }[];
}

function formatPoint(p: PointPayload): string {
  return `{ x: ${p.x}, y: ${p.y} }`;
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  try {
    const payload: BagConfigPayload = await req.json();
    if (!payload.bags || !Array.isArray(payload.bags) || !payload.labelRect) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { labelRect, warpMapDataUrl, lightingMapDataUrl, lightingOpacity, bags } = payload;
    const lines: string[] = [];

    lines.push(`/**`);
    lines.push(` * Per-bag mockup configuration.`);
    lines.push(` *`);
    lines.push(` * Label rect coordinates are percentages (0-100) of the bag photo dimensions.`);
    lines.push(` * isShiny enables the specular highlight pass for glossy/metallic bags.`);
    lines.push(` * warpMapDataUrl is a base64 PNG of a ${256}x${256} canvas`);
    lines.push(` *   where R=dx, G=dy, 128=neutral (no displacement).`);
    lines.push(` * lightingMapDataUrl is a base64 PNG of a 256x256 greyscale canvas`);
    lines.push(` *   where #808080 = neutral, darker = shadow, lighter = highlight.`);
    lines.push(` */`);
    lines.push(``);
    lines.push(`// ─── Types ───────────────────────────────────────────────────────────`);
    lines.push(``);
    lines.push(`export interface Point { x: number; y: number }`);
    lines.push(``);
    lines.push(`export interface LabelRect {`);
    lines.push(`  topLeft: Point;`);
    lines.push(`  topRight: Point;`);
    lines.push(`  bottomLeft: Point;`);
    lines.push(`  bottomRight: Point;`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`export interface BagMockupEntry {`);
    lines.push(`  labelRect: LabelRect;`);
    lines.push(`  warpMapDataUrl?: string;`);
    lines.push(`  lightingMapDataUrl?: string;`);
    lines.push(`  lightingOpacity?: number;`);
    lines.push(`  isShiny: boolean;`);
    lines.push(`  labelOpacity: number;`);
    lines.push(`  specularOpacity?: number;`);
    lines.push(`}`);
    lines.push(``);

    // ── Shared label rect ──
    lines.push(`// ─── Shared label rect ────────────────────────────────────────────────`);
    lines.push(``);
    lines.push(`export const SHARED_LABEL_RECT: LabelRect = {`);
    lines.push(`  topLeft: ${formatPoint(labelRect.topLeft)},`);
    lines.push(`  topRight: ${formatPoint(labelRect.topRight)},`);
    lines.push(`  bottomLeft: ${formatPoint(labelRect.bottomLeft)},`);
    lines.push(`  bottomRight: ${formatPoint(labelRect.bottomRight)},`);
    lines.push(`};`);
    lines.push(``);

    // ── Per-bag configurations ──
    lines.push(`// ─── Per-bag configurations ──────────────────────────────────────────`);
    lines.push(``);
    lines.push(`export const BAG_MOCKUP_CONFIG: Record<string, BagMockupEntry> = {`);

    for (const bag of bags) {
      lines.push(`  "${bag.name}": {`);
      lines.push(`    labelRect: SHARED_LABEL_RECT,`);
      if (warpMapDataUrl) {
        lines.push(`    warpMapDataUrl: "${warpMapDataUrl}",`);
      }
      if (lightingMapDataUrl) {
        lines.push(`    lightingMapDataUrl: "${lightingMapDataUrl}",`);
      }
      if (lightingOpacity != null) {
        lines.push(`    lightingOpacity: ${lightingOpacity},`);
      }
      lines.push(`    isShiny: ${bag.isShiny},`);
      lines.push(`    labelOpacity: ${bag.labelOpacity},`);
      if (bag.specularOpacity != null) {
        lines.push(`    specularOpacity: ${bag.specularOpacity},`);
      }
      lines.push(`  },`);
    }

    lines.push(`};`);
    lines.push(``);

    // ── Default / fallback ──
    lines.push(`/** Fallback config for unknown bag colours */`);
    lines.push(`export const DEFAULT_MOCKUP_CONFIG: BagMockupEntry = {`);
    lines.push(`  labelRect: {`);
    lines.push(`    topLeft: { x: 30, y: 24 },`);
    lines.push(`    topRight: { x: 70, y: 24 },`);
    lines.push(`    bottomLeft: { x: 28, y: 79 },`);
    lines.push(`    bottomRight: { x: 72, y: 79 },`);
    lines.push(`  },`);
    lines.push(`  isShiny: false,`);
    lines.push(`  labelOpacity: 1.0,`);
    lines.push(`};`);
    lines.push(``);
    lines.push(`/** Look up the mockup config for a bag by name, with fallback */`);
    lines.push(`export function getBagMockupConfig(bagName: string | null | undefined): BagMockupEntry {`);
    lines.push(`  if (!bagName) return DEFAULT_MOCKUP_CONFIG;`);
    lines.push(`  return BAG_MOCKUP_CONFIG[bagName] || DEFAULT_MOCKUP_CONFIG;`);
    lines.push(`}`);
    lines.push(``);

    // ── Utility functions ──
    lines.push(`/** Get the boundary polygon of a label rect (4 corners) */`);
    lines.push(`export function getLabelBoundary(rect: LabelRect): Point[] {`);
    lines.push(`  return [rect.topLeft, rect.topRight, rect.bottomRight, rect.bottomLeft];`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`/** Size of the warp displacement map canvas */`);
    lines.push(`export const WARP_MAP_SIZE = 256;`);
    lines.push(``);
    lines.push(`/** Create a neutral (no displacement) warp canvas */`);
    lines.push(`export function createNeutralWarpCanvas(): HTMLCanvasElement {`);
    lines.push(`  const canvas = document.createElement("canvas");`);
    lines.push(`  canvas.width = WARP_MAP_SIZE;`);
    lines.push(`  canvas.height = WARP_MAP_SIZE;`);
    lines.push(`  const ctx = canvas.getContext("2d")!;`);
    lines.push(`  ctx.fillStyle = "#808080";`);
    lines.push(`  ctx.fillRect(0, 0, WARP_MAP_SIZE, WARP_MAP_SIZE);`);
    lines.push(`  return canvas;`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`/** Size of the lighting map canvas */`);
    lines.push(`export const LIGHTING_MAP_SIZE = 256;`);
    lines.push(``);
    lines.push(`/** Create a neutral (no effect) lighting canvas */`);
    lines.push(`export function createNeutralLightingCanvas(): HTMLCanvasElement {`);
    lines.push(`  const canvas = document.createElement("canvas");`);
    lines.push(`  canvas.width = LIGHTING_MAP_SIZE;`);
    lines.push(`  canvas.height = LIGHTING_MAP_SIZE;`);
    lines.push(`  const ctx = canvas.getContext("2d")!;`);
    lines.push(`  ctx.fillStyle = "#808080";`);
    lines.push(`  ctx.fillRect(0, 0, LIGHTING_MAP_SIZE, LIGHTING_MAP_SIZE);`);
    lines.push(`  return canvas;`);
    lines.push(`}`);
    lines.push(``);

    const filePath = path.join(process.cwd(), "src/components/builder/bagMockupConfig.ts");
    await fs.writeFile(filePath, lines.join("\n"), "utf-8");

    return NextResponse.json({ ok: true, path: filePath });
  } catch (err) {
    console.error("Failed to save bag config:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
