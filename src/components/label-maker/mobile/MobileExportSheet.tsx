"use client";

import { useState, useCallback } from "react";
import {
  Download,
  SpinnerGap,
  CheckCircle,
  Warning,
  FileText,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import type { LabelDimensions } from "../types";
import { MobileBottomSheet } from "./MobileBottomSheet";

interface MobileExportSheetProps {
  open: boolean;
  onClose: () => void;
  getCanvasImage: () => string | null;
  dimensions: LabelDimensions;
  storageKey: string;
  onExportComplete?: (result: {
    pdfUrl: string;
    previewPngUrl: string | null;
    filename: string;
  }) => void;
}

type ExportState = "idle" | "exporting" | "success" | "error";

export function MobileExportSheet({
  open,
  onClose,
  getCanvasImage,
  dimensions,
  storageKey,
  onExportComplete,
}: MobileExportSheetProps) {
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

      localStorage.removeItem(storageKey);
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

  return (
    <MobileBottomSheet
      open={open}
      onClose={onClose}
      title="Export Label PDF"
      initialSnap="full"
    >
      <div className="space-y-4">
        {/* CMYK Warning */}
        <div className="flex gap-2 p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl">
          <Warning size={16} weight="duotone" className="text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-amber-300 font-medium">Colour Note</p>
            <p className="text-[10px] text-amber-400/80 mt-0.5">
              Colours may appear slightly different in print. We recommend
              ordering a single proof first.
            </p>
          </div>
        </div>

        {/* Export specs */}
        <div className="bg-neutral-800 rounded-xl p-3 space-y-1.5">
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
          </div>
        </div>

        {/* Idle state */}
        {state === "idle" && (
          <button
            onClick={handleExport}
            className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-accent text-neutral-900 text-sm font-semibold rounded-xl active:bg-accent/80 transition-colors"
          >
            <Download size={16} weight="duotone" />
            Generate Print-Ready PDF
          </button>
        )}

        {/* Exporting */}
        {state === "exporting" && (
          <div className="text-center py-6">
            <SpinnerGap size={32} weight="duotone" className="text-accent mx-auto mb-3 animate-spin" />
            <p className="text-xs text-neutral-300">
              Generating your print-ready PDF...
            </p>
            <p className="text-[10px] text-neutral-500 mt-1">
              This may take a few seconds.
            </p>
          </div>
        )}

        {/* Error */}
        {state === "error" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-xl text-xs text-red-400">
              <Warning size={16} weight="duotone" className="shrink-0" />
              {error || "Export failed. Please try again."}
            </div>
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-accent text-neutral-900 text-sm font-semibold rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Success */}
        {state === "success" && result && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-950/30 border border-green-800/50 rounded-xl">
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

            {result.previewPngUrl && (
              <div className="bg-neutral-800 rounded-xl p-2">
                <img
                  src={result.previewPngUrl}
                  alt="Label preview"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-neutral-900 text-xs font-semibold rounded-xl active:bg-accent/80 transition-colors"
              >
                <Download size={16} weight="duotone" />
                Download PDF
              </button>
              <a
                href={result.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 px-4 py-3 bg-neutral-700 text-neutral-300 text-xs rounded-xl active:bg-neutral-600 transition-colors"
              >
                <ArrowSquareOut size={14} weight="duotone" />
                Open
              </a>
            </div>
          </div>
        )}
      </div>
    </MobileBottomSheet>
  );
}
