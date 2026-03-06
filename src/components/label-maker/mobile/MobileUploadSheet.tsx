"use client";

import { useRef, useState, useCallback } from "react";
import { UploadSimple, Camera, Image as ImageIcon, Warning, CheckCircle } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface MobileUploadSheetProps {
  onAddImage: (dataUrl: string) => void;
  onUploadLogo?: (dataUrl: string) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "application/pdf",
];

function getDpiInfo(
  width: number,
  height: number,
  printWidthMm: number = 94
): { dpi: number; quality: "high" | "medium" | "low" } {
  const printWidthInches = printWidthMm / 25.4;
  const dpi = Math.round(width / printWidthInches);
  let quality: "high" | "medium" | "low" = "high";
  if (dpi < 150) quality = "low";
  else if (dpi < 250) quality = "medium";
  return { dpi, quality };
}

export function MobileUploadSheet({
  onAddImage,
  onUploadLogo,
}: MobileUploadSheetProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
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
          setLastUpload({ name: file.name, dpi: 0, quality: "high" });
          onAddImage(dataUrl);
          setUploading(false);
          return;
        }

        const img = new Image();
        img.onload = () => {
          const { dpi, quality } = getDpiInfo(
            img.naturalWidth,
            img.naturalHeight
          );
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

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
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
    <div className="space-y-4">
      {/* Primary actions — big touch targets */}
      <div className="grid grid-cols-2 gap-3">
        {/* Upload Logo */}
        <button
          onClick={() => logoInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 px-3 py-4 bg-accent text-neutral-900 font-medium text-xs rounded-xl active:bg-accent/80 transition-colors"
        >
          <UploadSimple size={20} weight="duotone" />
          Upload Logo
        </button>
        <input
          ref={logoInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.svg"
          onChange={handleLogoUpload}
          className="hidden"
        />

        {/* Camera capture */}
        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 px-3 py-4 bg-neutral-800 text-neutral-300 font-medium text-xs rounded-xl border border-neutral-700 active:border-accent transition-colors"
        >
          <Camera size={20} weight="duotone" />
          Take Photo
        </button>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Browse files */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors",
          "border-neutral-700 active:border-accent bg-neutral-800/50"
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
              Browse files
            </p>
            <p className="text-[10px] text-neutral-500 mt-1">
              PNG, JPG, SVG, PDF &middot; Max 20MB
            </p>
          </>
        )}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.svg,.pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-400">
          <Warning size={14} weight="duotone" className="shrink-0" />
          {error}
        </div>
      )}

      {/* Last upload info */}
      {lastUpload && (
        <div className="bg-neutral-800 rounded-xl p-3 space-y-2">
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
              <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
