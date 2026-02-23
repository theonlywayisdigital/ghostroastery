"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BagVisualisationProps {
  bagPhotoUrl: string | null;
  bagColourHex: string | null;
  bagColourName?: string | null;
  labelFileURL: string | null;
  size?: "small" | "medium" | "large";
  showPlaceholder?: boolean;
  collapsible?: boolean;
}

// Label corner positions as percentages of the bag image
// These define the 4 corners where the label warps to (subtle perspective)
const LABEL_CORNERS = {
  // Top-left corner (x%, y%)
  tl: { x: 32, y: 38 },
  // Top-right corner
  tr: { x: 68, y: 38 },
  // Bottom-left corner (slightly wider for subtle barrel effect)
  bl: { x: 31.5, y: 62 },
  // Bottom-right corner (slightly wider for subtle barrel effect)
  br: { x: 68.5, y: 62 },
};

// Label aspect ratio for 250g bags (88mm x 63mm)
const LABEL_ASPECT_RATIO = 88 / 63;

export function BagVisualisation({
  bagPhotoUrl,
  bagColourHex,
  bagColourName,
  labelFileURL,
  size = "medium",
  showPlaceholder = false,
  collapsible = false,
}: BagVisualisationProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [imageError, setImageError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasReady, setCanvasReady] = useState(false);

  const sizeClasses = {
    small: "max-w-[200px]",
    medium: "max-w-[300px]",
    large: "max-w-[400px]",
  };

  // Render the composite image on canvas when we have both bag and label
  useEffect(() => {
    if (!bagPhotoUrl || !labelFileURL || !canvasRef.current) {
      setCanvasReady(false);
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bagImg = new Image();
    bagImg.crossOrigin = "anonymous";

    bagImg.onload = () => {
      // Set canvas size to match bag image
      canvas.width = bagImg.width;
      canvas.height = bagImg.height;

      // Draw the bag
      ctx.drawImage(bagImg, 0, 0);

      // Load and draw the label with perspective warp
      const labelImg = new Image();
      labelImg.crossOrigin = "anonymous";

      labelImg.onload = () => {
        // Convert percentage corners to pixel coordinates
        const corners = {
          tl: { x: (LABEL_CORNERS.tl.x / 100) * bagImg.width, y: (LABEL_CORNERS.tl.y / 100) * bagImg.height },
          tr: { x: (LABEL_CORNERS.tr.x / 100) * bagImg.width, y: (LABEL_CORNERS.tr.y / 100) * bagImg.height },
          bl: { x: (LABEL_CORNERS.bl.x / 100) * bagImg.width, y: (LABEL_CORNERS.bl.y / 100) * bagImg.height },
          br: { x: (LABEL_CORNERS.br.x / 100) * bagImg.width, y: (LABEL_CORNERS.br.y / 100) * bagImg.height },
        };

        // Extract the bag's texture/lighting from the label area BEFORE drawing the label
        const bagTexture = extractBagTexture(ctx, corners, bagImg.width, bagImg.height);

        // Draw perspective-warped label using triangles
        drawPerspectiveImage(ctx, labelImg, corners);

        // Apply the bag's texture/lighting as an overlay to make the label look "printed on"
        applyBagTextureOverlay(ctx, corners, bagTexture);

        setCanvasReady(true);
      };

      labelImg.onerror = () => {
        // If label fails to load, just show the bag
        setCanvasReady(true);
      };

      labelImg.src = labelFileURL;
    };

    bagImg.onerror = () => {
      setImageError(true);
    };

    bagImg.src = bagPhotoUrl;
  }, [bagPhotoUrl, labelFileURL]);

  // Show placeholder state
  if (showPlaceholder && !bagPhotoUrl) {
    return (
      <motion.div
        className={`${sizeClasses[size]} w-full aspect-[5/7] bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <BagOutlineSVG />
        <p className="text-neutral-500 text-sm mt-4">Your bag will appear here</p>
      </motion.div>
    );
  }

  // Collapsible wrapper for mobile
  if (collapsible) {
    return (
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-3 text-neutral-400 hover:text-foreground transition-colors"
        >
          <span>{isExpanded ? "Hide" : "Show"} bag preview</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <BagContent
                bagPhotoUrl={bagPhotoUrl}
                bagColourHex={bagColourHex}
                bagColourName={bagColourName}
                labelFileURL={labelFileURL}
                size={size}
                imageError={imageError}
                setImageError={setImageError}
                canvasRef={canvasRef}
                canvasReady={canvasReady}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <BagContent
      bagPhotoUrl={bagPhotoUrl}
      bagColourHex={bagColourHex}
      bagColourName={bagColourName}
      labelFileURL={labelFileURL}
      size={size}
      imageError={imageError}
      setImageError={setImageError}
      canvasRef={canvasRef}
      canvasReady={canvasReady}
    />
  );
}

// Draw an image with perspective warp using texture mapping with triangles
function drawPerspectiveImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  corners: { tl: { x: number; y: number }; tr: { x: number; y: number }; bl: { x: number; y: number }; br: { x: number; y: number } }
) {
  const { tl, tr, bl, br } = corners;

  // Number of subdivisions for smoother warping
  const divisions = 10;

  for (let i = 0; i < divisions; i++) {
    for (let j = 0; j < divisions; j++) {
      // Calculate the 4 corners of this subdivision in the destination (bag)
      const u0 = i / divisions;
      const u1 = (i + 1) / divisions;
      const v0 = j / divisions;
      const v1 = (j + 1) / divisions;

      // Bilinear interpolation for destination points
      const destTL = bilinearInterp(tl, tr, bl, br, u0, v0);
      const destTR = bilinearInterp(tl, tr, bl, br, u1, v0);
      const destBL = bilinearInterp(tl, tr, bl, br, u0, v1);
      const destBR = bilinearInterp(tl, tr, bl, br, u1, v1);

      // Source coordinates in the label image
      const srcX0 = u0 * img.width;
      const srcX1 = u1 * img.width;
      const srcY0 = v0 * img.height;
      const srcY1 = v1 * img.height;

      // Draw two triangles for this quad
      drawTexturedTriangle(
        ctx, img,
        srcX0, srcY0, srcX1, srcY0, srcX0, srcY1,
        destTL.x, destTL.y, destTR.x, destTR.y, destBL.x, destBL.y
      );
      drawTexturedTriangle(
        ctx, img,
        srcX1, srcY0, srcX1, srcY1, srcX0, srcY1,
        destTR.x, destTR.y, destBR.x, destBR.y, destBL.x, destBL.y
      );
    }
  }
}

// Bilinear interpolation between 4 corner points
function bilinearInterp(
  tl: { x: number; y: number },
  tr: { x: number; y: number },
  bl: { x: number; y: number },
  br: { x: number; y: number },
  u: number,
  v: number
): { x: number; y: number } {
  const top = {
    x: tl.x + (tr.x - tl.x) * u,
    y: tl.y + (tr.y - tl.y) * u,
  };
  const bottom = {
    x: bl.x + (br.x - bl.x) * u,
    y: bl.y + (br.y - bl.y) * u,
  };
  return {
    x: top.x + (bottom.x - top.x) * v,
    y: top.y + (bottom.y - top.y) * v,
  };
}

// Draw a textured triangle using affine transformation
function drawTexturedTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  srcX0: number, srcY0: number,
  srcX1: number, srcY1: number,
  srcX2: number, srcY2: number,
  dstX0: number, dstY0: number,
  dstX1: number, dstY1: number,
  dstX2: number, dstY2: number
) {
  ctx.save();

  // Clip to the destination triangle
  ctx.beginPath();
  ctx.moveTo(dstX0, dstY0);
  ctx.lineTo(dstX1, dstY1);
  ctx.lineTo(dstX2, dstY2);
  ctx.closePath();
  ctx.clip();

  // Calculate affine transformation matrix
  const srcDx1 = srcX1 - srcX0;
  const srcDy1 = srcY1 - srcY0;
  const srcDx2 = srcX2 - srcX0;
  const srcDy2 = srcY2 - srcY0;

  const dstDx1 = dstX1 - dstX0;
  const dstDy1 = dstY1 - dstY0;
  const dstDx2 = dstX2 - dstX0;
  const dstDy2 = dstY2 - dstY0;

  const det = srcDx1 * srcDy2 - srcDy1 * srcDx2;
  if (Math.abs(det) < 0.0001) {
    ctx.restore();
    return;
  }

  const a = (dstDx1 * srcDy2 - dstDx2 * srcDy1) / det;
  const b = (dstDx2 * srcDx1 - dstDx1 * srcDx2) / det;
  const c = (dstDy1 * srcDy2 - dstDy2 * srcDy1) / det;
  const d = (dstDy2 * srcDx1 - dstDy1 * srcDx2) / det;
  const e = dstX0 - a * srcX0 - b * srcY0;
  const f = dstY0 - c * srcX0 - d * srcY0;

  ctx.setTransform(a, c, b, d, e, f);
  ctx.drawImage(img, 0, 0);

  ctx.restore();
}

// Extract the bag's texture/lighting from the label area
function extractBagTexture(
  ctx: CanvasRenderingContext2D,
  corners: { tl: { x: number; y: number }; tr: { x: number; y: number }; bl: { x: number; y: number }; br: { x: number; y: number } },
  canvasWidth: number,
  canvasHeight: number
): ImageData | null {
  const { tl, tr, bl, br } = corners;

  // Get bounding box of the label area
  const minX = Math.floor(Math.min(tl.x, bl.x));
  const maxX = Math.ceil(Math.max(tr.x, br.x));
  const minY = Math.floor(Math.min(tl.y, tr.y));
  const maxY = Math.ceil(Math.max(bl.y, br.y));

  const width = maxX - minX;
  const height = maxY - minY;

  if (width <= 0 || height <= 0) return null;

  // Extract the pixel data from the bag in the label area
  try {
    return ctx.getImageData(minX, minY, width, height);
  } catch {
    return null;
  }
}

// Check if a point is inside a quadrilateral using cross-product method
function isPointInQuad(
  px: number,
  py: number,
  tl: { x: number; y: number },
  tr: { x: number; y: number },
  br: { x: number; y: number },
  bl: { x: number; y: number }
): boolean {
  // Check if point is on the same side of all edges (clockwise winding)
  const cross = (ax: number, ay: number, bx: number, by: number) => ax * by - ay * bx;

  const d1 = cross(tr.x - tl.x, tr.y - tl.y, px - tl.x, py - tl.y);
  const d2 = cross(br.x - tr.x, br.y - tr.y, px - tr.x, py - tr.y);
  const d3 = cross(bl.x - br.x, bl.y - br.y, px - br.x, py - br.y);
  const d4 = cross(tl.x - bl.x, tl.y - bl.y, px - bl.x, py - bl.y);

  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0 || d4 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0 || d4 > 0;

  return !(hasNeg && hasPos);
}

// Apply the bag's texture/lighting as an overlay on the label
function applyBagTextureOverlay(
  ctx: CanvasRenderingContext2D,
  corners: { tl: { x: number; y: number }; tr: { x: number; y: number }; bl: { x: number; y: number }; br: { x: number; y: number } },
  bagTexture: ImageData | null
) {
  if (!bagTexture) return;

  const { tl, tr, bl, br } = corners;

  // Get bounding box
  const minX = Math.floor(Math.min(tl.x, bl.x));
  const maxX = Math.ceil(Math.max(tr.x, br.x));
  const minY = Math.floor(Math.min(tl.y, tr.y));
  const maxY = Math.ceil(Math.max(bl.y, br.y));

  const width = maxX - minX;
  const height = maxY - minY;

  // Get the current label pixels
  let labelData: ImageData;
  try {
    labelData = ctx.getImageData(minX, minY, width, height);
  } catch {
    return;
  }

  const labelPixels = labelData.data;
  const bagPixels = bagTexture.data;

  // Calculate the average luminosity of the bag texture to use as baseline
  let totalLum = 0;
  for (let i = 0; i < bagPixels.length; i += 4) {
    const r = bagPixels[i];
    const g = bagPixels[i + 1];
    const b = bagPixels[i + 2];
    totalLum += (r * 0.299 + g * 0.587 + b * 0.114);
  }
  const avgLum = totalLum / (bagPixels.length / 4);

  // Apply the bag's texture as a soft light/multiply blend
  // Only to pixels INSIDE the label quadrilateral
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const px = minX + x;
      const py = minY + y;

      // Skip pixels outside the label quadrilateral
      if (!isPointInQuad(px, py, tl, tr, br, bl)) {
        continue;
      }

      const i = (y * width + x) * 4;

      const bagR = bagPixels[i];
      const bagG = bagPixels[i + 1];
      const bagB = bagPixels[i + 2];

      // Calculate bag luminosity relative to average (creates the crease/shadow effect)
      const bagLum = (bagR * 0.299 + bagG * 0.587 + bagB * 0.114);

      // Normalize: values below avgLum darken the label, above avgLum lighten slightly
      // This creates the "printed on" effect where creases show through
      const factor = bagLum / avgLum;

      // Apply with intensity for the crease effect (higher = more visible creases)
      const intensity = 0.65;
      const adjustedFactor = 1 + (factor - 1) * intensity;

      // Multiply blend the label colors
      labelPixels[i] = Math.min(255, Math.max(0, labelPixels[i] * adjustedFactor));
      labelPixels[i + 1] = Math.min(255, Math.max(0, labelPixels[i + 1] * adjustedFactor));
      labelPixels[i + 2] = Math.min(255, Math.max(0, labelPixels[i + 2] * adjustedFactor));
    }
  }

  // Put the modified pixels back
  ctx.putImageData(labelData, minX, minY);
}

// Skeleton loader component with shimmer animation
function BagSkeleton({ size }: { size: "small" | "medium" | "large" }) {
  const sizeClasses = {
    small: "max-w-[200px]",
    medium: "max-w-[300px]",
    large: "max-w-[400px]",
  };

  return (
    <div className={`${sizeClasses[size]} w-full mx-auto`}>
      <div className="relative w-full aspect-[5/7] bg-neutral-800 rounded-lg overflow-hidden">
        {/* Shimmer animation */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
        {/* Bag shape outline */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <BagOutlineSVG />
        </div>
      </div>
    </div>
  );
}

function BagContent({
  bagPhotoUrl,
  bagColourHex,
  bagColourName,
  labelFileURL,
  size,
  imageError,
  setImageError,
  canvasRef,
  canvasReady,
}: {
  bagPhotoUrl: string | null;
  bagColourHex: string | null;
  bagColourName?: string | null;
  labelFileURL: string | null;
  size: "small" | "medium" | "large";
  imageError: boolean;
  setImageError: (error: boolean) => void;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  canvasReady: boolean;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const sizeClasses = {
    small: "max-w-[200px]",
    medium: "max-w-[300px]",
    large: "max-w-[400px]",
  };

  // Reset imageLoaded when bagPhotoUrl changes
  useEffect(() => {
    setImageLoaded(false);
  }, [bagPhotoUrl]);

  // No bag photo - show placeholder with pulse animation
  if (!bagPhotoUrl || imageError) {
    return (
      <motion.div
        className={`${sizeClasses[size]} w-full aspect-[5/7] bg-neutral-900 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center mx-auto`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <BagOutlineSVG />
        </motion.div>
        <p className="text-neutral-500 text-sm mt-4">Select a colour to preview</p>
      </motion.div>
    );
  }

  // Has bag photo and label - show canvas composite
  if (labelFileURL) {
    return (
      <motion.div
        className={`${sizeClasses[size]} w-full mx-auto`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative">
          <AnimatePresence mode="wait">
            {!canvasReady && (
              <motion.div
                key="skeleton"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <div className="w-full aspect-[5/7] bg-neutral-800 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <BagOutlineSVG />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <motion.canvas
            ref={canvasRef}
            className="w-full h-auto rounded-lg shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: canvasReady ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Colour indicator */}
        {bagColourName && (
          <div className="text-center mt-3">
            <span className="text-sm text-neutral-400 flex items-center justify-center gap-2">
              {bagColourHex && (
                <span
                  className="inline-block w-3 h-3 rounded-full border border-neutral-600"
                  style={{ backgroundColor: bagColourHex }}
                />
              )}
              {bagColourName}
            </span>
          </div>
        )}

        {/* Size disclaimer */}
        <p className="text-center text-xs text-neutral-500 mt-2">
          Preview shown for 250g bag. Actual appearance may vary by size.
        </p>
      </motion.div>
    );
  }

  // Has bag photo but no label - show bag with placeholder label area
  return (
    <motion.div
      className={`${sizeClasses[size]} w-full mx-auto`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {/* Skeleton loader while image loads */}
        <AnimatePresence mode="wait">
          {!imageLoaded && (
            <motion.div
              key="skeleton"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-10"
            >
              <div className="w-full aspect-[5/7] bg-neutral-800 rounded-lg overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-neutral-700/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <BagOutlineSVG />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={bagPhotoUrl}
          alt={bagColourName || "Coffee bag"}
          className="w-full h-auto rounded-lg shadow-2xl"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Label placeholder outline - only show when image is loaded */}
        {imageLoaded && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <rect
              x={LABEL_CORNERS.tl.x}
              y={LABEL_CORNERS.tl.y}
              width={LABEL_CORNERS.tr.x - LABEL_CORNERS.tl.x}
              height={LABEL_CORNERS.bl.y - LABEL_CORNERS.tl.y}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.5"
              strokeDasharray="2 2"
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              fill="rgba(255,255,255,0.4)"
              fontSize="3"
            >
              Your label here
            </text>
          </svg>
        )}
      </div>

      {/* Colour indicator */}
      {bagColourName && (
        <div className="text-center mt-3">
          <span className="text-sm text-neutral-400 flex items-center justify-center gap-2">
            {bagColourHex && (
              <span
                className="inline-block w-3 h-3 rounded-full border border-neutral-600"
                style={{ backgroundColor: bagColourHex }}
              />
            )}
            {bagColourName}
          </span>
        </div>
      )}

      {/* Size disclaimer */}
      <p className="text-center text-xs text-neutral-500 mt-2">
        Preview shown for 250g bag. Actual appearance may vary by size.
      </p>
    </motion.div>
  );
}

function BagOutlineSVG() {
  return (
    <svg
      viewBox="0 0 120 168"
      className="w-20 h-28 text-neutral-700"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {/* Bag body */}
      <path d="M15 30 Q10 30 10 40 L10 140 Q10 155 25 160 L95 160 Q110 155 110 140 L110 40 Q110 30 105 30 L15 30" />
      {/* Zip seal */}
      <rect x="15" y="20" width="90" height="12" rx="2" />
      {/* Top fold */}
      <path d="M15 20 Q60 15 105 20" />
      {/* Notches */}
      <path d="M10 25 L15 25" />
      <path d="M105 25 L110 25" />
    </svg>
  );
}
