"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  TEMPLATES,
  type TemplateDefinition,
} from "../data/templates";
import { MOBILE_TEMPLATES } from "../data/mobile-templates";
import { TemplateThumbnail } from "../TemplateThumbnail";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "mobile", label: "Mobile" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "elegant", label: "Elegant" },
  { value: "retro", label: "Retro" },
  { value: "corporate", label: "Corporate" },
] as const;

interface MobileTemplatesSheetProps {
  onApplyTemplate: (template: TemplateDefinition) => void;
  hasContent: boolean;
  onDismiss: () => void;
}

export function MobileTemplatesSheet({
  onApplyTemplate,
  hasContent,
  onDismiss,
}: MobileTemplatesSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const allTemplates = [...MOBILE_TEMPLATES, ...TEMPLATES];

  const filtered =
    selectedCategory === "all"
      ? allTemplates
      : allTemplates.filter((t: TemplateDefinition) => t.category === selectedCategory);

  const handleApply = (template: TemplateDefinition) => {
    if (hasContent) {
      const ok = window.confirm(
        "Replace current design? Applying a template will replace your current layout."
      );
      if (!ok) return;
    }
    onApplyTemplate(template);
    onDismiss();
  };

  return (
    <div>
      {/* Category pills — horizontal scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors shrink-0",
              selectedCategory === cat.value
                ? "bg-accent text-neutral-900 font-medium"
                : "bg-neutral-800 text-neutral-400 active:bg-neutral-700"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 2-col grid with larger thumbnails */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((template: TemplateDefinition) => (
          <button
            key={template.id}
            onClick={() => handleApply(template)}
            className="group relative bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700 active:border-accent transition-colors"
          >
            {/* Thumbnail area */}
            <TemplateThumbnail template={template} />
            <div className="p-2">
              <p className="text-xs text-neutral-200 truncate font-medium">
                {template.name}
              </p>
              <p className="text-[10px] text-neutral-500 capitalize">
                {template.category}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
