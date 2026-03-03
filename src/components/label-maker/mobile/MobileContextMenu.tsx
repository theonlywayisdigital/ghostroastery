"use client";

import { Copy, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface MobileContextMenuProps {
  bounds: { left: number; top: number; width: number; height: number };
  onDuplicate: () => void;
  onDelete: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
}

export function MobileContextMenu({
  bounds,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward,
}: MobileContextMenuProps) {
  // Position menu above the selected object
  const menuWidth = 176;
  const menuHeight = 40;
  const gap = 8;

  // Center horizontally above the object
  let left = bounds.left + bounds.width / 2 - menuWidth / 2;
  let top = bounds.top - menuHeight - gap;

  // Keep within viewport
  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 375;
  if (left < 8) left = 8;
  if (left + menuWidth > viewportWidth - 8) left = viewportWidth - menuWidth - 8;
  if (top < 48) top = bounds.top + bounds.height + gap; // Below if no room above

  return (
    <div
      className="fixed z-30 flex items-center gap-0.5 bg-neutral-800 border border-neutral-700 rounded-xl shadow-xl px-1 py-1"
      style={{
        left,
        top,
        width: menuWidth,
      }}
    >
      <ContextButton
        icon={<Copy className="w-3.5 h-3.5" />}
        label="Duplicate"
        onClick={onDuplicate}
      />
      <ContextButton
        icon={<ArrowUp className="w-3.5 h-3.5" />}
        label="Forward"
        onClick={onBringForward}
      />
      <ContextButton
        icon={<ArrowDown className="w-3.5 h-3.5" />}
        label="Back"
        onClick={onSendBackward}
      />
      <ContextButton
        icon={<Trash2 className="w-3.5 h-3.5" />}
        label="Delete"
        onClick={onDelete}
        danger
      />
    </div>
  );
}

function ContextButton({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`flex-1 flex items-center justify-center p-2 rounded-lg transition-colors ${
        danger
          ? "text-red-400 active:bg-red-900/30"
          : "text-neutral-300 active:bg-neutral-700"
      }`}
    >
      {icon}
    </button>
  );
}
