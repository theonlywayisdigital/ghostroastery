"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  getBagMockupConfig,
  BAG_MOCKUP_CONFIG,
  DEFAULT_MOCKUP_CONFIG,
  getLabelBoundary,
  type LabelRect,
  type Point,
} from "./bagMockupConfig";
import { renderMockupToCanvas } from "./renderMockupToCanvas";

interface BagVisualisationProps {
  bagPhotoUrl: string | null;
  bagColourHex: string | null;
  bagColourName?: string | null;
  actualBagPhotoUrl?: string | null;
  labelFileURL: string | null;
  size?: "small" | "medium" | "large";
  showPlaceholder?: boolean;
  collapsible?: boolean;
}

function getSwatchClass(name: string | null | undefined): string {
  if (!name) return "";
  const n = name.toLowerCase();
  if (n.includes("holo")) return "swatch-holo";
  if (n.includes("shiny")) return "swatch-shiny";
  return "";
}

// ── Watermark logo (loaded once) ──
let watermarkImg: HTMLImageElement | null = null;
let watermarkLoadPromise: Promise<HTMLImageElement> | null = null;

function loadWatermark(): Promise<HTMLImageElement> {
  if (watermarkImg) return Promise.resolve(watermarkImg);
  if (watermarkLoadPromise) return watermarkLoadPromise;
  watermarkLoadPromise = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => { watermarkImg = img; resolve(img); };
    img.onerror = () => resolve(img); // resolve anyway so rendering doesn't stall
    img.src = "/ghost-roastery-logo.png";
  });
  return watermarkLoadPromise;
}

// ── Module-level image cache ──
const imageCache = new Map<string, HTMLImageElement>();

function getCachedImage(src: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(src);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// ── Data URL image loader (for warp/lighting maps) ──
const dataUrlCache = new Map<string, HTMLImageElement>();

function loadDataUrlImage(dataUrl: string): Promise<HTMLImageElement> {
  const cached = dataUrlCache.get(dataUrl);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      dataUrlCache.set(dataUrl, img);
      resolve(img);
    };
    img.onerror = () => resolve(img); // resolve even on error so we can check .complete
    img.src = dataUrl;
  });
}

// ── Main component ──

export function BagVisualisation({
  bagPhotoUrl,
  bagColourHex,
  bagColourName,
  actualBagPhotoUrl,
  labelFileURL,
  size = "medium",
  showPlaceholder = false,
  collapsible = false,
}: BagVisualisationProps) {
  const [isExpanded, setIsExpanded] = useState(!collapsible);
  const [imageError, setImageError] = useState(false);
  const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvasReady, setCanvasReady] = useState(false);
  // Track the container width so we can match the calibration tool's sizing
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);

  const canvasCallbackRef = (node: HTMLCanvasElement | null) => {
    canvasRef.current = node;
    setCanvasEl(node);
  };

  const sizeClasses = {
    small: "max-w-[200px]",
    medium: "max-w-[300px]",
    large: "max-w-[400px]",
  };

  // ── Compositing pipeline — delegates entirely to shared renderer ──
  useEffect(() => {
    if (!bagPhotoUrl || !labelFileURL || !canvasEl) {
      setCanvasReady(false);
      return;
    }

    const canvas = canvasEl;
    let cancelled = false;

    (async () => {
      try {
        const bagImg = await getCachedImage(bagPhotoUrl);
        if (cancelled) return;
        const labelImg = await getCachedImage(labelFileURL);
        if (cancelled) return;

        const config = getBagMockupConfig(bagColourName);
        const { labelRect, warpMapDataUrl, lightingMapDataUrl, lightingOpacity, labelOpacity } = config;

        // Load warp map if present
        let warpSource: HTMLImageElement | null = null;
        if (warpMapDataUrl) {
          warpSource = await loadDataUrlImage(warpMapDataUrl);
          if (cancelled) return;
          if (!warpSource.complete || warpSource.naturalWidth === 0) warpSource = null;
        }

        // Load lighting map if present
        let lightingSource: HTMLImageElement | null = null;
        if (lightingMapDataUrl) {
          lightingSource = await loadDataUrlImage(lightingMapDataUrl);
          if (cancelled) return;
          if (!lightingSource.complete || lightingSource.naturalWidth === 0) lightingSource = null;
        }

        if (cancelled) return;

        // Use container width to match calibration tool's display sizing.
        // The calibration tool caps at 700px — we use whatever the container
        // gives us (will be ≤400px for "large", ≤300px for "medium", etc.).
        const maxW = containerWidth > 0 ? containerWidth : 300;

        const wm = await loadWatermark();
        if (cancelled) return;

        renderMockupToCanvas({
          canvas,
          bagImg,
          labelImg,
          labelRect,
          labelOpacity,
          warpSource,
          lightingSource,
          lightingOpacity: lightingOpacity ?? 0.6,
          maxDisplayWidth: maxW,
          watermarkImg: wm,
        });

        if (!cancelled) setCanvasReady(true);
      } catch {
        if (!cancelled) setImageError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bagPhotoUrl, bagColourName, labelFileURL, canvasEl, containerWidth]);

  // ── Observe container width ──
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(container);
    // Set initial width
    setContainerWidth(container.clientWidth);
    return () => ro.disconnect();
  }, []);

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

  if (collapsible) {
    return (
      <div className="lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center gap-2 py-3 text-neutral-400 hover:text-foreground transition-colors"
        >
          <span>{isExpanded ? "Hide" : "Show"} bag preview</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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
                actualBagPhotoUrl={actualBagPhotoUrl}
                labelFileURL={labelFileURL}
                size={size}
                imageError={imageError}
                setImageError={setImageError}
                canvasRef={canvasCallbackRef}
                canvasReady={canvasReady}
                containerRef={containerRef}
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
      actualBagPhotoUrl={actualBagPhotoUrl}
      labelFileURL={labelFileURL}
      size={size}
      imageError={imageError}
      setImageError={setImageError}
      canvasRef={canvasCallbackRef}
      canvasReady={canvasReady}
      containerRef={containerRef}
    />
  );
}

function BagContent({
  bagPhotoUrl,
  bagColourHex,
  bagColourName,
  actualBagPhotoUrl,
  labelFileURL,
  size,
  imageError,
  setImageError,
  canvasRef,
  canvasReady,
  containerRef,
}: {
  bagPhotoUrl: string | null;
  bagColourHex: string | null;
  bagColourName?: string | null;
  actualBagPhotoUrl?: string | null;
  labelFileURL: string | null;
  size: "small" | "medium" | "large";
  imageError: boolean;
  setImageError: (error: boolean) => void;
  canvasRef: (node: HTMLCanvasElement | null) => void;
  canvasReady: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const alreadyCached = bagPhotoUrl ? imageCache.has(bagPhotoUrl) : false;
  const [imageLoaded, setImageLoaded] = useState(alreadyCached);
  const [loadProgress, setLoadProgress] = useState(alreadyCached ? 100 : 0);

  const sizeClasses = {
    small: "max-w-[200px]",
    medium: "max-w-[300px]",
    large: "max-w-[400px]",
  };

  useEffect(() => {
    if (!bagPhotoUrl) {
      setImageLoaded(false);
      setLoadProgress(0);
      return;
    }

    if (imageCache.has(bagPhotoUrl)) {
      setImageLoaded(true);
      setLoadProgress(100);
      return;
    }

    setImageLoaded(false);
    setLoadProgress(0);

    let cancelled = false;
    let fakeProgress = 0;
    const progressTimer = setInterval(() => {
      if (cancelled) return;
      fakeProgress = Math.min(90, fakeProgress + (90 - fakeProgress) * 0.08);
      setLoadProgress(fakeProgress);
    }, 100);

    getCachedImage(bagPhotoUrl)
      .then(() => {
        if (!cancelled) {
          setLoadProgress(100);
          setImageLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setImageError(true);
      })
      .finally(() => clearInterval(progressTimer));

    return () => {
      cancelled = true;
      clearInterval(progressTimer);
    };
  }, [bagPhotoUrl, setImageError]);

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

  // Has label — show the composite canvas
  if (labelFileURL) {
    const showSideBySide = actualBagPhotoUrl && size !== "small";

    return (
      <motion.div
        className={`${showSideBySide ? "" : sizeClasses[size]} w-full mx-auto`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={showSideBySide ? "flex flex-col sm:flex-row gap-4 items-start" : ""}>
          {/* Mockup column */}
          <div className={showSideBySide ? "flex-1 min-w-0" : ""} ref={containerRef}>
            {showSideBySide && (
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
                Mockup preview
              </p>
            )}
            <div className="relative">
              {!canvasReady && (
                <div className="w-full aspect-[5/7] bg-neutral-900 rounded-lg flex flex-col items-center justify-center gap-4">
                  <div className="opacity-20">
                    <BagOutlineSVG />
                  </div>
                  <LoadingBar progress={loadProgress} />
                </div>
              )}
              <motion.canvas
                ref={canvasRef}
                className={`w-full h-auto rounded-lg shadow-2xl ${!canvasReady ? "absolute inset-0 opacity-0" : ""}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: canvasReady ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {bagColourName && !showSideBySide && (
              <div className="text-center mt-3">
                <span className="text-sm text-neutral-400 flex items-center justify-center gap-2">
                  {bagColourHex && (
                    <span
                      className={`inline-block w-3 h-3 rounded-full border border-neutral-600 ${getSwatchClass(bagColourName)}`}
                      style={{ backgroundColor: bagColourHex }}
                    />
                  )}
                  {bagColourName}
                </span>
              </div>
            )}
          </div>

          {/* Actual bag column */}
          {showSideBySide && (
            <ActualBagPreview
              url={actualBagPhotoUrl}
              colourName={bagColourName}
              colourHex={bagColourHex}
              standalone
            />
          )}
        </div>

        <p className="text-center text-xs text-neutral-500 italic mt-2">
          Label placement shown is for illustration purposes. Final product may vary slightly.
        </p>

        {actualBagPhotoUrl && !showSideBySide && (
          <ActualBagPreview url={actualBagPhotoUrl} colourName={bagColourName} colourHex={bagColourHex} />
        )}
      </motion.div>
    );
  }

  // No label — show bag photo with "Your label here" placeholder
  const showSideBySideNoLabel = actualBagPhotoUrl && size !== "small";

  return (
    <motion.div
      className={`${showSideBySideNoLabel ? "" : sizeClasses[size]} w-full mx-auto`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={showSideBySideNoLabel ? "flex flex-col sm:flex-row gap-4 items-start" : ""}>
        {/* Mockup column */}
        <div className={showSideBySideNoLabel ? "flex-1 min-w-0" : ""} ref={containerRef}>
          {showSideBySideNoLabel && (
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
              Mockup preview
            </p>
          )}
          <div className="relative">
            {!imageLoaded && (
              <div className="w-full aspect-[5/7] bg-neutral-900 rounded-lg flex flex-col items-center justify-center gap-4">
                <div className="opacity-20">
                  <BagOutlineSVG />
                </div>
                <LoadingBar progress={loadProgress} />
              </div>
            )}

            {imageLoaded && (
              <>
                <img src={bagPhotoUrl} alt="Bag preview" className="w-full h-auto rounded-lg shadow-2xl" />
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  {(() => {
                    const config = BAG_MOCKUP_CONFIG[bagColourName || ""] || DEFAULT_MOCKUP_CONFIG;
                    const boundary = getLabelBoundary(config.labelRect);
                    const cx = boundary.reduce((s, p) => s + p.x, 0) / boundary.length;
                    const cy = boundary.reduce((s, p) => s + p.y, 0) / boundary.length;
                    const pathD =
                      boundary.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
                    return (
                      <>
                        <path
                          d={pathD}
                          fill="none"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="0.5"
                          strokeDasharray="2 2"
                        />
                        <text x={cx} y={cy} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="3">
                          Your label here
                        </text>
                      </>
                    );
                  })()}
                </svg>
              </>
            )}
          </div>

          {bagColourName && !showSideBySideNoLabel && (
            <div className="text-center mt-3">
              <span className="text-sm text-neutral-400 flex items-center justify-center gap-2">
                {bagColourHex && (
                  <span
                    className={`inline-block w-3 h-3 rounded-full border border-neutral-600 ${getSwatchClass(bagColourName)}`}
                    style={{ backgroundColor: bagColourHex }}
                  />
                )}
                {bagColourName}
              </span>
            </div>
          )}
        </div>

        {/* Actual bag column */}
        {showSideBySideNoLabel && (
          <ActualBagPreview
            url={actualBagPhotoUrl}
            colourName={bagColourName}
            colourHex={bagColourHex}
            standalone
          />
        )}
      </div>

      <p className="text-center text-xs text-neutral-500 italic mt-2">
        Label placement shown is for illustration purposes. Final product may vary slightly.
      </p>

      {actualBagPhotoUrl && !showSideBySideNoLabel && (
        <ActualBagPreview url={actualBagPhotoUrl} colourName={bagColourName} colourHex={bagColourHex} />
      )}
    </motion.div>
  );
}

function ActualBagPreview({
  url,
  colourName,
  colourHex,
  standalone = false,
}: {
  url: string;
  colourName?: string | null;
  colourHex?: string | null;
  standalone?: boolean;
}) {
  return (
    <motion.div
      className={standalone ? "flex-1 min-w-0" : "mt-5"}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
        Your actual bag
      </p>
      <img
        src={url}
        alt={`Actual ${colourName || "bag"} colour`}
        className="w-full h-auto rounded-lg shadow-2xl"
      />
      {colourName && (
        <div className="text-center mt-3">
          <span className="text-sm text-neutral-400 flex items-center justify-center gap-2">
            {colourHex && (
              <span
                className={`inline-block w-3 h-3 rounded-full border border-neutral-600 ${getSwatchClass(colourName)}`}
                style={{ backgroundColor: colourHex }}
              />
            )}
            {colourName}
          </span>
        </div>
      )}
    </motion.div>
  );
}

function LoadingBar({ progress }: { progress: number }) {
  return (
    <div className="w-3/4 max-w-[160px]">
      <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: "linear" }}
        />
      </div>
      <p className="text-neutral-500 text-xs text-center mt-2">Loading preview…</p>
    </div>
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
      <path d="M15 30 Q10 30 10 40 L10 140 Q10 155 25 160 L95 160 Q110 155 110 140 L110 40 Q110 30 105 30 L15 30" />
      <rect x="15" y="20" width="90" height="12" rx="2" />
      <path d="M15 20 Q60 15 105 20" />
      <path d="M10 25 L15 25" />
      <path d="M105 25 L110 25" />
    </svg>
  );
}
