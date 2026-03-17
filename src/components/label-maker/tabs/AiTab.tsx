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
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type AiSection = "background" | "palette" | "layout" | "copy" | null;

interface AiTabProps {
  /** Get canvas as base64 PNG data URL */
  getCanvasImage: () => string | null;
  /** Get logo image from canvas (first image element) */
  getLogoImage: () => string | null;
  /** Add a background image to canvas */
  onAddBackground: (dataUrl: string) => void;
  /** Apply colour palette to all text/SVG elements */
  onApplyPalette: (colours: string[]) => void;
  /** Add text to canvas */
  onAddText: (
    preset: "heading" | "subheading" | "body" | "label",
    options?: { text?: string }
  ) => void;
}

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

const SECTIONS: { id: AiSection & string; label: string; icon: React.ReactNode }[] = [
  { id: "background", label: "Background", icon: <ImageIcon size={14} weight="duotone" /> },
  { id: "palette", label: "Palette", icon: <Palette size={14} weight="duotone" /> },
  { id: "layout", label: "Review", icon: <ListDashes size={14} weight="duotone" /> },
  { id: "copy", label: "Copy", icon: <PenNib size={14} weight="duotone" /> },
];

export function AiTab({
  getCanvasImage,
  getLogoImage,
  onAddBackground,
  onApplyPalette,
  onAddText,
}: AiTabProps) {
  const [activeSection, setActiveSection] = useState<AiSection>(null);

  return (
    <div className="p-3">
      {/* Section selector */}
      <div className="flex items-center gap-1 mb-3">
        <Sparkle size={14} weight="duotone" className="text-accent" />
        <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
          AI Tools
        </span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            onClick={() =>
              setActiveSection(activeSection === section.id ? null : section.id)
            }
            className={cn(
              "flex items-center gap-1.5 px-2 py-2 text-[10px] rounded-lg transition-colors",
              activeSection === section.id
                ? "bg-accent/20 text-accent border border-accent/30"
                : "bg-neutral-900 text-neutral-400 border border-neutral-700 hover:border-neutral-600"
            )}
          >
            {section.icon}
            {section.label}
          </button>
        ))}
      </div>

      {/* Active section content */}
      {activeSection === "background" && (
        <BackgroundGenerator
          onAddBackground={onAddBackground}
        />
      )}
      {activeSection === "palette" && (
        <PaletteSuggester
          getLogoImage={getLogoImage}
          onApplyPalette={onApplyPalette}
        />
      )}
      {activeSection === "layout" && (
        <LayoutReviewer getCanvasImage={getCanvasImage} />
      )}
      {activeSection === "copy" && (
        <CopyGenerator onAddText={onAddText} />
      )}

      {!activeSection && (
        <p className="text-[10px] text-neutral-500 text-center py-4">
          Select an AI tool above to get started.
        </p>
      )}
    </div>
  );
}

// ─── BACKGROUND GENERATOR ───

function BackgroundGenerator({
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
        placeholder="Describe the background you want... e.g. 'dark moody coffee roastery' or 'bright tropical fruit'"
        className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-foreground placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent resize-none"
        rows={2}
      />

      <div className="flex flex-wrap gap-1">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setStyle(opt.value)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded-full transition-colors",
              style === opt.value
                ? "bg-accent text-neutral-900 font-medium"
                : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <button
        onClick={generate}
        disabled={loading || !prompt.trim()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-neutral-900 text-xs font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkle size={14} weight="duotone" />
            Generate Backgrounds
          </>
        )}
      </button>

      {loading && (
        <p className="text-[10px] text-neutral-500 text-center animate-pulse">
          This can take up to 30 seconds — hang tight!
        </p>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-950/50 border border-red-800 rounded text-[10px] text-red-400">
          <Warning size={12} weight="duotone" className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={generate}
            disabled={loading}
            className="shrink-0 text-accent hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">
              Click to apply as background
            </span>
            <button
              onClick={generate}
              disabled={loading}
              className="text-[10px] text-accent hover:underline flex items-center gap-1"
            >
              <ArrowsClockwise size={12} weight="duotone" />
              Regenerate
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => onAddBackground(img)}
                className="aspect-[102/152] rounded-lg overflow-hidden border border-neutral-700 hover:border-accent transition-colors"
              >
                <img
                  src={img}
                  alt={`Background option ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PALETTE SUGGESTER ───

function PaletteSuggester({
  getLogoImage,
  onApplyPalette,
}: {
  getLogoImage: () => string | null;
  onApplyPalette: (colours: string[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [palettes, setPalettes] = useState<string[][]>([]);
  const [error, setError] = useState<string | null>(null);

  const suggestFromLogo = useCallback(async () => {
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
        Upload a logo to the canvas, then click below to get complementary colour palette suggestions.
      </p>

      <button
        onClick={suggestFromLogo}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-neutral-900 text-xs font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Analysing...
          </>
        ) : (
          <>
            <Palette size={14} weight="duotone" />
            Suggest colours from my logo
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-950/50 border border-red-800 rounded text-[10px] text-red-400">
          <Warning size={12} weight="duotone" className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={suggestFromLogo}
            disabled={loading}
            className="shrink-0 text-accent hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {palettes.length > 0 && (
        <div className="space-y-2">
          <span className="text-[10px] text-neutral-400">
            Click a palette to apply
          </span>
          {palettes.map((palette, i) => (
            <button
              key={i}
              onClick={() => onApplyPalette(palette)}
              className="w-full flex items-center gap-1 p-2 bg-neutral-900 border border-neutral-700 rounded-lg hover:border-accent transition-colors"
            >
              {palette.map((colour, j) => (
                <div
                  key={j}
                  className="flex-1 h-8 rounded"
                  style={{ backgroundColor: colour }}
                  title={colour}
                />
              ))}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LAYOUT REVIEWER ───

function LayoutReviewer({
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
        Get AI suggestions to improve your label design&apos;s readability, hierarchy, and print quality.
      </p>

      <button
        onClick={review}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-neutral-900 text-xs font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-950/50 border border-red-800 rounded text-[10px] text-red-400">
          <Warning size={12} weight="duotone" className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={review}
            disabled={loading}
            className="shrink-0 text-accent hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-neutral-400">
              Suggestions
            </span>
            <button
              onClick={review}
              disabled={loading}
              className="text-[10px] text-accent hover:underline flex items-center gap-1"
            >
              <ArrowsClockwise size={12} weight="duotone" />
              Review again
            </button>
          </div>
          <ol className="space-y-1.5">
            {suggestions.map((suggestion, i) => (
              <li
                key={i}
                className="flex gap-2 p-2 bg-neutral-900 rounded-lg text-[10px] text-neutral-300"
              >
                <span className="text-accent font-bold shrink-0">
                  {i + 1}.
                </span>
                {suggestion}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

// ─── COPY GENERATOR ───

function CopyGenerator({
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
      {/* Form */}
      <div className="space-y-2">
        <FormField
          label="Brand Name *"
          value={brandName}
          onChange={setBrandName}
          placeholder="e.g. Dark Horse Coffee"
        />
        <FormField
          label="Coffee Origin"
          value={origin}
          onChange={setOrigin}
          placeholder="e.g. Ethiopia Yirgacheffe"
        />
        <div>
          <label className="text-[10px] text-neutral-500 block mb-0.5">
            Roast Level
          </label>
          <select
            value={roastLevel}
            onChange={(e) => setRoastLevel(e.target.value)}
            className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">Select...</option>
            <option value="Light">Light</option>
            <option value="Medium">Medium</option>
            <option value="Dark">Dark</option>
            <option value="Espresso">Espresso</option>
          </select>
        </div>
        <FormField
          label="Flavour Notes"
          value={flavourNotes}
          onChange={setFlavourNotes}
          placeholder="e.g. fruity, floral, dark chocolate"
        />
        <div>
          <label className="text-[10px] text-neutral-500 block mb-0.5">
            Tone
          </label>
          <div className="flex flex-wrap gap-1">
            {TONE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setTone(opt.value)}
                className={cn(
                  "px-2 py-0.5 text-[10px] rounded-full transition-colors",
                  tone === opt.value
                    ? "bg-accent text-neutral-900 font-medium"
                    : "bg-neutral-700 text-neutral-400 hover:bg-neutral-600"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={generate}
        disabled={loading || !brandName.trim()}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-accent text-neutral-900 text-xs font-medium rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <SpinnerGap size={14} weight="duotone" className="animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <PenNib size={14} weight="duotone" />
            Generate label copy
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-2 p-2 bg-red-950/50 border border-red-800 rounded text-[10px] text-red-400">
          <Warning size={12} weight="duotone" className="shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={generate}
            disabled={loading}
            className="shrink-0 text-accent hover:underline"
          >
            Retry
          </button>
        </div>
      )}

      {copy && (
        <div className="space-y-2">
          <CopyResultItem
            label="Tagline"
            text={copy.tagline}
            onAdd={() => onAddText("heading", { text: copy.tagline })}
          />
          <CopyResultItem
            label="Origin Line"
            text={copy.originLine}
            onAdd={() => onAddText("subheading", { text: copy.originLine })}
          />
          <CopyResultItem
            label="Tasting Notes"
            text={copy.tastingNotes}
            onAdd={() => onAddText("body", { text: copy.tastingNotes })}
          />
          <CopyResultItem
            label="Brand Story"
            text={copy.brandStory}
            onAdd={() => onAddText("body", { text: copy.brandStory })}
          />
        </div>
      )}
    </div>
  );
}

// ─── Helper components ───

function FormField({
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
      <label className="text-[10px] text-neutral-500 block mb-0.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1.5 bg-neutral-900 border border-neutral-700 rounded text-xs text-foreground placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </div>
  );
}

function CopyResultItem({
  label,
  text,
  onAdd,
}: {
  label: string;
  text: string;
  onAdd: () => void;
}) {
  return (
    <div className="bg-neutral-900 rounded-lg p-2 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium text-neutral-400">
          {label}
        </span>
        <button
          onClick={onAdd}
          className="flex items-center gap-0.5 text-[10px] text-accent hover:underline"
        >
          <Plus size={12} weight="duotone" />
          Add to label
        </button>
      </div>
      <p className="text-[10px] text-neutral-300 leading-relaxed">{text}</p>
    </div>
  );
}
