"use client";

import { useRef, useEffect, useCallback, useState, type ReactNode } from "react";
import { X } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type SnapPoint = "peek" | "half" | "full";

const SNAP_VALUES: Record<SnapPoint, number> = {
  peek: 0.3,
  half: 0.5,
  full: 0.85,
};

interface MobileBottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  initialSnap?: SnapPoint;
  children: ReactNode;
}

export function MobileBottomSheet({
  open,
  onClose,
  title,
  initialSnap = "half",
  children,
}: MobileBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    dragging: false,
    startY: 0,
    startHeight: 0,
  });
  const [heightFraction, setHeightFraction] = useState(SNAP_VALUES[initialSnap]);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Animate in on open
  useEffect(() => {
    if (open) {
      setHeightFraction(SNAP_VALUES[initialSnap]);
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
    }
  }, [open, initialSnap]);

  const snapToNearest = useCallback(
    (fraction: number, velocity: number) => {
      // If swiping down fast past peek, dismiss
      if (velocity > 0.5 && fraction < SNAP_VALUES.peek + 0.05) {
        setVisible(false);
        setTimeout(onClose, 200);
        return;
      }

      // Find closest snap point
      const points = Object.values(SNAP_VALUES);
      let closest = points[0];
      let minDist = Math.abs(fraction - points[0]);
      for (let i = 1; i < points.length; i++) {
        const dist = Math.abs(fraction - points[i]);
        if (dist < minDist) {
          minDist = dist;
          closest = points[i];
        }
      }

      // Bias towards velocity direction
      if (velocity > 0.15) {
        // Swiping down — go to lower snap
        const lower = points.filter((p) => p < fraction);
        if (lower.length > 0) closest = lower[lower.length - 1];
      } else if (velocity < -0.15) {
        // Swiping up — go to higher snap
        const higher = points.filter((p) => p > fraction);
        if (higher.length > 0) closest = higher[0];
      }

      setHeightFraction(closest);
    },
    [onClose]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragRef.current = {
      dragging: true,
      startY: touch.clientY,
      startHeight: sheetRef.current?.getBoundingClientRect().height ?? 0,
    };
    setDragging(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragRef.current.dragging) return;
    e.preventDefault();

    const touch = e.touches[0];
    const deltaY = dragRef.current.startY - touch.clientY;
    const newHeight = dragRef.current.startHeight + deltaY;
    const vh = window.innerHeight;
    const fraction = Math.max(0.1, Math.min(0.9, newHeight / vh));

    setHeightFraction(fraction);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!dragRef.current.dragging) return;
      dragRef.current.dragging = false;
      setDragging(false);

      const touch = e.changedTouches[0];
      const deltaY = dragRef.current.startY - touch.clientY;
      const vh = window.innerHeight;
      const velocity = -deltaY / vh; // positive = down, negative = up

      snapToNearest(heightFraction, velocity);
    },
    [heightFraction, snapToNearest]
  );

  const handleBackdropTap = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 200);
  }, [onClose]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={handleBackdropTap}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className={cn(
          "fixed left-0 right-0 bottom-0 z-50 bg-neutral-900 rounded-t-2xl border-t border-neutral-700 flex flex-col",
          dragging ? "" : "transition-all duration-200 ease-out"
        )}
        style={{
          height: visible ? `${heightFraction * 100}vh` : "0vh",
          willChange: "height",
        }}
      >
        {/* Drag handle */}
        <div
          className="flex flex-col items-center pt-2 pb-1 cursor-grab active:cursor-grabbing shrink-0 touch-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 rounded-full bg-neutral-600" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-4 pb-2 shrink-0">
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            <button
              onClick={() => {
                setVisible(false);
                setTimeout(onClose, 200);
              }}
              className="p-1 rounded-lg hover:bg-neutral-800 text-white"
            >
              <X size={16} weight="duotone" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-4">
          {children}
        </div>
      </div>
    </>
  );
}
