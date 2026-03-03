"use client";

import {
  useRef,
  useEffect,
  useState,
  type RefObject,
} from "react";

interface MobileCanvasViewportProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  fabricRef: RefObject<unknown>;
  /** The element whose clientWidth/clientHeight LabelCanvas.calculateFitZoom reads */
  containerRef: RefObject<HTMLDivElement | null>;
  /**
   * Host element that contains the Fabric.js wrapper (.canvas-container).
   * On mount we reparent the wrapper into our viewport; on unmount we move it back.
   */
  canvasHostRef: RefObject<HTMLDivElement | null>;
  totalWMm: number;
  totalHMm: number;
  currentScale: number;
  applyZoom: (level: "fit" | 50 | 100 | 200) => void;
}

export function MobileCanvasViewport({
  fabricRef,
  containerRef,
  canvasHostRef,
  applyZoom,
}: MobileCanvasViewportProps) {
  const canvasSlotRef = useRef<HTMLDivElement>(null);
  const [viewportZoom, setViewportZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  // Keep latest values in refs for native event handlers
  const zoomRef = useRef(viewportZoom);
  const panRef = useRef(panOffset);
  zoomRef.current = viewportZoom;
  panRef.current = panOffset;

  const gestureRef = useRef({
    initialPinchDistance: 0,
    initialZoom: 1,
    initialPanX: 0,
    initialPanY: 0,
    initialMidX: 0,
    initialMidY: 0,
    lastTapTime: 0,
    lastTapX: 0,
    lastTapY: 0,
    isPinching: false,
  });

  // ─── Reparent the Fabric canvas wrapper into the mobile viewport ───
  useEffect(() => {
    const host = canvasHostRef.current;
    const slot = canvasSlotRef.current;
    if (!host || !slot) return;

    // Fabric.js wraps the <canvas> in a .canvas-container div.
    // On the very first render (before Fabric inits), it's just a raw <canvas>.
    // After Fabric inits, it becomes: host > .canvas-container > upper-canvas + lower-canvas.
    // We move all children from the host into our slot.
    const children = Array.from(host.children);
    children.forEach((child) => slot.appendChild(child));

    // Un-hide the host's parent (it has class="hidden" on mobile)
    // Actually the slot is visible, so the children are now visible.

    return () => {
      // Move everything back to the host on unmount (switching back to desktop)
      const slotChildren = Array.from(slot.children);
      slotChildren.forEach((child) => host.appendChild(child));
    };
  }, [canvasHostRef]);

  // ─── Apply touch-friendly corners to Fabric objects ───
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = fabricRef.current as any;
    if (!fc) return;

    const updateCorners = () => {
      fc.getObjects().forEach((obj: Record<string, unknown>) => {
        obj.cornerSize = 28;
        obj.touchCornerSize = 36;
        obj.cornerStyle = "circle";
        obj.cornerColor = "rgba(139, 92, 246, 0.8)";
        obj.cornerStrokeColor = "rgba(255, 255, 255, 0.9)";
        obj.borderColor = "rgba(139, 92, 246, 0.6)";
        obj.transparentCorners = false;
      });
      fc.requestRenderAll();
    };

    updateCorners();
    fc.on("object:added", updateCorners);
    return () => {
      fc.off("object:added", updateCorners);
    };
  }, [fabricRef]);

  // ─── Re-trigger fit-zoom now that containerRef points to mobile viewport ───
  useEffect(() => {
    // Wait two frames: one for reparenting, one for layout.
    let raf1: number;
    let raf2: number;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        applyZoom("fit");
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [applyZoom]);

  // ─── Native touch handlers for pinch-to-zoom / double-tap-to-reset ───
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        gestureRef.current = {
          ...gestureRef.current,
          initialPinchDistance: dist,
          initialZoom: zoomRef.current,
          initialPanX: panRef.current.x,
          initialPanY: panRef.current.y,
          initialMidX: (t1.clientX + t2.clientX) / 2,
          initialMidY: (t1.clientY + t2.clientY) / 2,
          isPinching: true,
        };
      } else if (e.touches.length === 1) {
        const now = Date.now();
        const g = gestureRef.current;
        const dt = now - g.lastTapTime;
        const dx = Math.abs(e.touches[0].clientX - g.lastTapX);
        const dy = Math.abs(e.touches[0].clientY - g.lastTapY);
        g.lastTapTime = now;
        g.lastTapX = e.touches[0].clientX;
        g.lastTapY = e.touches[0].clientY;

        if (dt < 300 && dt > 0 && dx < 30 && dy < 30) {
          e.preventDefault();
          setViewportZoom(1);
          setPanOffset({ x: 0, y: 0 });
          applyZoom("fit");
          g.lastTapTime = 0;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length >= 2 && gestureRef.current.isPinching) {
        e.preventDefault();
        e.stopPropagation();
        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
        const g = gestureRef.current;
        const scale = dist / g.initialPinchDistance;
        const newZoom = Math.max(0.5, Math.min(4, g.initialZoom * scale));
        setViewportZoom(newZoom);

        const midX = (t1.clientX + t2.clientX) / 2;
        const midY = (t1.clientY + t2.clientY) / 2;
        setPanOffset({
          x: g.initialPanX + (midX - g.initialMidX),
          y: g.initialPanY + (midY - g.initialMidY),
        });
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) {
        gestureRef.current.isPinching = false;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, applyZoom]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-hidden bg-neutral-950 relative"
    >
      {/* Viewport transform layer for pinch-zoom / pan */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${viewportZoom})`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {/*
          Slot for the Fabric.js canvas wrapper. The reparenting useEffect moves
          the .canvas-container from canvasHostRef into here. Fabric.js manages
          the canvas element dimensions via applyZoom → setDimensions().
        */}
        <div ref={canvasSlotRef} />
      </div>
    </div>
  );
}
