"use client";

import { useState } from "react";
import {
  Undo2,
  Redo2,
  MoreHorizontal,
  Ruler,
  Grid3X3,
  Magnet,
  RotateCcw,
  ShieldCheck,
  Eye,
  ArrowRight,
  FolderOpen,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileHeaderProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  guidesVisible: boolean;
  gridVisible: boolean;
  snapEnabled: boolean;
  onToggleGuides: () => void;
  onToggleGrid: () => void;
  onToggleSnap: () => void;
  onStartFresh: () => void;
  onPrintCheck: () => void;
  onBagPreview: () => void;
  onDone: () => void;
  onMyLabels: () => void;
  onSave: () => void;
  saving?: boolean;
  saved?: boolean;
  autoExporting?: boolean;
}

export function MobileHeader({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  guidesVisible,
  gridVisible,
  snapEnabled,
  onToggleGuides,
  onToggleGrid,
  onToggleSnap,
  onStartFresh,
  onPrintCheck,
  onBagPreview,
  onDone,
  onMyLabels,
  onSave,
  saving,
  saved,
  autoExporting,
}: MobileHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-3 h-11 bg-neutral-800 border-b border-neutral-700 shrink-0 relative z-30">
      {/* Left: Brand */}
      <span className="text-xs font-bold tracking-tight text-accent">
        Label Maker
      </span>

      {/* Center: Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            "p-2 rounded transition-colors",
            canUndo
              ? "text-neutral-300 active:bg-neutral-700"
              : "text-neutral-600"
          )}
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            "p-2 rounded transition-colors",
            canRedo
              ? "text-neutral-300 active:bg-neutral-700"
              : "text-neutral-600"
          )}
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Preview + Menu + Done */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBagPreview}
          className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-neutral-300 active:bg-neutral-700 rounded transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          Preview
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded text-neutral-400 active:bg-neutral-700 transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl overflow-hidden">
                <MenuItem
                  icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  label={saved ? "Saved!" : saving ? "Saving..." : "Save"}
                  onClick={() => {
                    onSave();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<FolderOpen className="w-4 h-4" />}
                  label="My Labels"
                  onClick={() => {
                    onMyLabels();
                    setMenuOpen(false);
                  }}
                />
                <div className="h-px bg-neutral-700" />
                <MenuItem
                  icon={<Ruler className="w-4 h-4" />}
                  label="Guides"
                  active={guidesVisible}
                  onClick={() => {
                    onToggleGuides();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<Grid3X3 className="w-4 h-4" />}
                  label="Grid"
                  active={gridVisible}
                  onClick={() => {
                    onToggleGrid();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<Magnet className="w-4 h-4" />}
                  label="Snap to guides"
                  active={snapEnabled}
                  onClick={() => {
                    onToggleSnap();
                    setMenuOpen(false);
                  }}
                />
                <div className="h-px bg-neutral-700" />
                <MenuItem
                  icon={<ShieldCheck className="w-4 h-4" />}
                  label="Print readiness"
                  onClick={() => {
                    onPrintCheck();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<Eye className="w-4 h-4" />}
                  label="Preview on bag"
                  onClick={() => {
                    onBagPreview();
                    setMenuOpen(false);
                  }}
                />
                <div className="h-px bg-neutral-700" />
                <MenuItem
                  icon={<RotateCcw className="w-4 h-4" />}
                  label="Start fresh"
                  onClick={() => {
                    onStartFresh();
                    setMenuOpen(false);
                  }}
                  danger
                />
              </div>
            </>
          )}
        </div>

        <button
          onClick={onDone}
          disabled={autoExporting}
          className="flex items-center gap-1 px-3 py-1.5 text-xs bg-accent text-neutral-900 font-semibold rounded-lg active:bg-accent/80 transition-colors disabled:opacity-50"
        >
          {autoExporting ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              Done
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </header>
  );
}

function MenuItem({
  icon,
  label,
  active,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 text-xs transition-colors active:bg-neutral-700",
        danger ? "text-red-400" : "text-neutral-300"
      )}
    >
      <span className={cn(active && "text-accent")}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {active !== undefined && (
        <div
          className={cn(
            "w-2 h-2 rounded-full",
            active ? "bg-accent" : "bg-neutral-600"
          )}
        />
      )}
    </button>
  );
}
