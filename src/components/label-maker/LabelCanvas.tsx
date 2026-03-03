"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  type RefObject,
} from "react";
import * as fabric from "fabric";
import {
  mmToPx,
  pxToMm,
  rehydrateFontsOnCanvas,
  type LabelDimensions,
  type ZoomLevel,
} from "./types";
import { useCanvasHistory } from "./useCanvasHistory";
import type { TemplateDefinition, TemplateFabricObject } from "./data/templates";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricAny = any;

/** Helper to access custom data on fabric objects (not typed in v7) */
function getData(obj: fabric.FabricObject): Record<string, unknown> | undefined {
  return (obj as FabricAny).data;
}

function isGuideOrGrid(obj: fabric.FabricObject): boolean {
  const d = getData(obj);
  return !!(d?.isGuide || d?.isGrid);
}

function isSnapLine(obj: fabric.FabricObject): boolean {
  const d = getData(obj);
  return !!d?.isSnapLine;
}

// Colours for guides
const BLEED_COLOUR = "#ef4444"; // red-500
const TRIM_COLOUR = "#3b82f6"; // blue-500
const SAFE_COLOUR = "#22c55e"; // green-500
const SNAP_LINE_COLOUR = "#facc15"; // yellow-400

interface LabelCanvasProps {
  dimensions: LabelDimensions;
  containerRef: RefObject<HTMLDivElement | null>;
}

export function LabelCanvas({
  dimensions,
  containerRef,
}: LabelCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const canvasReadyRef = useRef(false);
  const guidesRef = useRef<fabric.FabricObject[]>([]);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const [guidesVisible, setGuidesVisible] = useState(true);
  const [gridVisible, setGridVisible] = useState(false);
  const gridLinesRef = useRef<fabric.FabricObject[]>([]);
  const gridCreatedRef = useRef(false);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const snapEnabledRef = useRef(true); // ref so the event handler closure always reads current value
  const [zoom, setZoom] = useState<ZoomLevel>("fit");
  const [canUndoState, setCanUndoState] = useState(false);
  const [canRedoState, setCanRedoState] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { saveState, undo, redo, initState, canUndo, canRedo, isProgrammatic } =
    useCanvasHistory();

  // Calculate pixel dimensions (full canvas = trim + bleed on all sides)
  const bleedPx = mmToPx(dimensions.bleedMm);
  const trimW = mmToPx(dimensions.widthMm);
  const trimH = mmToPx(dimensions.heightMm);
  const canvasW = trimW + bleedPx * 2;
  const canvasH = trimH + bleedPx * 2;
  const safeInset = mmToPx(dimensions.safeZoneMm);

  // LocalStorage key (fixed — one label size)
  const storageKey = "gr-label-maker";

  // Debounced save to localStorage
  const scheduleLocalSave = useCallback(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      // Save only non-guide, non-grid, non-snap objects
      const json = canvas.toObject(['data']);
      json.objects = (json.objects as FabricAny[]).filter(
        (obj: FabricAny) => !obj.data?.isGuide && !obj.data?.isGrid && !obj.data?.isSnapLine
      );
      localStorage.setItem(storageKey, JSON.stringify(json));
    }, 1000);
  }, [storageKey]);

  // ─── Create guide lines ───
  // Uses fabric.Line pairs to draw complete rectangles (4 lines each)
  // This avoids the Rect stroke-clipping issue at canvas edges
  const createGuides = useCallback(
    (canvas: fabric.Canvas) => {
      // Remove existing guides
      guidesRef.current.forEach((g) => canvas.remove(g));
      guidesRef.current = [];

      const strokeW = 2;

      const makeLine = (
        x1: number, y1: number, x2: number, y2: number,
        colour: string,
        dashed: boolean,
        guideType: string,
      ) => {
        return new fabric.Line([x1, y1, x2, y2], {
          stroke: colour,
          strokeWidth: strokeW,
          strokeDashArray: dashed ? [8, 5] : undefined,
          strokeUniform: true,
          opacity: 0.9,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          data: { isGuide: true, guideType },
        } as FabricAny);
      };

      const makeRect = (
        left: number, top: number, w: number, h: number,
        colour: string, dashed: boolean, guideType: string,
      ) => {
        return [
          makeLine(left, top, left + w, top, colour, dashed, guideType),         // top
          makeLine(left + w, top, left + w, top + h, colour, dashed, guideType), // right
          makeLine(left + w, top + h, left, top + h, colour, dashed, guideType), // bottom
          makeLine(left, top + h, left, top, colour, dashed, guideType),         // left
        ];
      };

      // Bleed = full canvas edge — red dashed
      const bleedLines = makeRect(0, 0, canvasW, canvasH, BLEED_COLOUR, true, "bleed");

      // Trim = inset by bleed — blue solid
      const trimLines = makeRect(bleedPx, bleedPx, trimW, trimH, TRIM_COLOUR, false, "trim");

      // Safe zone = inset from trim by safeZone — green dashed
      const safeLines = makeRect(
        bleedPx + safeInset, bleedPx + safeInset,
        trimW - safeInset * 2, trimH - safeInset * 2,
        SAFE_COLOUR, true, "safe",
      );

      const allGuides = [...bleedLines, ...trimLines, ...safeLines];
      allGuides.forEach((g) => canvas.add(g));
      guidesRef.current = allGuides;

      // Move guides to top
      allGuides.forEach((g) => canvas.bringObjectToFront(g));
    },
    [canvasW, canvasH, bleedPx, trimW, trimH, safeInset]
  );

  // ─── Create grid lines (5mm intervals across full canvas) ───
  const createGrid = useCallback(
    (canvas: fabric.Canvas) => {
      // Remove existing grid lines
      gridLinesRef.current.forEach((g) => canvas.remove(g));
      gridLinesRef.current = [];

      const gridSpacePx = mmToPx(5); // 5mm grid
      const lines: fabric.FabricObject[] = [];

      // Vertical lines spanning full canvas height
      for (let x = 0; x <= canvasW; x += gridSpacePx) {
        const line = new fabric.Line([x, 0, x, canvasH], {
          stroke: "#94a3b8",
          strokeWidth: 1,
          strokeUniform: true,
          opacity: 0.35,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          data: { isGrid: true },
        } as FabricAny);
        lines.push(line);
      }

      // Horizontal lines spanning full canvas width
      for (let y = 0; y <= canvasH; y += gridSpacePx) {
        const line = new fabric.Line([0, y, canvasW, y], {
          stroke: "#94a3b8",
          strokeWidth: 1,
          strokeUniform: true,
          opacity: 0.35,
          selectable: false,
          evented: false,
          excludeFromExport: true,
          data: { isGrid: true },
        } as FabricAny);
        lines.push(line);
      }

      lines.forEach((l) => canvas.add(l));
      gridLinesRef.current = lines;

      // Send grid to back, then bring guides to front
      lines.forEach((l) => canvas.sendObjectToBack(l));
      guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));

      gridCreatedRef.current = true;
    },
    [canvasW, canvasH]
  );

  // Toggle guides visibility
  const toggleGuides = useCallback(() => {
    const next = !guidesVisible;
    guidesRef.current.forEach((g) => {
      g.visible = next;
    });
    fabricRef.current?.renderAll();
    setGuidesVisible(next);
  }, [guidesVisible]);

  // Toggle grid visibility
  const toggleGrid = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const next = !gridVisible;

    // Lazily create grid on first enable
    if (next && !gridCreatedRef.current) {
      createGrid(canvas);
    }

    gridLinesRef.current.forEach((g) => {
      g.visible = next;
    });
    canvas.renderAll();
    setGridVisible(next);
  }, [gridVisible, createGrid]);

  // Toggle snap on/off
  const toggleSnap = useCallback(() => {
    const next = !snapEnabled;
    snapEnabledRef.current = next;
    setSnapEnabled(next);
    // Clear any existing snap lines when disabling
    if (!next) {
      const canvas = fabricRef.current;
      if (canvas) {
        const toRemove = canvas.getObjects().filter((obj) => isSnapLine(obj));
        toRemove.forEach((obj) => canvas.remove(obj));
        canvas.renderAll();
      }
    }
  }, [snapEnabled]);

  // Calculate zoom to fit container (accounting for rulers + padding)
  const calculateFitZoom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0.4;
    const padding = 40;
    const rulerSize = 24;
    const availW = container.clientWidth - rulerSize - padding * 2;
    const availH = container.clientHeight - rulerSize - padding * 2;
    if (availW <= 0 || availH <= 0) return 0.3;
    const scaleX = availW / canvasW;
    const scaleY = availH / canvasH;
    return Math.min(scaleX, scaleY, 1);
  }, [containerRef, canvasW, canvasH]);

  // Apply zoom level
  const applyZoom = useCallback(
    (level: ZoomLevel) => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      let scale: number;
      if (level === "fit") {
        scale = calculateFitZoom();
      } else {
        scale = level / 100;
      }
      canvas.setZoom(scale);
      canvas.setDimensions({
        width: canvasW * scale,
        height: canvasH * scale,
      });
      canvas.renderAll();
      setZoom(level);
    },
    [calculateFitZoom, canvasW, canvasH]
  );

  // Update undo/redo button states
  const updateHistoryState = useCallback(() => {
    setCanUndoState(canUndo());
    setCanRedoState(canRedo());
  }, [canUndo, canRedo]);

  // Handle canvas object modifications for history
  const onCanvasModified = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas || isProgrammatic.current) return;
    saveState(canvas);
    updateHistoryState();
    scheduleLocalSave();
  }, [saveState, updateHistoryState, scheduleLocalSave, isProgrammatic]);

  // Clear canvas and start fresh
  const startFresh = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    // Remove all non-guide, non-grid objects
    const toRemove = canvas
      .getObjects()
      .filter((obj) => !isGuideOrGrid(obj) && !isSnapLine(obj));
    toRemove.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
    localStorage.removeItem(storageKey);
    initState(canvas);
    updateHistoryState();
  }, [storageKey, initState, updateHistoryState]);

  // ─── Initialise Fabric canvas ───
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || fabricRef.current) return;

    const canvas = new fabric.Canvas(el, {
      width: canvasW,
      height: canvasH,
      backgroundColor: "#ffffff",
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;

    // Try to restore from localStorage
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        canvas.loadFromJSON(parsed).then(async () => {
          createGuides(canvas);
          canvas.renderAll();
          await rehydrateFontsOnCanvas(canvas);
          initState(canvas);
          canvasReadyRef.current = true;
          // Slight delay to ensure container is measured
          requestAnimationFrame(() => applyZoom("fit"));
        });
      } catch {
        createGuides(canvas);
        initState(canvas);
        canvasReadyRef.current = true;
        requestAnimationFrame(() => applyZoom("fit"));
      }
    } else {
      createGuides(canvas);
      initState(canvas);
      canvasReadyRef.current = true;
      requestAnimationFrame(() => applyZoom("fit"));
    }

    // Listen for modifications
    canvas.on("object:modified", onCanvasModified);
    canvas.on("object:added", (e) => {
      if (e.target && !isGuideOrGrid(e.target) && !isSnapLine(e.target)) {
        onCanvasModified();
      }
    });
    canvas.on("object:removed", (e) => {
      if (e.target && !isGuideOrGrid(e.target) && !isSnapLine(e.target)) {
        onCanvasModified();
      }
    });

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if typing in an input
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const activeObj = canvas.getActiveObject();

      // Delete / Backspace — remove selected object
      if ((e.key === "Delete" || e.key === "Backspace") && activeObj) {
        if (isGuideOrGrid(activeObj)) return;
        canvas.remove(activeObj);
        canvas.discardActiveObject();
        canvas.renderAll();
        return;
      }

      // Arrow keys — nudge 1mm
      const nudge = mmToPx(1);
      if (activeObj && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const shift = e.shiftKey ? nudge * 10 : nudge;
        switch (e.key) {
          case "ArrowUp":
            activeObj.top = (activeObj.top ?? 0) - shift;
            break;
          case "ArrowDown":
            activeObj.top = (activeObj.top ?? 0) + shift;
            break;
          case "ArrowLeft":
            activeObj.left = (activeObj.left ?? 0) - shift;
            break;
          case "ArrowRight":
            activeObj.left = (activeObj.left ?? 0) + shift;
            break;
        }
        activeObj.setCoords();
        canvas.renderAll();
        onCanvasModified();
        return;
      }

      // Ctrl+Z / Cmd+Z — undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo(canvas);
        updateHistoryState();
        scheduleLocalSave();
        return;
      }

      // Ctrl+Y / Cmd+Shift+Z — redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        redo(canvas);
        updateHistoryState();
        scheduleLocalSave();
        return;
      }

      // Ctrl+D / Cmd+D — duplicate selected
      if ((e.ctrlKey || e.metaKey) && e.key === "d") {
        e.preventDefault();
        const active = canvas.getActiveObject();
        if (active && !isGuideOrGrid(active)) {
          active.clone().then((cloned: fabric.FabricObject) => {
            cloned.set({
              left: (active.left ?? 0) + mmToPx(3),
              top: (active.top ?? 0) + mmToPx(3),
            });
            (cloned as FabricAny).data = JSON.parse(JSON.stringify((active as FabricAny).data ?? {}));
            canvas.add(cloned);
            canvas.setActiveObject(cloned);
            guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
            canvas.renderAll();
            onCanvasModified();
          });
        }
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Logo zone click: open file picker when clicking a logo zone placeholder
    // Create a hidden file input for logo uploads
    const logoInput = document.createElement("input");
    logoInput.type = "file";
    logoInput.accept = ".png,.jpg,.jpeg,.svg";
    logoInput.style.display = "none";
    document.body.appendChild(logoInput);
    logoInputRef.current = logoInput;

    canvas.on("mouse:down", (e) => {
      const target = e.target;
      if (!target) return;
      const d = (target as FabricAny).data;
      if (d?.isLogoZone || d?.isLogoZoneLabel) {
        logoInput.click();
      }
    });

    logoInput.addEventListener("change", () => {
      const file = logoInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        // Find and replace logo zone
        const c = fabricRef.current;
        if (!c) return;
        const zone = c.getObjects().find((o) => (o as FabricAny).data?.isLogoZone);
        const label = c.getObjects().find((o) => (o as FabricAny).data?.isLogoZoneLabel);
        if (!zone) return;

        const zLeft = zone.left ?? 0;
        const zTop = zone.top ?? 0;
        const zW = (zone.width ?? 100) * (zone.scaleX ?? 1);
        const zH = (zone.height ?? 100) * (zone.scaleY ?? 1);
        const zOriginX = (zone as FabricAny).originX ?? "left";
        const zOriginY = (zone as FabricAny).originY ?? "top";

        c.remove(zone);
        if (label) c.remove(label);

        const imgEl = new Image();
        imgEl.onload = () => {
          const fabricImg = new fabric.FabricImage(imgEl, {
            left: zLeft,
            top: zTop,
            originX: zOriginX,
            originY: zOriginY,
            data: { elementType: "image", isLogo: true },
          } as FabricAny);
          const scaleX = zW / (fabricImg.width ?? 1);
          const scaleY = zH / (fabricImg.height ?? 1);
          fabricImg.scaleX = Math.min(scaleX, scaleY);
          fabricImg.scaleY = Math.min(scaleX, scaleY);
          c.add(fabricImg);
          c.setActiveObject(fabricImg);
          guidesRef.current.forEach((g) => c.bringObjectToFront(g));
          c.renderAll();
          onCanvasModified();
        };
        imgEl.src = dataUrl;
      };
      reader.readAsDataURL(file);
      logoInput.value = "";
    });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (logoInputRef.current) {
        document.body.removeChild(logoInputRef.current);
        logoInputRef.current = null;
      }
      canvas.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Object snapping ───
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const activeSnapLines: fabric.Line[] = [];

    const clearSnapLines = () => {
      activeSnapLines.forEach((l) => {
        try { canvas.remove(l); } catch { /* ignore */ }
      });
      activeSnapLines.length = 0;
    };

    const addSnapLine = (x1: number, y1: number, x2: number, y2: number) => {
      const line = new fabric.Line([x1, y1, x2, y2], {
        stroke: SNAP_LINE_COLOUR,
        strokeWidth: 2,
        strokeUniform: true,
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { isSnapLine: true },
      } as FabricAny);
      canvas.add(line);
      activeSnapLines.push(line);
    };

    const handleMoving = (e: { target: fabric.FabricObject }) => {
      const obj = e.target;
      if (isGuideOrGrid(obj) || isSnapLine(obj)) return;

      clearSnapLines();

      // If snap is disabled, do nothing
      if (!snapEnabledRef.current) return;

      // 3px screen threshold, adjusted for zoom
      const zoomScale = canvas.getZoom();
      const threshold = 3 / zoomScale;

      const objLeft = obj.left ?? 0;
      const objTop = obj.top ?? 0;
      const objW = (obj.width ?? 0) * (obj.scaleX ?? 1);
      const objH = (obj.height ?? 0) * (obj.scaleY ?? 1);
      const objRight = objLeft + objW;
      const objBottom = objTop + objH;
      const objCenterX = objLeft + objW / 2;
      const objCenterY = objTop + objH / 2;

      // Snap targets: guide lines + canvas centre
      const snapTargetsX: number[] = [
        0,                                 // bleed left
        canvasW,                           // bleed right
        bleedPx,                           // trim left
        bleedPx + trimW,                   // trim right
        bleedPx + safeInset,              // safe left
        bleedPx + trimW - safeInset,      // safe right
        canvasW / 2,                       // canvas centre X
      ];
      const snapTargetsY: number[] = [
        0,                                 // bleed top
        canvasH,                           // bleed bottom
        bleedPx,                           // trim top
        bleedPx + trimH,                  // trim bottom
        bleedPx + safeInset,              // safe top
        bleedPx + trimH - safeInset,      // safe bottom
        canvasH / 2,                       // canvas centre Y
      ];

      // Add grid snap targets when grid is visible
      if (gridCreatedRef.current && gridLinesRef.current.length > 0 && gridLinesRef.current[0]?.visible !== false) {
        const gridSpacePx = mmToPx(5);
        for (let x = 0; x <= canvasW; x += gridSpacePx) {
          snapTargetsX.push(x);
        }
        for (let y = 0; y <= canvasH; y += gridSpacePx) {
          snapTargetsY.push(y);
        }
      }

      // Other objects as snap targets (edges and centres)
      canvas.getObjects().forEach((other) => {
        if (other === obj || isGuideOrGrid(other) || isSnapLine(other)) return;
        const oL = other.left ?? 0;
        const oT = other.top ?? 0;
        const oW = (other.width ?? 0) * (other.scaleX ?? 1);
        const oH = (other.height ?? 0) * (other.scaleY ?? 1);
        snapTargetsX.push(oL, oL + oW, oL + oW / 2);
        snapTargetsY.push(oT, oT + oH, oT + oH / 2);
      });

      // De-duplicate
      const uniqueX = [...new Set(snapTargetsX)];
      const uniqueY = [...new Set(snapTargetsY)];

      // Snap X
      let snappedX = false;
      const xEdges = [
        { edge: objLeft, offset: 0 },
        { edge: objRight, offset: -objW },
        { edge: objCenterX, offset: -objW / 2 },
      ];
      for (const { edge, offset } of xEdges) {
        if (snappedX) break;
        for (const target of uniqueX) {
          if (Math.abs(edge - target) < threshold) {
            obj.left = target + offset;
            addSnapLine(target, 0, target, canvasH);
            snappedX = true;
            break;
          }
        }
      }

      // Snap Y
      let snappedY = false;
      const yEdges = [
        { edge: objTop, offset: 0 },
        { edge: objBottom, offset: -objH },
        { edge: objCenterY, offset: -objH / 2 },
      ];
      for (const { edge, offset } of yEdges) {
        if (snappedY) break;
        for (const target of uniqueY) {
          if (Math.abs(edge - target) < threshold) {
            obj.top = target + offset;
            addSnapLine(0, target, canvasW, target);
            snappedY = true;
            break;
          }
        }
      }

      obj.setCoords();
    };

    const handleModified = () => {
      clearSnapLines();
    };

    canvas.on("object:moving", handleMoving as FabricAny);
    canvas.on("object:modified", handleModified);

    return () => {
      canvas.off("object:moving", handleMoving as FabricAny);
      canvas.off("object:modified", handleModified);
      clearSnapLines();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Phase B: Add text to canvas ───
  const addText = useCallback(
    (
      preset: "heading" | "subheading" | "body" | "label",
      options?: { text?: string; fontFamily?: string }
    ) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const presets = {
        heading: {
          text: "HEADING",
          fontSize: mmToPx(8),
          fontWeight: "bold",
          fontFamily: "Figtree",
        },
        subheading: {
          text: "Subheading",
          fontSize: mmToPx(5),
          fontWeight: "600",
          fontFamily: "Figtree",
        },
        body: {
          text: "Body text goes here",
          fontSize: mmToPx(3),
          fontWeight: "normal",
          fontFamily: "Inter",
        },
        label: {
          text: "LABEL",
          fontSize: mmToPx(2.5),
          fontWeight: "bold",
          fontFamily: "Inter",
        },
      };

      const p = presets[preset];
      const textObj = new fabric.Textbox(options?.text ?? p.text, {
        left: bleedPx + trimW / 2,
        top: bleedPx + trimH / 2,
        originX: "center",
        originY: "center",
        fontSize: p.fontSize,
        fontWeight: p.fontWeight,
        fontFamily: options?.fontFamily ?? p.fontFamily,
        fill: "#000000",
        textAlign: "center",
        width: trimW * 0.8,
        editable: true,
        data: { elementType: "text", preset },
      });

      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      // Keep guides on top
      guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
      canvas.renderAll();
    },
    [bleedPx, trimW, trimH]
  );

  // ─── Phase B: Add label field shortcut ───
  const addLabelField = useCallback(
    (fieldName: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const fieldDefaults: Record<string, { text: string; fontSize: number }> = {
        "Roaster Name": { text: "YOUR ROASTERY", fontSize: mmToPx(7) },
        "Coffee Name": { text: "Coffee Blend Name", fontSize: mmToPx(5) },
        "Origin": { text: "Single Origin — Ethiopia", fontSize: mmToPx(3) },
        "Weight": { text: "250g", fontSize: mmToPx(4) },
        "Roast Level": { text: "Medium Roast", fontSize: mmToPx(3) },
        "Tasting Notes": { text: "Chocolate • Berry • Citrus", fontSize: mmToPx(2.5) },
        "Description": { text: "A smooth, full-bodied coffee with notes of...", fontSize: mmToPx(2.5) },
      };

      const defaults = fieldDefaults[fieldName] ?? { text: fieldName, fontSize: mmToPx(3) };

      const textObj = new fabric.Textbox(defaults.text, {
        left: bleedPx + trimW / 2,
        top: bleedPx + trimH / 2,
        originX: "center",
        originY: "center",
        fontSize: defaults.fontSize,
        fontWeight: fieldName === "Roaster Name" ? "bold" : "normal",
        fontFamily: fieldName === "Roaster Name" ? "Figtree" : "Inter",
        fill: "#000000",
        textAlign: "center",
        width: trimW * 0.8,
        editable: true,
        data: { elementType: "text", fieldName },
      });

      canvas.add(textObj);
      canvas.setActiveObject(textObj);
      guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
      canvas.renderAll();
    },
    [bleedPx, trimW, trimH]
  );

  // ─── Phase B: Add SVG element ───
  const addSvgElement = useCallback(
    (svgMarkup: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      fabric.loadSVGFromString(svgMarkup).then((result) => {
        if (!result.objects || result.objects.length === 0) return;
        const group = fabric.util.groupSVGElements(
          result.objects.filter(Boolean) as fabric.FabricObject[],
          result.options
        );

        // Scale to fit ~20mm
        const targetSize = mmToPx(20);
        const maxDim = Math.max(group.width ?? 1, group.height ?? 1);
        const scale = targetSize / maxDim;
        group.scaleX = scale;
        group.scaleY = scale;

        group.set({
          left: bleedPx + trimW / 2,
          top: bleedPx + trimH / 2,
          originX: "center",
          originY: "center",
          data: { elementType: "svg" },
        } as FabricAny);

        canvas.add(group);
        canvas.setActiveObject(group);
        guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
        canvas.renderAll();
      });
    },
    [bleedPx, trimW, trimH]
  );

  // ─── Phase B: Add uploaded image ───
  const addImage = useCallback(
    (dataUrl: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const imgEl = new Image();
      imgEl.onload = () => {
        const fabricImg = new fabric.FabricImage(imgEl, {
          left: bleedPx + trimW / 2,
          top: bleedPx + trimH / 2,
          originX: "center",
          originY: "center",
          data: { elementType: "image" },
        } as FabricAny);

        // Scale to fit within trim area (max 80%)
        const maxW = trimW * 0.8;
        const maxH = trimH * 0.8;
        const scaleX = maxW / (fabricImg.width ?? 1);
        const scaleY = maxH / (fabricImg.height ?? 1);
        const scale = Math.min(scaleX, scaleY, 1);
        fabricImg.scaleX = scale;
        fabricImg.scaleY = scale;

        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
        canvas.renderAll();
      };
      imgEl.src = dataUrl;
    },
    [bleedPx, trimW, trimH]
  );

  // ─── Phase B: Load template ───
  const loadTemplate = useCallback(
    (canvasJSON: string | object) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Remove all non-guide, non-grid objects first
      const toRemove = canvas
        .getObjects()
        .filter((obj) => !isGuideOrGrid(obj) && !isSnapLine(obj));
      toRemove.forEach((obj) => canvas.remove(obj));

      try {
        const parsed = typeof canvasJSON === "string" ? JSON.parse(canvasJSON) : canvasJSON;
        isProgrammatic.current = true;
        canvas.loadFromJSON(parsed).then(async () => {
          createGuides(canvas);
          // Re-create grid if it was visible
          if (gridVisible && gridCreatedRef.current) {
            createGrid(canvas);
            gridLinesRef.current.forEach((g) => { g.visible = true; });
          }
          canvas.renderAll();
          await rehydrateFontsOnCanvas(canvas);
          isProgrammatic.current = false;
          saveState(canvas);
          updateHistoryState();
          scheduleLocalSave();
        });
      } catch {
        // If JSON is invalid, just re-add guides
        createGuides(canvas);
        canvas.renderAll();
      }
    },
    [createGuides, createGrid, gridVisible, saveState, updateHistoryState, scheduleLocalSave, isProgrammatic]
  );

  // ─── Apply template from TemplateDefinition ───
  // Converts template objects to a Fabric.js-compatible JSON and uses loadFromJSON
  // which reliably renders all object types including text.
  const applyTemplate = useCallback(
    (template: TemplateDefinition) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Remove all non-guide, non-grid objects
      const toRemove = canvas
        .getObjects()
        .filter((obj) => !isGuideOrGrid(obj) && !isSnapLine(obj));
      toRemove.forEach((obj) => canvas.remove(obj));

      // Build a Fabric.js-compatible JSON from the template definition
      const fabricObjects = template.objects.map((config) => {
        // Common properties shared by all types
        const base: FabricAny = {
          type: config.type === "textbox" ? "Textbox" :
                config.type === "rect" ? "Rect" :
                config.type === "line" ? "Line" :
                config.type === "circle" ? "Circle" :
                config.type === "ellipse" ? "Ellipse" :
                config.type === "polygon" ? "Polygon" :
                config.type,
          left: config.left,
          top: config.top,
          originX: config.originX ?? "left",
          originY: config.originY ?? "top",
          angle: config.angle ?? 0,
          opacity: config.opacity ?? 1,
          fill: config.fill ?? "#000000",
          stroke: config.stroke ?? null,
          strokeWidth: config.strokeWidth ?? (config.stroke ? 1 : 0),
          strokeDashArray: config.strokeDashArray ?? null,
          selectable: config.selectable !== false,
          evented: config.evented !== false,
          data: config.data,
        };

        switch (config.type) {
          case "textbox":
            return {
              ...base,
              text: config.text ?? "",
              width: config.width ?? trimW * 0.8,
              fontSize: config.fontSize ?? mmToPx(3),
              fontFamily: config.fontFamily ?? "Inter",
              fontWeight: config.fontWeight ?? "normal",
              fontStyle: config.fontStyle ?? "normal",
              textAlign: config.textAlign ?? "left",
              charSpacing: config.charSpacing ?? 0,
              lineHeight: config.lineHeight ?? 1.16,
              editable: config.selectable !== false,
            };
          case "rect":
            return {
              ...base,
              width: config.width ?? 100,
              height: config.height ?? 100,
              rx: config.rx ?? 0,
              ry: config.ry ?? 0,
            };
          case "line": {
            const x1 = config.left;
            const y1 = config.top;
            const x2 = x1 + (config.width ?? 100);
            const y2 = y1 + (config.height ?? 0);
            return {
              ...base,
              x1, y1, x2, y2,
              stroke: config.stroke ?? config.fill ?? "#000000",
              strokeWidth: config.strokeWidth ?? 1,
              strokeLineCap: config.strokeLineCap ?? "butt",
            };
          }
          case "circle":
            return {
              ...base,
              radius: config.radius ?? 50,
            };
          case "ellipse":
            return {
              ...base,
              rx: config.rx ?? 50,
              ry: config.ry ?? 50,
            };
          case "polygon":
            return {
              ...base,
              points: config.points ?? [],
            };
          default:
            return base;
        }
      });

      const canvasJSON = {
        version: "6.0.0",
        objects: fabricObjects,
        background: template.backgroundColor,
      };

      isProgrammatic.current = true;
      canvas.loadFromJSON(canvasJSON).then(async () => {
        createGuides(canvas);
        if (gridVisible && gridCreatedRef.current) {
          createGrid(canvas);
          gridLinesRef.current.forEach((g) => { g.visible = true; });
        }
        canvas.renderAll();
        await rehydrateFontsOnCanvas(canvas);
        isProgrammatic.current = false;
        saveState(canvas);
        updateHistoryState();
        scheduleLocalSave();
      });
    },
    [trimW, isProgrammatic, saveState, updateHistoryState, scheduleLocalSave, createGuides, createGrid, gridVisible]
  );

  // ─── Logo zone: replace placeholder with uploaded image ───
  const replaceLogoZone = useCallback(
    (dataUrl: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Find the logo zone rect and label
      const logoZoneRect = canvas.getObjects().find(
        (obj) => (obj as FabricAny).data?.isLogoZone
      );
      const logoZoneLabel = canvas.getObjects().find(
        (obj) => (obj as FabricAny).data?.isLogoZoneLabel
      );

      if (!logoZoneRect) {
        // No logo zone, just add as regular image
        addImage(dataUrl);
        return;
      }

      const zoneLeft = logoZoneRect.left ?? 0;
      const zoneTop = logoZoneRect.top ?? 0;
      const zoneW = (logoZoneRect.width ?? 100) * (logoZoneRect.scaleX ?? 1);
      const zoneH = (logoZoneRect.height ?? 100) * (logoZoneRect.scaleY ?? 1);
      const zoneOriginX = (logoZoneRect as FabricAny).originX ?? "left";
      const zoneOriginY = (logoZoneRect as FabricAny).originY ?? "top";

      // Remove the zone rect and label
      canvas.remove(logoZoneRect);
      if (logoZoneLabel) canvas.remove(logoZoneLabel);

      const imgEl = new Image();
      imgEl.onload = () => {
        const fabricImg = new fabric.FabricImage(imgEl, {
          left: zoneLeft,
          top: zoneTop,
          originX: zoneOriginX,
          originY: zoneOriginY,
          data: { elementType: "image", isLogo: true },
        } as FabricAny);

        // Scale to fit within zone bounds while maintaining aspect ratio
        const scaleX = zoneW / (fabricImg.width ?? 1);
        const scaleY = zoneH / (fabricImg.height ?? 1);
        const scale = Math.min(scaleX, scaleY);
        fabricImg.scaleX = scale;
        fabricImg.scaleY = scale;

        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
        canvas.renderAll();
        onCanvasModified();
      };
      imgEl.src = dataUrl;
    },
    [addImage, onCanvasModified]
  );

  // ─── Replace the currently selected image with a new one ───
  const replaceSelectedImage = useCallback(
    (dataUrl: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      const active = canvas.getActiveObject();
      if (!active) return;

      // Read position/size/metadata from the current object
      const oldLeft = active.left ?? 0;
      const oldTop = active.top ?? 0;
      const oldOriginX = (active as FabricAny).originX ?? "left";
      const oldOriginY = (active as FabricAny).originY ?? "top";
      const oldW = (active.width ?? 1) * (active.scaleX ?? 1);
      const oldH = (active.height ?? 1) * (active.scaleY ?? 1);
      const oldData = (active as FabricAny).data
        ? JSON.parse(JSON.stringify((active as FabricAny).data))
        : { elementType: "image" };

      // Remove old object
      canvas.remove(active);
      canvas.discardActiveObject();

      const imgEl = new Image();
      imgEl.onload = () => {
        const fabricImg = new fabric.FabricImage(imgEl, {
          left: oldLeft,
          top: oldTop,
          originX: oldOriginX,
          originY: oldOriginY,
          data: oldData,
        } as FabricAny);

        // Scale to fit within same bounding box (aspect-fit)
        const scaleX = oldW / (fabricImg.width ?? 1);
        const scaleY = oldH / (fabricImg.height ?? 1);
        const scale = Math.min(scaleX, scaleY);
        fabricImg.scaleX = scale;
        fabricImg.scaleY = scale;

        canvas.add(fabricImg);
        canvas.setActiveObject(fabricImg);
        guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
        canvas.renderAll();
        onCanvasModified();
      };
      imgEl.src = dataUrl;
    },
    [onCanvasModified]
  );

  // ─── Get clean canvas JSON (excludes guides/grid/snap) for saving ───
  const getCanvasJson = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    const json = canvas.toObject(['data']);
    json.objects = (json.objects as FabricAny[]).filter(
      (obj: FabricAny) => !obj.data?.isGuide && !obj.data?.isGrid && !obj.data?.isSnapLine
    );
    return JSON.stringify(json);
  }, []);

  // ─── Check if canvas has any user content ───
  const hasContent = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return false;
    return canvas.getObjects().some(
      (obj) => !isGuideOrGrid(obj) && !isSnapLine(obj)
    );
  }, []);

  // ─── Check if there is a logo zone on canvas ───
  const hasLogoZone = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return false;
    return canvas.getObjects().some(
      (obj) => (obj as FabricAny).data?.isLogoZone
    );
  }, []);

  // ─── Duplicate selected object ───
  const duplicateSelected = useCallback(() => {
    const canvas = fabricRef.current;
    const active = canvas?.getActiveObject();
    if (!canvas || !active || isGuideOrGrid(active)) return;

    active.clone().then((cloned: fabric.FabricObject) => {
      cloned.set({
        left: (active.left ?? 0) + mmToPx(3),
        top: (active.top ?? 0) + mmToPx(3),
      });
      // Copy custom data property
      (cloned as FabricAny).data = JSON.parse(JSON.stringify((active as FabricAny).data ?? {}));
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
      canvas.renderAll();
      onCanvasModified();
    });
  }, [onCanvasModified]);

  // ─── Phase B: Layer controls ───
  const bringForward = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj || isGuideOrGrid(obj)) return;
    canvas.bringObjectForward(obj);
    guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
    canvas.renderAll();
    onCanvasModified();
  }, [onCanvasModified]);

  const sendBackward = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj || isGuideOrGrid(obj)) return;
    canvas.sendObjectBackwards(obj);
    canvas.renderAll();
    onCanvasModified();
  }, [onCanvasModified]);

  const bringToFront = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj || isGuideOrGrid(obj)) return;
    canvas.bringObjectToFront(obj);
    guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
    canvas.renderAll();
    onCanvasModified();
  }, [onCanvasModified]);

  const sendToBack = useCallback(() => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj || isGuideOrGrid(obj)) return;
    canvas.sendObjectToBack(obj);
    canvas.renderAll();
    onCanvasModified();
  }, [onCanvasModified]);

  // ─── Phase C: Get canvas as base64 PNG ───
  const getCanvasImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    // Temporarily hide guides, grid, and snap lines for clean capture
    const wasGuidesVisible = guidesRef.current.map((g) => g.visible);
    const wasGridVisible = gridLinesRef.current.map((g) => g.visible);
    guidesRef.current.forEach((g) => { g.visible = false; });
    gridLinesRef.current.forEach((g) => { g.visible = false; });
    // Also hide snap lines
    canvas.getObjects().forEach((obj) => {
      if (isSnapLine(obj)) obj.visible = false;
    });
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1 });
    // Restore visibility
    guidesRef.current.forEach((g, i) => { g.visible = wasGuidesVisible[i] ?? true; });
    gridLinesRef.current.forEach((g, i) => { g.visible = wasGridVisible[i] ?? false; });
    canvas.renderAll();
    return dataUrl;
  }, []);

  // ─── Phase C: Get trim-only image (excluding bleed) as base64 PNG ───
  // Returns only the 94×140mm trim area (1110×1654px) for bag mockup preview.
  const getTrimImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;

    // Save current zoom so we can restore it after export
    const prevZoom = canvas.getZoom();
    const prevVpt = canvas.viewportTransform ? [...canvas.viewportTransform] : null;

    // Reset to 1:1 zoom so export coordinates match canvas coordinates exactly
    canvas.setZoom(1);
    canvas.setDimensions({ width: canvasW, height: canvasH });

    // Temporarily hide guides, grid, and snap lines for clean capture
    const wasGuidesVisible = guidesRef.current.map((g) => g.visible);
    const wasGridVisible = gridLinesRef.current.map((g) => g.visible);
    guidesRef.current.forEach((g) => { g.visible = false; });
    gridLinesRef.current.forEach((g) => { g.visible = false; });
    canvas.getObjects().forEach((obj) => {
      if (isSnapLine(obj)) obj.visible = false;
    });
    canvas.discardActiveObject();
    canvas.renderAll();

    // Capture only the trim area at full 300 DPI resolution
    const dataUrl = canvas.toDataURL({
      format: "png",
      multiplier: 1,
      left: bleedPx,
      top: bleedPx,
      width: trimW,
      height: trimH,
    });

    // Restore visibility
    guidesRef.current.forEach((g, i) => { g.visible = wasGuidesVisible[i] ?? true; });
    gridLinesRef.current.forEach((g, i) => { g.visible = wasGridVisible[i] ?? false; });

    // Restore previous zoom
    canvas.setZoom(prevZoom);
    if (prevVpt) canvas.viewportTransform = prevVpt as fabric.TMat2D;
    canvas.setDimensions({ width: canvasW * prevZoom, height: canvasH * prevZoom });
    canvas.renderAll();

    return dataUrl;
  }, [bleedPx, trimW, trimH, canvasW, canvasH]);

  // ─── Phase C: Get first image element as base64 (for logo analysis) ───
  const getLogoImage = useCallback((): string | null => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    const imageObj = canvas.getObjects().find(
      (obj) => !isGuideOrGrid(obj) && ((obj as FabricAny).type === "image")
    );
    if (!imageObj) return null;
    return (imageObj as FabricAny).toDataURL({ format: "png" });
  }, []);

  // ─── Phase C: Add background image (fills entire canvas, sent to back) ───
  const addBackground = useCallback(
    (dataUrl: string) => {
      const canvas = fabricRef.current;
      if (!canvas) return;

      // Remove existing background objects
      const existingBgs = canvas.getObjects().filter(
        (obj) => (obj as FabricAny).data?.isBackground
      );
      existingBgs.forEach((obj) => canvas.remove(obj));

      const imgEl = new Image();
      imgEl.onload = () => {
        const imgW = imgEl.naturalWidth || imgEl.width || 1;
        const imgH = imgEl.naturalHeight || imgEl.height || 1;

        // Scale to cover entire canvas (bleed-to-bleed)
        const scaleX = canvasW / imgW;
        const scaleY = canvasH / imgH;
        const scale = Math.max(scaleX, scaleY);

        const fabricImg = new fabric.FabricImage(imgEl, {
          left: canvasW / 2,
          top: canvasH / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: false,
          evented: false,
          data: { elementType: "image", isBackground: true },
        } as FabricAny);

        canvas.add(fabricImg);
        canvas.sendObjectToBack(fabricImg);
        // Move guides back to top
        guidesRef.current.forEach((g) => canvas.bringObjectToFront(g));
        canvas.renderAll();
        onCanvasModified();
      };
      imgEl.src = dataUrl;
    },
    [canvasW, canvasH, onCanvasModified]
  );

  // ─── Phase C: Apply colour palette to text and SVG elements ───
  const applyPalette = useCallback(
    (colours: string[]) => {
      const canvas = fabricRef.current;
      if (!canvas || colours.length === 0) return;

      const objects = canvas.getObjects().filter(
        (obj) => !isGuideOrGrid(obj) && !(obj as FabricAny).data?.isBackground
      );

      let colourIndex = 0;
      objects.forEach((obj) => {
        const type = (obj as FabricAny).type;
        if (type === "textbox" || type === "i-text" || type === "text") {
          (obj as FabricAny).fill = colours[colourIndex % colours.length];
          colourIndex++;
        } else if (type === "group" || type === "path" || type === "rect" || type === "circle") {
          if ((obj as FabricAny).fill && (obj as FabricAny).fill !== "transparent") {
            (obj as FabricAny).fill = colours[colourIndex % colours.length];
            colourIndex++;
          }
        }
      });

      canvas.renderAll();
      onCanvasModified();
    },
    [onCanvasModified]
  );

  // ─── Phase C: Get element data for print readiness check ───
  const getElementsForCheck = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return [];

    return canvas.getObjects()
      .filter((obj) => !isGuideOrGrid(obj) && !isSnapLine(obj))
      .map((obj) => {
        const data = (obj as FabricAny).data || {};
        const left = obj.left ?? 0;
        const top = obj.top ?? 0;
        const w = (obj.width ?? 0) * (obj.scaleX ?? 1);
        const h = (obj.height ?? 0) * (obj.scaleY ?? 1);
        const type = (obj as FabricAny).type;

        return {
          type: data.elementType || (type === "textbox" || type === "i-text" || type === "text" ? "text" : type === "image" ? "image" : "shape"),
          x: pxToMm(left),
          y: pxToMm(top),
          w: pxToMm(w),
          h: pxToMm(h),
          isBackground: !!data.isBackground,
          dpi: type === "image" ? Math.round((obj.width ?? 1) / ((w / 300) * (25.4 / 300))) : undefined,
          fontSizeMm: (type === "textbox" || type === "i-text" || type === "text")
            ? pxToMm((obj as FabricAny).fontSize ?? 12)
            : undefined,
        };
      });
  }, []);

  // Resize on window resize
  useEffect(() => {
    const handleResize = () => {
      if (zoom === "fit") {
        applyZoom("fit");
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [zoom, applyZoom]);

  // Ruler data
  const totalWMm = dimensions.widthMm + dimensions.bleedMm * 2;
  const totalHMm = dimensions.heightMm + dimensions.bleedMm * 2;

  const currentScale =
    zoom === "fit"
      ? calculateFitZoom()
      : zoom / 100;

  return {
    canvasRef,
    fabricRef,
    canvasReadyRef,
    guidesVisible,
    gridVisible,
    zoom,
    canUndoState,
    canRedoState,
    toggleGuides,
    toggleGrid,
    snapEnabled,
    toggleSnap,
    applyZoom,
    startFresh,
    undo: () => {
      if (fabricRef.current) {
        undo(fabricRef.current);
        updateHistoryState();
        scheduleLocalSave();
      }
    },
    redo: () => {
      if (fabricRef.current) {
        redo(fabricRef.current);
        updateHistoryState();
        scheduleLocalSave();
      }
    },
    dimensions: {
      canvasW,
      canvasH,
      trimW,
      trimH,
      bleedPx,
      safeInset,
    },
    totalWMm,
    totalHMm,
    currentScale,
    storageKey,
    // Phase B
    addText,
    addLabelField,
    addSvgElement,
    addImage,
    loadTemplate,
    applyTemplate,
    replaceLogoZone,
    replaceSelectedImage,
    hasContent,
    hasLogoZone,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    duplicateSelected,
    onCanvasModified,
    // Save / restore
    getCanvasJson,
    // Phase C
    getCanvasImage,
    getTrimImage,
    getLogoImage,
    addBackground,
    applyPalette,
    getElementsForCheck,
  };
}
