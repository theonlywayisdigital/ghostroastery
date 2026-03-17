"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { client } from "@/sanity/lib/client";
import { bagColoursQuery } from "@/sanity/queries/builder";
import {
  BAG_MOCKUP_CONFIG,
  SHARED_LABEL_RECT,
  createNeutralLightingCanvas,
  createNeutralWarpCanvas,
  type LabelRect,
  type Point,
} from "@/components/builder/bagMockupConfig";
import { renderMockupToCanvas } from "@/components/builder/renderMockupToCanvas";

// ── Types ──────────────────────────────────────────────────────────────

interface BagColour {
  _id: string;
  name: string;
  hex: string;
  bagPhotoUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

type ToolMode = "rect" | "warp" | "lighting";
type BrushMode = "burn" | "dodge" | "erase";

type RectDragTarget =
  | { type: "corner"; key: "topLeft" | "topRight" | "bottomLeft" | "bottomRight" }
  | { type: "edge"; keys: [keyof LabelRect, keyof LabelRect] }
  | { type: "body" };

// ── Label size presets ────────────────────────────────────────────────
// Physical sizes in mm. The 152x102mm size matches SHARED_LABEL_RECT.
// All presets are scaled proportionally and centered on the bag.

interface LabelSizePreset {
  label: string;
  widthMm: number;
  heightMm: number;
}

const LABEL_SIZE_PRESETS: LabelSizePreset[] = [
  { label: "80×45mm",  widthMm: 80,  heightMm: 45 },
  { label: "88×63mm",  widthMm: 88,  heightMm: 63 },
  { label: "110×75mm", widthMm: 110, heightMm: 75 },
  { label: "152×102mm", widthMm: 152, heightMm: 102 },
];

// Reference: SHARED_LABEL_RECT corresponds to 152x102mm
const REF_WIDTH_MM = 152;
const REF_HEIGHT_MM = 102;

/** Compute the center and span of the reference (152x102) rect in % coords */
function getRefRectMetrics(): { cx: number; cy: number; halfW: number; halfH: number } {
  const r = SHARED_LABEL_RECT;
  const cx = (r.topLeft.x + r.topRight.x + r.bottomLeft.x + r.bottomRight.x) / 4;
  const cy = (r.topLeft.y + r.topRight.y + r.bottomLeft.y + r.bottomRight.y) / 4;
  const halfW = ((r.topRight.x - r.topLeft.x) + (r.bottomRight.x - r.bottomLeft.x)) / 4;
  const halfH = ((r.bottomLeft.y - r.topLeft.y) + (r.bottomRight.y - r.topRight.y)) / 4;
  return { cx, cy, halfW, halfH };
}

/** Build a label rect for a given mm size, centered on the same point as the reference */
function buildLabelRectForSize(widthMm: number, heightMm: number): LabelRect {
  const { cx, cy, halfW, halfH } = getRefRectMetrics();
  const scaleW = widthMm / REF_WIDTH_MM;
  const scaleH = heightMm / REF_HEIGHT_MM;
  const hw = round2(halfW * scaleW);
  const hh = round2(halfH * scaleH);
  return {
    topLeft:     { x: round2(cx - hw), y: round2(cy - hh) },
    topRight:    { x: round2(cx + hw), y: round2(cy - hh) },
    bottomLeft:  { x: round2(cx - hw), y: round2(cy + hh) },
    bottomRight: { x: round2(cx + hw), y: round2(cy + hh) },
  };
}

/** Check which preset (if any) the current rect matches */
function matchesPreset(rect: LabelRect, preset: LabelSizePreset): boolean {
  const expected = buildLabelRectForSize(preset.widthMm, preset.heightMm);
  const eps = 0.5; // allow small tolerance from manual dragging
  return (
    Math.abs(rect.topLeft.x - expected.topLeft.x) < eps &&
    Math.abs(rect.topLeft.y - expected.topLeft.y) < eps &&
    Math.abs(rect.bottomRight.x - expected.bottomRight.x) < eps &&
    Math.abs(rect.bottomRight.y - expected.bottomRight.y) < eps
  );
}

// ── Helpers ────────────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function isShinyBag(name: string): boolean {
  const n = name.toLowerCase();
  return n.includes("shiny") || n.includes("holographic");
}

function deepCloneRect(rect: LabelRect): LabelRect {
  return {
    topLeft: { ...rect.topLeft },
    topRight: { ...rect.topRight },
    bottomLeft: { ...rect.bottomLeft },
    bottomRight: { ...rect.bottomRight },
  };
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function midpoint(a: Point, b: Point): Point {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function pointInQuad(p: Point, tl: Point, tr: Point, br: Point, bl: Point): boolean {
  // Cross product sign test for convex quad
  const cross = (o: Point, a: Point, b: Point) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const d1 = cross(tl, tr, p);
  const d2 = cross(tr, br, p);
  const d3 = cross(br, bl, p);
  const d4 = cross(bl, tl, p);
  const hasNeg = (d1 < 0) || (d2 < 0) || (d3 < 0) || (d4 < 0);
  const hasPos = (d1 > 0) || (d2 > 0) || (d3 > 0) || (d4 > 0);
  return !(hasNeg && hasPos);
}

// Smoothstep for brush falloff
function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}


// ── Component ──────────────────────────────────────────────────────────

export function MapLabelZoneClient() {
  const [bagColours, setBagColours] = useState<BagColour[]>([]);
  const [selectedBag, setSelectedBag] = useState<string>("");
  const [bagImg, setBagImg] = useState<HTMLImageElement | null>(null);
  const [toolMode, setToolMode] = useState<ToolMode>("rect");
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Label rect state (shared across all bags)
  const [labelRect, setLabelRect] = useState<LabelRect>(() => deepCloneRect(SHARED_LABEL_RECT));

  // Warp canvas (shared, 256x256, #808080 = neutral)
  const warpCanvasRef = useRef<HTMLCanvasElement | null>(null);
  if (typeof document !== "undefined" && !warpCanvasRef.current) {
    warpCanvasRef.current = createNeutralWarpCanvas();
  }
  const warpHistoryRef = useRef<ImageData[]>([]);
  const [warpVersion, setWarpVersion] = useState(0);

  // Lighting canvas (shared dodge/burn map, 256x256, #808080 = neutral)
  const lightingCanvasRef = useRef<HTMLCanvasElement | null>(null);
  if (typeof document !== "undefined" && !lightingCanvasRef.current) {
    lightingCanvasRef.current = createNeutralLightingCanvas();
  }
  const lightingHistoryRef = useRef<ImageData[]>([]);
  const [lightingVersion, setLightingVersion] = useState(0);

  // Per-bag label opacity
  const [perBagOpacity, setPerBagOpacity] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    for (const [name, cfg] of Object.entries(BAG_MOCKUP_CONFIG)) {
      initial[name] = cfg.labelOpacity;
    }
    return initial;
  });

  // Warp brush settings
  const [warpBrushSize, setWarpBrushSize] = useState(25);
  const [warpBrushStrength, setWarpBrushStrength] = useState(15);

  // Lighting brush settings
  const [brushMode, setBrushMode] = useState<BrushMode>("burn");
  const [brushSize, setBrushSize] = useState(30);
  const [brushOpacity, setBrushOpacity] = useState(15);
  const [lightingPreviewOpacity, setLightingPreviewOpacity] = useState(60);

  // Painting state
  const isPaintingRef = useRef(false);
  const lastWarpPosRef = useRef<Point | null>(null);

  // Mouse position for brush cursor
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Rect drag state
  const rectDragRef = useRef<{ target: RectDragTarget; startPos: Point; startRect: LabelRect } | null>(null);

  // HQ image URLs per bag
  const [hqImageUrls, setHqImageUrls] = useState<Record<string, string>>({});
  const hqInputRef = useRef<HTMLInputElement>(null);

  // Test label
  const [testLabelImg, setTestLabelImg] = useState<HTMLImageElement | null>(null);
  const testLabelInputRef = useRef<HTMLInputElement>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Current bag's native image dimensions
  const nativeW = bagImg?.naturalWidth || 900;
  const nativeH = bagImg?.naturalHeight || 900;

  // Ordered list of bags with photos
  const bagsWithPhotos = useMemo(
    () => bagColours.filter((b) => b.bagPhotoUrl),
    [bagColours],
  );

  const currentOpacity = perBagOpacity[selectedBag] ?? 1.0;

  // ── Push current warp state to undo history ──
  const pushWarpHistory = useCallback(() => {
    const wc = warpCanvasRef.current;
    if (!wc) return;
    const ctx = wc.getContext("2d")!;
    const data = ctx.getImageData(0, 0, wc.width, wc.height);
    const hist = warpHistoryRef.current;
    hist.push(data);
    if (hist.length > 30) hist.shift();
  }, []);

  // ── Undo warp ──
  const handleWarpUndo = useCallback(() => {
    const hist = warpHistoryRef.current;
    if (hist.length === 0) return;
    const prev = hist.pop()!;
    const wc = warpCanvasRef.current;
    if (!wc) return;
    const ctx = wc.getContext("2d")!;
    ctx.putImageData(prev, 0, 0);
    setWarpVersion(v => v + 1);
  }, []);

  // ── Clear warp canvas ──
  const handleWarpClear = useCallback(() => {
    pushWarpHistory();
    const wc = warpCanvasRef.current;
    if (!wc) return;
    const ctx = wc.getContext("2d")!;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, wc.width, wc.height);
    setWarpVersion(v => v + 1);
  }, [pushWarpHistory]);

  // ── Push current lighting state to undo history ──
  const pushLightingHistory = useCallback(() => {
    const lc = lightingCanvasRef.current;
    if (!lc) return;
    const ctx = lc.getContext("2d")!;
    const data = ctx.getImageData(0, 0, lc.width, lc.height);
    const hist = lightingHistoryRef.current;
    hist.push(data);
    if (hist.length > 30) hist.shift();
  }, []);

  // ── Undo lighting ──
  const handleLightingUndo = useCallback(() => {
    const hist = lightingHistoryRef.current;
    if (hist.length === 0) return;
    const prev = hist.pop()!;
    const lc = lightingCanvasRef.current;
    if (!lc) return;
    const ctx = lc.getContext("2d")!;
    ctx.putImageData(prev, 0, 0);
    setLightingVersion(v => v + 1);
  }, []);

  // ── Clear lighting canvas ──
  const handleLightingClear = useCallback(() => {
    pushLightingHistory();
    const lc = lightingCanvasRef.current;
    if (!lc) return;
    const ctx = lc.getContext("2d")!;
    ctx.fillStyle = "#808080";
    ctx.fillRect(0, 0, lc.width, lc.height);
    setLightingVersion(v => v + 1);
  }, [pushLightingHistory]);

  // ── Load bag colours from Sanity ──
  useEffect(() => {
    client.fetch<BagColour[]>(bagColoursQuery).then((colours) => {
      setBagColours(colours || []);
      const first = colours?.find((c) => c.bagPhotoUrl);
      if (first) setSelectedBag(first.name);
    });
  }, []);

  // ── Load bag image when selection changes ──
  useEffect(() => {
    const bag = bagColours.find((b) => b.name === selectedBag);
    if (!bag?.bagPhotoUrl && !hqImageUrls[selectedBag]) { setBagImg(null); return; }

    const imgUrl = hqImageUrls[selectedBag] || bag?.bagPhotoUrl;
    if (!imgUrl) { setBagImg(null); return; }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setBagImg(img);
    img.src = imgUrl;
  }, [selectedBag, bagColours, hqImageUrls]);

  // ── Load saved warp & lighting data from config on mount ──
  const hasLoadedSavedData = useRef(false);
  useEffect(() => {
    if (hasLoadedSavedData.current) return;
    // Grab the first bag's config (warp & lighting are shared across all bags)
    const firstEntry = Object.values(BAG_MOCKUP_CONFIG)[0];
    if (!firstEntry) return;
    hasLoadedSavedData.current = true;

    // Load saved warp map
    if (firstEntry.warpMapDataUrl) {
      const warpImg = new Image();
      warpImg.onload = () => {
        const wc = warpCanvasRef.current;
        if (!wc) return;
        const ctx = wc.getContext("2d")!;
        ctx.clearRect(0, 0, wc.width, wc.height);
        ctx.drawImage(warpImg, 0, 0, wc.width, wc.height);
        setWarpVersion(v => v + 1);
      };
      warpImg.src = firstEntry.warpMapDataUrl;
    }

    // Load saved lighting map
    if (firstEntry.lightingMapDataUrl) {
      const lightImg = new Image();
      lightImg.onload = () => {
        const lc = lightingCanvasRef.current;
        if (!lc) return;
        const ctx = lc.getContext("2d")!;
        ctx.clearRect(0, 0, lc.width, lc.height);
        ctx.drawImage(lightImg, 0, 0, lc.width, lc.height);
        setLightingVersion(v => v + 1);
      };
      lightImg.src = firstEntry.lightingMapDataUrl;
    }

    // Restore saved lighting preview opacity
    if (firstEntry.lightingOpacity != null) {
      setLightingPreviewOpacity(Math.round(firstEntry.lightingOpacity * 100));
    }
  }, []);

  // ── HQ image upload ──
  const handleHqImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedBag) return;

    const slug = selectedBag.toLowerCase().replace(/\s+/g, "-");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "bag-images-hq");
    formData.append("filename", `${slug}.png`);

    try {
      const res = await fetch("/api/studio-tools/upload-bag-asset", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const { url } = await res.json();
        setHqImageUrls((prev) => ({ ...prev, [selectedBag]: url }));
      }
    } catch (err) {
      console.error("HQ image upload failed:", err);
    }

    if (hqInputRef.current) hqInputRef.current.value = "";
  }, [selectedBag]);

  // ── Test label upload ──
  const handleTestLabelUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => setTestLabelImg(img);
    img.src = url;
    if (testLabelInputRef.current) testLabelInputRef.current.value = "";
  }, []);

  // ── Paint on the warp canvas (liquify brush) ──
  const warpPaintAtPos = useCallback((percentPos: Point) => {
    const wc = warpCanvasRef.current;
    if (!wc) return;
    const ctx = wc.getContext("2d")!;

    const lastPos = lastWarpPosRef.current;
    if (!lastPos) {
      lastWarpPosRef.current = percentPos;
      return;
    }

    // Direction of drag
    const dx = percentPos.x - lastPos.x;
    const dy = percentPos.y - lastPos.y;
    const dragDist = Math.sqrt(dx * dx + dy * dy);
    if (dragDist < 0.05) return; // too small to register

    // Normalize direction
    const ndx = dx / dragDist;
    const ndy = dy / dragDist;

    // Map percent pos to label zone coords on the warp canvas
    const corners = [labelRect.topLeft, labelRect.topRight, labelRect.bottomLeft, labelRect.bottomRight];
    const lzLeft = Math.min(...corners.map(p => p.x));
    const lzRight = Math.max(...corners.map(p => p.x));
    const lzTop = Math.min(...corners.map(p => p.y));
    const lzBottom = Math.max(...corners.map(p => p.y));
    const lzW = lzRight - lzLeft;
    const lzH = lzBottom - lzTop;
    if (lzW <= 0 || lzH <= 0) return;

    const wcX = ((percentPos.x - lzLeft) / lzW) * wc.width;
    const wcY = ((percentPos.y - lzTop) / lzH) * wc.height;
    const brushR = (warpBrushSize / lzW) * wc.width / 2;

    // Read existing warp data
    const imgData = ctx.getImageData(0, 0, wc.width, wc.height);
    const data = imgData.data;

    // Scale strength
    const strength = (warpBrushStrength / 100) * Math.min(dragDist * 2, 3);

    // Apply displacement in brush radius
    const minX = Math.max(0, Math.floor(wcX - brushR));
    const maxX = Math.min(wc.width - 1, Math.ceil(wcX + brushR));
    const minY = Math.max(0, Math.floor(wcY - brushR));
    const maxY = Math.min(wc.height - 1, Math.ceil(wcY + brushR));

    for (let py = minY; py <= maxY; py++) {
      for (let px = minX; px <= maxX; px++) {
        const pDist = Math.sqrt((px - wcX) ** 2 + (py - wcY) ** 2);
        if (pDist > brushR) continue;

        // Smoothstep falloff
        const falloff = 1 - smoothstep(0, brushR, pDist);
        const amount = strength * falloff;

        const idx = (py * wc.width + px) * 4;
        // R channel = X displacement, G channel = Y displacement
        data[idx] = clamp(data[idx] + ndx * amount * 128, 0, 255);
        data[idx + 1] = clamp(data[idx + 1] + ndy * amount * 128, 0, 255);
      }
    }

    ctx.putImageData(imgData, 0, 0);
    lastWarpPosRef.current = percentPos;
    setWarpVersion(v => v + 1);
  }, [labelRect, warpBrushSize, warpBrushStrength]);

  // ── Paint on the lighting canvas ──
  const paintAtPos = useCallback((percentPos: Point) => {
    const lc = lightingCanvasRef.current;
    if (!lc) return;
    const ctx = lc.getContext("2d")!;

    // Bounding box of label rect in percent coords
    const corners = [labelRect.topLeft, labelRect.topRight, labelRect.bottomLeft, labelRect.bottomRight];
    const lzLeft = Math.min(...corners.map(p => p.x));
    const lzRight = Math.max(...corners.map(p => p.x));
    const lzTop = Math.min(...corners.map(p => p.y));
    const lzBottom = Math.max(...corners.map(p => p.y));
    const lzW = lzRight - lzLeft;
    const lzH = lzBottom - lzTop;

    if (lzW <= 0 || lzH <= 0) return;

    // Convert percent pos to lighting canvas coords
    const lcX = ((percentPos.x - lzLeft) / lzW) * lc.width;
    const lcY = ((percentPos.y - lzTop) / lzH) * lc.height;

    // Scale brush size relative to label zone
    const brushR = (brushSize / lzW) * lc.width / 2;

    // Create a soft radial gradient brush
    ctx.save();

    if (brushMode === "erase") {
      const grad = ctx.createRadialGradient(lcX, lcY, 0, lcX, lcY, brushR);
      grad.addColorStop(0, `rgba(128, 128, 128, ${brushOpacity / 100})`);
      grad.addColorStop(0.7, `rgba(128, 128, 128, ${(brushOpacity / 100) * 0.3})`);
      grad.addColorStop(1, `rgba(128, 128, 128, 0)`);
      ctx.fillStyle = grad;
    } else if (brushMode === "burn") {
      const grad = ctx.createRadialGradient(lcX, lcY, 0, lcX, lcY, brushR);
      grad.addColorStop(0, `rgba(0, 0, 0, ${brushOpacity / 100})`);
      grad.addColorStop(0.7, `rgba(0, 0, 0, ${(brushOpacity / 100) * 0.3})`);
      grad.addColorStop(1, `rgba(0, 0, 0, 0)`);
      ctx.fillStyle = grad;
    } else {
      const grad = ctx.createRadialGradient(lcX, lcY, 0, lcX, lcY, brushR);
      grad.addColorStop(0, `rgba(255, 255, 255, ${brushOpacity / 100})`);
      grad.addColorStop(0.7, `rgba(255, 255, 255, ${(brushOpacity / 100) * 0.3})`);
      grad.addColorStop(1, `rgba(255, 255, 255, 0)`);
      ctx.fillStyle = grad;
    }

    ctx.beginPath();
    ctx.arc(lcX, lcY, brushR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    setLightingVersion(v => v + 1);
  }, [labelRect, brushSize, brushOpacity, brushMode]);

  // ── Canvas drawing ──
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !bagImg) return;

    const imgW = bagImg.naturalWidth;
    const imgH = bagImg.naturalHeight;
    const aspect = imgW / imgH;

    const displayW = Math.min(container.clientWidth, 700);
    const displayH = displayW / aspect;

    // ── Steps 1-3: Bag + label + lighting via shared renderer ──
    if (testLabelImg) {
      renderMockupToCanvas({
        canvas,
        bagImg,
        labelImg: testLabelImg,
        labelRect,
        labelOpacity: perBagOpacity[selectedBag] ?? 1.0,
        warpSource: warpCanvasRef.current,
        lightingSource: lightingCanvasRef.current,
        lightingOpacity: lightingPreviewOpacity / 100,
        maxDisplayWidth: displayW,
      });
    } else {
      // No label — just draw the bag photo with DPR scaling
      const dpr = window.devicePixelRatio || 1;
      canvas.width = displayW * dpr;
      canvas.height = displayH * dpr;
      canvas.style.width = `${displayW}px`;
      canvas.style.height = `${displayH}px`;
      const ctx2 = canvas.getContext("2d");
      if (ctx2) {
        ctx2.scale(dpr, dpr);
        ctx2.drawImage(bagImg, 0, 0, displayW, displayH);
      }
    }

    // The shared renderer leaves ctx.scale(dpr) active for overlay drawing.
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const toPixel = (p: Point) => ({
      x: (p.x / 100) * displayW,
      y: (p.y / 100) * displayH,
    });

    const ptl = toPixel(labelRect.topLeft);
    const ptr = toPixel(labelRect.topRight);
    const pbl = toPixel(labelRect.bottomLeft);
    const pbr = toPixel(labelRect.bottomRight);

    // 4. Rect handles (rect mode only)
    if (toolMode === "rect") {
      // Dashed green outline
      ctx.save();
      ctx.strokeStyle = "rgba(34, 197, 94, 0.8)";
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(ptl.x, ptl.y);
      ctx.lineTo(ptr.x, ptr.y);
      ctx.lineTo(pbr.x, pbr.y);
      ctx.lineTo(pbl.x, pbl.y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Corner handles (green circles)
      const cornerPoints = [
        { p: ptl, key: "topLeft" },
        { p: ptr, key: "topRight" },
        { p: pbl, key: "bottomLeft" },
        { p: pbr, key: "bottomRight" },
      ];
      for (const { p } of cornerPoints) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
        ctx.fillStyle = "#22c55e";
        ctx.fill();
      }

      // Edge midpoint handles (blue circles)
      const edgeMids = [
        midpoint(ptl, ptr),
        midpoint(ptr, pbr),
        midpoint(pbr, pbl),
        midpoint(pbl, ptl),
      ];
      for (const p of edgeMids) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#3b82f6";
        ctx.fill();
      }
    }

    // 5. Brush cursor (warp or lighting mode)
    if ((toolMode === "warp" || toolMode === "lighting") && mousePos) {
      const scaleX = displayW / 100;
      const scaleY = displayH / 100;
      const currentBrushSize = toolMode === "warp" ? warpBrushSize : brushSize;
      const brushR = (currentBrushSize / 2) * Math.min(scaleX, scaleY);
      ctx.save();
      if (toolMode === "warp") {
        ctx.strokeStyle = "rgba(168, 85, 247, 0.8)"; // purple for warp
      } else {
        ctx.strokeStyle = brushMode === "burn" ? "rgba(255,100,100,0.8)" : brushMode === "dodge" ? "rgba(255,255,100,0.8)" : "rgba(100,200,255,0.8)";
      }
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, brushR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Dimension label
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.font = "11px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${imgW}\u00d7${imgH}px`, displayW / 2, displayH - 6);
  }, [bagImg, labelRect, toolMode, testLabelImg, perBagOpacity, selectedBag, lightingVersion, warpVersion, lightingPreviewOpacity, mousePos, brushSize, brushMode, warpBrushSize]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  // ── Canvas coordinate helpers ──
  const getPercentPos = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: round2(((clientX - rect.left) / rect.width) * 100),
      y: round2(((clientY - rect.top) / rect.height) * 100),
    };
  }, []);

  const getDisplayPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // ── Pointer handlers ──
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (toolMode === "lighting") {
      pushLightingHistory();
      isPaintingRef.current = true;
      const pos = getPercentPos(e);
      if (pos) paintAtPos(pos);
      return;
    }

    if (toolMode === "warp") {
      pushWarpHistory();
      isPaintingRef.current = true;
      lastWarpPosRef.current = null;
      const pos = getPercentPos(e);
      if (pos) lastWarpPosRef.current = pos;
      return;
    }

    // Rect mode — determine drag target
    const pos = getPercentPos(e);
    if (!pos) return;

    const cornerThreshold = 3; // % distance
    const edgeThreshold = 2;

    // Check corners first
    const cornerEntries: { key: keyof LabelRect; point: Point }[] = [
      { key: "topLeft", point: labelRect.topLeft },
      { key: "topRight", point: labelRect.topRight },
      { key: "bottomLeft", point: labelRect.bottomLeft },
      { key: "bottomRight", point: labelRect.bottomRight },
    ];
    for (const { key, point } of cornerEntries) {
      if (dist(pos, point) < cornerThreshold) {
        rectDragRef.current = {
          target: { type: "corner", key },
          startPos: pos,
          startRect: deepCloneRect(labelRect),
        };
        return;
      }
    }

    // Check edge midpoints
    const edges: { keys: [keyof LabelRect, keyof LabelRect]; a: Point; b: Point }[] = [
      { keys: ["topLeft", "topRight"], a: labelRect.topLeft, b: labelRect.topRight },
      { keys: ["topRight", "bottomRight"], a: labelRect.topRight, b: labelRect.bottomRight },
      { keys: ["bottomLeft", "bottomRight"], a: labelRect.bottomLeft, b: labelRect.bottomRight },
      { keys: ["topLeft", "bottomLeft"], a: labelRect.topLeft, b: labelRect.bottomLeft },
    ];
    for (const { keys, a, b } of edges) {
      const mid = midpoint(a, b);
      if (dist(pos, mid) < edgeThreshold) {
        rectDragRef.current = {
          target: { type: "edge", keys },
          startPos: pos,
          startRect: deepCloneRect(labelRect),
        };
        return;
      }
    }

    // Check if inside the rectangle body
    if (pointInQuad(pos, labelRect.topLeft, labelRect.topRight, labelRect.bottomRight, labelRect.bottomLeft)) {
      rectDragRef.current = {
        target: { type: "body" },
        startPos: pos,
        startRect: deepCloneRect(labelRect),
      };
    }
  }, [toolMode, getPercentPos, labelRect, pushLightingHistory, paintAtPos, pushWarpHistory]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (toolMode === "lighting") {
      const displayPos = getDisplayPos(e);
      if (displayPos) setMousePos(displayPos);
      if (isPaintingRef.current) {
        const pos = getPercentPos(e);
        if (pos) paintAtPos(pos);
      }
      return;
    }

    if (toolMode === "warp") {
      const displayPos = getDisplayPos(e);
      if (displayPos) setMousePos(displayPos);
      if (isPaintingRef.current) {
        const pos = getPercentPos(e);
        if (pos) warpPaintAtPos(pos);
      }
      return;
    }

    if (toolMode === "rect" && rectDragRef.current) {
      const pos = getPercentPos(e);
      if (!pos) return;
      const { target, startPos, startRect } = rectDragRef.current;
      const dx = pos.x - startPos.x;
      const dy = pos.y - startPos.y;

      setLabelRect(() => {
        const next = deepCloneRect(startRect);
        if (target.type === "corner") {
          next[target.key] = {
            x: round2(clamp(startRect[target.key].x + dx, 0, 100)),
            y: round2(clamp(startRect[target.key].y + dy, 0, 100)),
          };
        } else if (target.type === "edge") {
          for (const key of target.keys) {
            next[key] = {
              x: round2(clamp(startRect[key].x + dx, 0, 100)),
              y: round2(clamp(startRect[key].y + dy, 0, 100)),
            };
          }
        } else {
          // Body — move all corners
          const keys: (keyof LabelRect)[] = ["topLeft", "topRight", "bottomLeft", "bottomRight"];
          for (const key of keys) {
            next[key] = {
              x: round2(clamp(startRect[key].x + dx, 0, 100)),
              y: round2(clamp(startRect[key].y + dy, 0, 100)),
            };
          }
        }
        return next;
      });
    }
  }, [toolMode, getPercentPos, getDisplayPos, paintAtPos, warpPaintAtPos]);

  const handlePointerUp = useCallback(() => {
    rectDragRef.current = null;
    isPaintingRef.current = false;
    lastWarpPosRef.current = null;
  }, []);

  const handleMouseLeave = useCallback(() => {
    rectDragRef.current = null;
    isPaintingRef.current = false;
    lastWarpPosRef.current = null;
    setMousePos(null);
  }, []);

  // ── Keyboard handlers ──
  const handleCanvasKeyDown = useCallback((e: React.KeyboardEvent) => {
    // Ctrl/Cmd+Z = undo
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      if (toolMode === "lighting") handleLightingUndo();
      if (toolMode === "warp") handleWarpUndo();
      return;
    }
  }, [toolMode, handleLightingUndo, handleWarpUndo]);

  // ── Build bag list for save ──
  const buildBagList = useCallback(() => {
    return bagColours
      .filter((bag) => bag.bagPhotoUrl)
      .map((bag) => {
        const cfg = BAG_MOCKUP_CONFIG[bag.name];
        const shiny = cfg ? cfg.isShiny : isShinyBag(bag.name);
        return {
          name: bag.name,
          isShiny: shiny,
          labelOpacity: perBagOpacity[bag.name] ?? 1.0,
          ...(cfg?.specularOpacity != null && { specularOpacity: cfg.specularOpacity }),
        };
      });
  }, [bagColours, perBagOpacity]);

  // ── Get warp map as data URL ──
  const getWarpDataUrl = useCallback((): string | undefined => {
    const wc = warpCanvasRef.current;
    if (!wc) return undefined;
    const ctx = wc.getContext("2d")!;
    const data = ctx.getImageData(0, 0, wc.width, wc.height);
    // Check if it's all neutral grey (#808080)
    let isNeutral = true;
    for (let i = 0; i < data.data.length; i += 4) {
      if (data.data[i] !== 128 || data.data[i + 1] !== 128) {
        isNeutral = false;
        break;
      }
    }
    if (isNeutral) return undefined;
    return wc.toDataURL("image/png");
  }, []);

  // ── Get lighting map as data URL ──
  const getLightingDataUrl = useCallback((): string | undefined => {
    const lc = lightingCanvasRef.current;
    if (!lc) return undefined;
    const ctx = lc.getContext("2d")!;
    const data = ctx.getImageData(0, 0, lc.width, lc.height);
    let isNeutral = true;
    for (let i = 0; i < data.data.length; i += 4) {
      if (data.data[i] !== 128 || data.data[i + 1] !== 128 || data.data[i + 2] !== 128) {
        isNeutral = false;
        break;
      }
    }
    if (isNeutral) return undefined;
    return lc.toDataURL("image/png");
  }, []);

  // ── Save (shared logic) ──
  const doSave = async (statusLabel: string) => {
    setSaving(true);
    setSaveStatus(null);
    try {
      setSaveStatus("Saving config file...");
      const res = await fetch("/api/studio-tools/save-bag-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          labelRect,
          warpMapDataUrl: getWarpDataUrl(),
          lightingMapDataUrl: getLightingDataUrl(),
          lightingOpacity: lightingPreviewOpacity / 100,
          bags: buildBagList(),
        }),
      });
      if (res.ok) {
        setSaveStatus(statusLabel);
      } else {
        const data = await res.json();
        setSaveStatus(`Error: ${data.error || res.statusText}`);
      }
    } catch (err) {
      setSaveStatus(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleSaveAll = () => doSave("Saved all bags to bagMockupConfig.ts");
  const handleSaveSingle = () => doSave(`Saved "${selectedBag}" config`);

  // ── Copy opacity to all ──
  const handleCopyOpacityToAll = useCallback(() => {
    const val = perBagOpacity[selectedBag] ?? 1.0;
    setPerBagOpacity(prev => {
      const next = { ...prev };
      for (const bag of bagsWithPhotos) {
        next[bag.name] = val;
      }
      return next;
    });
    setSaveStatus(`Copied opacity ${val} to all bags (unsaved)`);
    setTimeout(() => setSaveStatus(null), 2000);
  }, [selectedBag, perBagOpacity, bagsWithPhotos]);

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 px-6 py-4">
        <h1 className="text-xl font-semibold">Label Zone Calibration Tool</h1>
        <p className="text-sm text-neutral-400 mt-1">
          Position the label rectangle, paint warp distortion, then add lighting effects.
        </p>
      </div>

      {/* Mode toolbar */}
      <div className="border-b border-neutral-800 px-6 py-3 flex items-center gap-3">
        <span className="text-xs text-neutral-500 mr-1">Mode:</span>
        <button
          onClick={() => setToolMode("rect")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            toolMode === "rect"
              ? "bg-blue-600 text-white"
              : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={() => { setToolMode("warp"); setMousePos(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            toolMode === "warp"
              ? "bg-purple-600 text-white"
              : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
          }`}
        >
          Warp
        </button>
        <button
          onClick={() => { setToolMode("lighting"); setMousePos(null); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            toolMode === "lighting"
              ? "bg-amber-600 text-white"
              : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
          }`}
        >
          Lighting
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-6">
        {/* ── Left column — Controls ── */}
        <div className="w-full lg:w-[340px] shrink-0 space-y-6">
          {/* Bag selector */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Bag Colour</label>
            <select
              value={selectedBag}
              onChange={(e) => setSelectedBag(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
            >
              {bagColours.map((bag) => (
                <option key={bag._id} value={bag.name}>
                  {bag.name} {bag.bagPhotoUrl ? "" : "(no photo)"}
                </option>
              ))}
            </select>
          </div>

          {/* HQ Image Upload */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">HQ Bag Image</label>
            <input
              ref={hqInputRef}
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleHqImageUpload}
              className="hidden"
            />
            <button
              onClick={() => hqInputRef.current?.click()}
              className="w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-4 py-2 text-sm transition-colors"
            >
              {hqImageUrls[selectedBag] ? "Replace HQ Image" : "Upload HQ Image"}
            </button>
            {hqImageUrls[selectedBag] && (
              <p className="text-[10px] text-green-400 mt-1 truncate">Using HQ image</p>
            )}
          </div>

          {/* Test Label Upload */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Test Label Preview</label>
            <input
              ref={testLabelInputRef}
              type="file"
              accept="image/png"
              onChange={handleTestLabelUpload}
              className="hidden"
            />
            <div className="flex gap-2">
              <button
                onClick={() => testLabelInputRef.current?.click()}
                className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-4 py-2 text-sm transition-colors"
              >
                {testLabelImg ? "Replace Label" : "Upload Test Label"}
              </button>
              {testLabelImg && (
                <button
                  onClick={() => setTestLabelImg(null)}
                  className="bg-neutral-800 hover:bg-red-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Label Opacity */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">
              Label Opacity: {Math.round(currentOpacity * 100)}%
              <span className="text-[10px] text-neutral-500 ml-2">({selectedBag})</span>
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(currentOpacity * 100)}
              onChange={(e) => {
                const val = parseInt(e.target.value) / 100;
                setPerBagOpacity(prev => ({ ...prev, [selectedBag]: round2(val) }));
              }}
              className="w-full accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
            <button
              onClick={handleCopyOpacityToAll}
              className="mt-2 w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs transition-colors"
            >
              Copy opacity to all bags
            </button>
          </div>

          {/* ── Rect mode controls ── */}
          {toolMode === "rect" && (
            <>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Label Size</label>
                <div className="grid grid-cols-2 gap-2">
                  {LABEL_SIZE_PRESETS.map((preset) => {
                    const isActive = matchesPreset(labelRect, preset);
                    return (
                      <button
                        key={preset.label}
                        onClick={() => setLabelRect(buildLabelRectForSize(preset.widthMm, preset.heightMm))}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white"
                            : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setLabelRect(deepCloneRect(SHARED_LABEL_RECT))}
                  className="mt-2 w-full bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs transition-colors"
                >
                  Reset to default (152×102mm)
                </button>
              </div>

              <div className="bg-neutral-900 rounded-lg p-3 border border-blue-800">
                <p className="text-xs text-blue-300 mb-2">Label Rectangle</p>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-neutral-300">
                  <div>TL: ({labelRect.topLeft.x}, {labelRect.topLeft.y})</div>
                  <div>TR: ({labelRect.topRight.x}, {labelRect.topRight.y})</div>
                  <div>BL: ({labelRect.bottomLeft.x}, {labelRect.bottomLeft.y})</div>
                  <div>BR: ({labelRect.bottomRight.x}, {labelRect.bottomRight.y})</div>
                </div>
                <p className="text-[10px] text-neutral-500 mt-2">
                  Drag corners to resize. Drag edges to move a side. Drag inside to move.
                </p>
              </div>
            </>
          )}

          {/* ── Warp mode controls ── */}
          {toolMode === "warp" && (
            <>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Brush Size: {warpBrushSize}
                </label>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={warpBrushSize}
                  onChange={(e) => setWarpBrushSize(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Strength: {warpBrushStrength}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={warpBrushStrength}
                  onChange={(e) => setWarpBrushStrength(parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Click and drag to push the label in the drag direction</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleWarpUndo}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm transition-colors"
                >
                  Undo (Ctrl+Z)
                </button>
                <button
                  onClick={handleWarpClear}
                  className="flex-1 bg-red-900 hover:bg-red-800 border border-red-700 rounded-lg px-4 py-2.5 text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          {/* ── Lighting mode controls ── */}
          {toolMode === "lighting" && (
            <>
              <div>
                <label className="block text-sm text-neutral-400 mb-2">Brush Tool</label>
                <div className="flex gap-2">
                  {([
                    { mode: "burn" as BrushMode, label: "Burn (Darken)", color: "bg-red-600 hover:bg-red-500" },
                    { mode: "dodge" as BrushMode, label: "Dodge (Lighten)", color: "bg-yellow-600 hover:bg-yellow-500" },
                    { mode: "erase" as BrushMode, label: "Erase", color: "bg-cyan-600 hover:bg-cyan-500" },
                  ]).map(({ mode, label, color }) => (
                    <button
                      key={mode}
                      onClick={() => setBrushMode(mode)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        brushMode === mode ? color + " text-white" : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Brush Size: {brushSize}
                </label>
                <input
                  type="range"
                  min={5}
                  max={60}
                  value={brushSize}
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Brush Opacity: {brushOpacity}%
                </label>
                <input
                  type="range"
                  min={1}
                  max={50}
                  value={brushOpacity}
                  onChange={(e) => setBrushOpacity(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1">Low values build up gradually like a sponge</p>
              </div>

              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Lighting Preview: {lightingPreviewOpacity}%
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={lightingPreviewOpacity}
                  onChange={(e) => setLightingPreviewOpacity(parseInt(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleLightingUndo}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm transition-colors"
                >
                  Undo (Ctrl+Z)
                </button>
                <button
                  onClick={handleLightingClear}
                  className="flex-1 bg-red-900 hover:bg-red-800 border border-red-700 rounded-lg px-4 py-2.5 text-sm transition-colors"
                >
                  Clear
                </button>
              </div>
            </>
          )}

          {/* ── Actions ── */}
          <div className="space-y-3">
            <button
              onClick={handleSaveSingle}
              disabled={saving}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {saving ? "Saving\u2026" : `Save "${selectedBag}"`}
            </button>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
            >
              {saving ? "Saving\u2026" : "Save All Bags"}
            </button>
            {saveStatus && (
              <p className={`text-xs text-center ${saveStatus.startsWith("Error") ? "text-red-400" : "text-green-400"}`}>
                {saveStatus}
              </p>
            )}
          </div>

          {/* Quick nav */}
          <div>
            <label className="block text-sm text-neutral-400 mb-2">Quick Nav</label>
            <div className="flex flex-wrap gap-2">
              {bagColours.map((bag) => (
                <button
                  key={bag._id}
                  onClick={() => setSelectedBag(bag.name)}
                  className={`px-3 py-1.5 rounded-md text-xs transition-colors ${
                    selectedBag === bag.name
                      ? "bg-blue-600 text-white"
                      : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                  }`}
                >
                  {bag.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right column — Canvas ── */}
        <div className="flex-1 min-w-0" ref={containerRef}>
          {bagImg ? (
            <canvas
              ref={canvasRef}
              tabIndex={0}
              className={`rounded-lg outline-none focus:ring-2 focus:ring-blue-500/50 ${
                toolMode === "warp" || toolMode === "lighting" ? "cursor-none" : "cursor-crosshair"
              }`}
              style={{ maxWidth: 700 }}
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
              onKeyDown={handleCanvasKeyDown}
            />
          ) : (
            <div className="w-full aspect-square bg-neutral-900 rounded-lg flex items-center justify-center text-neutral-500" style={{ maxWidth: 700 }}>
              {bagColours.length === 0 ? "Loading bags\u2026" : "Select a bag with a photo"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

