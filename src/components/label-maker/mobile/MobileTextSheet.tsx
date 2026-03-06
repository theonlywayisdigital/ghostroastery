"use client";

import { useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { FONT_LIBRARY } from "../types";

interface MobileTextSheetProps {
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

const FONT_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "sans-serif", label: "Sans" },
  { value: "serif", label: "Serif" },
  { value: "display", label: "Display" },
  { value: "script", label: "Script" },
];

export function MobileTextSheet({
  onAddText,
  onAddLabelField,
}: MobileTextSheetProps) {
  const [fontSearch, setFontSearch] = useState("");
  const [fontCategory, setFontCategory] = useState("all");

  const filteredFonts = FONT_LIBRARY.filter((font) => {
    const matchesSearch = font.label
      .toLowerCase()
      .includes(fontSearch.toLowerCase());
    const matchesCategory =
      fontCategory === "all" || font.category === fontCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Text presets — 48px tall buttons */}
      <div>
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Add Text
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {TEXT_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onAddText(preset.id)}
              className="text-left px-3 py-3 bg-neutral-800 rounded-xl border border-neutral-700 active:border-accent transition-colors min-h-[48px]"
            >
              <span
                className={cn(
                  "block text-foreground",
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
        <div className="flex flex-wrap gap-1.5">
          {LABEL_FIELDS.map((field) => (
            <button
              key={field}
              onClick={() => onAddLabelField(field)}
              className="px-3 py-2 text-xs bg-neutral-800 border border-neutral-700 rounded-lg active:border-accent transition-colors"
            >
              {field}
            </button>
          ))}
        </div>
      </div>

      {/* Font library with search */}
      <div>
        <h3 className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Font Library
        </h3>

        {/* Search */}
        <div className="relative mb-2">
          <MagnifyingGlass size={14} weight="duotone" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={fontSearch}
            onChange={(e) => setFontSearch(e.target.value)}
            placeholder="Search fonts..."
            className="w-full pl-8 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-xs text-foreground placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {FONT_CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFontCategory(cat.value)}
              className={cn(
                "px-3 py-1 text-[10px] rounded-full whitespace-nowrap transition-colors shrink-0",
                fontCategory === cat.value
                  ? "bg-accent text-neutral-900 font-medium"
                  : "bg-neutral-800 text-neutral-400 active:bg-neutral-700"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Font list */}
        <div className="space-y-1">
          {filteredFonts.map((font) => (
            <button
              key={font.family}
              onClick={() =>
                onAddText("heading", { fontFamily: font.family })
              }
              className="w-full text-left px-3 py-2.5 bg-neutral-800 rounded-lg border border-neutral-700 active:border-accent transition-colors"
            >
              <span
                className="block text-sm text-foreground"
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
