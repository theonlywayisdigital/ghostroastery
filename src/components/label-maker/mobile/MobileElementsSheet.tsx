"use client";

import { useState } from "react";
import { Shapes } from "lucide-react";
import { cn } from "@/lib/utils";
import { SVG_ELEMENTS, ELEMENT_CATEGORIES } from "../data/svg-elements";

interface MobileElementsSheetProps {
  onAddSvgElement: (svgMarkup: string) => void;
}

export function MobileElementsSheet({
  onAddSvgElement,
}: MobileElementsSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filtered =
    selectedCategory === "all"
      ? SVG_ELEMENTS
      : SVG_ELEMENTS.filter((el) => el.category === selectedCategory);

  return (
    <div>
      {/* Category pills — horizontal scroll */}
      <div className="flex gap-1.5 overflow-x-auto pb-3 -mx-1 px-1 scrollbar-none">
        {ELEMENT_CATEGORIES.map((cat) => (
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

      {/* 2-col grid with 64px touch targets */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Shapes className="w-8 h-8 text-neutral-600 mb-2" />
          <p className="text-xs text-neutral-500">
            No elements in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filtered.map((element) => (
            <button
              key={element._id}
              onClick={() => onAddSvgElement(element.svgMarkup)}
              title={element.name}
              className="group relative bg-neutral-800 rounded-xl p-3 border border-neutral-700 active:border-accent transition-colors aspect-square flex items-center justify-center min-h-[64px]"
            >
              <div
                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-[40px] [&>svg]:max-h-[40px]"
                style={{ filter: "invert(1)" }}
                dangerouslySetInnerHTML={{ __html: element.svgMarkup }}
              />
              <span className="absolute bottom-1 left-0 right-0 text-[9px] text-neutral-500 text-center truncate px-1">
                {element.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
