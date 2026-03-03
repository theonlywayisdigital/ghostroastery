"use client";

import { useRef, useCallback } from "react";
import type * as fabric from "fabric";
import { rehydrateFontsOnCanvas } from "./types";

const MAX_HISTORY = 20;

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
  const undo = useCallback((canvas: fabric.Canvas) => {
    if (undoStack.current.length <= 1) return; // need at least initial + 1
    isProgrammatic.current = true;
    const currentState = undoStack.current.pop()!;
    redoStack.current.push(currentState);
    const prev = undoStack.current[undoStack.current.length - 1];
    canvas.loadFromJSON(prev).then(async () => {
      canvas.renderAll();
      await rehydrateFontsOnCanvas(canvas);
      isProgrammatic.current = false;
    });
  }, []);

  /** Redo: pop from redo, push to undo, restore */
  const redo = useCallback((canvas: fabric.Canvas) => {
    if (redoStack.current.length === 0) return;
    isProgrammatic.current = true;
    const next = redoStack.current.pop()!;
    undoStack.current.push(next);
    canvas.loadFromJSON(next).then(async () => {
      canvas.renderAll();
      await rehydrateFontsOnCanvas(canvas);
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
