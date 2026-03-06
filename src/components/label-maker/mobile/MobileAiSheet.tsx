"use client";

import { useState, useCallback } from "react";
import {
  Image as ImageIcon,
  Palette,
  ListDashes,
  PenNib,
  Sparkle,
  SpinnerGap,
  ArrowsClockwise,
  Plus,
  Warning,
  CaretDown,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type AiSection = "background" | "palette" | "layout" | "copy";

interface MobileAiSheetProps {
  getCanvasImage: () => string | null;
  getLogoImage: () => string | null;
  onAddBackground: (dataUrl: string) => void;
  onApplyPalette: (colours: string[]) => void;
  onAddText: (
    preset: "heading" | "subheading" | "body" | "label",
    options?: { text?: string }
  ) => void;
}

const SECTIONS: {
  id: AiSection;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "background",
    label: "Generate Background",
    icon: <ImageIcon size={16} weight="duotone" />,
    description: "AI-generated backgrounds for your label",
  },
  {
    id: "palette",
    label: "Colour Palette",
    icon: <Palette size={16} weight="duotone" />,
    description: "Get colour suggestions from your logo",
  },
  {
    id: "layout",
    label: "Layout Review",
    icon: <ListDashes size={16} weight="duotone" />,
    description: "AI suggestions to improve your design",
  },
  {
    id: "copy",
    label: "Generate Copy",
    icon: <PenNib size={16} weight="duotone" />,
    description: "AI-written text for your coffee label",
  },
];

const STYLE_OPTIONS = [
  { value: "photographic", label: "Photo" },
  { value: "illustrated", label: "Illustrated" },
  { value: "abstract", label: "Abstract" },
  { value: "textured", label: "Textured" },
  { value: "flat", label: "Flat" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "playful", label: "Playful" },
  { value: "minimal", label: "Minimal" },
  { value: "premium", label: "Premium" },
];

export function MobileAiSheet({
  getCanvasImage,
  getLogoImage,
  onAddBackground,
  onApplyPalette,
  onAddText,
}: MobileAiSheetProps) {
  const [expandedSection, setExpandedSection] = useState<AiSection | null>(
    null
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        <Sparkle size={16} weight="duotone" className="text-accent" />
        <span className="text-xs font-semibold text-neutral-300">
          AI-Powered Tools
        </span>
      </div>

      {SECTIONS.map((section) => (
        <div
          key={section.id}
          className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden"
        >
          {/* Accordion header */}
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === section.id ? null : section.id
              )
            }
            className="w-full flex items-center gap-3 px-4 py-3 active:bg-neutral-700/50 transition-colors"
          >
            <span
              className={cn(
                "shrink-0",
                expandedSection === section.id
                  ? "text-accent"
                  : "text-neutral-400"
              )}
            >
              {section.icon}
            </span>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium text-neutral-200">
                {section.label}
              </p>
              <p className="text-[10px] text-neutral-500">
                {section.description}
              </p>
            </div>
            <CaretDown
              size={16}
              weight="duotone"
              className={cn(
                "text-neutral-500 transition-transform",
                expandedSection === section.id && "rotate-180"
              )}
            />
          </button>

          {/* Accordion content */}
          {expandedSection === section.id && (
            <div className="px-4 pb-4 pt-1 border-t border-neutral-700">
              {section.id === "background" && (
                <BackgroundSection onAddBackground={onAddBackground} />
              )}
              {section.id === "palette" && (
                <PaletteSection
                  getLogoImage={getLogoImage}
                  onApplyPalette={onApplyPalette}
                />
              )}
              {section.id === "layout" && (
                <LayoutSection getCanvasImage={getCanvasImage} />
              )}
              {section.id === "copy" && (
                <CopySection onAddText={onAddText} />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Background Section ───

function BackgroundSection({
  onAddBackground,
}: {
  onAddBackground: (dataUrl: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("photographic");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const res = await fetch("/api/ai/generate-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      setError("Failed to generate backgrounds. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [prompt, style]);

  return (
    <div className="space-y-3">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the background you want..."
        className="w-full px-3 py-2.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-foreground placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
        rows={2}
      />

      <div className="flex flex-wrap gap-1.5">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStyle(opt.value)}
            className={cn(
              "px-2.5 py-1 text-[10px] rounded-full transition-colors",
              style === opt.value
                ? "bg-accent text-neutral-900 font-medium"
                : "bg-neutral-700 text-neutral-400 active:bg-neutral-600"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-neutral-900 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkle size={14} weight="duotone" />
            Generate
          </>
        )}
      </button>

      {loading && (
        <p className="text-[10px] text-neutral-500 text-center animate-pulse">
          This can take up to 30 seconds — hang tight!
        </p>
      )}

      {error && <ErrorMessage error={error} onRetry={generate} loading={loading} />}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onAddBackground(img)}
              className="aspect-[94/140] rounded-lg overflow-hidden border border-neutral-700 active:border-accent transition-colors"
            >
              <img
                src={img}
                alt={`Background ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Palette Section ───

function PaletteSection({
  getLogoImage,
  onApplyPalette,
}: {
  getLogoImage: () => string | null;
  onApplyPalette: (colours: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [palettes, setPalettes] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const suggest = useCallback(async () => {
    const logoImage = getLogoImage();
    if (!logoImage) {
      setError("No image found on canvas. Upload a logo first.");
      return;
    }

    setLoading(true);
    setError(null);
    setPalettes([]);

    try {
      const res = await fetch("/api/ai/suggest-palette", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoImageBase64: logoImage }),
      });
      if (!res.ok) throw new Error("Failed to suggest");
      const data = await res.json();
      setPalettes(data.palettes || []);
    } catch {
      setError("Failed to suggest palettes. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getLogoImage]);

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-neutral-500">
        Upload a logo, then get complementary colour palette suggestions.
      </p>

      <button
        onClick={suggest}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-neutral-900 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Analysing...
          </>
        ) : (
          <>
            <Palette size={14} weight="duotone" />
            Suggest from logo
          </>
        )}
      </button>

      {error && <ErrorMessage error={error} onRetry={suggest} loading={loading} />}

      {palettes.length > 0 && (
        <div className="space-y-2">
          {palettes.map((palette, i) => (
            <button
              key={i}
              onClick={() => onApplyPalette(palette)}
              className="w-full flex items-center gap-1 p-2 bg-neutral-900 border border-neutral-700 rounded-lg active:border-accent transition-colors"
            >
              {palette.map((colour, j) => (
                <div
                  key={j}
                  className="flex-1 h-8 rounded"
                  style={{ backgroundColor: colour }}
                />
              ))}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Layout Section ───

function LayoutSection({
  getCanvasImage,
}: {
  getCanvasImage: () => string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const review = useCallback(async () => {
    const image = getCanvasImage();
    if (!image) {
      setError("Could not capture canvas. Please try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const res = await fetch("/api/ai/review-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ canvasImageBase64: image }),
      });
      if (!res.ok) throw new Error("Failed to review");
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch {
      setError("Failed to review layout. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [getCanvasImage]);

  return (
    <div className="space-y-3">
      <p className="text-[10px] text-neutral-500">
        Get AI suggestions to improve readability, hierarchy, and print quality.
      </p>

      <button
        onClick={review}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-neutral-900 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Reviewing...
          </>
        ) : (
          <>
            <ListDashes size={14} weight="duotone" />
            Review my layout
          </>
        )}
      </button>

      {error && <ErrorMessage error={error} onRetry={review} loading={loading} />}

      {suggestions.length > 0 && (
        <ol className="space-y-1.5">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="flex gap-2 p-2.5 bg-neutral-900 rounded-lg text-[10px] text-neutral-300"
            >
              <span className="text-accent font-bold shrink-0">{i + 1}.</span>
              {s}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// ─── Copy Section ───

function CopySection({
  onAddText,
}: {
  onAddText: (
    preset: "heading" | "subheading" | "body" | "label",
    options?: { text?: string }
  ) => void;
}) {
  const [brandName, setBrandName] = useState("");
  const [origin, setOrigin] = useState("");
  const [roastLevel, setRoastLevel] = useState("");
  const [flavourNotes, setFlavourNotes] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [copy, setCopy] = useState<{
    tagline: string;
    originLine: string;
    tastingNotes: string;
    brandStory: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async () => {
    if (!brandName.trim()) return;
    setLoading(true);
    setError(null);
    setCopy(null);

    try {
      const res = await fetch("/api/ai/generate-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          origin,
          roastLevel,
          flavourNotes,
          tone,
        }),
      });
      if (!res.ok) throw new Error("Failed to generate");
      const data = await res.json();
      setCopy(data);
    } catch {
      setError("Failed to generate copy. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [brandName, origin, roastLevel, flavourNotes, tone]);

  return (
    <div className="space-y-3">
      <MobileFormField
        label="Brand Name *"
        value={brandName}
        onChange={setBrandName}
        placeholder="e.g. Dark Horse Coffee"
      />
      <MobileFormField
        label="Coffee Origin"
        value={origin}
        onChange={setOrigin}
        placeholder="e.g. Ethiopia Yirgacheffe"
      />
      <div>
        <label className="text-[10px] text-neutral-500 block mb-1">
          Roast Level
        </label>
        <select
          value={roastLevel}
          onChange={(e) => setRoastLevel(e.target.value)}
          className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
        >
          <option value="">Select...</option>
          <option value="Light">Light</option>
          <option value="Medium">Medium</option>
          <option value="Dark">Dark</option>
          <option value="Espresso">Espresso</option>
        </select>
      </div>
      <MobileFormField
        label="Flavour Notes"
        value={flavourNotes}
        onChange={setFlavourNotes}
        placeholder="e.g. fruity, floral, dark chocolate"
      />
      <div>
        <label className="text-[10px] text-neutral-500 block mb-1">Tone</label>
        <div className="flex flex-wrap gap-1.5">
          {TONE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTone(opt.value)}
              className={cn(
                "px-2.5 py-1 text-[10px] rounded-full transition-colors",
                tone === opt.value
                  ? "bg-accent text-neutral-900 font-medium"
                  : "bg-neutral-700 text-neutral-400 active:bg-neutral-600"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || !brandName.trim()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-accent text-neutral-900 text-xs font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <PenNib size={14} weight="duotone" />
            Generate copy
          </>
        )}
      </button>

      {error && <ErrorMessage error={error} onRetry={generate} loading={loading} />}

      {copy && (
        <div className="space-y-2">
          <CopyResult label="Tagline" text={copy.tagline} onAdd={() => onAddText("heading", { text: copy.tagline })} />
          <CopyResult label="Origin Line" text={copy.originLine} onAdd={() => onAddText("subheading", { text: copy.originLine })} />
          <CopyResult label="Tasting Notes" text={copy.tastingNotes} onAdd={() => onAddText("body", { text: copy.tastingNotes })} />
          <CopyResult label="Brand Story" text={copy.brandStory} onAdd={() => onAddText("body", { text: copy.brandStory })} />
        </div>
      )}
    </div>
  );
}

// ─── Helpers ───

function MobileFormField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-[10px] text-neutral-500 block mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-foreground placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

function CopyResult({
  label,
  text,
  onAdd,
}: {
  label: string;
  text: string;
  onAdd: () => void;
}) {
  return (
    <div className="bg-neutral-900 rounded-lg p-2.5 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-neutral-400">{label}</span>
        <button
          onClick={onAdd}
          className="flex items-center gap-0.5 text-[10px] text-accent"
        >
          <Plus size={12} weight="duotone" />
          Add
        </button>
      </div>
      <p className="text-[10px] text-neutral-300 leading-relaxed">{text}</p>
    </div>
  );
}

function ErrorMessage({
  error,
  onRetry,
  loading,
}: {
  error: string;
  onRetry: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex items-center gap-2 p-2.5 bg-red-950/50 border border-red-800 rounded-lg text-[10px] text-red-400">
      <Warning size={12} weight="duotone" className="shrink-0" />
      <span className="flex-1">{error}</span>
      <button
        onClick={onRetry}
        disabled={loading}
        className="shrink-0 flex items-center gap-1 text-accent"
      >
        <ArrowsClockwise size={12} weight="duotone" />
        Retry
      </button>
    </div>
  );
}
