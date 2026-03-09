import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

/**
 * GET /api/label/download-template
 *
 * Generates a blank template PDF with crop marks and guide lines
 * at the fixed print dimensions (94mm × 140mm trim, 3mm bleed, 4mm safe zone).
 */
export async function GET() {
  // Fixed print dimensions
  const widthMm = 94;
  const heightMm = 140;
  const bleedMm = 3;
  const safeZoneMm = 4;

  const totalWidthMm = widthMm + bleedMm * 2;
  const totalHeightMm = heightMm + bleedMm * 2;

  const mmToPt = (mm: number) => mm * 2.83465;

  const totalWidthPt = mmToPt(totalWidthMm);
  const totalHeightPt = mmToPt(totalHeightMm);
  const bleedPt = mmToPt(bleedMm);
  const safePt = mmToPt(safeZoneMm);
  const trimWidthPt = mmToPt(widthMm);
  const trimHeightPt = mmToPt(heightMm);

  // Document is exactly the total size (trim + bleed) — no extra margins
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: [totalWidthPt, totalHeightPt],
      margin: 0,
      info: {
        Title: "Label Template - 94x140mm (100x146mm with bleed)",
        Author: "Ghost Roastery Label Maker",
        Subject: "Blank label template for coffee bags — 100×146mm with 3mm bleed",
        Creator: "Ghost Roastery (ghostroastery.com)",
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Fill entire page white
    doc.rect(0, 0, totalWidthPt, totalHeightPt).fill("#FFFFFF");

    // Trim line (red dashed) — 3mm in from each edge
    doc.lineWidth(0.5);
    doc.strokeColor("#FF0000");
    doc.dash(4, { space: 4 });
    doc.rect(bleedPt, bleedPt, trimWidthPt, trimHeightPt).stroke();
    doc.undash();

    // Safe zone (green dotted) — 4mm inset from trim
    const safeX = bleedPt + safePt;
    const safeY = bleedPt + safePt;
    const safeW = trimWidthPt - safePt * 2;
    const safeH = trimHeightPt - safePt * 2;
    doc.lineWidth(0.5);
    doc.strokeColor("#00AA00");
    doc.dash(2, { space: 3 });
    doc.rect(safeX, safeY, safeW, safeH).stroke();
    doc.undash();

    // Centre labels
    doc.fontSize(7);
    doc.fillColor("#BBBBBB");
    doc.text(
      `Trim: ${widthMm}\u00d7${heightMm}mm`,
      bleedPt,
      bleedPt + trimHeightPt / 2 - 14,
      { width: trimWidthPt, align: "center" }
    );
    doc.fontSize(5.5);
    doc.text(
      `Safe zone: ${safeZoneMm}mm inset from trim`,
      bleedPt,
      bleedPt + trimHeightPt / 2 + 1,
      { width: trimWidthPt, align: "center" }
    );
    doc.text(
      `Document: ${totalWidthMm}\u00d7${totalHeightMm}mm (incl. ${bleedMm}mm bleed)`,
      bleedPt,
      bleedPt + trimHeightPt / 2 + 12,
      { width: trimWidthPt, align: "center" }
    );

    doc.end();
  });

  const filename = "label-template-94x140mm.pdf";

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
