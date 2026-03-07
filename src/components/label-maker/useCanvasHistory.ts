"use client";

import { useRef, useCallback } from "react";
import type * as fabric from "fabric";
import { rehydrateFontsOnCanvas, loadGoogleFontAsync } from "./types";

const MAX_HISTORY = 20;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FabricAny = any;

/** Extract font families from a serialised canvas JSON string and preload them */
async function preloadFontsFromJSON(json: string): Promise<void> {
  try {
    const parsed = JSON.parse(json);
    const families = new Set<string>();
    if (Array.isArray(parsed.objects)) {
      for (const obj of parsed.objects as FabricAny[]) {
        if (obj.fontFamily) families.add(obj.fontFamily);
      }
    }
    if (families.size > 0) {
      await Promise.all(Array.from(families).map((f) => loadGoogleFontAsync(f)));
    }
  } catch {
    // Ignore parse errors — loadFromJSON will handle them
  }
}

/**
 * Manages undo/redo history for a Fabric.js canvas.
 * Call `saveState()` after every meaningful change.
 */
export function useCanvasHistory() {
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const isProgrammatic = useRef(false);

  /** Serialise the current canvas state and push to undo stack */
  const saveState = useCallback((canvas: fabric.Canvas) => {
    if (isProgrammatic.current) return;
    const json = JSON.stringify(canvas.toObject(['data']));
    undoStack.current.push(json);
    if (undoStack.current.length > MAX_HISTORY + 1) {
      undoStack.current.shift();
    }
    // Clear redo on new action
    redoStack.current = [];
  }, []);

  /** Undo: pop from undo, push current to redo, restore previous state */
  const undo = useCallback(async (canvas: fabric.Canvas) => {
    if (undoStack.current.length <= 1) return; // need at least initial + 1
    isProgrammatic.current = true;
    const currentState = undoStack.current.pop()!;
    redoStack.current.push(currentState);
    const prev = undoStack.current[undoStack.current.length - 1];
    // Pre-load fonts before loadFromJSON so Fabric has correct metrics
    await preloadFontsFromJSON(prev);
    canvas.loadFromJSON(prev).then(async () => {
      await rehydrateFontsOnCanvas(canvas);
      canvas.requestRenderAll();
      isProgrammatic.current = false;
    });
  }, []);

  /** Redo: pop from redo, push to undo, restore */
  const redo = useCallback(async (canvas: fabric.Canvas) => {
    if (redoStack.current.length === 0) return;
    isProgrammatic.current = true;
    const next = redoStack.current.pop()!;
    undoStack.current.push(next);
    // Pre-load fonts before loadFromJSON so Fabric has correct metrics
    await preloadFontsFromJSON(next);
    canvas.loadFromJSON(next).then(async () => {
      await rehydrateFontsOnCanvas(canvas);
      canvas.requestRenderAll();
      isProgrammatic.current = false;
    });
  }, []);

  /** Initialise with the first state snapshot */
  const initState = useCallback((canvas: fabric.Canvas) => {
    undoStack.current = [JSON.stringify(canvas.toObject(['data']))];
    redoStack.current = [];
  }, []);

  const canUndo = useCallback(() => undoStack.current.length > 1, []);
  const canRedo = useCallback(() => redoStack.current.length > 0, []);

  return { saveState, undo, redo, initState, canUndo, canRedo, isProgrammatic };
}
