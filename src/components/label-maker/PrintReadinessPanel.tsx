"use client";

import { useState, useCallback } from "react";
import {
  CheckCircle,
  Warning,
  XCircle,
  SpinnerGap,
  X,
  ShieldCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { LabelDimensions } from "./types";

interface CheckResult {
  label: string;
  status: "passed" | "warning" | "error";
  message: string;
}

interface PrintReadinessPanelProps {
  open: boolean;
  onClose: () => void;
  getCanvasImage: () => string | null;
  getElementsForCheck: () => {
    type: string;
    x: number;
    y: number;
    w: number;
    h: number;
    isBackground: boolean;
    dpi?: number;
    fontSizeMm?: number;
  }[];
  dimensions: LabelDimensions;
}

export function PrintReadinessPanel({
  open,
  onClose,
  getCanvasImage,
  getElementsForCheck,
  dimensions,
}: PrintReadinessPanelProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    passed: CheckResult[];
    warnings: CheckResult[];
    errors: CheckResult[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCheck = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const canvasImage = getCanvasImage();
      const elements = getElementsForCheck();

      const res = await fetch("/api/ai/check-print-readiness", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasImageBase64: canvasImage,
          elements,
          dimensions: {
            widthMm: dimensions.widthMm,
            heightMm: dimensions.heightMm,
            bleedMm: dimensions.bleedMm,
            safeZoneMm: dimensions.safeZoneMm,
          },
        }),
      });

      if (!res.ok) throw new Error("Check failed");
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to run print readiness check. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getCanvasImage, getElementsForCheck, dimensions]);

  if (!open) return null;

  const totalChecks = results
    ? results.passed.length + results.warnings.length + results.errors.length
    : 0;
  const passedCount = results?.passed.length ?? 0;
  const hasErrors = (results?.errors.length ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} weight="duotone" className="text-accent" />
            <h2 className="text-sm font-semibold text-foreground">
              Print Readiness Check
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
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!results && !loading && !error && (
            <div className="text-center py-6">
              <ShieldCheck size={48} weight="duotone" className="text-white mx-auto mb-3" />
              <p className="text-xs text-neutral-400 mb-4">
                Check your design for potential print issues before exporting.
              </p>
              <button
                onClick={runCheck}
                className="px-4 py-2 bg-accent text-neutral-900 text-xs font-medium rounded-lg hover:bg-accent/90 transition-colors"
              >
                Run Check
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <SpinnerGap size={32} weight="duotone" className="text-accent mx-auto mb-3 animate-spin" />
              <p className="text-xs text-neutral-400">
                Checking your design...
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-400">
              <Warning size={16} weight="duotone" className="shrink-0" />
              {error}
              <button
                onClick={runCheck}
                className="ml-auto text-accent hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {results && (
            <>
              {/* Summary */}
              <div
                className={cn(
                  "p-3 rounded-lg border text-center",
                  hasErrors
                    ? "bg-red-950/30 border-red-800"
                    : results.warnings.length > 0
                      ? "bg-amber-950/30 border-amber-800"
                      : "bg-green-950/30 border-green-800"
                )}
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    hasErrors
                      ? "text-red-400"
                      : results.warnings.length > 0
                        ? "text-amber-400"
                        : "text-green-400"
                  )}
                >
                  {hasErrors
                    ? "Issues Found"
                    : results.warnings.length > 0
                      ? "Ready with Warnings"
                      : "Print Ready"}
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  {passedCount}/{totalChecks} checks passed
                </p>
              </div>

              {/* Errors */}
              {results.errors.length > 0 && (
                <ResultSection
                  title="Errors"
                  items={results.errors}
                  icon={<XCircle size={14} weight="duotone" className="text-red-400" />}
                  colour="red"
                />
              )}

              {/* Warnings */}
              {results.warnings.length > 0 && (
                <ResultSection
                  title="Warnings"
                  items={results.warnings}
                  icon={<Warning size={14} weight="duotone" className="text-amber-400" />}
                  colour="amber"
                />
              )}

              {/* Passed */}
              {results.passed.length > 0 && (
                <ResultSection
                  title="Passed"
                  items={results.passed}
                  icon={<CheckCircle size={14} weight="duotone" className="text-green-400" />}
                  colour="green"
                />
              )}

              {/* Re-run */}
              <button
                onClick={runCheck}
                disabled={loading}
                className="w-full text-center text-[10px] text-accent hover:underline py-1"
              >
                Re-run check
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResultSection({
  title,
  items,
  icon,
  colour,
}: {
  title: string;
  items: CheckResult[];
  icon: React.ReactNode;
  colour: "red" | "amber" | "green";
}) {
  return (
    <div>
      <h3
        className={cn(
          "text-[10px] font-semibold uppercase tracking-wider mb-1.5",
          colour === "red" && "text-red-400",
          colour === "amber" && "text-amber-400",
          colour === "green" && "text-green-400"
        )}
      >
        {title} ({items.length})
      </h3>
      <div className="space-y-1">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex gap-2 p-2 bg-neutral-900 rounded-lg"
          >
            <div className="shrink-0 mt-0.5">{icon}</div>
            <div>
              <p className="text-[10px] font-medium text-neutral-300">
                {item.label}
              </p>
              <p className="text-[10px] text-neutral-500">{item.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
