"use client";

import { useCallback } from "react";
import { motion } from "framer-motion";
import { Upload, X, ExternalLink, Info } from "lucide-react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { BagVisualisation } from "../BagVisualisation";

const ACCEPTED_TYPES = [
  "image/png",
  "image/jpeg",
  "application/pdf",
  "image/svg+xml",
];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export function Step3Label() {
  const { state, dispatch, siteSettings } = useBuilder();

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (!file) return;

      // Validate file type
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert("Please upload a PNG, PDF, SVG, or AI file.");
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        alert("File size must be less than 15MB.");
        return;
      }

      // Create object URL for preview (only works for images)
      const url = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;

      dispatch({
        type: "SET_LABEL_FILE",
        file,
        url: url || "",
      });
    },
    [dispatch]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      handleFileChange(file);
    },
    [handleFileChange]
  );

  const handleRemoveFile = () => {
    dispatch({ type: "REMOVE_LABEL_FILE" });
  };

  const handleSkip = () => {
    dispatch({ type: "SKIP_LABEL" });
    dispatch({ type: "NEXT_STEP" });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const heading =
    siteSettings.builderCopy?.step3Heading || "Make it yours.";
  const subheading =
    siteSettings.builderCopy?.step3Subheading || "Upload your label artwork.";
  const labelMakerUrl = siteSettings.labelMakerUrl || "/label-maker";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upload area */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <StepHeading heading={heading} subheading={subheading} />

        {!state.labelFile ? (
          <label
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-neutral-700 rounded-xl cursor-pointer hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors"
          >
            <Upload className="w-12 h-12 text-neutral-500 mb-4" />
            <p className="text-foreground font-medium mb-1">
              Drag and drop your label file here
            </p>
            <p className="text-sm text-neutral-500 mb-4">or click to browse</p>
            <p className="text-xs text-neutral-600">PNG, PDF, SVG, AI — Max 15MB</p>
            <input
              type="file"
              accept=".png,.pdf,.svg,.ai,image/png,application/pdf,image/svg+xml"
              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
              className="hidden"
            />
          </label>
        ) : (
          <div className="w-full p-6 border-2 border-accent rounded-xl bg-accent/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Upload className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-foreground font-medium truncate max-w-[200px]">
                    {state.labelFile.name}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {formatFileSize(state.labelFile.size)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thumbnail preview for images */}
            {state.labelFileURL && (
              <div className="mt-4 p-4 bg-neutral-900 rounded-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.labelFileURL}
                  alt="Label preview"
                  className="max-h-32 mx-auto object-contain"
                />
              </div>
            )}
          </div>
        )}

        {/* Label Maker link */}
        <a
          href={labelMakerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 mt-4 text-accent hover:underline"
        >
          <span>Need a label? Use our free Label Maker tool</span>
          <ExternalLink className="w-4 h-4" />
        </a>
        <p className="text-xs text-neutral-500 mt-1">
          Design your label there, download it, then upload it here.
        </p>

        {/* Label dimensions info */}
        <motion.div
          className="mt-6 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-neutral-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">
                Recommended label dimensions
              </p>
              <p className="text-sm text-neutral-400 mt-1">
                88mm × 63mm + 3mm bleed (for 250g bags)
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Label dimensions vary by bag size. We&apos;ll confirm final specs before printing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Skip option */}
        {!state.labelFile && (
          <div className="mt-6 text-center">
            <button
              onClick={handleSkip}
              className="text-sm text-neutral-400 hover:text-foreground transition-colors underline"
            >
              Skip for now — I&apos;ll upload my label later
            </button>
          </div>
        )}
      </motion.div>

      {/* Bag visualisation preview */}
      <motion.div
        className="hidden lg:flex flex-col items-center justify-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <BagVisualisation
          bagPhotoUrl={state.bagPhotoUrl}
          bagColourHex={state.bagColourHex}
          labelFileURL={state.labelFileURL}
          
          size="large"
        />
        <p className="text-sm text-neutral-500 mt-4">
          {state.bagColourName || "Your bag"}
        </p>
      </motion.div>

      {/* Mobile visualisation */}
      <BagVisualisation
        bagPhotoUrl={state.bagPhotoUrl}
        bagColourHex={state.bagColourHex}
        labelFileURL={state.labelFileURL}
        
        size="medium"
        collapsible
      />
    </div>
  );
}
