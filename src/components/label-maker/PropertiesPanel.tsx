"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import * as fabric from "fabric";
import {
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  FlipHorizontal,
  FlipVertical,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  Bold,
  Italic,
  Underline,
  ChevronDown,
  Image as ImageIcon,
  X,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { pxToMm, mmToPx, FONT_LIBRARY, loadGoogleFont, loadGoogleFontAsync } from "./types";
import { ColourPicker } from "./ColourPicker";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricAny = any;

// ── Types ────────────────────────────────────────────────────────────────

interface PropertiesPanelProps {
  fabricRef: React.RefObject<fabric.Canvas | null>;
  onCanvasModified: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  onDuplicate: () => void;
  onReplaceImage?: (dataUrl: string) => void;
}

type SelectionType = "none" | "single" | "multi";

interface ElementInfo {
  type: "text" | "image" | "svg" | "shape" | "unknown";
  x: number;
  y: number;
  w: number;
  h: number;
  angle: number;
  opacity: number;
  // Text
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string;
  underline?: boolean;
  fill?: string;
  textAlign?: string;
  charSpacing?: number;
  lineHeight?: number;
  // Shape / SVG
  shapeFill?: string;
  shapeSecondary?: string;
  stroke?: string;
  strokeWidth?: number;
  // Image
  flipX?: boolean;
  flipY?: boolean;
}

type GradientDirection = "horizontal" | "vertical" | "diagonal";

interface BackgroundState {
  mode: "solid" | "gradient";
  solidColour: string;
  gradColour1: string;
  gradColour2: string;
  gradDirection: GradientDirection;
  gradStart: number;    // 0–100, where colour1 starts to fade (left handle)
  gradMidpoint: number; // 0–100, where the 50/50 blend sits (middle handle)
  gradEnd: number;      // 0–100, where colour2 becomes fully solid (right handle)
  hasImage: boolean;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function mixColours(hex1: string, hex2: string, t: number): string {
  const parse = (h: string) => {
    const c = h.replace("#", "");
    return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)];
  };
  const [r1, g1, b1] = parse(hex1);
  const [r2, g2, b2] = parse(hex2);
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function getElementType(obj: fabric.FabricObject): ElementInfo["type"] {
  const data = (obj as FabricAny).data;
  const et = data?.elementType;
  if (et === "text" || et === "image" || et === "svg" || et === "shape") return et;
  // Fallback: detect from Fabric object type (v7 uses PascalCase: Textbox, IText, etc.)
  const t = ((obj as FabricAny).type || "").toLowerCase();
  if (t === "textbox" || t === "i-text" || t === "itext" || t === "text") return "text";
  if (t === "image") return "image";
  if (t === "group") return "svg";
  return "shape";
}

function extractInfo(obj: fabric.FabricObject): ElementInfo {
  const type = getElementType(obj);
  const info: ElementInfo = {
    type,
    x: Math.round(pxToMm(obj.left ?? 0) * 10) / 10,
    y: Math.round(pxToMm(obj.top ?? 0) * 10) / 10,
    w: Math.round(pxToMm((obj.width ?? 0) * (obj.scaleX ?? 1)) * 10) / 10,
    h: Math.round(pxToMm((obj.height ?? 0) * (obj.scaleY ?? 1)) * 10) / 10,
    angle: Math.round(obj.angle ?? 0),
    opacity: Math.round((obj.opacity ?? 1) * 100),
  };

  if (type === "text") {
    const t = obj as FabricAny;
    info.fontFamily = t.fontFamily ?? "Inter";
    info.fontSize = Math.round(pxToMm(t.fontSize ?? 12) * 10) / 10;
    info.fontWeight = String(t.fontWeight ?? "normal");
    info.fontStyle = t.fontStyle ?? "normal";
    info.underline = t.underline ?? false;
    info.fill = typeof t.fill === "string" ? t.fill : "#000000";
    info.textAlign = t.textAlign ?? "left";
    info.charSpacing = t.charSpacing ?? 0;
    info.lineHeight = t.lineHeight ?? 1.16;
  }

  if (type === "svg" || type === "shape") {
    const s = obj as FabricAny;
    // For groups (SVGs), detect primary and secondary colours
    if (s._objects?.length) {
      // Collect distinct fill colours (excluding none/transparent)
      const fillColours: string[] = [];
      const strokeColours: string[] = [];
      for (const c of s._objects as FabricAny[]) {
        if (typeof c.fill === "string" && c.fill !== "none" && c.fill !== "transparent") {
          if (!fillColours.includes(c.fill)) fillColours.push(c.fill);
        }
        if (typeof c.stroke === "string" && c.stroke !== "none" && c.stroke !== "transparent") {
          if (!strokeColours.includes(c.stroke)) strokeColours.push(c.stroke);
        }
      }
      // Primary = first fill, or first stroke for stroke-only SVGs
      info.shapeFill = fillColours[0] ?? strokeColours[0] ?? "#000000";
      // Secondary = second distinct fill, or first stroke if primary is a fill, or second stroke
      if (fillColours.length >= 2) {
        info.shapeSecondary = fillColours[1];
      } else if (fillColours.length >= 1 && strokeColours.length >= 1 && strokeColours[0] !== fillColours[0]) {
        info.shapeSecondary = strokeColours[0];
      } else if (strokeColours.length >= 2) {
        info.shapeSecondary = strokeColours[1];
      }
      info.stroke = strokeColours[0] ?? undefined;
      info.strokeWidth = (s._objects as FabricAny[]).find((c: FabricAny) => c.stroke && c.stroke !== "none")?.strokeWidth ?? 0;
    } else {
      info.shapeFill = typeof s.fill === "string" && s.fill !== "transparent" ? s.fill : undefined;
      info.stroke = typeof s.stroke === "string" && s.stroke !== "none" && s.stroke !== "transparent" ? s.stroke : undefined;
      info.strokeWidth = s.strokeWidth ?? 0;
    }
    info.flipX = s.flipX ?? false;
    info.flipY = s.flipY ?? false;
  }

  if (type === "image") {
    info.flipX = obj.flipX ?? false;
    info.flipY = obj.flipY ?? false;
  }

  return info;
}

function readBackgroundState(canvas: fabric.Canvas): BackgroundState {
  const bg = (canvas as FabricAny).backgroundColor;
  const hasImage = canvas.getObjects().some(
    (obj: fabric.FabricObject) => (obj as FabricAny).data?.isBackground
  );

  // Check if background is a gradient object
  if (bg && typeof bg === "object" && (bg as FabricAny).colorStops) {
    const stops = (bg as FabricAny).colorStops as { offset: number; color: string }[];
    const c1 = stops[0]?.color ?? "#ffffff";
    const c2 = stops[stops.length - 1]?.color ?? "#000000";
    // Read start/mid/end from 5-stop format, otherwise default
    let start = 0, midpoint = 50, end = 100;
    if (stops.length === 5) {
      start = Math.round(stops[1].offset * 100);
      midpoint = Math.round(stops[2].offset * 100);
      end = Math.round(stops[3].offset * 100);
    } else if (stops.length === 3) {
      midpoint = Math.round(stops[1].offset * 100);
    }
    const coords = bg as FabricAny;
    let dir: GradientDirection = "horizontal";
    if (coords.x1 === coords.x2 && coords.y1 !== coords.y2) dir = "vertical";
    else if (coords.x1 !== coords.x2 && coords.y1 !== coords.y2) dir = "diagonal";
    return { mode: "gradient", solidColour: "#ffffff", gradColour1: c1, gradColour2: c2, gradDirection: dir, gradStart: start, gradMidpoint: midpoint, gradEnd: end, hasImage };
  }

  const colour = typeof bg === "string" ? bg : "#ffffff";
  return { mode: "solid", solidColour: colour, gradColour1: "#ffffff", gradColour2: "#000000", gradDirection: "vertical", gradStart: 0, gradMidpoint: 50, gradEnd: 100, hasImage };
}

// ── Component ────────────────────────────────────────────────────────────

export function PropertiesPanel({
  fabricRef,
  onCanvasModified,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  onDuplicate,
  onReplaceImage,
}: PropertiesPanelProps) {
  const [selectionType, setSelectionType] = useState<SelectionType>("none");
  const [info, setInfo] = useState<ElementInfo | null>(null);
  const [bgState, setBgState] = useState<BackgroundState>({
    mode: "solid",
    solidColour: "#ffffff",
    gradColour1: "#ffffff",
    gradColour2: "#000000",
    gradDirection: "vertical",
    gradStart: 0,
    gradMidpoint: 50,
    gradEnd: 100,
    hasImage: false,
  });
  const boundCanvasRef = useRef<fabric.Canvas | null>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  // ── Selection tracking ──

  const updateInfo = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Update background state
    setBgState(readBackgroundState(canvas));

    const active = canvas.getActiveObject();
    if (!active) {
      setSelectionType("none");
      setInfo(null);
      return;
    }

    // Skip guides/grid/snap
    const d = (active as FabricAny).data;
    if (d?.isGuide || d?.isGrid || d?.isSnapLine) {
      setSelectionType("none");
      setInfo(null);
      return;
    }

    // Multi-select (ActiveSelection)
    if ((active as FabricAny).type === "activeselection" || (active as FabricAny)._objects?.length > 1) {
      setSelectionType("multi");
      // Read fill from first selected object
      const firstObj = (active as FabricAny)._objects?.[0];
      let multiFill = "#000000";
      if (firstObj) {
        const fi = extractInfo(firstObj);
        multiFill = fi.fill ?? fi.shapeFill ?? "#000000";
      }
      setInfo({
        type: "unknown",
        x: 0, y: 0, w: 0, h: 0, angle: 0,
        opacity: Math.round((active.opacity ?? 1) * 100),
        fill: multiFill,
      });
      return;
    }

    setSelectionType("single");
    setInfo(extractInfo(active));
  }, [fabricRef]);

  // Bind canvas event listeners, rebinding if the canvas instance changes (e.g. HMR)
  useEffect(() => {
    const onClear = () => {
      setSelectionType("none");
      setInfo(null);
      const c = fabricRef.current;
      if (c) setBgState(readBackgroundState(c));
    };

    const bind = (canvas: fabric.Canvas) => {
      canvas.on("selection:created", updateInfo);
      canvas.on("selection:updated", updateInfo);
      canvas.on("selection:cleared", onClear);
      canvas.on("object:modified", updateInfo);
      canvas.on("object:scaling", updateInfo);
      canvas.on("object:moving", updateInfo);
      canvas.on("object:rotating", updateInfo);
      setBgState(readBackgroundState(canvas));
      boundCanvasRef.current = canvas;
    };

    const unbind = (canvas: fabric.Canvas) => {
      canvas.off("selection:created", updateInfo);
      canvas.off("selection:updated", updateInfo);
      canvas.off("selection:cleared", onClear);
      canvas.off("object:modified", updateInfo);
      canvas.off("object:scaling", updateInfo);
      canvas.off("object:moving", updateInfo);
      canvas.off("object:rotating", updateInfo);
    };

    // Bind immediately if canvas is ready
    const canvas = fabricRef.current;
    if (canvas && canvas !== boundCanvasRef.current) {
      if (boundCanvasRef.current) unbind(boundCanvasRef.current);
      bind(canvas);
    }

    // Poll for canvas availability (handles HMR and late initialisation)
    const interval = setInterval(() => {
      const c = fabricRef.current;
      if (c && c !== boundCanvasRef.current) {
        if (boundCanvasRef.current) unbind(boundCanvasRef.current);
        bind(c);
      }
    }, 500);

    return () => {
      clearInterval(interval);
      if (boundCanvasRef.current) {
        unbind(boundCanvasRef.current);
        boundCanvasRef.current = null;
      }
    };
  }, [fabricRef, updateInfo]);

  // ── Active object helpers ──

  const getActiveObj = () => fabricRef.current?.getActiveObject() ?? null;

  const applyAndUpdate = () => {
    const obj = getActiveObj();
    if (obj) {
      // Force text relayout if it's a text object
      if (typeof (obj as FabricAny).initDimensions === "function") {
        (obj as FabricAny).initDimensions();
      }
      // Temporarily disable caching and mark dirty so Fabric fully repaints
      (obj as FabricAny).dirty = true;
      (obj as FabricAny).objectCaching = false;
      if ((obj as FabricAny)._objects) {
        (obj as FabricAny)._objects.forEach((child: FabricAny) => {
          child.dirty = true;
          child.objectCaching = false;
        });
      }
      obj.setCoords();
      fabricRef.current?.renderAll();
      // Re-enable caching after render
      (obj as FabricAny).objectCaching = true;
      if ((obj as FabricAny)._objects) {
        (obj as FabricAny)._objects.forEach((child: FabricAny) => { child.objectCaching = true; });
      }
      onCanvasModified();
      updateInfo();
    }
  };

  const setOpacity = (val: number) => {
    const obj = getActiveObj(); if (obj) { obj.opacity = val / 100; applyAndUpdate(); }
  };

  // ── Multi-selection colour setter ──
  const setMultiFill = (colour: string) => {
    const canvas = fabricRef.current;
    const active = canvas?.getActiveObject() as FabricAny;
    if (!active) return;
    const objects: FabricAny[] = active._objects ?? [active];
    objects.forEach((obj: FabricAny) => {
      const t = obj.type;
      if (t === "Textbox" || t === "IText" || t === "Text" || t === "textbox" || t === "i-text" || t === "text") {
        obj.fill = colour;
      } else if (obj._objects) {
        // SVG group — set fill on children, only set stroke on stroke-only children
        obj._objects.forEach((child: FabricAny) => {
          const hasFill = typeof child.fill === "string" && child.fill !== "none" && child.fill !== "transparent";
          if (hasFill) {
            child.fill = colour;
          }
          if (typeof child.stroke === "string" && child.stroke !== "none" && child.stroke !== "transparent") {
            if (!hasFill) {
              // Stroke-only child — treat stroke as the primary colour
              child.stroke = colour;
            }
          }
          child.dirty = true;
        });
      } else if (t !== "Image" && t !== "image") {
        // Simple shape — only change fill
        if (obj.fill && obj.fill !== "transparent") obj.fill = colour;
      }
      obj.dirty = true;
      obj.objectCaching = false;
      obj.setCoords();
    });
    active.dirty = true;
    canvas?.renderAll();
    // Re-enable caching after render
    objects.forEach((obj: FabricAny) => { obj.objectCaching = true; });
    onCanvasModified();
  };

  const deleteSelected = () => {
    const canvas = fabricRef.current;
    const obj = canvas?.getActiveObject();
    if (!canvas || !obj) return;
    // Handle multi-selection
    if ((obj as FabricAny)._objects) {
      const objects = [...(obj as FabricAny)._objects];
      canvas.discardActiveObject();
      objects.forEach((o: fabric.FabricObject) => canvas.remove(o));
    } else {
      canvas.remove(obj);
    }
    canvas.discardActiveObject();
    canvas.renderAll();
    onCanvasModified();
    setSelectionType("none");
    setInfo(null);
  };

  // ── Multi-object alignment ──

  const alignObjects = (direction: "left" | "centerH" | "right" | "top" | "centerV" | "bottom") => {
    const canvas = fabricRef.current;
    const active = canvas?.getActiveObject() as FabricAny;
    if (!active?._objects || active._objects.length < 2) return;
    const objects = active._objects as FabricAny[];

    // Objects in an ActiveSelection have coordinates relative to the group center.
    // We need to transform to absolute canvas coords, compute alignment, then convert back.
    const groupMatrix = active.calcTransformMatrix();
    const invGroupMatrix = fabric.util.invertTransform(groupMatrix);

    // Get absolute bounding box for each object
    const getAbsoluteBounds = (o: FabricAny) => {
      const w = (o.width ?? 0) * (o.scaleX ?? 1);
      const h = (o.height ?? 0) * (o.scaleY ?? 1);
      const relCenter = new fabric.Point(o.left ?? 0, o.top ?? 0);
      const absCenter = fabric.util.transformPoint(relCenter, groupMatrix);
      return {
        left: absCenter.x - w / 2,
        top: absCenter.y - h / 2,
        width: w,
        height: h,
        centerX: absCenter.x,
        centerY: absCenter.y,
      };
    };

    const bounds = objects.map(getAbsoluteBounds);

    switch (direction) {
      case "left": {
        const minLeft = Math.min(...bounds.map(b => b.left));
        objects.forEach((o: FabricAny, i: number) => {
          const newAbsCenterX = minLeft + bounds[i].width / 2;
          const newRel = fabric.util.transformPoint(
            new fabric.Point(newAbsCenterX, bounds[i].centerY), invGroupMatrix
          );
          o.left = newRel.x;
          o.setCoords();
        });
        break;
      }
      case "centerH": {
        const avgCenterX = bounds.reduce((sum, b) => sum + b.centerX, 0) / bounds.length;
        objects.forEach((o: FabricAny, i: number) => {
          const newRel = fabric.util.transformPoint(
            new fabric.Point(avgCenterX, bounds[i].centerY), invGroupMatrix
          );
          o.left = newRel.x;
          o.setCoords();
        });
        break;
      }
      case "right": {
        const maxRight = Math.max(...bounds.map(b => b.left + b.width));
        objects.forEach((o: FabricAny, i: number) => {
          const newAbsCenterX = maxRight - bounds[i].width / 2;
          const newRel = fabric.util.transformPoint(
            new fabric.Point(newAbsCenterX, bounds[i].centerY), invGroupMatrix
          );
          o.left = newRel.x;
          o.setCoords();
        });
        break;
      }
      case "top": {
        const minTop = Math.min(...bounds.map(b => b.top));
        objects.forEach((o: FabricAny, i: number) => {
          const newAbsCenterY = minTop + bounds[i].height / 2;
          const newRel = fabric.util.transformPoint(
            new fabric.Point(bounds[i].centerX, newAbsCenterY), invGroupMatrix
          );
          o.top = newRel.y;
          o.setCoords();
        });
        break;
      }
      case "centerV": {
        const avgCenterY = bounds.reduce((sum, b) => sum + b.centerY, 0) / bounds.length;
        objects.forEach((o: FabricAny, i: number) => {
          const newRel = fabric.util.transformPoint(
            new fabric.Point(bounds[i].centerX, avgCenterY), invGroupMatrix
          );
          o.top = newRel.y;
          o.setCoords();
        });
        break;
      }
      case "bottom": {
        const maxBottom = Math.max(...bounds.map(b => b.top + b.height));
        objects.forEach((o: FabricAny, i: number) => {
          const newAbsCenterY = maxBottom - bounds[i].height / 2;
          const newRel = fabric.util.transformPoint(
            new fabric.Point(bounds[i].centerX, newAbsCenterY), invGroupMatrix
          );
          o.top = newRel.y;
          o.setCoords();
        });
        break;
      }
    }
    canvas!.renderAll();
    onCanvasModified();
  };

  // ── Text setters ──

  const setFontFamily = async (family: string) => {
    await loadGoogleFontAsync(family);
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("fontFamily", family); applyAndUpdate(); }
  };
  const setFontSize = (val: number) => {
    const obj = getActiveObj() as FabricAny;
    if (!obj) return;
    const newSize = mmToPx(val);
    // Capture centre before change
    const centerX = (obj.left ?? 0) + ((obj.width ?? 0) * (obj.scaleX ?? 1)) / 2;
    const centerY = (obj.top ?? 0) + ((obj.height ?? 0) * (obj.scaleY ?? 1)) / 2;
    // Use set() so Fabric triggers internal text relayout
    obj.set("fontSize", newSize);
    // Force Fabric to recalculate text dimensions
    if (typeof obj.initDimensions === "function") obj.initDimensions();
    // Restore centre position for centered text
    if (obj.textAlign === "center" || obj.originX === "center") {
      const newW = (obj.width ?? 0) * (obj.scaleX ?? 1);
      const newH = (obj.height ?? 0) * (obj.scaleY ?? 1);
      obj.set("left", centerX - newW / 2);
      obj.set("top", centerY - newH / 2);
    }
    applyAndUpdate();
  };
  const toggleBold = () => {
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("fontWeight", (obj.fontWeight === "bold" || obj.fontWeight >= 700) ? "normal" : "bold"); applyAndUpdate(); }
  };
  const toggleItalic = () => {
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("fontStyle", obj.fontStyle === "italic" ? "normal" : "italic"); applyAndUpdate(); }
  };
  const toggleUnderline = () => {
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("underline", !obj.underline); applyAndUpdate(); }
  };
  const setFill = (colour: string) => {
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("fill", colour); applyAndUpdate(); }
  };
  const setTextAlign = (align: string) => {
    const obj = getActiveObj() as FabricAny;
    const canvas = fabricRef.current;
    if (!obj || !canvas) return;
    obj.set("textAlign", align);
    // Also centre the object horizontally on canvas when "center" is clicked
    if (align === "center") {
      const canvasW = canvas.width ?? 1;
      const zoom = canvas.getZoom();
      const canvasCenterX = (canvasW / zoom) / 2;
      const objW = (obj.width ?? 0) * (obj.scaleX ?? 1);
      obj.set("left", canvasCenterX - objW / 2);
    }
    applyAndUpdate();
  };
  const setCharSpacing = (val: number) => {
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("charSpacing", val); applyAndUpdate(); }
  };
  const setLineHeight = (val: number) => {
    const obj = getActiveObj() as FabricAny;
    if (obj) { obj.set("lineHeight", val); applyAndUpdate(); }
  };

  // ── Shape / SVG setters ──

  const setShapeFill = (colour: string) => {
    const obj = getActiveObj() as FabricAny;
    if (!obj) return;
    if (obj._objects) {
      // SVG group: change fill colours that match the current primary
      const currentInfo = extractInfo(obj);
      const primaryColour = currentInfo.shapeFill;
      obj._objects.forEach((child: FabricAny) => {
        if (typeof child.fill === "string" && child.fill === primaryColour) {
          child.fill = colour;
          child.dirty = true;
        }
        // Only change stroke if it matches primary AND there are no separate fill colours
        // (i.e. stroke-only SVG elements where stroke IS the primary colour)
        if (typeof child.stroke === "string" && child.stroke === primaryColour) {
          const hasFill = typeof child.fill === "string" && child.fill !== "none" && child.fill !== "transparent";
          if (!hasFill) {
            child.stroke = colour;
            child.dirty = true;
          }
        }
      });
    } else {
      // Simple shape: only change fill, never touch stroke
      if (typeof obj.fill === "string" && obj.fill !== "transparent") {
        obj.fill = colour;
      } else if (!obj.fill || obj.fill === "transparent") {
        // Shape has no fill — set one
        obj.fill = colour;
      }
    }
    applyAndUpdate();
  };
  const setShapeSecondary = (colour: string) => {
    const obj = getActiveObj() as FabricAny;
    if (!obj) return;
    const currentInfo = extractInfo(obj);
    const secondaryColour = currentInfo.shapeSecondary;
    if (!secondaryColour || !obj._objects) return;
    obj._objects.forEach((child: FabricAny) => {
      if (typeof child.fill === "string" && child.fill === secondaryColour) {
        child.fill = colour;
        child.dirty = true;
      }
      if (typeof child.stroke === "string" && child.stroke === secondaryColour) {
        child.stroke = colour;
        child.dirty = true;
      }
    });
    applyAndUpdate();
  };
  const setStroke = (colour: string) => {
    const obj = getActiveObj() as FabricAny;
    if (!obj) return;
    if (obj._objects) {
      obj._objects.forEach((child: FabricAny) => {
        if (typeof child.stroke === "string" && child.stroke !== "none" && child.stroke !== "transparent") {
          child.stroke = colour;
          child.dirty = true;
        }
      });
    } else {
      obj.set("stroke", colour);
      // Ensure stroke is visible if width is 0
      if (!obj.strokeWidth || obj.strokeWidth === 0) {
        obj.set("strokeWidth", 1);
      }
    }
    applyAndUpdate();
  };
  const setStrokeWidth = (val: number) => {
    const obj = getActiveObj() as FabricAny;
    if (!obj) return;
    if (obj._objects) {
      obj._objects.forEach((child: FabricAny) => {
        child.strokeWidth = val;
        child.dirty = true;
      });
    } else {
      obj.strokeWidth = val;
    }
    applyAndUpdate();
  };

  // ── Flip ──

  const toggleFlipX = () => {
    const obj = getActiveObj(); if (obj) { obj.flipX = !obj.flipX; applyAndUpdate(); }
  };
  const toggleFlipY = () => {
    const obj = getActiveObj(); if (obj) { obj.flipY = !obj.flipY; applyAndUpdate(); }
  };

  // ── Background ──

  const applyBgColour = (colour: string) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    (canvas as FabricAny).backgroundColor = colour;
    canvas.renderAll();
    onCanvasModified();
    setBgState((s) => ({ ...s, mode: "solid", solidColour: colour }));
  };

  const applyGradient = (c1: string, c2: string, dir: GradientDirection, start: number = 0, midpoint: number = 50, end: number = 100) => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const zoom = canvas.getZoom() || 1;
    const w = (canvas.width ?? 1) / zoom;
    const h = (canvas.height ?? 1) / zoom;
    let coords: { x1: number; y1: number; x2: number; y2: number };
    switch (dir) {
      case "horizontal": coords = { x1: 0, y1: 0, x2: w, y2: 0 }; break;
      case "vertical":   coords = { x1: 0, y1: 0, x2: 0, y2: h }; break;
      case "diagonal":   coords = { x1: 0, y1: 0, x2: w, y2: h }; break;
    }
    const s = start / 100;
    const m = midpoint / 100;
    const e = end / 100;
    // 5 stops: solid c1 → fade starts → 50/50 blend → fade ends → solid c2
    const grad = new fabric.Gradient({
      type: "linear",
      coords,
      colorStops: [
        { offset: 0, color: c1 },
        { offset: s, color: c1 },
        { offset: m, color: mixColours(c1, c2, 0.5) },
        { offset: e, color: c2 },
        { offset: 1, color: c2 },
      ],
    } as FabricAny);
    (canvas as FabricAny).backgroundColor = grad;
    canvas.renderAll();
    onCanvasModified();
    setBgState((s_) => ({ ...s_, mode: "gradient", gradColour1: c1, gradColour2: c2, gradDirection: dir, gradStart: start, gradMidpoint: midpoint, gradEnd: end }));
  };

  const handleBgImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const canvas = fabricRef.current;
      if (!canvas) return;
      const dataUrl = reader.result as string;
      // Remove existing background image objects
      const existing = canvas.getObjects().filter(
        (obj: fabric.FabricObject) => (obj as FabricAny).data?.isBackground
      );
      existing.forEach((obj: fabric.FabricObject) => canvas.remove(obj));
      // Add new background image
      const imgEl = new Image();
      imgEl.onload = () => {
        const fabricImg = new fabric.FabricImage(imgEl, {
          left: 0,
          top: 0,
          originX: "left",
          originY: "top",
          data: { elementType: "image", isBackground: true },
          selectable: false,
          evented: false,
        });
        const cw = canvas.width ?? 1;
        const ch = canvas.height ?? 1;
        const scaleX = cw / (fabricImg.width ?? 1);
        const scaleY = ch / (fabricImg.height ?? 1);
        const scale = Math.max(scaleX, scaleY);
        fabricImg.scaleX = scale;
        fabricImg.scaleY = scale;
        canvas.add(fabricImg);
        canvas.sendObjectToBack(fabricImg);
        canvas.renderAll();
        onCanvasModified();
        setBgState((s) => ({ ...s, hasImage: true }));
      };
      imgEl.src = dataUrl;
    };
    reader.readAsDataURL(file);
    if (bgInputRef.current) bgInputRef.current.value = "";
  };

  const removeBgImage = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;
    const existing = canvas.getObjects().filter(
      (obj: fabric.FabricObject) => (obj as FabricAny).data?.isBackground
    );
    existing.forEach((obj: fabric.FabricObject) => canvas.remove(obj));
    canvas.renderAll();
    onCanvasModified();
    setBgState((s) => ({ ...s, hasImage: false }));
  };

  const resetBackground = () => {
    removeBgImage();
    applyBgColour("#ffffff");
  };

  // ── Render ──

  return (
    <aside className="w-64 bg-neutral-800 border-l border-neutral-700 shrink-0 overflow-y-auto">
      <div className="p-3 border-b border-neutral-700">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Properties
        </h3>
      </div>

      {/* ── Background (always visible) ── */}
      <BackgroundSection
        bgState={bgState}
        onSolidColour={applyBgColour}
        onGradient={applyGradient}
        onModeChange={(mode) => {
          if (mode === "solid") {
            applyBgColour(bgState.solidColour);
          } else {
            applyGradient(bgState.gradColour1, bgState.gradColour2, bgState.gradDirection, bgState.gradStart, bgState.gradMidpoint, bgState.gradEnd);
          }
        }}
        onImageUpload={handleBgImageUpload}
        onRemoveImage={removeBgImage}
        onReset={resetBackground}
        bgInputRef={bgInputRef}
      />

      {/* ── No selection message ── */}
      {selectionType === "none" && (
        <div className="p-4 flex flex-col items-center justify-center text-center h-32">
          <p className="text-xs text-neutral-500">
            Select an object to edit its properties.
          </p>
        </div>
      )}

      {/* ── Multi-selection ── */}
      {selectionType === "multi" && info && (
        <>
          <Section title="Selection" subtitle="Multiple objects">
            <ColourPicker label="Colour" value={info.fill ?? "#000000"} onChange={setMultiFill} />
            <SliderInput
              label="Opacity"
              value={info.opacity}
              min={0}
              max={100}
              unit="%"
              onChange={setOpacity}
            />
          </Section>
          <div className="p-3 border-b border-neutral-700">
            <h4 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Align
            </h4>
            <div className="flex items-center gap-1">
              <LayerButton icon={<AlignStartVertical className="w-3.5 h-3.5" />} label="Align left" onClick={() => alignObjects("left")} />
              <LayerButton icon={<AlignCenterVertical className="w-3.5 h-3.5" />} label="Align center" onClick={() => alignObjects("centerH")} />
              <LayerButton icon={<AlignEndVertical className="w-3.5 h-3.5" />} label="Align right" onClick={() => alignObjects("right")} />
              <div className="w-px h-5 bg-neutral-700 mx-0.5" />
              <LayerButton icon={<AlignStartHorizontal className="w-3.5 h-3.5" />} label="Align top" onClick={() => alignObjects("top")} />
              <LayerButton icon={<AlignCenterHorizontal className="w-3.5 h-3.5" />} label="Align middle" onClick={() => alignObjects("centerV")} />
              <LayerButton icon={<AlignEndHorizontal className="w-3.5 h-3.5" />} label="Align bottom" onClick={() => alignObjects("bottom")} />
            </div>
          </div>
          <LayerSection
            bringForward={bringForward}
            sendBackward={sendBackward}
            bringToFront={bringToFront}
            sendToBack={sendToBack}
            onDelete={deleteSelected}
            onDuplicate={onDuplicate}
          />
        </>
      )}

      {/* ── Single selection ── */}
      {selectionType === "single" && info && (
        <>
          {/* Text properties */}
          {info.type === "text" && (
            <TextSection
              info={info}
              onFontFamily={setFontFamily}
              onFontSize={setFontSize}
              onBold={toggleBold}
              onItalic={toggleItalic}
              onUnderline={toggleUnderline}
              onFill={setFill}
              onAlign={setTextAlign}
              onCharSpacing={setCharSpacing}
              onLineHeight={setLineHeight}
              onOpacity={setOpacity}
            />
          )}

          {/* Shape / SVG properties */}
          {(info.type === "svg" || info.type === "shape") && (
            <ShapeSection
              info={info}
              onFill={setShapeFill}
              onSecondary={setShapeSecondary}
              onStroke={setStroke}
              onStrokeWidth={setStrokeWidth}
              onFlipX={toggleFlipX}
              onFlipY={toggleFlipY}
              onOpacity={setOpacity}
            />
          )}

          {/* Image properties */}
          {info.type === "image" && (
            <ImageSection
              info={info}
              onFlipX={toggleFlipX}
              onFlipY={toggleFlipY}
              onOpacity={setOpacity}
              onReplaceImage={onReplaceImage}
            />
          )}

          {/* Layer controls */}
          <LayerSection
            bringForward={bringForward}
            sendBackward={sendBackward}
            bringToFront={bringToFront}
            sendToBack={sendToBack}
            onDelete={deleteSelected}
            onDuplicate={onDuplicate}
          />
        </>
      )}
    </aside>
  );
}

// ── Section components ───────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  trailing,
  children,
}: {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-3 border-b border-neutral-700 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            {title}
          </h4>
          {subtitle && (
            <span className="text-[10px] text-neutral-500">{subtitle}</span>
          )}
        </div>
        {trailing}
      </div>
      {children}
    </div>
  );
}

// ── Background Section ───────────────────────────────────────────────────

function BackgroundSection({
  bgState,
  onSolidColour,
  onGradient,
  onModeChange,
  onImageUpload,
  onRemoveImage,
  onReset,
  bgInputRef,
}: {
  bgState: BackgroundState;
  onSolidColour: (c: string) => void;
  onGradient: (c1: string, c2: string, dir: GradientDirection, start?: number, midpoint?: number, end?: number) => void;
  onModeChange: (mode: "solid" | "gradient") => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  onReset: () => void;
  bgInputRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="p-3 border-b border-neutral-700 space-y-3">
      <h4 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        Background
      </h4>

      {/* Mode toggle */}
      <div className="flex gap-1">
        <button
          onClick={() => onModeChange("solid")}
          className={cn(
            "flex-1 px-2 py-1 text-[10px] rounded transition-colors",
            bgState.mode === "solid"
              ? "bg-neutral-600 text-foreground"
              : "bg-neutral-900 text-neutral-400 hover:text-foreground"
          )}
        >
          Solid
        </button>
        <button
          onClick={() => onModeChange("gradient")}
          className={cn(
            "flex-1 px-2 py-1 text-[10px] rounded transition-colors",
            bgState.mode === "gradient"
              ? "bg-neutral-600 text-foreground"
              : "bg-neutral-900 text-neutral-400 hover:text-foreground"
          )}
        >
          Gradient
        </button>
      </div>

      {bgState.mode === "solid" && (
        <ColourPicker
          label="Colour"
          value={bgState.solidColour}
          onChange={onSolidColour}
          showAlpha={false}
        />
      )}

      {bgState.mode === "gradient" && (
        <div className="space-y-2">
          <ColourPicker
            label="Start"
            value={bgState.gradColour1}
            onChange={(c) => onGradient(c, bgState.gradColour2, bgState.gradDirection, bgState.gradStart, bgState.gradMidpoint, bgState.gradEnd)}
            showAlpha={false}
          />
          <ColourPicker
            label="End"
            value={bgState.gradColour2}
            onChange={(c) => onGradient(bgState.gradColour1, c, bgState.gradDirection, bgState.gradStart, bgState.gradMidpoint, bgState.gradEnd)}
            showAlpha={false}
          />
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Direction</label>
            <div className="flex gap-1">
              {(["horizontal", "vertical", "diagonal"] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => onGradient(bgState.gradColour1, bgState.gradColour2, dir, bgState.gradStart, bgState.gradMidpoint, bgState.gradEnd)}
                  className={cn(
                    "flex-1 px-2 py-1 text-[10px] rounded capitalize transition-colors",
                    bgState.gradDirection === dir
                      ? "bg-neutral-600 text-foreground"
                      : "bg-neutral-900 text-neutral-400 hover:text-foreground"
                  )}
                >
                  {dir === "horizontal" ? "→" : dir === "vertical" ? "↓" : "↘"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">Gradient scale</label>
            <div
              className="h-4 rounded-full relative"
              style={{
                background: `linear-gradient(to right, ${bgState.gradColour1} ${bgState.gradStart}%, ${bgState.gradColour2} ${bgState.gradEnd}%)`,
              }}
            >
              {/* Start handle */}
              <input
                type="range" min={0} max={100} value={bgState.gradStart}
                onChange={(e) => {
                  let v = Number(e.target.value);
                  if (v >= bgState.gradMidpoint) v = bgState.gradMidpoint - 1;
                  onGradient(bgState.gradColour1, bgState.gradColour2, bgState.gradDirection, v, bgState.gradMidpoint, bgState.gradEnd);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
                style={{ clipPath: `inset(0 ${100 - (bgState.gradStart + bgState.gradMidpoint) / 2}% 0 0)` }}
              />
              {/* Midpoint handle */}
              <input
                type="range" min={0} max={100} value={bgState.gradMidpoint}
                onChange={(e) => {
                  let v = Number(e.target.value);
                  if (v <= bgState.gradStart) v = bgState.gradStart + 1;
                  if (v >= bgState.gradEnd) v = bgState.gradEnd - 1;
                  onGradient(bgState.gradColour1, bgState.gradColour2, bgState.gradDirection, bgState.gradStart, v, bgState.gradEnd);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
                style={{ clipPath: `inset(0 ${100 - (bgState.gradMidpoint + bgState.gradEnd) / 2}% 0 ${(bgState.gradStart + bgState.gradMidpoint) / 2}%)` }}
              />
              {/* End handle */}
              <input
                type="range" min={0} max={100} value={bgState.gradEnd}
                onChange={(e) => {
                  let v = Number(e.target.value);
                  if (v <= bgState.gradMidpoint) v = bgState.gradMidpoint + 1;
                  onGradient(bgState.gradColour1, bgState.gradColour2, bgState.gradDirection, bgState.gradStart, bgState.gradMidpoint, v);
                }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer z-30"
                style={{ clipPath: `inset(0 0 0 ${(bgState.gradMidpoint + bgState.gradEnd) / 2}%)` }}
              />
              {/* Visual handles */}
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none"
                style={{ left: `calc(${bgState.gradStart}% - 6px)`, backgroundColor: bgState.gradColour1 }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rotate-45 border-2 border-white bg-neutral-600 shadow pointer-events-none"
                style={{ left: `calc(${bgState.gradMidpoint}% - 5px)` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow pointer-events-none"
                style={{ left: `calc(${bgState.gradEnd}% - 6px)`, backgroundColor: bgState.gradColour2 }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Background image */}
      <div>
        <input
          ref={bgInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={onImageUpload}
          className="hidden"
        />
        <button
          onClick={() => bgInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-neutral-900 hover:bg-neutral-700 border border-neutral-700 rounded text-[10px] text-neutral-300 transition-colors"
        >
          <ImageIcon className="w-3 h-3" />
          {bgState.hasImage ? "Replace BG Image" : "Upload BG Image"}
        </button>
      </div>

      {/* Remove / reset */}
      {(bgState.solidColour !== "#ffffff" || bgState.mode === "gradient" || bgState.hasImage) && (
        <div className="flex gap-1">
          {bgState.hasImage && (
            <button
              onClick={onRemoveImage}
              className="flex-1 px-2 py-1 text-[10px] text-red-400 bg-neutral-900 hover:bg-red-950/50 rounded transition-colors"
            >
              Remove Image
            </button>
          )}
          <button
            onClick={onReset}
            className="flex-1 px-2 py-1 text-[10px] text-neutral-400 bg-neutral-900 hover:bg-neutral-700 rounded transition-colors"
          >
            Reset to White
          </button>
        </div>
      )}
    </div>
  );
}

// ── Text Section ─────────────────────────────────────────────────────────

function TextSection({
  info,
  onFontFamily,
  onFontSize,
  onBold,
  onItalic,
  onUnderline,
  onFill,
  onAlign,
  onCharSpacing,
  onLineHeight,
  onOpacity,
}: {
  info: ElementInfo;
  onFontFamily: (f: string) => void;
  onFontSize: (v: number) => void;
  onBold: () => void;
  onItalic: () => void;
  onUnderline: () => void;
  onFill: (c: string) => void;
  onAlign: (a: string) => void;
  onCharSpacing: (v: number) => void;
  onLineHeight: (v: number) => void;
  onOpacity: (v: number) => void;
}) {
  return (
    <Section title="Text">
      {/* Font family (searchable dropdown) */}
      <FontFamilySelector value={info.fontFamily ?? "Inter"} onChange={onFontFamily} />

      {/* Font size */}
      <NumberInput label="Size" value={info.fontSize ?? 3} unit="mm" onChange={onFontSize} step={0.5} min={0.5} />

      {/* Bold / Italic / Underline / Alignment */}
      <div className="flex items-center gap-1 flex-wrap">
        <ToggleBtn
          active={info.fontWeight === "bold" || Number(info.fontWeight) >= 700}
          onClick={onBold}
          title="Bold"
        >
          <Bold className="w-3.5 h-3.5" />
        </ToggleBtn>
        <ToggleBtn active={info.fontStyle === "italic"} onClick={onItalic} title="Italic">
          <Italic className="w-3.5 h-3.5" />
        </ToggleBtn>
        <ToggleBtn active={!!info.underline} onClick={onUnderline} title="Underline">
          <Underline className="w-3.5 h-3.5" />
        </ToggleBtn>

        <div className="w-px h-5 bg-neutral-700 mx-0.5" />

        <ToggleBtn active={info.textAlign === "left"} onClick={() => onAlign("left")} title="Align left">
          <AlignLeft className="w-3.5 h-3.5" />
        </ToggleBtn>
        <ToggleBtn active={info.textAlign === "center"} onClick={() => onAlign("center")} title="Align centre">
          <AlignCenter className="w-3.5 h-3.5" />
        </ToggleBtn>
        <ToggleBtn active={info.textAlign === "right"} onClick={() => onAlign("right")} title="Align right">
          <AlignRight className="w-3.5 h-3.5" />
        </ToggleBtn>
      </div>

      {/* Text colour */}
      <ColourPicker label="Colour" value={info.fill ?? "#000000"} onChange={onFill} />

      {/* Letter spacing */}
      <SliderInput
        label="Letter Spacing"
        value={info.charSpacing ?? 0}
        min={-50}
        max={500}
        step={10}
        onChange={onCharSpacing}
      />

      {/* Line height */}
      <SliderInput
        label="Line Height"
        value={Math.round((info.lineHeight ?? 1.16) * 100) / 100}
        min={0.5}
        max={3}
        step={0.05}
        onChange={onLineHeight}
        formatValue={(v) => v.toFixed(2)}
      />

      {/* Opacity */}
      <SliderInput
        label="Opacity"
        value={info.opacity}
        min={0}
        max={100}
        unit="%"
        onChange={onOpacity}
      />
    </Section>
  );
}

// ── Shape / SVG Section ──────────────────────────────────────────────────

function ShapeSection({
  info,
  onFill,
  onSecondary,
  onStroke,
  onStrokeWidth,
  onFlipX,
  onFlipY,
  onOpacity,
}: {
  info: ElementInfo;
  onFill: (c: string) => void;
  onSecondary: (c: string) => void;
  onStroke: (c: string) => void;
  onStrokeWidth: (v: number) => void;
  onFlipX: () => void;
  onFlipY: () => void;
  onOpacity: (v: number) => void;
}) {
  return (
    <Section title={info.type === "svg" ? "SVG Element" : "Shape"}>
      <ColourPicker label={info.shapeSecondary ? "Primary" : "Fill"} value={info.shapeFill ?? "transparent"} onChange={onFill} />
      {info.shapeSecondary !== undefined && (
        <ColourPicker label="Secondary" value={info.shapeSecondary} onChange={onSecondary} />
      )}
      <ColourPicker label="Stroke" value={info.stroke ?? "transparent"} onChange={onStroke} />
      <SliderInput
        label="Stroke Width"
        value={info.strokeWidth ?? 0}
        min={0}
        max={20}
        step={0.5}
        unit="px"
        onChange={onStrokeWidth}
      />
      <SliderInput
        label="Opacity"
        value={info.opacity}
        min={0}
        max={100}
        unit="%"
        onChange={onOpacity}
      />
      <div className="flex items-center gap-1 pt-1">
        <ToggleBtn active={!!info.flipX} onClick={onFlipX} title="Flip horizontal">
          <FlipHorizontal className="w-3 h-3" />
        </ToggleBtn>
        <ToggleBtn active={!!info.flipY} onClick={onFlipY} title="Flip vertical">
          <FlipVertical className="w-3 h-3" />
        </ToggleBtn>
      </div>
    </Section>
  );
}

// ── Image Section ────────────────────────────────────────────────────────

function ImageSection({
  info,
  onFlipX,
  onFlipY,
  onOpacity,
  onReplaceImage,
}: {
  info: ElementInfo;
  onFlipX: () => void;
  onFlipY: () => void;
  onOpacity: (v: number) => void;
  onReplaceImage?: (dataUrl: string) => void;
}) {
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onReplaceImage) return;
    const reader = new FileReader();
    reader.onload = () => {
      onReplaceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (replaceInputRef.current) replaceInputRef.current.value = "";
  };

  return (
    <Section title="Image">
      {onReplaceImage && (
        <>
          <input
            ref={replaceInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleReplaceFile}
            className="hidden"
          />
          <button
            onClick={() => replaceInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-neutral-900 hover:bg-neutral-700 border border-neutral-700 rounded text-[10px] text-neutral-300 transition-colors"
          >
            <ImageIcon className="w-3 h-3" />
            Replace Image
          </button>
        </>
      )}
      <SliderInput
        label="Opacity"
        value={info.opacity}
        min={0}
        max={100}
        unit="%"
        onChange={onOpacity}
      />
      <div className="flex items-center gap-1">
        <ToggleBtn active={!!info.flipX} onClick={onFlipX} title="Flip horizontal">
          <FlipHorizontal className="w-3 h-3" />
          <span className="text-[10px] ml-1">Flip H</span>
        </ToggleBtn>
        <ToggleBtn active={!!info.flipY} onClick={onFlipY} title="Flip vertical">
          <FlipVertical className="w-3 h-3" />
          <span className="text-[10px] ml-1">Flip V</span>
        </ToggleBtn>
      </div>
    </Section>
  );
}

// ── Layer Section ────────────────────────────────────────────────────────

function LayerSection({
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  onDelete,
  onDuplicate,
}: {
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  onDelete: () => void;
  onDuplicate?: () => void;
}) {
  return (
    <div className="p-3 border-b border-neutral-700">
      <h4 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
        Layer
      </h4>
      <div className="flex items-center gap-1">
        <LayerButton icon={<ChevronsUp className="w-3.5 h-3.5" />} label="Bring to front" onClick={bringToFront} />
        <LayerButton icon={<ArrowUp className="w-3.5 h-3.5" />} label="Bring forward" onClick={bringForward} />
        <LayerButton icon={<ArrowDown className="w-3.5 h-3.5" />} label="Send backward" onClick={sendBackward} />
        <LayerButton icon={<ChevronsDown className="w-3.5 h-3.5" />} label="Send to back" onClick={sendToBack} />
        <div className="flex-1" />
        {onDuplicate && (
          <button
            onClick={onDuplicate}
            title="Duplicate"
            className="p-1.5 rounded text-neutral-400 hover:text-foreground hover:bg-neutral-700 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={onDelete}
          title="Delete"
          className="p-1.5 rounded text-red-400 hover:bg-red-950/50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

// ── Searchable Font Selector ─────────────────────────────────────────────

function FontFamilySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (family: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const filtered = FONT_LIBRARY.filter((f) =>
    f.label.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  // Load the currently-selected font
  useEffect(() => {
    loadGoogleFont(value);
  }, [value]);

  return (
    <div ref={containerRef} className="relative">
      <label className="text-[10px] text-neutral-500 block mb-1">Font</label>
      <button
        onClick={() => { setOpen(!open); setSearch(""); }}
        className="w-full flex items-center justify-between px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-foreground hover:border-neutral-500 transition-colors"
        style={{ fontFamily: value }}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className="w-3 h-3 text-neutral-500 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 left-0 right-0 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-neutral-700">
            <Search className="w-3 h-3 text-neutral-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground placeholder-neutral-500 focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-neutral-500 hover:text-neutral-300">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Font list */}
          <div className="max-h-60 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-neutral-500">No fonts found</p>
            )}
            {filtered.map((font) => (
              <FontOption
                key={font.family}
                font={font}
                selected={font.family === value}
                onSelect={() => {
                  onChange(font.family);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FontOption({
  font,
  selected,
  onSelect,
}: {
  font: { family: string; label: string; category: string };
  selected: boolean;
  onSelect: () => void;
}) {
  const loaded = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    loadGoogleFontAsync(font.family).then(() => setReady(true));
  }, [font.family]);

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left px-3 py-1.5 text-xs hover:bg-neutral-800 transition-colors flex items-center justify-between",
        selected && "bg-neutral-700"
      )}
    >
      <span
        className="truncate"
        style={ready ? { fontFamily: font.family } : undefined}
      >
        {font.label}
      </span>
      <span className="text-[9px] text-neutral-500 ml-2 shrink-0">{font.category}</span>
    </button>
  );
}

// ── Reusable UI components ───────────────────────────────────────────────

function NumberInput({
  label,
  value,
  unit,
  onChange,
  step = 1,
  min,
  max,
}: {
  label: string;
  value: number;
  unit: string;
  onChange: (val: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <div>
      <label className="text-[10px] text-neutral-500 block mb-0.5">{label}</label>
      <div className="flex items-center bg-neutral-900 border border-neutral-700 rounded overflow-hidden">
        <input
          type="number"
          value={value}
          step={step}
          min={min}
          max={max}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="flex-1 w-0 px-2 py-1 bg-transparent text-xs text-foreground font-mono focus:outline-none"
        />
        {unit && <span className="pr-2 text-[10px] text-neutral-500">{unit}</span>}
      </div>
    </div>
  );
}

function SliderInput({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (val: number) => void;
  formatValue?: (v: number) => string;
}) {
  const display = formatValue ? formatValue(value) : `${Math.round(value * 100) / 100}`;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-[10px] text-neutral-500">{label}</label>
        <span className="text-[10px] text-neutral-400 font-mono">{display}{unit ?? ""}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-accent"
      />
    </div>
  );
}

function ToggleBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center px-2 py-1 rounded transition-colors",
        active
          ? "bg-neutral-600 text-foreground"
          : "bg-neutral-900 text-neutral-400 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function LayerButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className="p-1.5 rounded text-neutral-400 hover:text-foreground hover:bg-neutral-700 transition-colors"
    >
      {icon}
    </button>
  );
}
