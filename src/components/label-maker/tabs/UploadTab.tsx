"use client";

import { useRef, useState, useCallback } from "react";
import { UploadSimple, Image as ImageIcon, Warning, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface UploadTabProps {
  onAddImage: (dataUrl: string) => void;
  onUploadLogo?: (dataUrl: string) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/svg+xml", "application/pdf"];
const ACCEPTED_EXT = ".png,.jpg,.jpeg,.svg,.pdf";

function getDpiInfo(
  width: number,
  height: number,
  printWidthMm: number = 102
): { dpi: number; quality: "high" | "medium" | "low" } {
  // Estimate DPI based on assuming the image fills the label width (102mm trim)
  const printWidthInches = printWidthMm / 25.4;
  const dpi = Math.round(width / printWidthInches);
  let quality: "high" | "medium" | "low" = "high";
  if (dpi < 150) quality = "low";
  else if (dpi < 250) quality = "medium";
  return { dpi, quality };
}

export function UploadTab({ onAddImage, onUploadLogo }: UploadTabProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [lastUpload, setLastUpload] = useState<{
    name: string;
    dpi: number;
    quality: "high" | "medium" | "low";
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      setError(null);
      setLastUpload(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Unsupported file type. Use PNG, JPG, SVG, or PDF.");
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError("File too large. Maximum size is 20MB.");
        return;
      }

      setUploading(true);

      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;

        if (file.type === "image/svg+xml") {
          // SVG doesn't have pixel dimensions in the same way
          setLastUpload({ name: file.name, dpi: 0, quality: "high" });
          onAddImage(dataUrl);
          setUploading(false);
          return;
        }

        // For raster images, read dimensions
        const img = new Image();
        img.onload = () => {
          const { dpi, quality } = getDpiInfo(img.naturalWidth, img.naturalHeight);
          setLastUpload({ name: file.name, dpi, quality });
          onAddImage(dataUrl);
          setUploading(false);
        };
        img.onerror = () => {
          setError("Could not read image.");
          setUploading(false);
        };
        img.src = dataUrl;
      };
      reader.onerror = () => {
        setError("Could not read file.");
        setUploading(false);
      };
      reader.readAsDataURL(file);
    },
    [onAddImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [processFile]
  );

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        if (onUploadLogo) {
          onUploadLogo(dataUrl);
        } else {
          onAddImage(dataUrl);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = "";
    },
    [onUploadLogo, onAddImage]
  );

  return (
    <div className="p-3 space-y-3">
      {/* Upload Logo — persistent primary action */}
      <button
        onClick={() => logoInputRef.current?.click()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-neutral-900 font-medium text-xs rounded-lg hover:bg-accent/90 transition-colors"
      >
        <UploadSimple size={16} weight="duotone" />
        Upload Logo
      </button>
      <input
        ref={logoInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg"
        onChange={handleLogoUpload}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
          dragOver
            ? "border-accent bg-accent/10"
            : "border-neutral-700 hover:border-neutral-500 bg-neutral-900"
        )}
      >
        {uploading ? (
          <div className="animate-pulse">
            <UploadSimple size={40} weight="duotone" className="text-white mb-2" />
            <p className="text-xs text-neutral-400">Processing...</p>
          </div>
        ) : (
          <>
            <ImageIcon size={40} weight="duotone" className="text-white mb-2" />
            <p className="text-xs text-neutral-300">
              Drop an image here or click to browse
            </p>
            <p className="text-[10px] text-neutral-500 mt-1">
              PNG, JPG, SVG, PDF &middot; Max 20MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-950/50 border border-red-800 rounded text-xs text-red-400">
          <Warning size={14} weight="duotone" className="shrink-0" />
          {error}
        </div>
      )}

      {/* Last upload info with DPI indicator */}
      {lastUpload && (
        <div className="bg-neutral-900 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <CheckCircle size={14} weight="duotone" className="text-green-500 shrink-0" />
            <span className="text-xs text-neutral-300 truncate">
              {lastUpload.name}
            </span>
          </div>

          {lastUpload.dpi > 0 && (
            <div>
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-neutral-500">Estimated DPI</span>
                <span
                  className={cn(
                    "font-medium",
                    lastUpload.quality === "high" && "text-green-400",
                    lastUpload.quality === "medium" && "text-amber-400",
                    lastUpload.quality === "low" && "text-red-400"
                  )}
                >
                  {lastUpload.dpi} DPI
                </span>
              </div>
              <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    lastUpload.quality === "high" && "bg-green-500",
                    lastUpload.quality === "medium" && "bg-amber-500",
                    lastUpload.quality === "low" && "bg-red-500"
                  )}
                  style={{
                    width: `${Math.min((lastUpload.dpi / 300) * 100, 100)}%`,
                  }}
                />
              </div>
              <p className="text-[9px] text-neutral-500 mt-1">
                {lastUpload.quality === "high" && "Great for print (300+ DPI)"}
                {lastUpload.quality === "medium" && "Acceptable quality (150\u2013299 DPI)"}
                {lastUpload.quality === "low" && "Low quality \u2014 consider a higher-resolution image"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="space-y-1.5">
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          Tips
        </h3>
        <ul className="text-[10px] text-neutral-500 space-y-1 list-disc list-inside">
          <li>Use 300 DPI or higher for sharp prints</li>
          <li>PNG with transparency works best for logos</li>
          <li>SVG files scale to any size without quality loss</li>
        </ul>
      </div>
    </div>
  );
}
