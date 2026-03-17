import type { TemplateDefinition } from "./data/templates";

/** CSS-based thumbnail preview for a template */
export function TemplateThumbnail({ template }: { template: TemplateDefinition }) {
  return (
    <div
      className="w-full aspect-[102/152] rounded overflow-hidden relative"
      style={{ backgroundColor: template.backgroundColor }}
    >
      {/* Template 1 — Classic (gold on dark brown, framed) */}
      {template.id === "tpl-classic" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#2C1810" }}>
          {/* Gold frame */}
          <div className="absolute inset-[8%] border border-[#C9A96E]/70" />
          {/* Logo placeholder — square, taller */}
          <div className="w-[44%] aspect-[40/35] border border-dashed border-[#8B7348] rounded-sm mt-[18%] z-10" />
          {/* Thin divider */}
          <div className="w-[36%] h-px bg-[#C9A96E]/50 mt-1.5 z-10" />
          {/* Coffee name — more central */}
          <div className="w-[55%] h-[5%] bg-[#C9A96E]/70 rounded-sm mt-3 z-10" />
          {/* Tagline */}
          <div className="w-[45%] h-[2%] bg-[#A0845C]/40 rounded-sm mt-1.5 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#C9A96E]/50 rounded-sm z-10" />
        </div>
      )}

      {/* Template 2 — Editorial (clean white, massive type) */}
      {template.id === "tpl-editorial" && (
        <div className="absolute inset-0 flex flex-col items-center bg-white">
          {/* Tagline */}
          <div className="w-[40%] h-[1.5%] bg-[#6B6B6B]/40 rounded-sm mt-[6%] z-10" />
          {/* Full rule */}
          <div className="w-[86%] h-px bg-[#0A0A0A] mt-1.5 z-10" />
          {/* Logo placeholder — square, taller */}
          <div className="w-[44%] aspect-[42/35] border border-dashed border-neutral-300 rounded-sm mt-1.5 z-10" />
          {/* HUGE coffee name — more central */}
          <div className="w-[70%] h-[8%] bg-[#0A0A0A] rounded-sm mt-3 z-10" />
          <div className="w-[50%] h-[8%] bg-[#0A0A0A] rounded-sm mt-0.5 z-10" />
          {/* Rule */}
          <div className="w-[86%] h-px bg-neutral-200 mt-2 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#0A0A0A]/60 rounded-sm z-10" />
        </div>
      )}

      {/* Template 3 — Nordic (dark circle, clean type) */}
      {template.id === "tpl-nordic" && (
        <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#F5F3EF" }}>
          {/* Large dark circle with logo placeholder — bigger */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[56%] aspect-square rounded-full bg-[#2A2A2A] flex items-center justify-center">
            <div className="w-[55%] aspect-square border border-dashed border-white/20 rounded-sm" />
          </div>
          {/* Product name — more central */}
          <div className="absolute top-[56%] left-[8%] w-[60%] h-[4%] bg-[#1C1C1C] rounded-sm" />
          {/* Tagline */}
          <div className="absolute top-[64%] left-[8%] w-[70%] h-[2%] bg-[#7A7A7A]/40 rounded-sm" />
          {/* Full rule */}
          <div className="absolute top-[72%] left-[8%] right-[8%] h-px bg-[#1C1C1C]" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-[8%] w-[12%] h-[2px] bg-[#1C1C1C]/60 rounded-sm" />
        </div>
      )}

      {/* Template 4 — Foundry (industrial, black with rust bars) */}
      {template.id === "tpl-foundry" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#111111" }}>
          {/* Top rust bar — thinner */}
          <div className="w-full h-[5%] bg-[#B85C38]" />
          {/* Logo placeholder — square, taller */}
          <div className="w-[44%] aspect-[40/35] border border-dashed border-white/30 rounded-sm mt-3 z-10" />
          {/* Thick white rule */}
          <div className="w-[86%] h-[2px] bg-white mt-2 z-10" />
          {/* Massive stacked name — more central */}
          <div className="w-[65%] h-[8%] bg-[#F5F5F5] rounded-sm mt-3 z-10" />
          <div className="w-[50%] h-[8%] bg-[#F5F5F5] rounded-sm mt-0.5 z-10" />
          {/* Bottom rust bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-[#B85C38] flex items-center justify-center">
            <div className="w-[40%] h-[3px] bg-[#111111]/70 rounded-sm" />
          </div>
        </div>
      )}

      {/* Template 5 — Atelier (boutique, calligraphic, ivory) */}
      {template.id === "tpl-atelier" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#FAF8F5" }}>
          {/* Hairline frame */}
          <div className="absolute inset-[8%] border border-[#B8A080]/50" />
          {/* 3 tiny circles at top */}
          <div className="flex gap-1 mt-[10%] z-10">
            <div className="w-0.5 h-0.5 rounded-full bg-[#B8A080]" />
            <div className="w-0.5 h-0.5 rounded-full bg-[#B8A080]" />
            <div className="w-0.5 h-0.5 rounded-full bg-[#B8A080]" />
          </div>
          {/* Logo placeholder — square, taller */}
          <div className="w-[44%] aspect-[40/35] border border-dashed border-[#B8A080] rounded-sm mt-2 z-10" />
          {/* Thin divider */}
          <div className="w-[24%] h-px bg-[#B8A080]/50 mt-1.5 z-10" />
          {/* Script coffee name — more central */}
          <div className="w-[60%] h-[5%] bg-[#2B2B2B]/50 rounded-full mt-3 z-10" />
          {/* Ornament circle */}
          <div className="w-1 h-1 rounded-full bg-[#B8A080] mt-2 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[7%] left-1/2 -translate-x-1/2 w-[12%] h-[1.5%] bg-[#9A8E80]/40 rounded-sm z-10" />
        </div>
      )}

      {/* Template 6 — Bloc (Swiss/Bauhaus, green block + gold accents) */}
      {template.id === "tpl-bloc" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#F0EDE8" }}>
          {/* Large green block at top — taller to fit square logo */}
          <div className="w-full h-[46%] bg-[#1B3D2F] flex flex-col items-center justify-center gap-0.5">
            {/* Logo placeholder — square, taller */}
            <div className="w-[44%] aspect-[40/35] border border-dashed border-[#4A7A5C] rounded-sm" />
            {/* Golden accent line */}
            <div className="w-[28%] h-[2px] bg-[#D4A853] mt-0.5" />
          </div>
          {/* Product name — more central */}
          <div className="self-start ml-[10%] w-[65%] h-[5%] bg-[#1B3D2F] rounded-sm mt-3 z-10" />
          {/* Tagline */}
          <div className="self-start ml-[10%] w-[50%] h-[2%] bg-[#1B3D2F]/40 rounded-sm mt-1.5 z-10" />
          {/* Bottom golden bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-[#D4A853] flex items-center justify-center">
            <div className="w-[40%] h-[3px] bg-[#1B3D2F]/70 rounded-sm" />
          </div>
        </div>
      )}

      {/* Template 7 — Terroir (organic shapes, clay ellipse, earth tones) */}
      {template.id === "tpl-terroir" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#E8E4DA" }}>
          {/* Logo placeholder — square, taller */}
          <div className="w-[44%] aspect-[40/35] border border-dashed border-[#A0785C] rounded-sm mt-[15%] z-10" />
          {/* Large clay circle — more central */}
          <div className="relative mt-3 z-10">
            <div className="w-10 h-10 rounded-full bg-[#A0785C] flex items-center justify-center">
              <div className="w-[70%] h-[35%] bg-white/20 rounded-sm" />
            </div>
          </div>
          {/* Scattered sage accent circles */}
          <div className="absolute top-[35%] left-[12%] w-2 h-2 rounded-full bg-[#6B8F71]/60 z-0" />
          <div className="absolute top-[60%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#6B8F71]/50 z-0" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[12%] h-[2%] bg-[#2E2418]/40 rounded-sm z-10" />
        </div>
      )}

      {/* Template 8 — Dossier (clean typography, bordered) */}
      {template.id === "tpl-dossier" && (
        <div className="absolute inset-0 flex flex-col bg-white">
          {/* Thin border */}
          <div className="absolute inset-[6%] border border-[#1A1A1A]/40" />
          {/* Logo placeholder — square, taller */}
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[44%] aspect-[42/35] border border-dashed border-neutral-300 rounded-sm" />
          {/* Hairline rule */}
          <div className="absolute top-[42%] left-[6%] right-[6%] h-px bg-[#E0E0E0]" />
          {/* Product name — more central */}
          <div className="absolute top-[52%] left-[10%] w-[60%] h-[4%] bg-[#1A1A1A] rounded-sm" />
          {/* Tagline */}
          <div className="absolute top-[60%] left-[10%] w-[50%] h-[2%] bg-[#999999]/40 rounded-sm" />
          {/* Rule */}
          <div className="absolute top-[68%] left-[6%] right-[6%] h-px bg-[#E0E0E0]" />
          {/* Weight */}
          <div className="absolute bottom-[8%] left-[10%] w-[10%] h-[2.5px] bg-[#1A1A1A]/60 rounded-sm" />
        </div>
      )}

      {/* ─── Mobile Template 1 — Stack ─── */}
      {template.id === "tpl-mobile-stack" && (
        <div className="absolute inset-0 flex flex-col items-center bg-white">
          {/* Logo placeholder — square, taller */}
          <div className="w-[44%] aspect-[40/35] border border-dashed border-neutral-300 rounded-sm mt-[18%] z-10" />
          {/* Large coffee name — more central */}
          <div className="w-[60%] h-[7%] bg-[#1A1A1A] rounded-sm mt-4 z-10" />
          <div className="w-[45%] h-[7%] bg-[#1A1A1A] rounded-sm mt-0.5 z-10" />
          {/* Tagline */}
          <div className="w-[50%] h-[2%] bg-[#999999]/40 rounded-sm mt-2 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#1A1A1A]/60 rounded-sm z-10" />
        </div>
      )}

      {/* ─── Mobile Template 2 — Bold Split ─── */}
      {template.id === "tpl-mobile-bold-split" && (
        <div className="absolute inset-0 flex flex-col bg-white">
          {/* Top colour block — taller to fit square logo */}
          <div className="w-full h-[50%] bg-[#1B3D2F] flex items-center justify-center">
            {/* Logo placeholder — square, taller */}
            <div className="w-[44%] aspect-[40/35] border border-dashed border-white/30 rounded-sm" />
          </div>
          {/* Coffee name — more central */}
          <div className="self-center w-[60%] h-[5%] bg-[#1B3D2F] rounded-sm mt-4" />
          {/* Tagline */}
          <div className="self-center w-[45%] h-[2%] bg-[#999999]/40 rounded-sm mt-1.5" />
          {/* Weight */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#1B3D2F]/60 rounded-sm" />
        </div>
      )}

      {/* ─── Mobile Template 3 — Circle Mark ─── */}
      {template.id === "tpl-mobile-circle-mark" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#F5F3EF" }}>
          {/* Logo placeholder — square, taller */}
          <div className="w-[38%] aspect-[36/30] border border-dashed border-[#7A7A7A]/40 rounded-sm mt-[10%] z-10" />
          {/* Large dark circle — more central */}
          <div className="w-[55%] aspect-square rounded-full bg-[#2A2A2A] flex items-center justify-center mt-3 z-10">
            {/* Coffee name inside */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-[3px] bg-[#F5F3EF]/80 rounded-sm" />
              <div className="w-4 h-[3px] bg-[#F5F3EF]/60 rounded-sm" />
            </div>
          </div>
          {/* Weight */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#2A2A2A]/60 rounded-sm z-10" />
        </div>
      )}

      {/* ─── Mobile Template 4 — Type Only ─── */}
      {template.id === "tpl-mobile-type-only" && (
        <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
          {/* Rule */}
          <div className="absolute top-[10%] left-[8%] right-[8%] h-px bg-[#E0E0E0]" />
          {/* Logo placeholder — square, taller */}
          <div className="absolute top-[14%] left-[8%] w-[44%] aspect-[40/32] border border-dashed border-neutral-300 rounded-sm" />
          {/* Massive serif coffee name — more central */}
          <div className="absolute top-[42%] left-[8%] w-[65%] h-[6%] bg-[#1A1A1A] rounded-sm" />
          <div className="absolute top-[50%] left-[8%] w-[55%] h-[6%] bg-[#1A1A1A] rounded-sm" />
          {/* Tagline */}
          <div className="absolute top-[62%] left-[8%] w-[50%] h-[2%] bg-[#666666]/50 rounded-sm" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-[8%] w-[12%] h-[2%] bg-[#1A1A1A]/60 rounded-sm" />
        </div>
      )}

      {/* ─── Generic fallback for any unhandled template ID ─── */}
      {![
        "tpl-classic", "tpl-editorial", "tpl-nordic", "tpl-foundry",
        "tpl-atelier", "tpl-bloc", "tpl-terroir", "tpl-dossier",
        "tpl-mobile-stack", "tpl-mobile-bold-split", "tpl-mobile-circle-mark", "tpl-mobile-type-only",
      ].includes(template.id) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-[44%] aspect-square border border-dashed border-black/15 rounded-sm" />
          <div className="w-[65%] h-[8%] bg-black/15 rounded-sm mt-3" />
          <div className="w-[45%] h-[2%] bg-black/10 rounded-sm mt-1.5" />
        </div>
      )}
    </div>
  );
}
