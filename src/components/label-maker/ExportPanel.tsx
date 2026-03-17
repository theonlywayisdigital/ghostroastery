"use client";

import { useState, useCallback } from "react";
import {
  Download,
  SpinnerGap,
  CheckCircle,
  Warning,
  X,
  FileText,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { LabelDimensions } from "./types";

interface ExportPanelProps {
  open: boolean;
  onClose: () => void;
  getCanvasImage: () => string | null;
  dimensions: LabelDimensions;
  storageKey: string;
  /** Called after a successful export with the result URLs (for builder integration) */
  onExportComplete?: (result: { pdfUrl: string; previewPngUrl: string | null; filename: string }) => void;
  /** Whether the user is logged in (shows account link after export) */
  isLoggedIn?: boolean;
}

type ExportState = "idle" | "exporting" | "success" | "error";

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL;

export function ExportPanel({
  open,
  onClose,
  getCanvasImage,
  dimensions,
  storageKey,
  onExportComplete,
  isLoggedIn,
}: ExportPanelProps) {
  const [state, setState] = useState<ExportState>("idle");
  const [result, setResult] = useState<{
    pdfUrl: string;
    previewPngUrl: string | null;
    filename: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExport = useCallback(async () => {
    setState("exporting");
    setError(null);
    setResult(null);

    try {
      const canvasImage = getCanvasImage();
      if (!canvasImage) {
        throw new Error("Could not capture canvas");
      }

      const res = await fetch("/api/label/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasImageBase64: canvasImage,
          dimensions: {
            widthMm: dimensions.widthMm,
            heightMm: dimensions.heightMm,
            bleedMm: dimensions.bleedMm,
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Export failed");
      }

      const data = await res.json();
      setResult(data);
      setState("success");

      // Clear localStorage on successful export
      localStorage.removeItem(storageKey);

      // Notify parent (builder integration)
      onExportComplete?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
      setState("error");
    }
  }, [getCanvasImage, dimensions, storageKey, onExportComplete]);

  const handleDownload = useCallback(() => {
    if (!result?.pdfUrl) return;
    const link = document.createElement("a");
    link.href = result.pdfUrl;
    link.download = result.filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [result]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <FileText size={24} weight="duotone" className="text-accent" />
            <h2 className="text-sm font-semibold text-foreground">
              Export Label PDF
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-700 text-white hover:text-foreground transition-colors"
          >
            <X size={16} weight="duotone" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* CMYK Warning */}
          <div className="flex gap-2 p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg">
            <Warning size={16} weight="duotone" className="text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-300 font-medium">
                Colour Note
              </p>
              <p className="text-[10px] text-amber-400/80 mt-0.5">
                Colours may appear slightly different in print compared to
                screen. We recommend ordering a single proof before your full
                order.
              </p>
            </div>
          </div>

          {/* Export specs */}
          <div className="bg-neutral-900 rounded-lg p-3 space-y-1.5">
            <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
              Export Settings
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
              <div className="flex justify-between">
                <span className="text-neutral-500">Format</span>
                <span className="text-foreground">PDF</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Resolution</span>
                <span className="text-foreground">300 DPI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Size</span>
                <span className="text-foreground">
                  {dimensions.widthMm + dimensions.bleedMm * 2}&times;{dimensions.heightMm + dimensions.bleedMm * 2}mm
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Bleed</span>
                <span className="text-foreground">{dimensions.bleedMm}mm</span>
              </div>
              <div className="flex justify-between col-span-2">
                <span className="text-neutral-500">Includes</span>
                <span className="text-foreground">
                  {dimensions.bleedMm}mm bleed area
                </span>
              </div>
            </div>
          </div>

          {/* State: Idle */}
          {state === "idle" && (
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-neutral-900 text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
            >
              <Download size={20} weight="duotone" />
              Generate Print-Ready PDF
            </button>
          )}

          {/* State: Exporting */}
          {state === "exporting" && (
            <div className="text-center py-4">
              <SpinnerGap size={32} weight="duotone" className="text-accent mx-auto mb-3 animate-spin" />
              <p className="text-xs text-neutral-300">
                Generating your print-ready PDF...
              </p>
              <p className="text-[10px] text-neutral-500 mt-1">
                This may take a few seconds.
              </p>
            </div>
          )}

          {/* State: Error */}
          {state === "error" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-400">
                <Warning size={16} weight="duotone" className="shrink-0" />
                {error || "Export failed. Please try again."}
              </div>
              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent text-neutral-900 text-sm font-semibold rounded-lg hover:bg-accent/90 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* State: Success */}
          {state === "success" && result && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-950/30 border border-green-800/50 rounded-lg">
                <CheckCircle size={16} weight="duotone" className="text-green-400 shrink-0" />
                <div>
                  <p className="text-xs text-green-300 font-medium">
                    PDF exported successfully
                  </p>
                  <p className="text-[10px] text-green-400/70 mt-0.5">
                    {result.filename}
                  </p>
                </div>
              </div>

              {/* Preview */}
              {result.previewPngUrl && (
                <div className="bg-neutral-900 rounded-lg p-2">
                  <img
                    src={result.previewPngUrl}
                    alt="Label preview"
                    className="w-full rounded"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-neutral-900 text-xs font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                >
                  <Download size={20} weight="duotone" />
                  Download PDF
                </button>
                <a
                  href={result.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 px-3 py-2.5 bg-neutral-700 text-neutral-300 text-xs rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  <ArrowSquareOut size={14} weight="duotone" />
                  Open
                </a>
              </div>

              {isLoggedIn && !onExportComplete && PORTAL_URL && (
                <a
                  href={`${PORTAL_URL}/my-orders`}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-700 text-neutral-300 text-xs font-medium rounded-lg hover:bg-neutral-600 transition-colors"
                >
                  Go to My Account
                  <ArrowSquareOut size={14} weight="duotone" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
