"use client";

import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  GridFour,
  Ruler,
  MagnetStraight,
  ShieldCheck,
  FloppyDisk,
  ArrowRight,
  Eye,
  FolderOpen,
  SpinnerGap,
  CheckCircle,
} from "@phosphor-icons/react";
import { LabelCanvas } from "./LabelCanvas";
import { HorizontalRuler, VerticalRuler, RULER_SIZE } from "./Rulers";
import { LeftPanel } from "./LeftPanel";
import { PropertiesPanel } from "./PropertiesPanel";
import { PrintReadinessPanel } from "./PrintReadinessPanel";
import { ExportPanel } from "./ExportPanel";
import { BagPreviewModal } from "./BagPreviewModal";
import { AuthModal } from "./AuthModal";
import { SavedLabelsPanel } from "./SavedLabelsPanel";
import { MobileLabelMaker } from "./mobile/MobileLabelMaker";
import { LABEL_DIMENSIONS, mmToPx } from "./types";
import type { ZoomLevel } from "./types";
import { createBrowserClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

interface LabelMakerClientProps {
  /** Called after a successful PDF export (for builder integration) */
  onExportComplete?: (result: { pdfUrl: string; previewPngUrl: string | null; filename: string }) => void;
}

const ZOOM_OPTIONS: { label: string; value: ZoomLevel }[] = [
  { label: "Fit", value: "fit" },
  { label: "50%", value: 50 },
  { label: "100%", value: 100 },
  { label: "200%", value: 200 },
];

export function LabelMakerClient({
  onExportComplete,
}: LabelMakerClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [printCheckOpen, setPrintCheckOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [bagPreviewOpen, setBagPreviewOpen] = useState(false);
  const [bagPreviewImage, setBagPreviewImage] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [savedLabelsOpen, setSavedLabelsOpen] = useState(false);
  const [currentLabelId, setCurrentLabelId] = useState<string | null>(null);
  const [labelRefreshTrigger, setLabelRefreshTrigger] = useState(0);
  const pendingSaveRef = useRef(false);
  const hasUnsavedChanges = useRef(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createBrowserClient(), []);

  // Initialize auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: u } }) => setUser(u));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load label from URL param (e.g. ?labelId=xxx from portal "Edit" link)
  const labelIdParam = searchParams.get("labelId");
  const [labelIdLoaded, setLabelIdLoaded] = useState<string | null>(null);

  const dimensions = LABEL_DIMENSIONS;

  const canvas = LabelCanvas({
    dimensions,
    containerRef,
  });

  // Track unsaved changes via fabric canvas events
  useEffect(() => {
    const fab = canvas.fabricRef.current;
    if (!fab) return;
    const markDirty = () => { hasUnsavedChanges.current = true; };
    fab.on("object:modified", markDirty);
    fab.on("object:added", markDirty);
    fab.on("object:removed", markDirty);
    return () => {
      fab.off("object:modified", markDirty);
      fab.off("object:added", markDirty);
      fab.off("object:removed", markDirty);
    };
  }, [canvas.fabricRef]);

  // Load a specific label when ?labelId= is in the URL
  useEffect(() => {
    if (!labelIdParam || labelIdParam === labelIdLoaded) return;
    if (!user) return; // Wait for auth state

    setLabelIdLoaded(labelIdParam);

    fetch(`/api/label/${labelIdParam}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch label");
        return res.json();
      })
      .then((data) => {
        if (data.label?.canvas_json) {
          // Poll until the Fabric canvas is fully initialized (including
          // any localStorage restore and DOM reparenting).
          const tryLoad = () => {
            if (canvas.canvasReadyRef.current) {
              setTemplateLoading(true);
              canvas.loadTemplate(data.label.canvas_json).finally(() => setTemplateLoading(false));
              setCurrentLabelId(labelIdParam);
            } else {
              setTimeout(tryLoad, 100);
            }
          };
          tryLoad();
        }
      })
      .catch((err) => console.error("Load label from URL error:", err));
  }, [labelIdParam, labelIdLoaded, user, canvas]);

  const handleStartFresh = () => {
    const ok = window.confirm(
      "This will clear your entire design. Are you sure?"
    );
    if (ok) {
      canvas.startFresh();
      setCurrentLabelId(null);
    }
  };

  const handleLogoClick = () => {
    if (hasUnsavedChanges.current) {
      const ok = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!ok) return;
    }
    router.push("/");
  };

  // Save label to profile
  const saveToProfile = useCallback(async () => {
    if (!canvas.getCanvasJson || !canvas.getCanvasImage) {
      console.error("saveToProfile: canvas methods not available");
      return;
    }
    setSaving(true);
    try {
      const canvasJson = canvas.getCanvasJson();
      const canvasImage = canvas.getCanvasImage();
      if (!canvasJson || !canvasImage) throw new Error("No canvas data");

      const res = await fetch("/api/label/save", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          canvasJson,
          canvasImageBase64: canvasImage,
          name: currentLabelId ? undefined : "Untitled Label",
          labelId: currentLabelId,
          dimensions: {
            widthMm: dimensions.widthMm,
            heightMm: dimensions.heightMm,
            bleedMm: dimensions.bleedMm,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentLabelId(data.label.id);
        setSaved(true);
        hasUnsavedChanges.current = false;
        setLabelRefreshTrigger((n) => n + 1);
        setTimeout(() => setSaved(false), 2000);
      } else {
        console.error("Save label error:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Save label error:", err);
    }
    setSaving(false);
  }, [canvas, currentLabelId, dimensions]);

  const handleSave = useCallback(() => {
    if (!user) {
      console.log("handleSave: no user, opening auth modal");
      pendingSaveRef.current = true;
      setAuthModalOpen(true);
      return;
    }
    console.log("handleSave: user found, saving...");
    saveToProfile();
  }, [user, saveToProfile]);

  const handleAuthSuccess = useCallback(() => {
    setAuthModalOpen(false);
    if (pendingSaveRef.current) {
      pendingSaveRef.current = false;
      // Small delay to let auth state propagate
      setTimeout(() => saveToProfile(), 500);
    }
  }, [saveToProfile]);

  const handleLoadLabel = useCallback(
    async (labelId: string, canvasJson: string) => {
      setTemplateLoading(true);
      try {
        await canvas.loadTemplate(canvasJson);
      } finally {
        setTemplateLoading(false);
      }
      setCurrentLabelId(labelId);
      setSavedLabelsOpen(false);
    },
    [canvas]
  );

  const handleApplyTemplate = useCallback(
    async (template: import("./data/templates").TemplateDefinition) => {
      setTemplateLoading(true);
      try {
        await canvas.applyTemplate(template);
      } finally {
        setTemplateLoading(false);
      }
    },
    [canvas]
  );

  const handleNewLabel = useCallback(() => {
    canvas.startFresh();
    setCurrentLabelId(null);
    setSavedLabelsOpen(false);
  }, [canvas]);

  const [templateLoading, setTemplateLoading] = useState(false);
  const [autoExporting, setAutoExporting] = useState(false);

  const handleDone = useCallback(() => {
    if (onExportComplete) {
      // Builder flow: auto-export and pass result back to parent
      setAutoExporting(true);
      const canvasImage = canvas.getCanvasImage();
      if (!canvasImage) {
        console.error("handleDone: canvas.getCanvasImage() returned null");
        setAutoExporting(false);
        return;
      }
      fetch("/api/label/export-pdf", {
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
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Export failed");
          const data = await res.json();
          localStorage.removeItem(canvas.storageKey);
          onExportComplete(data);
        })
        .catch((err) => {
          console.error("Auto-export error:", err);
        })
        .finally(() => setAutoExporting(false));
    } else {
      // Standalone: save label (uploads all files including print PNG, PDF, etc.)
      if (!user) {
        pendingSaveRef.current = true;
        setAuthModalOpen(true);
        return;
      }
      handleSave();
    }
  }, [onExportComplete, canvas, dimensions, user, handleSave]);

  const handleBagPreview = () => {
    const trimImage = canvas.getTrimImage();
    setBagPreviewImage(trimImage);
    setBagPreviewOpen(true);
  };

  const scaledCanvasW = mmToPx(canvas.totalWMm) * canvas.currentScale;
  const scaledCanvasH = mmToPx(canvas.totalHMm) * canvas.currentScale;

  return (
    <>
      {/*
        Persistent canvas host — always in the DOM so the Fabric.js canvas
        element is never unmounted. On desktop it's placed inside the ruler
        layout below. On mobile it's reparented into MobileCanvasViewport.
        When neither layout has claimed it, it stays here (offscreen / hidden).
      */}
      <div
        ref={canvasHostRef}
        style={{ display: isMobile ? "none" : undefined }}
      >
        <canvas ref={canvas.canvasRef} />
      </div>

      {isMobile ? (
        <MobileLabelMaker
          dimensions={dimensions}
          canvas={canvas}
          containerRef={containerRef}
          canvasHostRef={canvasHostRef}
          onExportComplete={onExportComplete}
          user={user}
          onSave={handleSave}
          onLogoClick={handleLogoClick}
          saving={saving}
          saved={saved}
          currentLabelId={currentLabelId}
          onLoadLabel={handleLoadLabel}
          onNewLabel={handleNewLabel}
          onSignIn={() => setAuthModalOpen(true)}
          labelRefreshTrigger={labelRefreshTrigger}
          templateLoading={templateLoading}
          onApplyTemplate={handleApplyTemplate}
        />
      ) : (
        <div className="flex flex-col h-screen bg-neutral-900 text-foreground overflow-hidden">
          {/* ─── TOP BAR ─── */}
          <header className="flex items-center justify-between px-4 h-12 bg-neutral-800 border-b border-neutral-700 shrink-0">
            {/* Left: Logo + title */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogoClick}
                className="flex items-center cursor-pointer"
              >
                <Image
                  src="/ghost-roastery-consumer-logo.png"
                  alt="Ghost Roastery"
                  width={240}
                  height={56}
                  className="h-12 w-auto"
                  priority
                />
              </button>
              <span className="text-neutral-600">|</span>
              <span className="text-sm font-medium text-neutral-300">
                Label Maker
              </span>
            </div>

            {/* Centre: Tools */}
            <div className="flex items-center gap-1">
              <ToolbarButton
                icon={<ArrowCounterClockwise size={16} weight="duotone" />}
                label="Undo"
                onClick={canvas.undo}
                disabled={!canvas.canUndoState}
              />
              <ToolbarButton
                icon={<ArrowClockwise size={16} weight="duotone" />}
                label="Redo"
                onClick={canvas.redo}
                disabled={!canvas.canRedoState}
              />

              <div className="w-px h-5 bg-neutral-700 mx-1" />

              {ZOOM_OPTIONS.map((opt) => (
                <button
                  key={String(opt.value)}
                  onClick={() => canvas.applyZoom(opt.value)}
                  className={cn(
                    "px-2 py-1 text-xs rounded transition-colors",
                    canvas.zoom === opt.value
                      ? "bg-neutral-600 text-foreground"
                      : "text-neutral-400 hover:text-foreground hover:bg-neutral-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}

              <div className="w-px h-5 bg-neutral-700 mx-1" />

              <ToolbarButton
                icon={<Ruler size={16} weight="duotone" />}
                label="Guides"
                onClick={canvas.toggleGuides}
                active={canvas.guidesVisible}
              />
              <ToolbarButton
                icon={<GridFour size={16} weight="duotone" />}
                label="Grid"
                onClick={canvas.toggleGrid}
                active={canvas.gridVisible}
              />
              <ToolbarButton
                icon={<MagnetStraight size={16} weight="duotone" />}
                label="Snap"
                onClick={canvas.toggleSnap}
                active={canvas.snapEnabled}
              />
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPrintCheckOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded transition-colors"
              >
                <ShieldCheck size={14} weight="duotone" />
                Check print readiness
              </button>
              <button
                onClick={handleBagPreview}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded transition-colors"
              >
                <Eye size={14} weight="duotone" />
                Preview on bag
              </button>
              <button
                onClick={handleStartFresh}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded transition-colors"
              >
                <ArrowCounterClockwise size={14} weight="duotone" />
                Start fresh
              </button>

              <div className="w-px h-5 bg-neutral-700" />

              <button
                onClick={() => setSavedLabelsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded transition-colors"
              >
                <FolderOpen size={14} weight="duotone" />
                My Labels
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <SpinnerGap size={14} weight="duotone" className="animate-spin" />
                ) : (
                  <FloppyDisk size={14} weight="duotone" />
                )}
                {saved ? "Saved!" : saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleDone}
                disabled={autoExporting || (!onExportComplete && saving)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-accent text-neutral-900 font-medium rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {autoExporting ? (
                  <>
                    <SpinnerGap size={14} weight="duotone" className="animate-spin" />
                    Exporting...
                  </>
                ) : !onExportComplete && saving ? (
                  <>
                    <SpinnerGap size={14} weight="duotone" className="animate-spin" />
                    Saving...
                  </>
                ) : !onExportComplete && saved ? (
                  <>
                    <CheckCircle size={14} weight="duotone" />
                    Saved!
                  </>
                ) : (
                  <>
                    Done
                    <ArrowRight size={14} weight="duotone" />
                  </>
                )}
              </button>
            </div>
          </header>

          {/* ─── MAIN AREA ─── */}
          <div className="flex flex-1 overflow-hidden">
            {/* ─── LEFT PANEL ─── */}
            <LeftPanel
              dimensions={dimensions}
              onAddText={canvas.addText}
              onAddLabelField={canvas.addLabelField}
              onAddSvgElement={canvas.addSvgElement}
              onAddImage={canvas.addImage}
              onApplyTemplate={handleApplyTemplate}
              onUploadLogo={canvas.replaceLogoZone}
              hasContent={canvas.hasContent}
              getCanvasImage={canvas.getCanvasImage}
              getLogoImage={canvas.getLogoImage}
              onAddBackground={canvas.addBackground}
              onApplyPalette={canvas.applyPalette}
            />

            {/* ─── CANVAS AREA ─── */}
            <DesktopCanvasArea
              containerRef={containerRef}
              canvasHostRef={canvasHostRef}
              scaledCanvasW={scaledCanvasW}
              scaledCanvasH={scaledCanvasH}
              canvas={canvas}
              dimensions={dimensions}
              templateLoading={templateLoading}
            />

            {/* ─── RIGHT PANEL ─── */}
            <PropertiesPanel
              fabricRef={canvas.fabricRef}
              onCanvasModified={canvas.onCanvasModified}
              bringForward={canvas.bringForward}
              sendBackward={canvas.sendBackward}
              bringToFront={canvas.bringToFront}
              sendToBack={canvas.sendToBack}
              onDuplicate={canvas.duplicateSelected}
              onReplaceImage={canvas.replaceSelectedImage}
            />
          </div>

          {/* ─── PRINT READINESS MODAL ─── */}
          <PrintReadinessPanel
            open={printCheckOpen}
            onClose={() => setPrintCheckOpen(false)}
            getCanvasImage={canvas.getCanvasImage}
            getElementsForCheck={canvas.getElementsForCheck}
            dimensions={dimensions}
          />

          {/* ─── EXPORT PDF MODAL ─── */}
          <ExportPanel
            open={exportOpen}
            onClose={() => setExportOpen(false)}
            getCanvasImage={canvas.getCanvasImage}
            dimensions={dimensions}
            storageKey={canvas.storageKey}
            onExportComplete={onExportComplete}
            isLoggedIn={!!user}
          />

          {/* ─── BAG PREVIEW MODAL ─── */}
          <BagPreviewModal
            open={bagPreviewOpen}
            onClose={() => setBagPreviewOpen(false)}
            labelImageDataUrl={bagPreviewImage}
            onDone={handleDone}
          />

          {/* ─── SAVED LABELS PANEL ─── */}
          <SavedLabelsPanel
            open={savedLabelsOpen}
            onClose={() => setSavedLabelsOpen(false)}
            user={user}
            onLoadLabel={handleLoadLabel}
            onNewLabel={handleNewLabel}
            onSignIn={() => {
              setSavedLabelsOpen(false);
              setAuthModalOpen(true);
            }}
            currentLabelId={currentLabelId}
            refreshTrigger={labelRefreshTrigger}
          />
        </div>
      )}

      {/* ─── AUTH MODAL (shared across desktop/mobile) ─── */}
      <AuthModal
        open={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          pendingSaveRef.current = false;
        }}
        onAuthSuccess={handleAuthSuccess}
      />
    </>
  );
}

// ─── Desktop canvas area — places the canvas host inside the ruler layout ───

function DesktopCanvasArea({
  containerRef,
  canvasHostRef,
  scaledCanvasW,
  scaledCanvasH,
  canvas,
  dimensions,
  templateLoading,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canvasHostRef: React.RefObject<HTMLDivElement | null>;
  scaledCanvasW: number;
  scaledCanvasH: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dimensions: any;
  templateLoading: boolean;
}) {
  const desktopSlotRef = useRef<HTMLDivElement>(null);

  // Reparent the canvas host content into the desktop slot
  useEffect(() => {
    const host = canvasHostRef.current;
    const slot = desktopSlotRef.current;
    if (!host || !slot) return;

    // Move all children from the persistent host into the desktop slot
    const children = Array.from(host.children);
    children.forEach((child) => slot.appendChild(child));

    return () => {
      // Move back to host on unmount
      const slotChildren = Array.from(slot.children);
      slotChildren.forEach((child) => host.appendChild(child));
    };
  }, [canvasHostRef]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-auto bg-neutral-950 relative"
    >
      {/* Loading overlay while fonts / template are loading */}
      {templateLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-neutral-950/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <SpinnerGap size={28} weight="duotone" className="animate-spin text-accent" />
            <span className="text-xs text-neutral-300">Loading fonts...</span>
          </div>
        </div>
      )}

      <div
        className="flex items-center justify-center"
        style={{
          minWidth: scaledCanvasW + RULER_SIZE + 40,
          minHeight: scaledCanvasH + RULER_SIZE + 80,
          width: "100%",
          height: "100%",
        }}
      >
        <div className="flex flex-col">
          {/* Top row: corner square + horizontal ruler */}
          <div className="flex">
            <div
              className="bg-neutral-800 border-b border-r border-neutral-700 shrink-0"
              style={{ width: RULER_SIZE, height: RULER_SIZE }}
            />
            <HorizontalRuler
              totalWMm={canvas.totalWMm}
              totalHMm={canvas.totalHMm}
              scale={canvas.currentScale}
              bleedMm={dimensions.bleedMm}
            />
          </div>

          {/* Bottom row: vertical ruler + canvas + legend */}
          <div className="flex">
            <VerticalRuler
              totalWMm={canvas.totalWMm}
              totalHMm={canvas.totalHMm}
              scale={canvas.currentScale}
              bleedMm={dimensions.bleedMm}
            />

            <div className="flex flex-col">
              {/* Slot for the Fabric canvas */}
              <div ref={desktopSlotRef} />

              {/* Guide legend */}
              {canvas.guidesVisible && (
                <div className="flex items-center gap-4 mt-2 ml-0.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0 border-t-2 border-dashed" style={{ borderColor: "#ef4444" }} />
                    <span className="text-[10px] text-neutral-400">Bleed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0 border-t-2" style={{ borderColor: "#3b82f6" }} />
                    <span className="text-[10px] text-neutral-400">Trim</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0 border-t-2 border-dashed" style={{ borderColor: "#22c55e" }} />
                    <span className="text-[10px] text-neutral-400">Safe zone</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Small helper components ───

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "p-1.5 rounded transition-colors",
        active
          ? "bg-neutral-600 text-foreground"
          : "text-neutral-400 hover:text-foreground hover:bg-neutral-700",
        disabled && "opacity-30 cursor-not-allowed"
      )}
    >
      {icon}
    </button>
  );
}
