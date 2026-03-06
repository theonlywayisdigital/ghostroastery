/**
 * BagPreviewModal — Shows the current label design warped onto a bag photo.
 *
 * Reuses the existing BagVisualisation component from /src/components/builder/BagVisualisation.tsx
 * which handles all perspective warp logic (triangle-based texture mapping with bilinear
 * interpolation + bag texture overlay).
 *
 * Bag photos and colours are fetched from Sanity CMS via bagColoursQuery.
 * Label zone corner points are hardcoded in BagVisualisation.tsx as LABEL_CORNERS (percentage-based).
 * The client can remap these in Sanity when new bag photos are ready.
 *
 * Label zone mapping tool location (for future reference):
 *   The corner points are defined in BagVisualisation.tsx lines 17-28.
 *   When real bag photos are available, update LABEL_CORNERS to match.
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ArrowRight, Package } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { BagVisualisation } from "../builder/BagVisualisation";
import { client } from "@/sanity/lib/client";
import { bagColoursQuery } from "@/sanity/queries/builder";
import type { BagColour } from "../builder/types";

function getSwatchClass(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("holo")) return "swatch-holo";
  if (n.includes("shiny")) return "swatch-shiny";
  return "";
}

interface BagPreviewModalProps {
  open: boolean;
  onClose: () => void;
  /** Trim-only label PNG as a data URL (94×140mm, 1110×1654px) */
  labelImageDataUrl: string | null;
  /** Called when user clicks "Done — export label" */
  onDone: () => void;
}

export function BagPreviewModal({
  open,
  onClose,
  labelImageDataUrl,
  onDone,
}: BagPreviewModalProps) {
  const [bagColours, setBagColours] = useState<BagColour[]>([]);
  const [selectedColour, setSelectedColour] = useState<BagColour | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch bag colours from Sanity on mount
  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    setLoading(true);

    client
      .fetch<BagColour[]>(bagColoursQuery)
      .then((colours) => {
        if (cancelled) return;
        setBagColours(colours || []);
        // Auto-select first colour with a photo, or first overall
        const withPhoto = colours?.find((c) => c.bagPhotoUrl) || colours?.[0] || null;
        setSelectedColour(withPhoto);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleDone = useCallback(() => {
    onClose();
    onDone();
  }, [onClose, onDone]);

  if (!open) return null;

  const hasBagData = selectedColour?.bagPhotoUrl != null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#111111]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 shrink-0">
        <h2 className="text-sm font-semibold text-neutral-200">
          Preview on bag
        </h2>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-neutral-800 text-white hover:text-neutral-200 transition-colors"
        >
          <X size={20} weight="duotone" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto px-6 py-6">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border-2 border-neutral-600 border-t-accent rounded-full animate-spin" />
            <p className="text-sm text-neutral-500">Loading bag preview…</p>
          </div>
        ) : hasBagData && labelImageDataUrl ? (
          /* Side-by-side on larger screens: mockup left, actual bag right */
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-6 lg:gap-8">
            {/* Mockup preview */}
            <div className="w-full max-w-[420px] shrink-0">
              <BagVisualisation
                bagPhotoUrl={selectedColour!.bagPhotoUrl}
                bagColourHex={selectedColour!.hex}
                bagColourName={selectedColour!.name}
                labelFileURL={labelImageDataUrl}
                size="large"
              />
            </div>

            {/* Actual bag photo — smaller reference */}
            {selectedColour!.actualBagPhotoUrl && (
              <div className="w-full max-w-[240px] shrink-0 border border-amber-500/30 bg-amber-500/5 rounded-xl p-3">
                <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-2">
                  Actual bag finish
                </p>
                <img
                  src={selectedColour!.actualBagPhotoUrl}
                  alt={`Actual ${selectedColour!.name} bag`}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
                <p className="text-center text-[10px] text-neutral-400 mt-2 leading-snug">
                  Mock-up is for illustration only.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Fallback — no bag photo available */
          <div className="h-full flex items-center justify-center">
            <FallbackPreview labelImageDataUrl={labelImageDataUrl} />
          </div>
        )}
      </div>

      {/* Footer — colour selector + done button */}
      <div className="border-t border-neutral-800 px-6 py-4 shrink-0">
        {/* Colour selector */}
        {bagColours.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider mr-2">
              Bag colour
            </span>
            {bagColours.map((colour) => (
              <button
                key={colour._id}
                onClick={() => setSelectedColour(colour)}
                title={colour.name}
                className={cn(
                  "w-7 h-7 rounded-full border-2 transition-all",
                  selectedColour?._id === colour._id
                    ? "border-accent scale-110"
                    : "border-neutral-600 hover:border-neutral-400",
                  getSwatchClass(colour.name),
                )}
                style={{ backgroundColor: colour.hex }}
              />
            ))}
          </div>
        )}

        {/* Done button */}
        <div className="flex justify-center">
          <button
            onClick={handleDone}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent text-neutral-900 text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
          >
            Done — export label
            <ArrowRight size={20} weight="duotone" />
          </button>
        </div>
      </div>
    </div>
  );
}

/** Fallback when no bag photo or label zone data is available */
function FallbackPreview({
  labelImageDataUrl,
}: {
  labelImageDataUrl: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-6 max-w-sm">
      {/* Grey bag silhouette */}
      <div className="w-48 h-64 bg-neutral-800 rounded-xl border-2 border-dashed border-neutral-700 flex flex-col items-center justify-center">
        <Package size={64} weight="duotone" className="text-white" />
      </div>

      {/* Label at actual proportions */}
      {labelImageDataUrl && (
        <div className="w-40">
          <img
            src={labelImageDataUrl}
            alt="Label preview"
            className="w-full h-auto rounded-lg shadow-lg border border-neutral-700"
          />
        </div>
      )}

      {/* Message */}
      <p className="text-sm text-neutral-500 text-center leading-relaxed">
        Bag preview not available yet. Your label will appear here once bag
        photos are configured.
      </p>
    </div>
  );
}
