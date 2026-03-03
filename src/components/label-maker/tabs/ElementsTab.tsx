"use client";

import { useState } from "react";
import { Shapes } from "lucide-react";
import { cn } from "@/lib/utils";
import { SVG_ELEMENTS, ELEMENT_CATEGORIES } from "../data/svg-elements";

interface ElementsTabProps {
  onAddSvgElement: (svgMarkup: string) => void;
}

export function ElementsTab({ onAddSvgElement }: ElementsTabProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? SVG_ELEMENTS
      : SVG_ELEMENTS.filter((el) => el.category === selectedCategory);

  return (
    <div className="p-3">
      {/* Category filter */}
      <div className="flex flex-wrap gap-1 mb-3">
        {ELEMENT_CATEGORIES.map((cat) => (
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

      {/* Elements grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Shapes className="w-8 h-8 text-neutral-600 mb-2" />
          <p className="text-xs text-neutral-500">No elements in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((element) => (
            <button
              key={element._id}
              onClick={() => onAddSvgElement(element.svgMarkup)}
              title={element.name}
              className="group relative bg-neutral-900 rounded-lg p-2 border border-neutral-700 hover:border-accent transition-colors aspect-square flex items-center justify-center"
            >
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[32px] [&>svg]:max-h-[32px]"
                style={{ filter: "invert(1)" }}
                dangerouslySetInnerHTML={{ __html: element.svgMarkup }}
              />
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 rounded-lg transition-colors" />
              <span className="absolute bottom-0.5 left-0 right-0 text-[8px] text-neutral-500 text-center truncate px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {element.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
