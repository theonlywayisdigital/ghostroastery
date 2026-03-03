/**
 * Shared mockup rendering pipeline.
 *
 * Both BagVisualisation and MapLabelZoneClient call this function so the
 * label‑on‑bag preview looks *exactly* the same everywhere.
 */

import { WARP_MAP_SIZE, type LabelRect, type Point } from "./bagMockupConfig";

// ── Public interface ────────────────────────────────────────────────────

export interface RenderMockupOptions {
  /** Target canvas element — will be resized to fit. */
  canvas: HTMLCanvasElement;
  /** Bag photo (already loaded). */
  bagImg: HTMLImageElement;
  /** Label image (already loaded). */
  labelImg: HTMLImageElement | HTMLCanvasElement;
  /** Label rectangle in % coordinates (0‑100). */
  labelRect: LabelRect;
  /** Label opacity 0‑1 (per‑bag setting from the calibration tool). */
  labelOpacity: number;
  /** Optional 256×256 warp displacement canvas / image. */
  warpSource?: HTMLImageElement | HTMLCanvasElement | null;
  /** Optional 256×256 lighting map canvas / image. */
  lightingSource?: HTMLImageElement | HTMLCanvasElement | null;
  /** Lighting overlay strength 0‑1 (from config / calibration tool). */
  lightingOpacity: number;
  /**
   * Maximum display width in CSS pixels. The canvas will be sized to this
   * width (maintaining aspect ratio) and DPR‑scaled for sharpness.
   * Pass `null` to use the bag image's native resolution without DPR scaling
   * (for server‑side or off‑screen rendering).
   */
  maxDisplayWidth?: number | null;
  /** Optional logo image to draw as a watermark over the mockup. */
  watermarkImg?: HTMLImageElement | null;
}

/**
 * Render the complete bag mockup (bag + label + warp + lighting) to a canvas.
 *
 * The pipeline is:
 *   1. Draw bag photo
 *   2. Draw label via triangle subdivision (24×24 grid) with optional warp
 *   3. Lighting overlay (multiply + screen) clipped to label rect
 */
export function renderMockupToCanvas(opts: RenderMockupOptions): void {
  const {
    canvas,
    bagImg,
    labelImg,
    labelRect,
    labelOpacity,
    warpSource,
    lightingSource,
    lightingOpacity,
    maxDisplayWidth,
    watermarkImg,
  } = opts;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imgW = bagImg.naturalWidth || bagImg.width;
  const imgH = bagImg.naturalHeight || bagImg.height;
  const aspect = imgW / imgH;

  // ── Size the canvas ──
  let displayW: number;
  let displayH: number;
  let dpr: number;

  if (maxDisplayWidth != null) {
    // Browser display — DPR‑scaled for sharpness
    displayW = maxDisplayWidth;
    displayH = displayW / aspect;
    dpr = typeof window !== "undefined" ? (window.devicePixelRatio || 1) : 1;
  } else {
    // Off‑screen / native resolution
    displayW = imgW;
    displayH = imgH;
    dpr = 1;
  }

  canvas.width = displayW * dpr;
  canvas.height = displayH * dpr;
  canvas.style.width = `${displayW}px`;
  canvas.style.height = `${displayH}px`;

  ctx.scale(dpr, dpr);

  // ── 1. Draw bag photo ──
  ctx.drawImage(bagImg, 0, 0, displayW, displayH);

  // ── Helper: percentage → display pixel coords ──
  const toPixel = (p: Point) => ({
    x: (p.x / 100) * displayW,
    y: (p.y / 100) * displayH,
  });

  const ptl = toPixel(labelRect.topLeft);
  const ptr = toPixel(labelRect.topRight);
  const pbl = toPixel(labelRect.bottomLeft);
  const pbr = toPixel(labelRect.bottomRight);

  // Bounding box of label zone in display coords
  const allPts = [ptl, ptr, pbl, pbr];
  const minX = Math.min(...allPts.map((p) => p.x));
  const maxX = Math.max(...allPts.map((p) => p.x));
  const minY = Math.min(...allPts.map((p) => p.y));
  const maxY = Math.max(...allPts.map((p) => p.y));

  // ── 2. Draw label via triangle subdivision ──
  // Read warp data once (if available)
  let warpData: ImageData | null = null;
  if (warpSource) {
    const wc = document.createElement("canvas");
    wc.width = WARP_MAP_SIZE;
    wc.height = WARP_MAP_SIZE;
    const wctx = wc.getContext("2d")!;
    wctx.drawImage(warpSource, 0, 0, WARP_MAP_SIZE, WARP_MAP_SIZE);
    warpData = wctx.getImageData(0, 0, WARP_MAP_SIZE, WARP_MAP_SIZE);
  }

  const zoneW = Math.max(Math.abs(ptr.x - ptl.x), Math.abs(pbr.x - pbl.x));
  const zoneH = Math.max(Math.abs(pbl.y - ptl.y), Math.abs(pbr.y - ptr.y));
  const maxDisplaceX = zoneW * 0.1;
  const maxDisplaceY = zoneH * 0.1;

  const gridSize = 24;
  const sw = (labelImg as HTMLImageElement).naturalWidth || labelImg.width;
  const sh = (labelImg as HTMLImageElement).naturalHeight || labelImg.height;

  ctx.save();
  ctx.globalAlpha = labelOpacity;
  // drawTexturedTriangle uses ctx.setTransform (absolute), which conflicts
  // with the ctx.scale(dpr) we set earlier. Reset to identity and scale dest
  // coords by dpr manually instead.
  ctx.setTransform(1, 0, 0, 1, 0, 0);

  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const u0 = c / gridSize;
      const u1 = (c + 1) / gridSize;
      const v0 = r / gridSize;
      const v1 = (r + 1) / gridSize;

      const sx0 = u0 * sw,
        sy0 = v0 * sh;
      const sx1 = u1 * sw,
        sy1 = v0 * sh;
      const sx2 = u0 * sw,
        sy2 = v1 * sh;
      const sx3 = u1 * sw,
        sy3 = v1 * sh;

      const d0 = bilinearInterp(ptl, ptr, pbl, pbr, u0, v0);
      const d1 = bilinearInterp(ptl, ptr, pbl, pbr, u1, v0);
      const d2 = bilinearInterp(ptl, ptr, pbl, pbr, u0, v1);
      const d3 = bilinearInterp(ptl, ptr, pbl, pbr, u1, v1);

      // Apply warp displacement
      if (warpData) {
        for (const corner of [
          { d: d0, u: u0, v: v0 },
          { d: d1, u: u1, v: v0 },
          { d: d2, u: u0, v: v1 },
          { d: d3, u: u1, v: v1 },
        ]) {
          const wx = Math.floor(corner.u * (WARP_MAP_SIZE - 1));
          const wy = Math.floor(corner.v * (WARP_MAP_SIZE - 1));
          const idx = (wy * WARP_MAP_SIZE + wx) * 4;
          corner.d.x += ((warpData.data[idx] - 128) / 128) * maxDisplaceX;
          corner.d.y += ((warpData.data[idx + 1] - 128) / 128) * maxDisplaceY;
        }
      }

      drawTexturedTriangle(
        ctx,
        labelImg,
        sx0, sy0, sx1, sy1, sx2, sy2,
        d0.x * dpr, d0.y * dpr, d1.x * dpr, d1.y * dpr, d2.x * dpr, d2.y * dpr,
      );
      drawTexturedTriangle(
        ctx,
        labelImg,
        sx1, sy1, sx3, sy3, sx2, sy2,
        d1.x * dpr, d1.y * dpr, d3.x * dpr, d3.y * dpr, d2.x * dpr, d2.y * dpr,
      );
    }
  }
  ctx.restore();

  // ── 3. Lighting overlay ──
  if (lightingSource && lightingOpacity > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(ptl.x, ptl.y);
    ctx.lineTo(ptr.x, ptr.y);
    ctx.lineTo(pbr.x, pbr.y);
    ctx.lineTo(pbl.x, pbl.y);
    ctx.closePath();
    ctx.clip();

    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = lightingOpacity;
    ctx.drawImage(lightingSource, minX, minY, maxX - minX, maxY - minY);

    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = lightingOpacity * 0.5;
    ctx.drawImage(lightingSource, minX, minY, maxX - minX, maxY - minY);

    ctx.restore();
  }

  // ── 4. Watermark overlay ──
  if (watermarkImg && watermarkImg.complete && watermarkImg.naturalWidth > 0) {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 0.20;
    ctx.globalCompositeOperation = "source-over";

    // Size the logo to ~40% of the display width
    const logoAspect = watermarkImg.naturalWidth / watermarkImg.naturalHeight;
    const logoW = displayW * 0.4;
    const logoH = logoW / logoAspect;

    // Draw centered
    const lx = (displayW - logoW) / 2;
    const ly = (displayH - logoH) / 2;
    ctx.drawImage(watermarkImg, lx, ly, logoW, logoH);
    ctx.restore();
  }

  // ── 5. Diagonal "MOCKUP PREVIEW" text watermark ──
  {
    ctx.save();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalAlpha = 0.20;
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#ffffff";

    const textFontSize = Math.max(12, displayW * 0.05);
    ctx.font = `bold ${textFontSize}px sans-serif`;

    const text = "MOCKUP PREVIEW";
    const measured = ctx.measureText(text);
    const textWidth = measured.width;
    const lineHeight = textFontSize * 2.5;

    // Rotate -30° around canvas centre
    const angle = -Math.PI / 6;
    ctx.translate(displayW / 2, displayH / 2);
    ctx.rotate(angle);

    // Tile text across the rotated canvas — cover enough area
    // to fill the full canvas even after rotation
    const diagonal = Math.sqrt(displayW * displayW + displayH * displayH);
    const halfDiag = diagonal / 2;
    const spacingX = textWidth * 1.5;

    for (let row = -halfDiag; row < halfDiag; row += lineHeight) {
      for (let col = -halfDiag; col < halfDiag; col += spacingX) {
        ctx.fillText(text, col, row);
      }
    }

    ctx.restore();
  }
}

// ── Private helpers ─────────────────────────────────────────────────────

function bilinearInterp(
  tl: Point,
  tr: Point,
  bl: Point,
  br: Point,
  u: number,
  v: number,
): Point {
  const topX = tl.x + (tr.x - tl.x) * u;
  const topY = tl.y + (tr.y - tl.y) * u;
  const botX = bl.x + (br.x - bl.x) * u;
  const botY = bl.y + (br.y - bl.y) * u;
  return {
    x: topX + (botX - topX) * v,
    y: topY + (botY - topY) * v,
  };
}

function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  s0x: number, s0y: number,
  s1x: number, s1y: number,
  s2x: number, s2y: number,
  d0x: number, d0y: number,
  d1x: number, d1y: number,
  d2x: number, d2y: number,
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(d0x, d0y);
  ctx.lineTo(d1x, d1y);
  ctx.lineTo(d2x, d2y);
  ctx.closePath();
  ctx.clip();

  const denom = s0x * (s1y - s2y) - s1x * (s0y - s2y) + s2x * (s0y - s1y);
  if (Math.abs(denom) < 0.001) {
    ctx.restore();
    return;
  }

  const a = (d0x * (s1y - s2y) - d1x * (s0y - s2y) + d2x * (s0y - s1y)) / denom;
  const b = (d0y * (s1y - s2y) - d1y * (s0y - s2y) + d2y * (s0y - s1y)) / denom;
  const c = (d0x * (s2x - s1x) - d1x * (s2x - s0x) + d2x * (s1x - s0x)) / denom;
  const d = (d0y * (s2x - s1x) - d1y * (s2x - s0x) + d2y * (s1x - s0x)) / denom;
  const e =
    (d0x * (s1x * s2y - s2x * s1y) - d1x * (s0x * s2y - s2x * s0y) + d2x * (s0x * s1y - s1x * s0y)) / denom;
  const f =
    (d0y * (s1x * s2y - s2x * s1y) - d1y * (s0x * s2y - s2x * s0y) + d2y * (s0x * s1y - s1x * s0y)) / denom;

  ctx.setTransform(a, b, c, d, e, f);
  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
