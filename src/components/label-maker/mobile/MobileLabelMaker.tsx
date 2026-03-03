"use client";

import { useState, useCallback, useEffect, type RefObject } from "react";
import type { LabelDimensions } from "../types";
import { MobileHeader } from "./MobileHeader";
import { MobileToolbar, type MobileToolTab } from "./MobileToolbar";
import { MobileCanvasViewport } from "./MobileCanvasViewport";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { MobileTemplatesSheet } from "./MobileTemplatesSheet";
import { MobileElementsSheet } from "./MobileElementsSheet";
import { MobileTextSheet } from "./MobileTextSheet";
import { MobileUploadSheet } from "./MobileUploadSheet";
import { MobileAiSheet } from "./MobileAiSheet";
import { MobilePropertiesSheet } from "./MobilePropertiesSheet";
import { MobileContextMenu } from "./MobileContextMenu";
import { MobileExportSheet } from "./MobileExportSheet";
import { MobileSavedLabelsSheet } from "./MobileSavedLabelsSheet";
import { PrintReadinessPanel } from "../PrintReadinessPanel";
import { BagPreviewModal } from "../BagPreviewModal";
import type { User } from "@supabase/supabase-js";

interface MobileLabelMakerProps {
  dimensions: LabelDimensions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canvas: any;
  containerRef: RefObject<HTMLDivElement | null>;
  /**
   * Ref to the host element containing the <canvas> + Fabric wrapper.
   * On desktop this is inside the ruler layout; on mobile we reparent
   * the Fabric wrapper into the mobile viewport.
   */
  canvasHostRef: RefObject<HTMLDivElement | null>;
  onExportComplete?: (result: {
    pdfUrl: string;
    previewPngUrl: string | null;
    filename: string;
  }) => void;
  user: User | null;
  onSave: () => void;
  saving: boolean;
  saved: boolean;
  currentLabelId: string | null;
  onLoadLabel: (labelId: string, canvasJson: string) => void;
  onNewLabel: () => void;
  onSignIn: () => void;
  labelRefreshTrigger?: number;
}

export function MobileLabelMaker({
  dimensions,
  canvas,
  containerRef,
  canvasHostRef,
  onExportComplete,
  user,
  onSave,
  saving,
  saved,
  currentLabelId,
  onLoadLabel,
  onNewLabel,
  onSignIn,
  labelRefreshTrigger,
}: MobileLabelMakerProps) {
  const [activeTab, setActiveTab] = useState<MobileToolTab | null>(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [selectedObject, setSelectedObject] = useState<{
    type: string;
    bounds: { left: number; top: number; width: number; height: number };
  } | null>(null);
  const [printCheckOpen, setPrintCheckOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [bagPreviewOpen, setBagPreviewOpen] = useState(false);
  const [bagPreviewImage, setBagPreviewImage] = useState<string | null>(null);
  const [savedLabelsOpen, setSavedLabelsOpen] = useState(false);

  // Listen for Fabric.js selection events
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fc = canvas.fabricRef.current as any;
    if (!fc) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onSelected = (e: any) => {
      const obj = e.selected?.[0] || fc.getActiveObject();
      if (obj) {
        setHasSelection(true);
        const bound = obj.getBoundingRect();
        setSelectedObject({
          type: obj.type || "object",
          bounds: {
            left: bound.left,
            top: bound.top,
            width: bound.width,
            height: bound.height,
          },
        });
      }
    };

    const onDeselected = () => {
      setHasSelection(false);
      setSelectedObject(null);
      // If properties sheet is open, close it
      if (activeTab === "properties") {
        setActiveTab(null);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onModified = (e: any) => {
      const obj = e.target;
      if (obj) {
        const bound = obj.getBoundingRect();
        setSelectedObject({
          type: obj.type || "object",
          bounds: {
            left: bound.left,
            top: bound.top,
            width: bound.width,
            height: bound.height,
          },
        });
      }
    };

    fc.on("selection:created", onSelected);
    fc.on("selection:updated", onSelected);
    fc.on("selection:cleared", onDeselected);
    fc.on("object:modified", onModified);
    fc.on("object:moving", onModified);

    return () => {
      fc.off("selection:created", onSelected);
      fc.off("selection:updated", onSelected);
      fc.off("selection:cleared", onDeselected);
      fc.off("object:modified", onModified);
      fc.off("object:moving", onModified);
    };
  }, [canvas.fabricRef, activeTab]);

  const handleTabPress = useCallback(
    (tab: MobileToolTab) => {
      setActiveTab(activeTab === tab ? null : tab);
    },
    [activeTab]
  );

  const closeSheet = useCallback(() => {
    setActiveTab(null);
  }, []);

  const handleStartFresh = useCallback(() => {
    const ok = window.confirm(
      "This will clear your entire design. Are you sure?"
    );
    if (ok) canvas.startFresh();
  }, [canvas]);

  const [autoExporting, setAutoExporting] = useState(false);

  const handleDone = useCallback(() => {
    if (onExportComplete) {
      // Builder flow: auto-export without showing the export sheet
      setAutoExporting(true);
      const canvasImage = canvas.getCanvasImage();
      if (!canvasImage) {
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
          setExportOpen(true);
        })
        .finally(() => setAutoExporting(false));
    } else {
      setExportOpen(true);
    }
  }, [onExportComplete, canvas, dimensions]);

  const handleBagPreview = useCallback(() => {
    const trimImage = canvas.getTrimImage();
    setBagPreviewImage(trimImage);
    setBagPreviewOpen(true);
  }, [canvas]);

  return (
    <div className="flex flex-col h-[100dvh] bg-neutral-900 text-foreground overflow-hidden">
      {/* Header */}
      <MobileHeader
        onUndo={canvas.undo}
        onRedo={canvas.redo}
        canUndo={canvas.canUndoState}
        canRedo={canvas.canRedoState}
        guidesVisible={canvas.guidesVisible}
        gridVisible={canvas.gridVisible}
        snapEnabled={canvas.snapEnabled}
        onToggleGuides={canvas.toggleGuides}
        onToggleGrid={canvas.toggleGrid}
        onToggleSnap={canvas.toggleSnap}
        onStartFresh={handleStartFresh}
        onPrintCheck={() => setPrintCheckOpen(true)}
        onBagPreview={handleBagPreview}
        onDone={handleDone}
        onMyLabels={() => setSavedLabelsOpen(true)}
        onSave={onSave}
        saving={saving}
        saved={saved}
        autoExporting={autoExporting}
      />

      {/* Canvas viewport */}
      <MobileCanvasViewport
        canvasRef={canvas.canvasRef}
        fabricRef={canvas.fabricRef}
        containerRef={containerRef}
        canvasHostRef={canvasHostRef}
        totalWMm={canvas.totalWMm}
        totalHMm={canvas.totalHMm}
        currentScale={canvas.currentScale}
        applyZoom={canvas.applyZoom}
      />

      {/* Context menu for selected objects */}
      {hasSelection && selectedObject && activeTab !== "properties" && (
        <MobileContextMenu
          bounds={selectedObject.bounds}
          onDuplicate={canvas.duplicateSelected}
          onDelete={() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const fc = canvas.fabricRef.current as any;
            if (fc) {
              const obj = fc.getActiveObject();
              if (obj) {
                fc.remove(obj);
                fc.discardActiveObject();
                canvas.onCanvasModified();
              }
            }
          }}
          onBringForward={canvas.bringForward}
          onSendBackward={canvas.sendBackward}
        />
      )}

      {/* Toolbar */}
      <MobileToolbar
        activeTab={activeTab}
        onTabPress={handleTabPress}
        hasSelection={hasSelection}
      />

      {/* Bottom Sheets */}
      <MobileBottomSheet
        open={activeTab === "templates"}
        onClose={closeSheet}
        title="Templates"
        initialSnap="half"
      >
        <MobileTemplatesSheet
          onApplyTemplate={canvas.applyTemplate}
          hasContent={canvas.hasContent}
          onDismiss={closeSheet}
        />
      </MobileBottomSheet>

      <MobileBottomSheet
        open={activeTab === "elements"}
        onClose={closeSheet}
        title="Elements"
        initialSnap="half"
      >
        <MobileElementsSheet onAddSvgElement={canvas.addSvgElement} />
      </MobileBottomSheet>

      <MobileBottomSheet
        open={activeTab === "text"}
        onClose={closeSheet}
        title="Text"
        initialSnap="half"
      >
        <MobileTextSheet
          onAddText={canvas.addText}
          onAddLabelField={canvas.addLabelField}
        />
      </MobileBottomSheet>

      <MobileBottomSheet
        open={activeTab === "upload"}
        onClose={closeSheet}
        title="Upload"
        initialSnap="half"
      >
        <MobileUploadSheet
          onAddImage={canvas.addImage}
          onUploadLogo={canvas.replaceLogoZone}
        />
      </MobileBottomSheet>

      <MobileBottomSheet
        open={activeTab === "ai"}
        onClose={closeSheet}
        title="AI Tools"
        initialSnap="half"
      >
        <MobileAiSheet
          getCanvasImage={canvas.getCanvasImage}
          getLogoImage={canvas.getLogoImage}
          onAddBackground={canvas.addBackground}
          onApplyPalette={canvas.applyPalette}
          onAddText={canvas.addText}
        />
      </MobileBottomSheet>

      <MobileBottomSheet
        open={activeTab === "properties"}
        onClose={closeSheet}
        title="Properties"
        initialSnap="peek"
      >
        <MobilePropertiesSheet
          fabricRef={canvas.fabricRef}
          onCanvasModified={canvas.onCanvasModified}
          bringForward={canvas.bringForward}
          sendBackward={canvas.sendBackward}
          bringToFront={canvas.bringToFront}
          sendToBack={canvas.sendToBack}
          onDuplicate={canvas.duplicateSelected}
          onReplaceImage={canvas.replaceSelectedImage}
        />
      </MobileBottomSheet>

      {/* Export Sheet */}
      <MobileExportSheet
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        getCanvasImage={canvas.getCanvasImage}
        dimensions={dimensions}
        storageKey={canvas.storageKey}
        onExportComplete={onExportComplete}
      />

      {/* Print Readiness Modal */}
      <PrintReadinessPanel
        open={printCheckOpen}
        onClose={() => setPrintCheckOpen(false)}
        getCanvasImage={canvas.getCanvasImage}
        getElementsForCheck={canvas.getElementsForCheck}
        dimensions={dimensions}
      />

      {/* Bag Preview Modal */}
      <BagPreviewModal
        open={bagPreviewOpen}
        onClose={() => setBagPreviewOpen(false)}
        labelImageDataUrl={bagPreviewImage}
        onDone={handleDone}
      />

      {/* Saved Labels Sheet */}
      <MobileSavedLabelsSheet
        open={savedLabelsOpen}
        onClose={() => setSavedLabelsOpen(false)}
        user={user}
        onLoadLabel={onLoadLabel}
        onNewLabel={onNewLabel}
        onSignIn={onSignIn}
        currentLabelId={currentLabelId}
        refreshTrigger={labelRefreshTrigger}
      />
    </div>
  );
}
