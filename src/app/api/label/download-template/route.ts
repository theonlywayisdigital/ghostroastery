import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";

/**
 * GET /api/label/download-template
 *
 * Generates a blank template PDF with guide lines
 * at the fixed print dimensions (106mm × 156mm page, with 2mm bleed,
 * trim at 102×152mm, safe zone 4mm inside trim).
 */
export async function GET() {
  // Fixed print dimensions
  const trimWidthMm = 102;
  const trimHeightMm = 152;
  const bleedMm = 2;
  const safeZoneMm = 4;

  // Page size = trim + bleed on each side
  const pageWidthMm = trimWidthMm + bleedMm * 2; // 106mm
  const pageHeightMm = trimHeightMm + bleedMm * 2; // 156mm

  // 1 inch = 72pt = 25.4mm → 1mm = 72/25.4 pt (exact fraction avoids drift)
  const mmToPt = (mm: number) => (mm * 72) / 25.4;

  const pageWidthPt = mmToPt(pageWidthMm);
  const pageHeightPt = mmToPt(pageHeightMm);
  const bleedPt = mmToPt(bleedMm);
  const safePt = mmToPt(safeZoneMm);

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: [pageWidthPt, pageHeightPt],
      margin: 0,
      info: {
        Title: `Label Template - ${pageWidthMm}x${pageHeightMm}mm`,
        Author: "Ghost Roastery Label Maker",
        Subject: `Blank label template for coffee bags \u2014 ${pageWidthMm}\u00d7${pageHeightMm}mm (${trimWidthMm}\u00d7${trimHeightMm}mm trim + ${bleedMm}mm bleed)`,
        Creator: "Ghost Roastery (ghostroastery.com)",
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Fill entire page white
    doc.rect(0, 0, pageWidthPt, pageHeightPt).fill("#FFFFFF");

    // Bleed line (red dashed) — at page edge
    doc.lineWidth(0.5);
    doc.strokeColor("#FF0000");
    doc.dash(4, { space: 4 });
    doc.rect(0, 0, pageWidthPt, pageHeightPt).stroke();
    doc.undash();

    // Trim line (blue solid) — 2mm inset from page edge
    const trimW = pageWidthPt - bleedPt * 2;
    const trimH = pageHeightPt - bleedPt * 2;
    doc.lineWidth(0.75);
    doc.strokeColor("#0066FF");
    doc.rect(bleedPt, bleedPt, trimW, trimH).stroke();

    // Safe zone (green dotted) — 4mm inside trim (= bleed + safe from page edge)
    const safeInsetPt = bleedPt + safePt;
    const safeW = pageWidthPt - safeInsetPt * 2;
    const safeH = pageHeightPt - safeInsetPt * 2;
    doc.lineWidth(0.5);
    doc.strokeColor("#00AA00");
    doc.dash(2, { space: 3 });
    doc.rect(safeInsetPt, safeInsetPt, safeW, safeH).stroke();
    doc.undash();

    // Centre labels
    doc.fontSize(7);
    doc.fillColor("#BBBBBB");
    doc.text(
      `Page: ${pageWidthMm}\u00d7${pageHeightMm}mm (includes ${bleedMm}mm bleed)`,
      0,
      pageHeightPt / 2 - 20,
      { width: pageWidthPt, align: "center" }
    );
    doc.fontSize(5.5);
    doc.text(
      `Trim: ${trimWidthMm}\u00d7${trimHeightMm}mm (blue line)`,
      0,
      pageHeightPt / 2 - 5,
      { width: pageWidthPt, align: "center" }
    );
    doc.text(
      `Safe zone: ${safeZoneMm}mm inside trim (green line)`,
      0,
      pageHeightPt / 2 + 6,
      { width: pageWidthPt, align: "center" }
    );

    doc.end();
  });

  const filename = `label-template-${pageWidthMm}x${pageHeightMm}mm.pdf`;

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
