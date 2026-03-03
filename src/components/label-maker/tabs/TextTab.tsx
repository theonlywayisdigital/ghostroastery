"use client";

import { cn } from "@/lib/utils";
import { FONT_LIBRARY } from "../types";

interface TextTabProps {
  onAddText: (
    preset: "heading" | "subheading" | "body" | "label",
    options?: { text?: string; fontFamily?: string }
  ) => void;
  onAddLabelField: (fieldName: string) => void;
}

const TEXT_PRESETS: {
  id: "heading" | "subheading" | "body" | "label";
  label: string;
  preview: string;
  className: string;
}[] = [
  {
    id: "heading",
    label: "Heading",
    preview: "HEADING",
    className: "text-lg font-bold tracking-tight",
  },
  {
    id: "subheading",
    label: "Subheading",
    preview: "Subheading",
    className: "text-sm font-semibold",
  },
  {
    id: "body",
    label: "Body Text",
    preview: "Body text goes here",
    className: "text-xs",
  },
  {
    id: "label",
    label: "Label",
    preview: "LABEL",
    className: "text-[10px] font-bold tracking-wider uppercase",
  },
];

const LABEL_FIELDS = [
  "Roaster Name",
  "Coffee Name",
  "Origin",
  "Weight",
  "Roast Level",
  "Tasting Notes",
  "Description",
];

export function TextTab({ onAddText, onAddLabelField }: TextTabProps) {
  return (
    <div className="p-3 space-y-4">
      {/* Text type buttons */}
      <div>
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Add Text
        </h3>
        <div className="space-y-1.5">
          {TEXT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onAddText(preset.id)}
              className="w-full text-left px-3 py-2 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-accent transition-colors group"
            >
              <span
                className={cn(
                  "block text-foreground group-hover:text-accent transition-colors",
                  preset.className
                )}
              >
                {preset.preview}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Label field shortcuts */}
      <div>
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Label Fields
        </h3>
        <p className="text-[10px] text-neutral-500 mb-2">
          Quick-add common coffee label fields with pre-set sizes.
        </p>
        <div className="flex flex-wrap gap-1">
          {LABEL_FIELDS.map((field) => (
            <button
              key={field}
              onClick={() => onAddLabelField(field)}
              className="px-2 py-1 text-[10px] bg-neutral-900 border border-neutral-700 rounded hover:border-accent hover:text-accent transition-colors"
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* Font library */}
      <div>
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Font Library
        </h3>
        <p className="text-[10px] text-neutral-500 mb-2">
          Click a font to add a heading with that typeface.
        </p>
        <div className="space-y-1">
          {FONT_LIBRARY.map((font) => (
            <button
              key={font.family}
              onClick={() =>
                onAddText("heading", { fontFamily: font.family })
              }
              className="w-full text-left px-3 py-2 bg-neutral-900 rounded border border-neutral-700 hover:border-accent transition-colors group"
            >
              <span
                className="block text-sm text-foreground group-hover:text-accent transition-colors"
                style={{ fontFamily: font.family }}
              >
                {font.label}
              </span>
              <span className="text-[9px] text-neutral-500 capitalize">
                {font.category} &middot; {font.weights.length} weight
                {font.weights.length > 1 ? "s" : ""}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
