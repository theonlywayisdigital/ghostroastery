"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  UploadSimple,
  X,
  Palette,
  DownloadSimple,
  Info,
  ChatCircle,
  CheckCircle,
  FolderOpen,
  SpinnerGap,
  Warning,
  PencilSimple,
  SignIn,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import { useBuilder } from "../BuilderContext";
import { StepHeading } from "../StepHeading";
import { BagVisualisation } from "../BagVisualisation";
import { LabelMakerModal } from "../LabelMakerModal";
import { TemplateEmailModal } from "../TemplateEmailModal";
import { createBrowserClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

type LabelTab = "create" | "saved";

interface SavedLabel {
  id: string;
  name: string;
  thumbnail_url: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

const ACCEPTED_TYPES = ["image/png", "image/tiff", "application/pdf"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

export function Step3Label() {
  const { state, dispatch, builderSettings } = useBuilder();
  const [labelMakerOpen, setLabelMakerOpen] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<LabelTab>("create");
  const [templateEmailOpen, setTemplateEmailOpen] = useState(false);

  // Upload validation state
  const [uploading, setUploading] = useState(false);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Auth + saved labels state
  const [user, setUser] = useState<User | null>(null);
  const [savedLabels, setSavedLabels] = useState<SavedLabel[]>([]);
  const [loadingLabels, setLoadingLabels] = useState(false);

  const supabase = useMemo(() => createBrowserClient(), []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Fetch saved labels when switching to saved tab
  useEffect(() => {
    if (activeTab === "saved" && user) {
      setLoadingLabels(true);
      fetch("/api/label/list")
        .then((r) => r.json())
        .then((data) => setSavedLabels(data.labels || []))
        .catch(() => {})
        .finally(() => setLoadingLabels(false));
    }
  }, [activeTab, user]);

  const heading = builderSettings.step3Heading || "Make it yours.";
  const subheading =
    builderSettings.step3Subheading ||
    "Design your label, upload your own, or get help from a designer.";

  const hasLabel = !!state.labelFile || !!state.labelPdfUrl;

  const handleFileChange = useCallback(
    async (file: File | null) => {
      if (!file) return;

      // Reject JPEG
      if (file.type === "image/jpeg" || file.type === "image/jpg") {
        setUploadError(
          "JPEG files are not suitable for print labels. Please use PNG, TIFF, or PDF for best quality."
        );
        return;
      }

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Please upload a PNG, TIFF, or PDF file.");
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setUploadError("File size must be less than 15MB.");
        return;
      }

      setUploadError(null);
      setUploadWarning(null);

      // For PDFs, skip dimension validation (vector-based)
      if (file.type === "application/pdf") {
        dispatch({ type: "SET_LABEL_FILE", file, url: "" });
        setShowUpload(false);
        return;
      }

      // Validate dimensions via API
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/label/validate-upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          setUploadError(data.error || "Upload validation failed.");
          setUploading(false);
          return;
        }

        if (data.dpiWarning) {
          setUploadWarning(data.dpiWarning);
        }
        if (data.warning) {
          setUploadWarning((prev) =>
            prev ? `${prev} ${data.warning}` : data.warning
          );
        }

        // Use the (possibly resized) file URL from the API, or the original
        const url = data.previewUrl || URL.createObjectURL(file);
        dispatch({ type: "SET_LABEL_FILE", file, url });
        setShowUpload(false);
      } catch {
        setUploadError("Upload validation failed. Please try again.");
      }
      setUploading(false);
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
    setUploadWarning(null);
    setUploadError(null);
  };

  const handleExportComplete = useCallback(
    (result: {
      pdfUrl: string;
      previewPngUrl: string | null;
      filename: string;
    }) => {
      dispatch({
        type: "SET_LABEL_FROM_MAKER",
        pdfUrl: result.pdfUrl,
        previewUrl: result.previewPngUrl || result.pdfUrl,
      });
    },
    [dispatch]
  );

  const handleSelectSavedLabel = useCallback(
    (label: SavedLabel) => {
      dispatch({
        type: "SET_LABEL_FROM_SAVED",
        pdfUrl: label.pdf_url || "",
        previewUrl: label.thumbnail_url || "",
        savedLabelId: label.id,
      });
    },
    [dispatch]
  );

  const handleEditSavedLabel = useCallback(
    (labelId: string) => {
      // Open label maker modal — it will load from localStorage
      // Fetch the canvas JSON first and save it for the label maker
      fetch(`/api/label/${labelId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.label?.canvas_json) {
            const json =
              typeof data.label.canvas_json === "string"
                ? data.label.canvas_json
                : JSON.stringify(data.label.canvas_json);
            // Store in localStorage so label maker picks it up
            localStorage.setItem("gr-label-maker", json);
            setLabelMakerOpen(true);
          }
        })
        .catch(() => {});
    },
    []
  );

  const handleSkip = () => {
    dispatch({ type: "SKIP_LABEL" });
    dispatch({ type: "NEXT_STEP" });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Options */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StepHeading heading={heading} subheading={subheading} />

          {/* ─── Current label preview (if set) ─── */}
          {hasLabel && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 border-2 border-accent rounded-xl bg-accent/5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} weight="duotone" className="text-accent" />
                  <span className="text-sm font-medium text-foreground">
                    Label attached
                  </span>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-1.5 text-neutral-400 hover:text-red-500 transition-colors"
                >
                  <X size={16} weight="duotone" />
                </button>
              </div>

              {state.labelFile && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/20 rounded flex items-center justify-center">
                    <UploadSimple size={20} weight="duotone" className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground truncate max-w-[200px]">
                      {state.labelFile.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatFileSize(state.labelFile.size)}
                    </p>
                  </div>
                </div>
              )}

              {state.labelPdfUrl && !state.labelFile && (
                <p className="text-xs text-neutral-400">
                  {state.savedLabelId
                    ? "Selected from saved labels"
                    : "Created with Label Maker"}
                </p>
              )}

              {state.labelFileURL && (
                <div className="mt-3 p-3 bg-neutral-900 rounded-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={state.labelFileURL}
                    alt="Label preview"
                    className="max-h-28 mx-auto object-contain"
                  />
                </div>
              )}

              {/* Upload warnings */}
              {uploadWarning && (
                <div className="mt-3 flex items-start gap-2 p-2 bg-amber-950/30 border border-amber-800/50 rounded-lg">
                  <Warning size={14} weight="duotone" className="text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-amber-400">{uploadWarning}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ─── Tab switcher: Create | Saved Labels ─── */}
          <div className="flex bg-neutral-900 rounded-lg p-1 mb-4">
            <button
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "create"
                  ? "bg-neutral-700 text-foreground"
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              Create
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "saved"
                  ? "bg-neutral-700 text-foreground"
                  : "text-neutral-400 hover:text-foreground"
              }`}
            >
              <FolderOpen size={14} weight="duotone" />
              Saved Labels
            </button>
          </div>

          {/* ─── CREATE TAB ─── */}
          {activeTab === "create" && (
            <div className="space-y-3">
              {/* Option A: Design your label */}
              <motion.button
                onClick={() => setLabelMakerOpen(true)}
                className="w-full group flex items-start gap-4 p-5 rounded-xl border-2 border-accent bg-accent/5 hover:bg-accent/10 transition-colors text-left"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-10 h-10 shrink-0 bg-accent rounded-lg flex items-center justify-center">
                  <Palette size={24} weight="duotone" className="text-neutral-900" />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-semibold mb-0.5">
                    Design your label
                  </p>
                  <p className="text-sm text-neutral-400">
                    Use our free label maker with templates, AI tools, and
                    drag-and-drop editing.
                  </p>
                  <span className="inline-block mt-2 text-xs font-medium text-accent group-hover:underline">
                    Open Label Maker &rarr;
                  </span>
                </div>
              </motion.button>

              {/* Option B: Upload a file */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {!showUpload ? (
                  <button
                    onClick={() => setShowUpload(true)}
                    className="w-full group flex items-start gap-4 p-5 rounded-xl border border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 shrink-0 bg-neutral-800 rounded-lg flex items-center justify-center">
                      <UploadSimple size={24} weight="duotone" className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium mb-0.5">
                        Upload a finished file
                      </p>
                      <p className="text-sm text-neutral-500">
                        Already have artwork? Upload a print-ready PDF, PNG, or
                        TIFF.
                      </p>
                    </div>
                  </button>
                ) : (
                  <div className="rounded-xl border border-neutral-700 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">
                        Upload your label file
                      </p>
                      <button
                        onClick={() => {
                          setShowUpload(false);
                          setUploadError(null);
                        }}
                        className="p-1 text-neutral-400 hover:text-foreground"
                      >
                        <X size={16} weight="duotone" />
                      </button>
                    </div>

                    {/* Upload error */}
                    {uploadError && (
                      <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-800/50 rounded-lg">
                        <Warning size={20} weight="duotone" className="text-red-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-400">{uploadError}</p>
                      </div>
                    )}

                    {/* Drop zone */}
                    <label
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-neutral-700 rounded-lg cursor-pointer hover:border-neutral-600 hover:bg-neutral-900/50 transition-colors"
                    >
                      {uploading ? (
                        <>
                          <SpinnerGap size={32} weight="duotone" className="text-neutral-500 mb-2 animate-spin" />
                          <p className="text-sm text-neutral-400">
                            Validating...
                          </p>
                        </>
                      ) : (
                        <>
                          <UploadSimple size={40} weight="duotone" className="text-white mb-2" />
                          <p className="text-sm text-foreground font-medium">
                            Drag and drop here
                          </p>
                          <p className="text-xs text-neutral-500 mt-1">
                            or click to browse
                          </p>
                          <p className="text-[10px] text-neutral-600 mt-2">
                            PDF, PNG, or TIFF — Max 15MB
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        accept=".png,.pdf,.tiff,.tif,image/png,application/pdf,image/tiff"
                        onChange={(e) =>
                          handleFileChange(e.target.files?.[0] || null)
                        }
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>

                    {/* Template download (email-gated) */}
                    <button
                      onClick={() => setTemplateEmailOpen(true)}
                      className="flex items-center gap-2 text-xs text-neutral-400 hover:text-accent transition-colors"
                    >
                      <DownloadSimple size={16} weight="duotone" />
                      Download blank template PDF
                    </button>

                    {/* Design services link */}
                    <a
                      href="/design-services"
                      className="flex items-center gap-2 text-xs text-neutral-400 hover:text-accent transition-colors"
                    >
                      <ArrowSquareOut size={16} weight="duotone" />
                      Need help with your label? We offer design services.
                    </a>
                  </div>
                )}
              </motion.div>

              {/* Option C: Get help */}
              <motion.a
                href="mailto:hello@roasteryplatform.com?subject=Label%20design%20help"
                className="w-full group flex items-start gap-4 p-5 rounded-xl border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/30 transition-colors text-left block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-10 h-10 shrink-0 bg-neutral-800 rounded-lg flex items-center justify-center">
                  <ChatCircle size={24} weight="duotone" className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-neutral-300 font-medium mb-0.5">
                    Need a designer? Get help
                  </p>
                  <p className="text-sm text-neutral-500">
                    Our team can design your label for you. Get in touch for a
                    quote.
                  </p>
                </div>
              </motion.a>
            </div>
          )}

          {/* ─── SAVED LABELS TAB ─── */}
          {activeTab === "saved" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-3"
            >
              {!user ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <SignIn size={40} weight="duotone" className="text-white mb-3" />
                  <p className="text-sm text-neutral-300 mb-1">
                    Sign in to access your saved labels
                  </p>
                  <p className="text-xs text-neutral-500 mb-4">
                    Design labels in the Label Maker and save them for reuse
                  </p>
                </div>
              ) : loadingLabels ? (
                <div className="flex items-center justify-center py-12">
                  <SpinnerGap size={24} weight="duotone" className="text-neutral-500 animate-spin" />
                </div>
              ) : savedLabels.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <FolderOpen size={40} weight="duotone" className="text-white mb-3" />
                  <p className="text-sm text-neutral-300 mb-1">
                    No saved labels yet
                  </p>
                  <p className="text-xs text-neutral-500 mb-4">
                    Open the Label Maker and save a design to see it here
                  </p>
                  <button
                    onClick={() => {
                      setActiveTab("create");
                      setLabelMakerOpen(true);
                    }}
                    className="px-4 py-2 bg-accent text-neutral-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-colors"
                  >
                    Open Label Maker
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {savedLabels.map((label) => (
                    <div
                      key={label.id}
                      className={`group relative rounded-xl border overflow-hidden transition-colors cursor-pointer ${
                        state.savedLabelId === label.id
                          ? "border-accent bg-accent/5"
                          : "border-neutral-700 hover:border-neutral-600"
                      }`}
                    >
                      <button
                        onClick={() => handleSelectSavedLabel(label)}
                        className="w-full text-left"
                      >
                        <div className="aspect-[102/152] bg-neutral-900 flex items-center justify-center">
                          {label.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={label.thumbnail_url}
                              alt={label.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs text-neutral-600">
                              No preview
                            </span>
                          )}
                        </div>
                        <div className="px-2.5 py-2">
                          <p className="text-xs font-medium text-foreground truncate">
                            {label.name}
                          </p>
                          <p className="text-[10px] text-neutral-500">
                            {formatDate(label.updated_at)}
                          </p>
                        </div>
                      </button>

                      {/* Edit button */}
                      <button
                        onClick={() => handleEditSavedLabel(label.id)}
                        className="absolute top-1.5 right-1.5 p-1.5 bg-neutral-900/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-accent"
                        title="Edit in Label Maker"
                      >
                        <PencilSimple size={12} weight="duotone" />
                      </button>

                      {/* Selected indicator */}
                      {state.savedLabelId === label.id && (
                        <div className="absolute top-1.5 left-1.5">
                          <CheckCircle size={24} weight="duotone" className="text-accent" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Dimensions info */}
          <motion.div
            className="mt-6 p-4 bg-neutral-900/50 rounded-lg border border-neutral-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-start gap-2">
              <Info size={20} weight="duotone" className="text-white mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Label dimensions
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  102mm &times; 152mm + 3mm bleed (108mm &times; 158mm total)
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Safe zone: 4mm inset from trim. Resolution: 300 DPI.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Skip option */}
          {!hasLabel && (
            <div className="mt-6 text-center">
              <button
                onClick={handleSkip}
                className="text-sm text-neutral-400 hover:text-foreground transition-colors underline"
              >
                Skip for now — I&apos;ll add my label later
              </button>
            </div>
          )}
        </motion.div>

        {/* Bag visualisation preview (desktop) */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <BagVisualisation
            bagPhotoUrl={state.bagPhotoUrl}
            bagColourHex={state.bagColourHex}
            bagColourName={state.bagColourName}
            actualBagPhotoUrl={state.actualBagPhotoUrl}
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
          bagColourName={state.bagColourName}
          actualBagPhotoUrl={state.actualBagPhotoUrl}
          labelFileURL={state.labelFileURL}
          size="medium"
          collapsible
        />
      </div>

      {/* ─── Label Maker Modal ─── */}
      <LabelMakerModal
        isOpen={labelMakerOpen}
        onClose={() => setLabelMakerOpen(false)}
        onExportComplete={handleExportComplete}
      />

      {/* ─── Template Email Modal ─── */}
      <TemplateEmailModal
        open={templateEmailOpen}
        onClose={() => setTemplateEmailOpen(false)}
      />
    </>
  );
}
