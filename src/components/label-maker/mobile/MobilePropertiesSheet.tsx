"use client";

import { useState, useEffect, useCallback, useRef, type RefObject } from "react";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronsUp,
  ChevronsDown,
  Minus,
  Plus,
  ChevronDown,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ColourPicker } from "../ColourPicker";
import { FONT_LIBRARY, pxToMm, mmToPx, loadGoogleFont, loadGoogleFontAsync } from "../types";

interface MobilePropertiesSheetProps {
  fabricRef: RefObject<unknown>;
  onCanvasModified: () => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  onDuplicate: () => void;
  onReplaceImage?: (dataUrl: string) => void;
}

interface ObjectState {
  type: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: string;
  textAlign: string;
  underline: boolean;
  fill: string;
  opacity: number;
  charSpacing: number;
  lineHeight: number;
  stroke: string;
  strokeWidth: number;
}

const DEFAULT_STATE: ObjectState = {
  type: "object",
  fontFamily: "Inter",
  fontSize: 24,
  fontWeight: 400,
  fontStyle: "normal",
  textAlign: "left",
  underline: false,
  fill: "#000000",
  opacity: 1,
  charSpacing: 0,
  lineHeight: 1.2,
  stroke: "",
  strokeWidth: 0,
};

export function MobilePropertiesSheet({
  fabricRef,
  onCanvasModified,
  bringForward,
  sendBackward,
  bringToFront,
  sendToBack,
  onDuplicate,
  onReplaceImage,
}: MobilePropertiesSheetProps) {
  const [state, setState] = useState<ObjectState>(DEFAULT_STATE);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [fontSearch, setFontSearch] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getActiveObject = useCallback((): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = fabricRef.current as any;
    return fc?.getActiveObject?.() ?? null;
  }, [fabricRef]);

  // Helper: read the effective fill colour from an object (handles SVG groups)
  const readFill = useCallback((obj: Record<string, unknown>): string => {
    // For groups (SVGs), read fill from child objects
    if (obj._objects && Array.isArray(obj._objects)) {
      for (const child of obj._objects as Record<string, unknown>[]) {
        if (typeof child.fill === "string" && child.fill !== "none" && child.fill !== "transparent") {
          return child.fill;
        }
      }
      return "transparent";
    }
    return typeof obj.fill === "string" ? obj.fill : "transparent";
  }, []);

  // Helper: read the effective stroke from an object (handles SVG groups)
  const readStroke = useCallback((obj: Record<string, unknown>): { stroke: string; strokeWidth: number } => {
    if (obj._objects && Array.isArray(obj._objects)) {
      for (const child of obj._objects as Record<string, unknown>[]) {
        if (typeof child.stroke === "string" && child.stroke !== "none" && child.stroke !== "transparent") {
          return { stroke: child.stroke, strokeWidth: (child.strokeWidth as number) ?? 0 };
        }
      }
      return { stroke: "", strokeWidth: 0 };
    }
    return {
      stroke: typeof obj.stroke === "string" ? obj.stroke : "",
      strokeWidth: (obj.strokeWidth as number) ?? 0,
    };
  }, []);

  // Sync state from selected object
  useEffect(() => {
    const syncState = () => {
      const obj = getActiveObject();
      if (!obj) return;

      const strokeInfo = readStroke(obj);
      setState({
        type: obj.type || "object",
        fontFamily: obj.fontFamily || "Inter",
        fontSize: obj.fontSize ? Math.round(pxToMm(obj.fontSize) * 10) / 10 : 8,
        fontWeight: obj.fontWeight || 400,
        fontStyle: obj.fontStyle || "normal",
        textAlign: obj.textAlign || "left",
        underline: obj.underline || false,
        fill: readFill(obj),
        opacity: obj.opacity ?? 1,
        charSpacing: obj.charSpacing ?? 0,
        lineHeight: obj.lineHeight ?? 1.2,
        stroke: strokeInfo.stroke,
        strokeWidth: strokeInfo.strokeWidth,
      });
    };

    syncState();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = fabricRef.current as any;
    if (!fc) return;

    fc.on("selection:created", syncState);
    fc.on("selection:updated", syncState);
    fc.on("object:modified", syncState);

    return () => {
      fc.off("selection:created", syncState);
      fc.off("selection:updated", syncState);
      fc.off("object:modified", syncState);
    };
  }, [fabricRef, getActiveObject, readFill, readStroke]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateProp = useCallback((key: string, value: any) => {
    const obj = getActiveObject();
    if (!obj) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = fabricRef.current as any;

    if (key === "fill") {
      // Special handling for fill — SVG groups need child-level updates
      const objType = obj.type || "";
      const isText = objType === "textbox" || objType === "i-text" || objType === "text";

      if (isText) {
        obj.set("fill", value);
      } else if (obj._objects && Array.isArray(obj._objects)) {
        // SVG group — set fill on each child that has a visible fill
        const currentFill = readFill(obj);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj._objects.forEach((child: any) => {
          if (typeof child.fill === "string" && child.fill !== "none" && child.fill !== "transparent") {
            if (child.fill === currentFill || !currentFill) {
              child.fill = value;
            }
          }
          // Only change stroke on stroke-only children (no fill) where stroke is the primary
          if (typeof child.stroke === "string" && child.stroke !== "none" && child.stroke !== "transparent") {
            const hasFill = typeof child.fill === "string" && child.fill !== "none" && child.fill !== "transparent";
            if (!hasFill && child.stroke === currentFill) {
              child.stroke = value;
            }
          }
          child.dirty = true;
        });
      } else {
        // Simple shape — only change fill, never touch stroke
        obj.set("fill", value);
      }
    } else if (key === "stroke") {
      // Special handling for stroke on SVG groups
      if (obj._objects && Array.isArray(obj._objects)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj._objects.forEach((child: any) => {
          if (typeof child.stroke === "string" && child.stroke !== "none" && child.stroke !== "transparent") {
            child.stroke = value;
          }
          child.dirty = true;
        });
      } else {
        obj.set("stroke", value);
      }
    } else if (key === "strokeWidth") {
      if (obj._objects && Array.isArray(obj._objects)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        obj._objects.forEach((child: any) => {
          child.strokeWidth = value;
          child.dirty = true;
        });
      } else {
        obj.set("strokeWidth", value);
      }
    } else {
      obj.set(key, value);
    }

    // Force text relayout if it's a text object
    if (typeof obj.initDimensions === "function") {
      obj.initDimensions();
    }
    // Mark dirty + disable caching for proper repaint (same pattern as desktop)
    obj.dirty = true;
    obj.objectCaching = false;
    if (obj._objects && Array.isArray(obj._objects)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj._objects.forEach((child: any) => {
        child.dirty = true;
        child.objectCaching = false;
      });
    }
    obj.setCoords?.();
    fc?.renderAll();

    // Re-enable caching after render
    obj.objectCaching = true;
    if (obj._objects && Array.isArray(obj._objects)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      obj._objects.forEach((child: any) => { child.objectCaching = true; });
    }

    onCanvasModified();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setState((prev: any) => ({ ...prev, [key]: value }));
  }, [getActiveObject, fabricRef, onCanvasModified, readFill]);

  const handleDelete = useCallback(() => {
    const obj = getActiveObject();
    if (!obj) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = fabricRef.current as any;
    if (fc) {
      fc.remove(obj);
      fc.discardActiveObject();
      onCanvasModified();
    }
  }, [getActiveObject, fabricRef, onCanvasModified]);

  const replaceImageInputRef = useRef<HTMLInputElement>(null);

  const handleReplaceImageFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onReplaceImage) return;
    const reader = new FileReader();
    reader.onload = () => {
      onReplaceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (replaceImageInputRef.current) replaceImageInputRef.current.value = "";
  }, [onReplaceImage]);

  const isText =
    state.type === "textbox" ||
    state.type === "i-text" ||
    state.type === "text";

  const isImage = state.type === "image";

  const typeBadge = isText
    ? "Text"
    : isImage
    ? "Image"
    : state.type === "group"
    ? "SVG"
    : "Shape";

  return (
    <div className="space-y-4">
      {/* Type badge */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 text-[10px] font-medium bg-accent/20 text-accent rounded-full">
          {typeBadge}
        </span>
      </div>

      {/* Replace Image button (image objects only) */}
      {isImage && onReplaceImage && (
        <>
          <input
            ref={replaceImageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            onChange={handleReplaceImageFile}
            className="hidden"
          />
          <button
            onClick={() => replaceImageInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-neutral-300 active:bg-neutral-700 transition-colors"
          >
            <ImageIcon className="w-4 h-4" />
            Replace Image
          </button>
        </>
      )}

      {/* Quick actions row */}
      <div className="flex items-center gap-1 flex-wrap">
        {isText && (
          <>
            <QuickButton
              icon={<Bold className="w-4 h-4" />}
              active={state.fontWeight >= 700}
              onClick={() =>
                updateProp("fontWeight", state.fontWeight >= 700 ? 400 : 700)
              }
            />
            <QuickButton
              icon={<Italic className="w-4 h-4" />}
              active={state.fontStyle === "italic"}
              onClick={() =>
                updateProp(
                  "fontStyle",
                  state.fontStyle === "italic" ? "normal" : "italic"
                )
              }
            />
            <QuickButton
              icon={<Underline className="w-4 h-4" />}
              active={state.underline}
              onClick={() => updateProp("underline", !state.underline)}
            />
            <div className="w-px h-6 bg-neutral-700 mx-1" />
            <QuickButton
              icon={<AlignLeft className="w-4 h-4" />}
              active={state.textAlign === "left"}
              onClick={() => updateProp("textAlign", "left")}
            />
            <QuickButton
              icon={<AlignCenter className="w-4 h-4" />}
              active={state.textAlign === "center"}
              onClick={() => updateProp("textAlign", "center")}
            />
            <QuickButton
              icon={<AlignRight className="w-4 h-4" />}
              active={state.textAlign === "right"}
              onClick={() => updateProp("textAlign", "right")}
            />
            <div className="w-px h-6 bg-neutral-700 mx-1" />
          </>
        )}
        <QuickButton
          icon={<Copy className="w-4 h-4" />}
          onClick={onDuplicate}
          label="Duplicate"
        />
        <QuickButton
          icon={<Trash2 className="w-4 h-4" />}
          onClick={handleDelete}
          label="Delete"
          danger
        />
      </div>

      {/* Font family */}
      {isText && (
        <div>
          <label className="text-[10px] text-neutral-500 block mb-1">
            Font Family
          </label>
          <button
            onClick={() => setShowFontPicker(!showFontPicker)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-foreground active:border-accent transition-colors"
          >
            <span style={{ fontFamily: state.fontFamily }}>
              {state.fontFamily}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
          </button>

          {showFontPicker && (
            <div className="mt-2 bg-neutral-800 border border-neutral-700 rounded-lg max-h-48 overflow-hidden flex flex-col">
              <input
                type="text"
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                placeholder="Search fonts..."
                className="px-3 py-2 bg-neutral-900 border-b border-neutral-700 text-xs text-foreground placeholder:text-neutral-600 focus:outline-none"
              />
              <div className="overflow-y-auto">
                {FONT_LIBRARY.filter((f) =>
                  f.label.toLowerCase().includes(fontSearch.toLowerCase())
                ).map((font) => (
                  <MobileFontOption
                    key={font.family}
                    font={font}
                    selected={state.fontFamily === font.family}
                    onSelect={async () => {
                      await loadGoogleFontAsync(font.family, font.weights);
                      updateProp("fontFamily", font.family);
                      setShowFontPicker(false);
                      setFontSearch("");
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Font size stepper */}
      {isText && (
        <div>
          <label className="text-[10px] text-neutral-500 block mb-1">
            Font Size (mm)
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newSize = Math.max(2, state.fontSize - 0.5);
                setState((prev) => ({ ...prev, fontSize: newSize }));
                updateProp("fontSize", mmToPx(newSize));
              }}
              className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 active:bg-neutral-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm font-mono text-foreground min-w-[48px] text-center">
              {state.fontSize.toFixed(1)}
            </span>
            <button
              onClick={() => {
                const newSize = Math.min(100, state.fontSize + 0.5);
                setState((prev) => ({ ...prev, fontSize: newSize }));
                updateProp("fontSize", mmToPx(newSize));
              }}
              className="p-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 active:bg-neutral-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Colour */}
      <div>
        <label className="text-[10px] text-neutral-500 block mb-1">
          {isText ? "Text Colour" : "Fill Colour"}
        </label>
        <ColourPicker
          value={state.fill}
          onChange={(colour) => updateProp("fill", colour)}
        />
      </div>

      {/* Layer controls */}
      <div>
        <label className="text-[10px] text-neutral-500 block mb-1">
          Layer
        </label>
        <div className="flex items-center gap-1">
          <QuickButton
            icon={<ChevronsUp className="w-4 h-4" />}
            onClick={bringToFront}
            label="Front"
          />
          <QuickButton
            icon={<ArrowUp className="w-4 h-4" />}
            onClick={bringForward}
            label="Forward"
          />
          <QuickButton
            icon={<ArrowDown className="w-4 h-4" />}
            onClick={sendBackward}
            label="Back"
          />
          <QuickButton
            icon={<ChevronsDown className="w-4 h-4" />}
            onClick={sendToBack}
            label="Bottom"
          />
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-1.5 text-[10px] text-neutral-400"
      >
        <ChevronDown
          className={cn(
            "w-3 h-3 transition-transform",
            showAdvanced && "rotate-180"
          )}
        />
        Advanced
      </button>

      {showAdvanced && (
        <div className="space-y-3 pl-1">
          {/* Opacity */}
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">
              Opacity
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(state.opacity * 100)}
              onChange={(e) =>
                updateProp("opacity", parseInt(e.target.value) / 100)
              }
              className="w-full accent-accent"
            />
            <span className="text-[10px] text-neutral-500">
              {Math.round(state.opacity * 100)}%
            </span>
          </div>

          {/* Letter spacing (text only) */}
          {isText && (
            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">
                Letter Spacing
              </label>
              <input
                type="range"
                min={-200}
                max={800}
                value={state.charSpacing}
                onChange={(e) =>
                  updateProp("charSpacing", parseInt(e.target.value))
                }
                className="w-full accent-accent"
              />
              <span className="text-[10px] text-neutral-500">
                {state.charSpacing}
              </span>
            </div>
          )}

          {/* Line height (text only) */}
          {isText && (
            <div>
              <label className="text-[10px] text-neutral-500 block mb-1">
                Line Height
              </label>
              <input
                type="range"
                min={80}
                max={300}
                value={Math.round(state.lineHeight * 100)}
                onChange={(e) =>
                  updateProp("lineHeight", parseInt(e.target.value) / 100)
                }
                className="w-full accent-accent"
              />
              <span className="text-[10px] text-neutral-500">
                {state.lineHeight.toFixed(2)}
              </span>
            </div>
          )}

          {/* Stroke */}
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">
              Stroke
            </label>
            <div className="flex items-center gap-2">
              <ColourPicker
                value={state.stroke || "#000000"}
                onChange={(colour) => updateProp("stroke", colour)}
                showAlpha={false}
              />
              <input
                type="number"
                min={0}
                max={20}
                value={state.strokeWidth}
                onChange={(e) =>
                  updateProp(
                    "strokeWidth",
                    Math.max(0, parseInt(e.target.value) || 0)
                  )
                }
                className="w-16 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-foreground text-center font-mono focus:outline-none"
              />
              <span className="text-[10px] text-neutral-500">px</span>
            </div>
          </div>

          {/* Flip */}
          <div>
            <label className="text-[10px] text-neutral-500 block mb-1">
              Flip
            </label>
            <div className="flex items-center gap-1">
              <QuickButton
                icon={<FlipHorizontal className="w-4 h-4" />}
                onClick={() => {
                  const obj = getActiveObject();
                  if (obj) updateProp("flipX", !obj.flipX);
                }}
                label="Horizontal"
              />
              <QuickButton
                icon={<FlipVertical className="w-4 h-4" />}
                onClick={() => {
                  const obj = getActiveObject();
                  if (obj) updateProp("flipY", !obj.flipY);
                }}
                label="Vertical"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickButton({
  icon,
  active,
  onClick,
  label,
  danger,
}: {
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
  label?: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "p-2 rounded-lg transition-colors",
        active
          ? "bg-accent/20 text-accent"
          : danger
          ? "bg-neutral-800 text-red-400 active:bg-red-900/30"
          : "bg-neutral-800 text-neutral-400 active:bg-neutral-700"
      )}
    >
      {icon}
    </button>
  );
}

function MobileFontOption({
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
        "w-full text-left px-3 py-2 text-xs active:bg-neutral-700 transition-colors",
        selected
          ? "text-accent bg-accent/10"
          : "text-neutral-300"
      )}
    >
      <span style={ready ? { fontFamily: font.family } : undefined}>
        {font.label}
      </span>
    </button>
  );
}
