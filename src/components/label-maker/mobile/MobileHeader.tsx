"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowCounterClockwise,
  ArrowClockwise,
  DotsThree,
  Ruler,
  GridFour,
  MagnetStraight,
  ShieldCheck,
  Eye,
  ArrowRight,
  FolderOpen,
  FloppyDisk,
  SpinnerGap,
} from "@phosphor-icons/react";
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
      <a
        href="https://ghostroastery.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <Image
          src="/ghost-roastery-consumer-logo.png"
          alt="Ghost Roastery"
          width={180}
          height={44}
          className="h-10 w-auto"
          priority
        />
        <span className="text-neutral-600">|</span>
        <span className="text-xs font-medium text-neutral-300">
          Label Maker
        </span>
      </a>

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
          <ArrowCounterClockwise size={16} weight="duotone" />
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
          <ArrowClockwise size={16} weight="duotone" />
        </button>
      </div>

      {/* Right: Preview + Menu + Done */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBagPreview}
          className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-neutral-300 active:bg-neutral-700 rounded transition-colors"
        >
          <Eye size={14} weight="duotone" />
          Preview
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded text-white active:bg-neutral-700 transition-colors"
          >
            <DotsThree size={16} weight="duotone" />
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
                  icon={saving ? <SpinnerGap size={16} weight="duotone" className="animate-spin" /> : <FloppyDisk size={16} weight="duotone" />}
                  label={saved ? "Saved!" : saving ? "Saving..." : "Save"}
                  onClick={() => {
                    onSave();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<FolderOpen size={16} weight="duotone" />}
                  label="My Labels"
                  onClick={() => {
                    onMyLabels();
                    setMenuOpen(false);
                  }}
                />
                <div className="h-px bg-neutral-700" />
                <MenuItem
                  icon={<Ruler size={16} weight="duotone" />}
                  label="Guides"
                  active={guidesVisible}
                  onClick={() => {
                    onToggleGuides();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<GridFour size={16} weight="duotone" />}
                  label="Grid"
                  active={gridVisible}
                  onClick={() => {
                    onToggleGrid();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<MagnetStraight size={16} weight="duotone" />}
                  label="Snap to guides"
                  active={snapEnabled}
                  onClick={() => {
                    onToggleSnap();
                    setMenuOpen(false);
                  }}
                />
                <div className="h-px bg-neutral-700" />
                <MenuItem
                  icon={<ShieldCheck size={16} weight="duotone" />}
                  label="Print readiness"
                  onClick={() => {
                    onPrintCheck();
                    setMenuOpen(false);
                  }}
                />
                <MenuItem
                  icon={<Eye size={16} weight="duotone" />}
                  label="Preview on bag"
                  onClick={() => {
                    onBagPreview();
                    setMenuOpen(false);
                  }}
                />
                <div className="h-px bg-neutral-700" />
                <MenuItem
                  icon={<ArrowCounterClockwise size={16} weight="duotone" />}
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
              <SpinnerGap size={14} weight="duotone" className="animate-spin" />
              Exporting...
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
