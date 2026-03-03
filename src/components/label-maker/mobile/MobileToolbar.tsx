"use client";

import {
  LayoutTemplate,
  Shapes,
  Type,
  ImageIcon,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type MobileToolTab =
  | "templates"
  | "elements"
  | "text"
  | "upload"
  | "ai"
  | "properties";

interface MobileToolbarProps {
  activeTab: MobileToolTab | null;
  onTabPress: (tab: MobileToolTab) => void;
  hasSelection: boolean;
}

const TABS: { id: MobileToolTab; label: string; icon: React.ReactNode }[] = [
  {
    id: "templates",
    label: "Templates",
    icon: <LayoutTemplate className="w-5 h-5" />,
  },
  {
    id: "elements",
    label: "Elements",
    icon: <Shapes className="w-5 h-5" />,
  },
  { id: "text", label: "Text", icon: <Type className="w-5 h-5" /> },
  { id: "upload", label: "Upload", icon: <ImageIcon className="w-5 h-5" /> },
  { id: "ai", label: "AI", icon: <Sparkles className="w-5 h-5" /> },
];

export function MobileToolbar({
  activeTab,
  onTabPress,
  hasSelection,
}: MobileToolbarProps) {
  // When an object is selected, show Properties as last tab
  const visibleTabs = hasSelection
    ? [
        ...TABS.slice(0, 4),
        {
          id: "properties" as MobileToolTab,
          label: "Properties",
          icon: <SlidersHorizontal className="w-5 h-5" />,
        },
      ]
    : TABS;

  return (
    <nav className="flex items-center justify-around h-14 bg-neutral-800 border-t border-neutral-700 shrink-0 px-1 safe-bottom">
      {visibleTabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabPress(tab.id)}
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors min-w-[56px]",
            activeTab === tab.id
              ? "text-accent"
              : "text-neutral-500 active:text-neutral-300"
          )}
        >
          {tab.icon}
          <span className="text-[9px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
