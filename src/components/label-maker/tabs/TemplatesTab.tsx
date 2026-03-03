"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { TEMPLATES, type TemplateDefinition } from "../data/templates";
import { TemplateThumbnail } from "../TemplateThumbnail";

interface TemplatesTabProps {
  onApplyTemplate: (template: TemplateDefinition) => void;
  hasContent: boolean;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "minimal", label: "Minimal" },
  { value: "bold", label: "Bold" },
  { value: "vintage", label: "Vintage" },
  { value: "modern", label: "Modern" },
  { value: "elegant", label: "Elegant" },
  { value: "retro", label: "Retro" },
  { value: "corporate", label: "Corporate" },
] as const;

export function TemplatesTab({ onApplyTemplate, hasContent }: TemplatesTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? TEMPLATES
      : TEMPLATES.filter((t) => t.category === selectedCategory);

  const handleApply = (template: TemplateDefinition) => {
    if (hasContent) {
      const ok = window.confirm(
        "Replace current design? Applying a template will replace your current layout."
      );
      if (!ok) return;
    }
    onApplyTemplate(template);
  };

  return (
    <div className="p-3">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1 mb-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded-full transition-colors",
              selectedCategory === cat.value
                ? "bg-accent text-neutral-900 font-medium"
                : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => handleApply(template)}
            className="group relative bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700 hover:border-accent transition-colors"
          >
            <TemplateThumbnail template={template} />
            <div className="p-1.5">
              <p className="text-[10px] text-neutral-300 truncate">
                {template.name}
              </p>
              <p className="text-[9px] text-neutral-500 capitalize">
                {template.category}
              </p>
            </div>
            <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
