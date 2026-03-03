"use client";

import { useState } from "react";
import {
  LayoutTemplate,
  Shapes,
  Type,
  Upload,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LeftPanelTab, LabelDimensions } from "./types";
import type { TemplateDefinition } from "./data/templates";
import { TemplatesTab } from "./tabs/TemplatesTab";
import { ElementsTab } from "./tabs/ElementsTab";
import { TextTab } from "./tabs/TextTab";
import { UploadTab } from "./tabs/UploadTab";
import { AiTab } from "./tabs/AiTab";

interface LeftPanelProps {
  dimensions: LabelDimensions;
  // Canvas actions
  onAddText: (
    preset: "heading" | "subheading" | "body" | "label",
    options?: { text?: string; fontFamily?: string }
  ) => void;
  onAddLabelField: (fieldName: string) => void;
  onAddSvgElement: (svgMarkup: string) => void;
  onAddImage: (dataUrl: string) => void;
  onApplyTemplate: (template: TemplateDefinition) => void;
  onUploadLogo: (dataUrl: string) => void;
  hasContent: () => boolean;
  // Phase C: AI features
  getCanvasImage: () => string | null;
  getLogoImage: () => string | null;
  onAddBackground: (dataUrl: string) => void;
  onApplyPalette: (colours: string[]) => void;
}

const TABS: { id: LeftPanelTab; label: string; icon: React.ReactNode }[] = [
  { id: "templates", label: "Templates", icon: <LayoutTemplate className="w-4 h-4" /> },
  { id: "elements", label: "Elements", icon: <Shapes className="w-4 h-4" /> },
  { id: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { id: "upload", label: "Upload", icon: <Upload className="w-4 h-4" /> },
  { id: "ai", label: "AI", icon: <Sparkles className="w-4 h-4" /> },
];

export function LeftPanel({
  dimensions,
  onAddText,
  onAddLabelField,
  onAddSvgElement,
  onAddImage,
  onApplyTemplate,
  onUploadLogo,
  hasContent,
  getCanvasImage,
  getLogoImage,
  onAddBackground,
  onApplyPalette,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<LeftPanelTab>("templates");

  return (
    <aside className="w-64 bg-neutral-800 border-r border-neutral-700 flex flex-col shrink-0">
      {/* Tab bar */}
      <div className="flex border-b border-neutral-700">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={cn(
              "flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] transition-colors",
              activeTab === tab.id
                ? "text-accent border-b-2 border-accent bg-neutral-750"
                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-750"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "templates" && (
          <TemplatesTab
            onApplyTemplate={onApplyTemplate}
            hasContent={hasContent()}
          />
        )}
        {activeTab === "elements" && (
          <ElementsTab
            onAddSvgElement={onAddSvgElement}
          />
        )}
        {activeTab === "text" && (
          <TextTab
            onAddText={onAddText}
            onAddLabelField={onAddLabelField}
          />
        )}
        {activeTab === "upload" && (
          <UploadTab
            onAddImage={onAddImage}
            onUploadLogo={onUploadLogo}
          />
        )}
        {activeTab === "ai" && (
          <AiTab
            getCanvasImage={getCanvasImage}
            getLogoImage={getLogoImage}
            onAddBackground={onAddBackground}
            onApplyPalette={onApplyPalette}
            onAddText={onAddText}
          />
        )}
      </div>

      {/* Label dimensions info */}
      <div className="border-t border-neutral-700 p-3">
        <div className="grid grid-cols-4 gap-1.5 text-[10px]">
          <div className="bg-neutral-900 rounded px-1.5 py-1 text-center">
            <span className="text-neutral-500 block">W</span>
            <span className="text-foreground">{dimensions.widthMm}</span>
          </div>
          <div className="bg-neutral-900 rounded px-1.5 py-1 text-center">
            <span className="text-neutral-500 block">H</span>
            <span className="text-foreground">{dimensions.heightMm}</span>
          </div>
          <div className="bg-neutral-900 rounded px-1.5 py-1 text-center">
            <span className="text-neutral-500 block">Bleed</span>
            <span className="text-foreground">{dimensions.bleedMm}</span>
          </div>
          <div className="bg-neutral-900 rounded px-1.5 py-1 text-center">
            <span className="text-neutral-500 block">Safe</span>
            <span className="text-foreground">{dimensions.safeZoneMm}</span>
          </div>
        </div>
        {/* Guide legend */}
        <div className="flex items-center gap-3 mt-2 text-[10px] text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 rounded-full" style={{ backgroundColor: "#ff0000" }} />
            Bleed
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 rounded-full" style={{ backgroundColor: "#00aaff" }} />
            Trim
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-0.5 rounded-full" style={{ backgroundColor: "#00cc44" }} />
            Safe
          </span>
        </div>
      </div>
    </aside>
  );
}
