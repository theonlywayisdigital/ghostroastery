"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

// ── Colour conversion helpers ───────────────────────────────────────────

interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

function rgbaToHex(c: RGBA): string {
  const hex = (n: number) => n.toString(16).padStart(2, "0");
  if (c.a < 1) {
    return `#${hex(c.r)}${hex(c.g)}${hex(c.b)}${hex(Math.round(c.a * 255))}`;
  }
  return `#${hex(c.r)}${hex(c.g)}${hex(c.b)}`;
}

function hexToRgba(hex: string): RGBA {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  if (h.length === 4) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  const r = parseInt(h.slice(0, 2), 16) || 0;
  const g = parseInt(h.slice(2, 4), 16) || 0;
  const b = parseInt(h.slice(4, 6), 16) || 0;
  const a = h.length >= 8 ? (parseInt(h.slice(6, 8), 16) || 0) / 255 : 1;
  return { r, g, b, a };
}

function rgbaToHsva(c: RGBA): HSVA {
  const r = c.r / 255, g = c.g / 255, b = c.b / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max, a: c.a };
}

function hsvaToRgba(c: HSVA): RGBA {
  const { h, s, v, a } = c;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
    a,
  };
}

function rgbaToString(c: RGBA): string {
  if (c.a < 1) {
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.round(c.a * 100) / 100})`;
  }
  return rgbaToHex(c);
}

function parseColour(value: string): RGBA {
  if (!value) return { r: 0, g: 0, b: 0, a: 1 };
  // Handle hex
  if (value.startsWith("#")) return hexToRgba(value);
  // Handle rgba()
  const rgbaMatch = value.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]) || 0,
      g: parseInt(rgbaMatch[2]) || 0,
      b: parseInt(rgbaMatch[3]) || 0,
      a: rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1,
    };
  }
  // Fallback
  return hexToRgba(value);
}

// ── Recent colours store (module-level, shared across all pickers) ─────

let recentColours: string[] = [];
const MAX_RECENT = 8;
const recentListeners: Set<() => void> = new Set();

function addRecentColour(colour: string) {
  // Normalise to 6-char hex for dedup (ignore alpha for recent tracking)
  const rgba = parseColour(colour);
  const norm = rgbaToHex({ ...rgba, a: 1 });
  recentColours = [norm, ...recentColours.filter((c) => c !== norm)].slice(0, MAX_RECENT);
  recentListeners.forEach((fn) => fn());
}

function useRecentColours(): string[] {
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    const handler = () => forceUpdate((n) => n + 1);
    recentListeners.add(handler);
    return () => { recentListeners.delete(handler); };
  }, []);
  return recentColours;
}

// ── Colour Picker Component ─────────────────────────────────────────────

interface ColourPickerProps {
  value: string;
  onChange: (colour: string) => void;
  showAlpha?: boolean;
  label?: string;
}

export function ColourPicker({ value, onChange, showAlpha = true, label }: ColourPickerProps) {
  const [open, setOpen] = useState(false);
  const [rgba, setRgba] = useState<RGBA>(() => parseColour(value));
  const [hsva, setHsva] = useState<HSVA>(() => rgbaToHsva(parseColour(value)));
  const [hexInput, setHexInput] = useState(() => rgbaToHex(parseColour(value)));
  const containerRef = useRef<HTMLDivElement>(null);
  const recent = useRecentColours();

  // Sync external value changes
  useEffect(() => {
    const parsed = parseColour(value);
    setRgba(parsed);
    setHsva(rgbaToHsva(parsed));
    setHexInput(rgbaToHex(parsed));
  }, [value]);

  // Close on outside click / touch
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      const target = e instanceof TouchEvent ? e.touches[0]?.target ?? e.target : e.target;
      if (containerRef.current && !containerRef.current.contains(target as Node)) {
        setOpen(false);
        addRecentColour(rgbaToHex(rgba));
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [open, rgba]);

  const emitChange = useCallback(
    (newRgba: RGBA) => {
      setRgba(newRgba);
      setHsva(rgbaToHsva(newRgba));
      setHexInput(rgbaToHex(newRgba));
      onChange(rgbaToString(newRgba));
    },
    [onChange],
  );

  const handleHsvaChange = useCallback(
    (newHsva: HSVA) => {
      setHsva(newHsva);
      const newRgba = hsvaToRgba(newHsva);
      setRgba(newRgba);
      setHexInput(rgbaToHex(newRgba));
      onChange(rgbaToString(newRgba));
    },
    [onChange],
  );

  const handleHexCommit = useCallback(
    (hex: string) => {
      const parsed = hexToRgba(hex);
      emitChange(parsed);
    },
    [emitChange],
  );

  // Checkerboard for transparency preview
  const checkerBg = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23ccc'/%3E%3C/svg%3E\")";

  return (
    <div ref={containerRef} className="relative">
      {label && <label className="text-[10px] text-neutral-500 block mb-1">{label}</label>}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-6 rounded border border-neutral-600 cursor-pointer shrink-0 relative overflow-hidden"
          style={{ backgroundImage: checkerBg, backgroundSize: "8px 8px" }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: rgbaToString(rgba) }}
          />
        </button>
        <input
          type="text"
          value={hexInput}
          onChange={(e) => setHexInput(e.target.value)}
          onBlur={() => handleHexCommit(hexInput)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleHexCommit(hexInput);
          }}
          className="flex-1 px-2 py-1 bg-neutral-900 border border-neutral-700 rounded text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-accent w-0"
        />
        <EyeDropperButton onPick={(hex) => { emitChange(parseColour(hex)); addRecentColour(hex); }} />
      </div>

      {open && (
        <div className="absolute z-50 mt-2 right-0 w-52 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl p-3 space-y-3">
          {/* Saturation/Value area */}
          <SaturationPanel hsva={hsva} onChange={handleHsvaChange} />

          {/* Hue slider */}
          <HueSlider hue={hsva.h} onChange={(h) => handleHsvaChange({ ...hsva, h })} />

          {/* Alpha slider */}
          {showAlpha && (
            <AlphaSlider rgba={rgba} onChange={(a) => emitChange({ ...rgba, a })} />
          )}

          {/* RGB inputs */}
          <div className="grid grid-cols-4 gap-1">
            <RgbInput label="R" value={rgba.r} onChange={(r) => emitChange({ ...rgba, r })} />
            <RgbInput label="G" value={rgba.g} onChange={(g) => emitChange({ ...rgba, g })} />
            <RgbInput label="B" value={rgba.b} onChange={(b) => emitChange({ ...rgba, b })} />
            {showAlpha && (
              <div>
                <label className="text-[9px] text-neutral-500 block text-center">A</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={Math.round(rgba.a * 100)}
                  onChange={(e) => emitChange({ ...rgba, a: (parseInt(e.target.value) || 0) / 100 })}
                  className="w-full px-1 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px] text-foreground text-center font-mono focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Recent colours */}
          {recent.length > 0 && (
            <div>
              <label className="text-[9px] text-neutral-500 block mb-1">Recent</label>
              <div className="flex gap-1 flex-wrap">
                {recent.map((c) => (
                  <button
                    key={c}
                    onClick={() => emitChange(parseColour(c))}
                    className="w-5 h-5 rounded border border-neutral-600 cursor-pointer"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Saturation/Value panel ──────────────────────────────────────────────

function SaturationPanel({
  hsva,
  onChange,
}: {
  hsva: HSVA;
  onChange: (hsva: HSVA) => void;
}) {
  const canvasRef = useRef<HTMLDivElement>(null);

  const handlePointerAt = useCallback(
    (clientX: number, clientY: number) => {
      const el = canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const s = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const v = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
      onChange({ ...hsva, s, v });
    },
    [hsva, onChange],
  );

  const handlePointer = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      handlePointerAt(e.clientX, e.clientY);
    },
    [handlePointerAt],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handlePointer(e);
      const move = (ev: MouseEvent) => handlePointer(ev);
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [handlePointer],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerAt(touch.clientX, touch.clientY);
      const move = (ev: TouchEvent) => {
        ev.preventDefault();
        handlePointerAt(ev.touches[0].clientX, ev.touches[0].clientY);
      };
      const end = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
    },
    [handlePointerAt],
  );

  const hueColour = `hsl(${hsva.h}, 100%, 50%)`;

  return (
    <div
      ref={canvasRef}
      className="w-full h-28 rounded cursor-crosshair relative"
      style={{
        background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${hueColour})`,
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md pointer-events-none -translate-x-1/2 -translate-y-1/2"
        style={{
          left: `${hsva.s * 100}%`,
          top: `${(1 - hsva.v) * 100}%`,
        }}
      />
    </div>
  );
}

// ── Hue slider ──────────────────────────────────────────────────────────

function HueSlider({
  hue,
  onChange,
}: {
  hue: number;
  onChange: (h: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  const handlePointerAt = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const h = Math.max(0, Math.min(360, ((clientX - rect.left) / rect.width) * 360));
      onChange(h);
    },
    [onChange],
  );

  const handlePointer = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      handlePointerAt(e.clientX);
    },
    [handlePointerAt],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handlePointer(e);
      const move = (ev: MouseEvent) => handlePointer(ev);
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [handlePointer],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handlePointerAt(e.touches[0].clientX);
      const move = (ev: TouchEvent) => {
        ev.preventDefault();
        handlePointerAt(ev.touches[0].clientX);
      };
      const end = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
    },
    [handlePointerAt],
  );

  return (
    <div
      ref={trackRef}
      className="w-full h-3 rounded cursor-pointer relative"
      style={{
        background:
          "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md pointer-events-none -translate-x-1/2 top-0"
        style={{ left: `${(hue / 360) * 100}%` }}
      />
    </div>
  );
}

// ── Alpha slider ────────────────────────────────────────────────────────

function AlphaSlider({
  rgba,
  onChange,
}: {
  rgba: RGBA;
  onChange: (a: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const checkerBg = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8'%3E%3Crect width='4' height='4' fill='%23ccc'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23ccc'/%3E%3C/svg%3E\")";

  const handlePointerAt = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const a = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      onChange(a);
    },
    [onChange],
  );

  const handlePointer = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      handlePointerAt(e.clientX);
    },
    [handlePointerAt],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handlePointer(e);
      const move = (ev: MouseEvent) => handlePointer(ev);
      const up = () => {
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [handlePointer],
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      handlePointerAt(e.touches[0].clientX);
      const move = (ev: TouchEvent) => {
        ev.preventDefault();
        handlePointerAt(ev.touches[0].clientX);
      };
      const end = () => {
        window.removeEventListener("touchmove", move);
        window.removeEventListener("touchend", end);
      };
      window.addEventListener("touchmove", move, { passive: false });
      window.addEventListener("touchend", end);
    },
    [handlePointerAt],
  );

  const solidColour = `rgb(${rgba.r}, ${rgba.g}, ${rgba.b})`;

  return (
    <div
      ref={trackRef}
      className="w-full h-3 rounded cursor-pointer relative overflow-hidden"
      style={{ backgroundImage: checkerBg, backgroundSize: "8px 8px" }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent, ${solidColour})`,
        }}
      />
      <div
        className="absolute w-3 h-3 border-2 border-white rounded-full shadow-md pointer-events-none -translate-x-1/2 top-0"
        style={{ left: `${rgba.a * 100}%` }}
      />
    </div>
  );
}

// ── RGB number input ────────────────────────────────────────────────────

function RgbInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-[9px] text-neutral-500 block text-center">{label}</label>
      <input
        type="number"
        min={0}
        max={255}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(255, parseInt(e.target.value) || 0)))}
        className="w-full px-1 py-0.5 bg-neutral-800 border border-neutral-700 rounded text-[10px] text-foreground text-center font-mono focus:outline-none"
      />
    </div>
  );
}

// ── Eye Dropper button (only renders when browser supports EyeDropper API) ──

function EyeDropperButton({ onPick }: { onPick: (hex: string) => void }) {
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported("EyeDropper" in window);
  }, []);

  if (!supported) return null;

  return (
    <button
      onClick={async () => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const dropper = new (window as any).EyeDropper();
          const result = await dropper.open();
          if (result?.sRGBHex) onPick(result.sRGBHex);
        } catch {
          // User cancelled or API unavailable
        }
      }}
      title="Pick colour from screen"
      className="p-1 rounded border border-neutral-700 hover:border-neutral-500 hover:bg-neutral-800 transition-colors shrink-0"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
        <path d="m2 22 1-1h3l9-9" />
        <path d="M3 21v-3l9-9" />
        <path d="m15 6-2.5-2.5a2.12 2.12 0 0 1 3-3L18 3l3-3 3 3-3 3 2.5 2.5a2.12 2.12 0 0 1-3 3z" />
      </svg>
    </button>
  );
}
