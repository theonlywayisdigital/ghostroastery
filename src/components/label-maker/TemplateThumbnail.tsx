import type { TemplateDefinition } from "./data/templates";

/** CSS-based thumbnail preview for a template */
export function TemplateThumbnail({ template }: { template: TemplateDefinition }) {
  return (
    <div
      className="w-full aspect-[94/140] rounded overflow-hidden relative"
      style={{ backgroundColor: template.backgroundColor }}
    >
      {/* Template 1 — Classic Roast (gold on dark brown, framed borders) */}
      {template.id === "tpl-classic-roast" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#2C1810" }}>
          {/* Outer gold frame */}
          <div className="absolute inset-[6%] border border-[#C9A96E]/80" />
          {/* Inner gold frame */}
          <div className="absolute inset-[9%] border border-[#C9A96E]/40" />
          {/* Diamond corners */}
          <div className="absolute top-[7%] left-[7%] w-1 h-1 bg-[#C9A96E] rotate-45" />
          <div className="absolute top-[7%] right-[7%] w-1 h-1 bg-[#C9A96E] rotate-45" />
          <div className="absolute bottom-[7%] left-[7%] w-1 h-1 bg-[#C9A96E] rotate-45" />
          <div className="absolute bottom-[7%] right-[7%] w-1 h-1 bg-[#C9A96E] rotate-45" />
          {/* Brand name */}
          <div className="flex gap-[2px] mt-[13%] z-10">
            <div className="w-1 h-1 bg-[#C9A96E] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#C9A96E] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#C9A96E] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#C9A96E] rounded-[1px]" />
          </div>
          {/* Logo placeholder */}
          <div className="w-[52%] h-[16%] border border-dashed border-[#8B7348] rounded-sm mt-1 z-10" />
          {/* Flourish: line + diamond + line */}
          <div className="flex items-center gap-0.5 mt-1.5 z-10">
            <div className="w-3 h-px bg-[#C9A96E]/70" />
            <div className="w-1 h-1 bg-[#C9A96E] rotate-45" />
            <div className="w-3 h-px bg-[#C9A96E]/70" />
          </div>
          {/* Large italic coffee name */}
          <div className="w-[55%] h-[5%] bg-[#C9A96E]/70 rounded-sm mt-2 z-10" />
          <div className="w-[45%] h-[5%] bg-[#C9A96E]/60 rounded-sm mt-0.5 z-10" />
          {/* Origin */}
          <div className="w-[48%] h-[2%] bg-[#A0845C]/50 rounded-sm mt-2 z-10" />
          {/* Notes */}
          <div className="w-[55%] h-[2%] bg-[#8B7348]/40 rounded-sm mt-1 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#C9A96E]/50 rounded-sm z-10" />
        </div>
      )}

      {/* Template 2 — Editorial (clean white, massive type, data rows) */}
      {template.id === "tpl-editorial" && (
        <div className="absolute inset-0 flex flex-col items-center bg-white">
          {/* Brand name small */}
          <div className="flex gap-[2px] mt-[5%] z-10">
            <div className="w-1 h-1 bg-[#0A0A0A] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#0A0A0A] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#0A0A0A] rounded-[1px]" />
          </div>
          {/* Subtitle */}
          <div className="w-[40%] h-[1.5%] bg-[#6B6B6B]/40 rounded-sm mt-1 z-10" />
          {/* Full rule */}
          <div className="w-[86%] h-px bg-[#0A0A0A] mt-1.5 z-10" />
          {/* Logo placeholder */}
          <div className="w-[50%] h-[12%] border border-dashed border-neutral-300 rounded-sm mt-1.5 z-10" />
          {/* HUGE coffee name */}
          <div className="w-[70%] h-[8%] bg-[#0A0A0A] rounded-sm mt-1.5 z-10" />
          <div className="w-[50%] h-[8%] bg-[#0A0A0A] rounded-sm mt-0.5 z-10" />
          {/* Data rows */}
          <div className="w-[86%] h-px bg-neutral-200 mt-2 z-10" />
          <div className="flex w-[86%] gap-1 mt-1 z-10">
            <div className="w-[20%] h-[3px] bg-[#6B6B6B]/50 rounded-sm" />
            <div className="w-[40%] h-[3px] bg-[#1A1A1A]/60 rounded-sm" />
          </div>
          <div className="w-[86%] h-px bg-neutral-200 mt-1 z-10" />
          <div className="flex w-[86%] gap-1 mt-1 z-10">
            <div className="w-[20%] h-[3px] bg-[#6B6B6B]/50 rounded-sm" />
            <div className="w-[45%] h-[3px] bg-[#1A1A1A]/60 rounded-sm" />
          </div>
          {/* Vertical text indicator on left */}
          <div className="absolute left-[2%] top-[30%] bottom-[30%] w-[2px] bg-[#6B6B6B]/30 rounded-sm z-10" />
          {/* Weight */}
          <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#0A0A0A]/60 rounded-sm z-10" />
        </div>
      )}

      {/* Template 3 — Nordic (large dark circle, data grid) */}
      {template.id === "tpl-nordic" && (
        <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#F5F3EF" }}>
          {/* Brand name top-left */}
          <div className="absolute top-[5%] left-[8%] flex gap-[2px]">
            <div className="w-1 h-1 bg-[#1C1C1C] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#1C1C1C] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#1C1C1C] rounded-[1px]" />
          </div>
          {/* Large dark circle */}
          <div className="absolute top-[12%] left-1/2 -translate-x-1/2 w-[55%] aspect-square rounded-full bg-[#2A2A2A] flex items-center justify-center">
            <div className="w-[65%] h-[40%] border border-dashed border-white/20 rounded-sm" />
          </div>
          {/* Product name left-aligned */}
          <div className="absolute top-[55%] left-[8%] w-[60%] h-[4%] bg-[#1C1C1C] rounded-sm" />
          {/* Description */}
          <div className="absolute top-[62%] left-[8%] w-[70%] h-[2%] bg-[#7A7A7A]/40 rounded-sm" />
          {/* Full rule */}
          <div className="absolute top-[68%] left-[8%] right-[8%] h-px bg-[#1C1C1C]" />
          {/* 2-column data grid */}
          <div className="absolute top-[72%] left-[8%] w-[28%] h-[2px] bg-[#7A7A7A]/40 rounded-sm" />
          <div className="absolute top-[75%] left-[8%] w-[35%] h-[2px] bg-[#1C1C1C]/60 rounded-sm" />
          <div className="absolute top-[72%] left-[52%] w-[28%] h-[2px] bg-[#7A7A7A]/40 rounded-sm" />
          <div className="absolute top-[75%] left-[52%] w-[25%] h-[2px] bg-[#1C1C1C]/60 rounded-sm" />
          {/* Bottom rule */}
          <div className="absolute top-[82%] left-[8%] right-[8%] h-px bg-[#1C1C1C]/50" />
          {/* Weight + website */}
          <div className="absolute bottom-[4%] left-[8%] w-[12%] h-[2px] bg-[#1C1C1C]/60 rounded-sm" />
          <div className="absolute bottom-[4%] right-[8%] w-[25%] h-[2px] bg-[#7A7A7A]/40 rounded-sm" />
        </div>
      )}

      {/* Template 4 — Foundry (industrial, black with rust bars) */}
      {template.id === "tpl-foundry" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#111111" }}>
          {/* Top rust bar */}
          <div className="w-full h-[14%] bg-[#B85C38] flex items-center justify-center">
            <div className="flex gap-[2px]">
              <div className="w-1 h-1 bg-[#111111] rounded-[1px]" />
              <div className="w-1 h-1 bg-[#111111] rounded-[1px]" />
              <div className="w-1 h-1 bg-[#111111] rounded-[1px]" />
              <div className="w-1 h-1 bg-[#111111] rounded-[1px]" />
            </div>
          </div>
          {/* Logo placeholder */}
          <div className="w-[50%] h-[14%] border border-dashed border-white/30 rounded-sm mt-1.5 z-10" />
          {/* Thick white rule */}
          <div className="w-[86%] h-[2px] bg-white mt-1.5 z-10" />
          {/* Massive stacked name */}
          <div className="w-[65%] h-[8%] bg-[#F5F5F5] rounded-sm mt-1.5 z-10" />
          <div className="w-[50%] h-[8%] bg-[#F5F5F5] rounded-sm mt-0.5 z-10" />
          {/* Thin rule */}
          <div className="w-[86%] h-px bg-[#777777] mt-1.5 z-10" />
          {/* 3 info pills */}
          <div className="flex gap-0.5 mt-1.5 z-10">
            <div className="w-5 h-3 border border-[#777777] rounded-sm flex flex-col items-center justify-center gap-px">
              <div className="w-3 h-[2px] bg-[#B85C38]/60 rounded-sm" />
              <div className="w-2.5 h-[2px] bg-white/50 rounded-sm" />
            </div>
            <div className="w-5 h-3 border border-[#777777] rounded-sm flex flex-col items-center justify-center gap-px">
              <div className="w-3 h-[2px] bg-[#B85C38]/60 rounded-sm" />
              <div className="w-2.5 h-[2px] bg-white/50 rounded-sm" />
            </div>
            <div className="w-5 h-3 border border-[#777777] rounded-sm flex flex-col items-center justify-center gap-px">
              <div className="w-3 h-[2px] bg-[#B85C38]/60 rounded-sm" />
              <div className="w-2.5 h-[2px] bg-white/50 rounded-sm" />
            </div>
          </div>
          {/* Bottom rust bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[9%] bg-[#B85C38] flex items-center justify-center">
            <div className="w-[40%] h-[3px] bg-[#111111]/70 rounded-sm" />
          </div>
        </div>
      )}

      {/* Template 5 — Atelier (boutique, calligraphic, ivory) */}
      {template.id === "tpl-atelier" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#FAF8F5" }}>
          {/* Hairline frame */}
          <div className="absolute inset-[7%] border border-[#B8A080]/50" />
          {/* 3 tiny circles at top */}
          <div className="flex gap-1 mt-[9%] z-10">
            <div className="w-0.5 h-0.5 rounded-full bg-[#B8A080]" />
            <div className="w-0.5 h-0.5 rounded-full bg-[#B8A080]" />
            <div className="w-0.5 h-0.5 rounded-full bg-[#B8A080]" />
          </div>
          {/* Brand name spaced */}
          <div className="flex gap-[2px] mt-1.5 z-10">
            <div className="w-0.5 h-1 bg-[#2B2B2B]/70 rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#2B2B2B]/70 rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#2B2B2B]/70 rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#2B2B2B]/70 rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#2B2B2B]/70 rounded-[1px]" />
          </div>
          {/* EST. 2024 */}
          <div className="w-[18%] h-[1.5%] bg-[#9A8E80]/40 rounded-sm mt-0.5 z-10" />
          {/* Logo placeholder */}
          <div className="w-[50%] h-[14%] border border-dashed border-[#B8A080] rounded-sm mt-1.5 z-10" />
          {/* Thin divider */}
          <div className="w-[24%] h-px bg-[#B8A080]/50 mt-1 z-10" />
          {/* Script coffee name (simulated with italics-like shape) */}
          <div className="w-[60%] h-[5%] bg-[#2B2B2B]/50 rounded-full mt-2 z-10" />
          {/* Ornament: line + circle + line */}
          <div className="flex items-center gap-0.5 mt-1.5 z-10">
            <div className="w-3 h-px bg-[#B8A080]/50" />
            <div className="w-1 h-1 rounded-full bg-[#B8A080]" />
            <div className="w-3 h-px bg-[#B8A080]/50" />
          </div>
          {/* Origin */}
          <div className="w-[38%] h-[2%] bg-[#9A8E80]/40 rounded-sm mt-1.5 z-10" />
          {/* Notes */}
          <div className="w-[32%] h-[1.5%] bg-[#B8A080]/30 rounded-sm mt-1 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 w-[12%] h-[1.5%] bg-[#9A8E80]/40 rounded-sm z-10" />
          {/* Bottom circle */}
          <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#B8A080] z-10" />
        </div>
      )}

      {/* Template 6 — Bloc (Swiss/Bauhaus, green block + gold accents) */}
      {template.id === "tpl-bloc" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#F0EDE8" }}>
          {/* Large green block at top */}
          <div className="w-full h-[38%] bg-[#1B3D2F] flex flex-col items-center justify-center gap-0.5">
            {/* Brand name reversed */}
            <div className="flex gap-[2px]">
              <div className="w-1 h-1 bg-[#F0EDE8] rounded-[1px]" />
              <div className="w-1 h-1 bg-[#F0EDE8] rounded-[1px]" />
              <div className="w-1 h-1 bg-[#F0EDE8] rounded-[1px]" />
              <div className="w-1 h-1 bg-[#F0EDE8] rounded-[1px]" />
            </div>
            {/* Golden accent line */}
            <div className="w-[28%] h-[2px] bg-[#D4A853] mt-0.5" />
            {/* Logo placeholder */}
            <div className="w-[52%] h-[35%] border border-dashed border-[#4A7A5C] rounded-sm mt-1" />
          </div>
          {/* Product name left-aligned */}
          <div className="self-start ml-[10%] w-[65%] h-[5%] bg-[#1B3D2F] rounded-sm mt-2 z-10" />
          {/* ORIGIN label + value */}
          <div className="self-start ml-[10%] flex gap-1 mt-2 z-10">
            <div className="w-4 h-[3px] bg-[#D4A853]/70 rounded-sm" />
            <div className="w-12 h-[3px] bg-[#1B3D2F]/60 rounded-sm" />
          </div>
          {/* NOTES label + value */}
          <div className="self-start ml-[10%] flex gap-1 mt-1 z-10">
            <div className="w-4 h-[3px] bg-[#D4A853]/70 rounded-sm" />
            <div className="w-14 h-[3px] bg-[#1B3D2F]/60 rounded-sm" />
          </div>
          {/* Bottom golden bar */}
          <div className="absolute bottom-0 left-0 right-0 h-[8%] bg-[#D4A853] flex items-center justify-center">
            <div className="w-[40%] h-[3px] bg-[#1B3D2F]/70 rounded-sm" />
          </div>
        </div>
      )}

      {/* Template 7 — Terroir (organic shapes, clay ellipse, earth tones) */}
      {template.id === "tpl-terroir" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#E8E4DA" }}>
          {/* Brand name */}
          <div className="flex gap-[2px] mt-[6%] z-10">
            <div className="w-1 h-1 bg-[#2E2418] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#2E2418] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#2E2418] rounded-[1px]" />
          </div>
          {/* Logo placeholder */}
          <div className="w-[50%] h-[12%] border border-dashed border-[#A0785C] rounded-sm mt-1 z-10" />
          {/* Large clay ellipse */}
          <div className="relative mt-2 z-10">
            <div className="w-10 h-14 rounded-full bg-[#A0785C] flex items-center justify-center">
              <div className="w-[70%] h-[35%] bg-white/20 rounded-sm" />
            </div>
          </div>
          {/* Scattered sage accent circles */}
          <div className="absolute top-[28%] left-[12%] w-2 h-2 rounded-full bg-[#6B8F71]/60 z-0" />
          <div className="absolute top-[52%] right-[12%] w-1.5 h-1.5 rounded-full bg-[#6B8F71]/50 z-0" />
          <div className="absolute top-[60%] left-[18%] w-1 h-1 rounded-full bg-[#2E2418]/30 z-0" />
          {/* Tasting notes */}
          <div className="w-[38%] h-[2%] bg-[#2E2418]/50 rounded-sm mt-1.5 z-10" />
          {/* Origin in sage */}
          <div className="w-[30%] h-[2%] bg-[#6B8F71]/60 rounded-sm mt-1 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 w-[12%] h-[2%] bg-[#2E2418]/40 rounded-sm z-10" />
        </div>
      )}

      {/* Template 8 — Dossier (Aesop-inspired, dense typography, zero decoration) */}
      {template.id === "tpl-dossier" && (
        <div className="absolute inset-0 flex flex-col bg-white">
          {/* Thin border */}
          <div className="absolute inset-[5%] border border-[#1A1A1A]/40" />
          {/* Brand name left-aligned */}
          <div className="absolute top-[7%] left-[8%] flex gap-[2px]">
            <div className="w-1 h-1.5 bg-[#1A1A1A] rounded-[1px]" />
            <div className="w-1 h-1.5 bg-[#1A1A1A] rounded-[1px]" />
            <div className="w-1 h-1.5 bg-[#1A1A1A] rounded-[1px]" />
            <div className="w-1 h-1.5 bg-[#1A1A1A] rounded-[1px]" />
          </div>
          {/* Hairline rule */}
          <div className="absolute top-[13%] left-[5%] right-[5%] h-px bg-[#E0E0E0]" />
          {/* Logo placeholder */}
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[50%] h-[13%] border border-dashed border-neutral-300 rounded-sm" />
          {/* Product name left-aligned */}
          <div className="absolute top-[34%] left-[8%] w-[65%] h-[4%] bg-[#1A1A1A] rounded-sm" />
          {/* Rule */}
          <div className="absolute top-[41%] left-[5%] right-[5%] h-px bg-[#E0E0E0]" />
          {/* ORIGIN label + value */}
          <div className="absolute top-[44%] left-[8%] w-[16%] h-[2px] bg-[#999999]/60 rounded-sm" />
          <div className="absolute top-[48%] left-[8%] w-[50%] h-[2.5px] bg-[#1A1A1A]/60 rounded-sm" />
          {/* Rule */}
          <div className="absolute top-[53%] left-[5%] right-[5%] h-px bg-[#E0E0E0]" />
          {/* TASTING NOTES label + value */}
          <div className="absolute top-[56%] left-[8%] w-[24%] h-[2px] bg-[#999999]/60 rounded-sm" />
          <div className="absolute top-[60%] left-[8%] w-[60%] h-[2.5px] bg-[#1A1A1A]/60 rounded-sm" />
          {/* Rule */}
          <div className="absolute top-[65%] left-[5%] right-[5%] h-px bg-[#E0E0E0]" />
          {/* PROCESS label + value */}
          <div className="absolute top-[68%] left-[8%] w-[18%] h-[2px] bg-[#999999]/60 rounded-sm" />
          <div className="absolute top-[72%] left-[8%] w-[45%] h-[2.5px] bg-[#1A1A1A]/60 rounded-sm" />
          {/* Rule */}
          <div className="absolute top-[77%] left-[5%] right-[5%] h-px bg-[#E0E0E0]" />
          {/* Weight + batch bottom */}
          <div className="absolute bottom-[6%] left-[8%] w-[10%] h-[2.5px] bg-[#1A1A1A]/60 rounded-sm" />
          <div className="absolute bottom-[6%] right-[8%] w-[18%] h-[2px] bg-[#999999]/40 rounded-sm" />
        </div>
      )}

      {/* ─── Mobile Template 1 — Stack (minimal vertical stack, white bg) ─── */}
      {template.id === "tpl-mobile-stack" && (
        <div className="absolute inset-0 flex flex-col items-center bg-white">
          {/* Brand name small caps */}
          <div className="flex gap-[2px] mt-[9%] z-10">
            <div className="w-1 h-1 bg-[#1A1A1A] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#1A1A1A] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#1A1A1A] rounded-[1px]" />
          </div>
          {/* Logo placeholder */}
          <div className="w-[50%] h-[10%] border border-dashed border-neutral-300 rounded-sm mt-1.5 z-10" />
          {/* Large coffee name */}
          <div className="w-[60%] h-[7%] bg-[#1A1A1A] rounded-sm mt-2 z-10" />
          <div className="w-[45%] h-[7%] bg-[#1A1A1A] rounded-sm mt-0.5 z-10" />
          {/* Origin */}
          <div className="w-[55%] h-[2%] bg-[#666666]/50 rounded-sm mt-2 z-10" />
          {/* Notes */}
          <div className="w-[60%] h-[2%] bg-[#999999]/40 rounded-sm mt-1.5 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#1A1A1A]/60 rounded-sm z-10" />
        </div>
      )}

      {/* ─── Mobile Template 2 — Bold Split (colour block top, white bottom) ─── */}
      {template.id === "tpl-mobile-bold-split" && (
        <div className="absolute inset-0 flex flex-col bg-white">
          {/* Top colour block */}
          <div className="w-full h-[45%] bg-[#1B3D2F] flex flex-col items-center justify-center gap-0.5">
            {/* Brand name reversed */}
            <div className="flex gap-[2px]">
              <div className="w-1 h-1 bg-white rounded-[1px]" />
              <div className="w-1 h-1 bg-white rounded-[1px]" />
              <div className="w-1 h-1 bg-white rounded-[1px]" />
            </div>
            {/* Logo placeholder */}
            <div className="w-[48%] h-[20%] border border-dashed border-white/30 rounded-sm mt-1" />
            {/* Coffee name reversed */}
            <div className="w-[55%] h-[12%] bg-white/90 rounded-sm mt-1" />
          </div>
          {/* Bottom white area */}
          <div className="flex-1 flex flex-col items-start px-[10%] pt-[4%]">
            {/* Origin label */}
            <div className="w-[25%] h-[2px] bg-[#999999]/60 rounded-sm" />
            <div className="w-[50%] h-[3px] bg-[#1A1A1A]/70 rounded-sm mt-1" />
            {/* Notes label */}
            <div className="w-[20%] h-[2px] bg-[#999999]/60 rounded-sm mt-2" />
            <div className="w-[60%] h-[3px] bg-[#1A1A1A]/70 rounded-sm mt-1" />
          </div>
          {/* Weight */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#1B3D2F]/60 rounded-sm" />
        </div>
      )}

      {/* ─── Mobile Template 3 — Circle Mark (large circle, modern) ─── */}
      {template.id === "tpl-mobile-circle-mark" && (
        <div className="absolute inset-0 flex flex-col items-center" style={{ backgroundColor: "#F5F3EF" }}>
          {/* Brand name */}
          <div className="flex gap-[2px] mt-[7%] z-10">
            <div className="w-1 h-1 bg-[#2A2A2A] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#2A2A2A] rounded-[1px]" />
            <div className="w-1 h-1 bg-[#2A2A2A] rounded-[1px]" />
          </div>
          {/* Logo placeholder */}
          <div className="w-[45%] h-[10%] border border-dashed border-[#7A7A7A]/40 rounded-sm mt-1 z-10" />
          {/* Large dark circle */}
          <div className="w-[55%] aspect-square rounded-full bg-[#2A2A2A] flex items-center justify-center mt-1.5 z-10">
            {/* Coffee name inside */}
            <div className="flex flex-col items-center gap-0.5">
              <div className="w-6 h-[3px] bg-[#F5F3EF]/80 rounded-sm" />
              <div className="w-4 h-[3px] bg-[#F5F3EF]/60 rounded-sm" />
            </div>
          </div>
          {/* Details below circle */}
          <div className="w-[50%] h-[2%] bg-[#7A7A7A]/40 rounded-sm mt-1.5 z-10" />
          {/* Weight */}
          <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[14%] h-[2%] bg-[#2A2A2A]/60 rounded-sm z-10" />
        </div>
      )}

      {/* ─── Mobile Template 4 — Type Only (pure typography, no shapes) ─── */}
      {template.id === "tpl-mobile-type-only" && (
        <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: "#FAFAFA" }}>
          {/* Brand name tiny left-aligned */}
          <div className="absolute top-[6%] left-[8%] flex gap-[2px]">
            <div className="w-0.5 h-1 bg-[#999999] rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#999999] rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#999999] rounded-[1px]" />
            <div className="w-0.5 h-1 bg-[#999999] rounded-[1px]" />
          </div>
          {/* Rule */}
          <div className="absolute top-[11%] left-[8%] right-[8%] h-px bg-[#E0E0E0]" />
          {/* Logo placeholder */}
          <div className="absolute top-[14%] left-[8%] w-[45%] h-[10%] border border-dashed border-neutral-300 rounded-sm" />
          {/* Massive serif coffee name */}
          <div className="absolute top-[28%] left-[8%] w-[65%] h-[6%] bg-[#1A1A1A] rounded-sm" />
          <div className="absolute top-[36%] left-[8%] w-[55%] h-[6%] bg-[#1A1A1A] rounded-sm" />
          {/* Origin subtitle */}
          <div className="absolute top-[48%] left-[8%] w-[50%] h-[2%] bg-[#666666]/50 rounded-sm" />
          {/* Tasting notes */}
          <div className="absolute top-[58%] left-[8%] w-[55%] h-[2%] bg-[#999999]/40 rounded-sm" />
          {/* Weight */}
          <div className="absolute bottom-[6%] left-[8%] w-[12%] h-[2%] bg-[#1A1A1A]/60 rounded-sm" />
        </div>
      )}

      {/* ─── Generic fallback for any unhandled template ID ─── */}
      {![
        "tpl-classic-roast", "tpl-editorial", "tpl-nordic", "tpl-foundry",
        "tpl-atelier", "tpl-bloc", "tpl-terroir", "tpl-dossier",
        "tpl-mobile-stack", "tpl-mobile-bold-split", "tpl-mobile-circle-mark", "tpl-mobile-type-only",
      ].includes(template.id) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-[60%] h-[4%] bg-black/20 rounded-sm" />
          <div className="w-[50%] h-[12%] border border-dashed border-black/15 rounded-sm mt-1.5" />
          <div className="w-[65%] h-[8%] bg-black/15 rounded-sm mt-2" />
          <div className="w-[45%] h-[2%] bg-black/10 rounded-sm mt-1.5" />
        </div>
      )}
    </div>
  );
}
