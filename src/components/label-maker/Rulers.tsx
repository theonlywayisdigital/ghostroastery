"use client";

import { mmToPx } from "./types";

interface RulersProps {
  totalWMm: number;
  totalHMm: number;
  scale: number;
  bleedMm: number;
}

const RULER_SIZE = 24;
const TICK_INTERVAL = 5; // mm
const LABEL_INTERVAL = 10; // mm

/**
 * Horizontal ruler that spans the full scaled canvas width.
 * Origin (0) aligns with the trim edge (offset by bleedMm from canvas edge).
 */
export function HorizontalRuler({ totalWMm, scale, bleedMm }: RulersProps) {
  const ticks: { label: number; px: number; isLabel: boolean }[] = [];
  for (let mm = 0; mm <= totalWMm; mm += TICK_INTERVAL) {
    ticks.push({
      label: mm - bleedMm, // 0 at trim edge
      px: mmToPx(mm) * scale,
      isLabel: mm % LABEL_INTERVAL === 0,
    });
  }

  const totalWidthPx = mmToPx(totalWMm) * scale;

  return (
    <div
      className="relative bg-neutral-800 border-b border-neutral-700 select-none shrink-0"
      style={{ height: RULER_SIZE, width: totalWidthPx }}
    >
      {ticks.map((tick, i) => (
        <div
          key={i}
          className="absolute top-0"
          style={{ left: tick.px }}
        >
          <div
            className={`w-px ${tick.isLabel ? "h-3" : "h-2"}`}
            style={{ backgroundColor: tick.isLabel ? "#a3a3a3" : "#525252" }}
          />
          {tick.isLabel && (
            <span
              className="absolute text-[9px] text-neutral-400 whitespace-nowrap"
              style={{ left: 2, top: 10 }}
            >
              {tick.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Vertical ruler that spans the full scaled canvas height.
 * Origin (0) aligns with the trim edge (offset by bleedMm from canvas edge).
 */
export function VerticalRuler({ totalHMm, scale, bleedMm }: RulersProps) {
  const ticks: { label: number; px: number; isLabel: boolean }[] = [];
  for (let mm = 0; mm <= totalHMm; mm += TICK_INTERVAL) {
    ticks.push({
      label: mm - bleedMm, // 0 at trim edge
      px: mmToPx(mm) * scale,
      isLabel: mm % LABEL_INTERVAL === 0,
    });
  }

  const totalHeightPx = mmToPx(totalHMm) * scale;

  return (
    <div
      className="relative bg-neutral-800 border-r border-neutral-700 select-none shrink-0"
      style={{ width: RULER_SIZE, height: totalHeightPx }}
    >
      {ticks.map((tick, i) => (
        <div
          key={i}
          className="absolute left-0"
          style={{ top: tick.px }}
        >
          <div
            className={`h-px ${tick.isLabel ? "w-3" : "w-2"}`}
            style={{ backgroundColor: tick.isLabel ? "#a3a3a3" : "#525252" }}
          />
          {tick.isLabel && (
            <span
              className="absolute text-[9px] text-neutral-400 whitespace-nowrap"
              style={{ left: 10, top: -5 }}
            >
              {tick.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export { RULER_SIZE };
