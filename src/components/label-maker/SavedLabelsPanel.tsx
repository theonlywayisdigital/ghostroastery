"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Plus,
  Loader2,
  Trash2,
  LogIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { User } from "@supabase/supabase-js";

interface SavedLabel {
  id: string;
  name: string;
  thumbnail_url: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

interface SavedLabelsPanelProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onLoadLabel: (labelId: string, canvasJson: string) => void;
  onNewLabel: () => void;
  onSignIn: () => void;
  currentLabelId: string | null;
  /** Increment to trigger a refresh (e.g. after saving a label) */
  refreshTrigger?: number;
}

export function SavedLabelsPanel({
  open,
  onClose,
  user,
  onLoadLabel,
  onNewLabel,
  onSignIn,
  currentLabelId,
  refreshTrigger,
}: SavedLabelsPanelProps) {
  const [labels, setLabels] = useState<SavedLabel[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchLabels = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch("/api/label/list", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setLabels(data.labels || []);
      } else {
        console.error("Failed to fetch labels:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Fetch labels error:", err);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (open && user) {
      fetchLabels();
    }
  }, [open, user, fetchLabels]);

  // Re-fetch when refreshTrigger changes (e.g. after saving)
  useEffect(() => {
    if (refreshTrigger && user) {
      fetchLabels();
    }
  }, [refreshTrigger, user, fetchLabels]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Delete this label?")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/label/${id}`, { method: "DELETE", credentials: "include" });
      setLabels((prev) => prev.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Delete label error:", err);
    }
    setDeletingId(null);
  };

  const handleLoad = async (labelId: string) => {
    try {
      const res = await fetch(`/api/label/${labelId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        const canvasJson =
          typeof data.label.canvas_json === "string"
            ? data.label.canvas_json
            : JSON.stringify(data.label.canvas_json);
        onLoadLabel(labelId, canvasJson);
      } else {
        console.error("Load label error:", res.status, await res.text());
      }
    } catch (err) {
      console.error("Load label error:", err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className={cn(
        "fixed top-0 right-0 h-full w-80 bg-neutral-800 border-l border-neutral-700 z-[55] transition-transform duration-300 flex flex-col",
        open ? "translate-x-0" : "translate-x-full"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-neutral-700 shrink-0">
        <h3 className="text-sm font-semibold text-foreground">My Labels</h3>
        <button
          onClick={onClose}
          className="p-1.5 text-neutral-400 hover:text-foreground hover:bg-neutral-700 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {!user ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <LogIn className="w-8 h-8 text-neutral-500 mb-3" />
            <p className="text-sm text-neutral-300 mb-1">
              Sign in to access your saved labels
            </p>
            <p className="text-xs text-neutral-500 mb-4">
              Save designs to reuse across orders
            </p>
            <button
              onClick={onSignIn}
              className="px-4 py-2 bg-accent text-neutral-900 text-sm font-semibold rounded-lg hover:opacity-90 transition-colors"
            >
              Sign In
            </button>
          </div>
        ) : (
          <>
            {/* New label button */}
            <button
              onClick={onNewLabel}
              className="w-full flex items-center gap-2 px-3 py-2.5 border border-dashed border-neutral-600 rounded-lg text-sm text-neutral-400 hover:text-foreground hover:border-neutral-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Label
            </button>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-neutral-500 animate-spin" />
              </div>
            ) : labels.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-500">No saved labels yet</p>
                <p className="text-xs text-neutral-600 mt-1">
                  Design a label and hit Save
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {labels.map((label) => (
                  <div
                    key={label.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleLoad(label.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleLoad(label.id); }}
                    className={cn(
                      "group relative rounded-lg border overflow-hidden text-left transition-colors cursor-pointer",
                      currentLabelId === label.id
                        ? "border-accent bg-accent/10"
                        : "border-neutral-700 hover:border-neutral-600"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[94/140] bg-neutral-900 flex items-center justify-center">
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

                    {/* Info */}
                    <div className="px-2 py-1.5">
                      <p className="text-[11px] font-medium text-foreground truncate">
                        {label.name}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {formatDate(label.updated_at)}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDelete(label.id, e)}
                      className="absolute top-1 right-1 p-1 bg-neutral-900/80 rounded opacity-0 group-hover:opacity-100 transition-opacity text-neutral-400 hover:text-red-400"
                    >
                      {deletingId === label.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
