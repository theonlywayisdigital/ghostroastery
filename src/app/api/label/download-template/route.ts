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

  // Crop mark settings
  const cropMarkLenMm = 5;
  const cropMarkOffMm = 3;
  const cropMarkMarginPt = mmToPt(cropMarkOffMm + cropMarkLenMm + 2);

  const pageWidthPt = totalWidthPt + cropMarkMarginPt * 2;
  const pageHeightPt = totalHeightPt + cropMarkMarginPt * 2;

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: [pageWidthPt, pageHeightPt],
      margin: 0,
      info: {
        Title: "Label Template - 94x140mm",
        Author: "Ghost Roastery Label Maker",
        Subject: "Blank label template for coffee bags",
        Creator: "Ghost Roastery (ghostroastery.com)",
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const imgX = cropMarkMarginPt;
    const imgY = cropMarkMarginPt;

    // Fill the total canvas area with white
    doc.rect(imgX, imgY, totalWidthPt, totalHeightPt).fill("#FFFFFF");

    // Draw bleed area (light grey border)
    doc.lineWidth(0.5);
    doc.strokeColor("#CCCCCC");
    doc.rect(imgX, imgY, totalWidthPt, totalHeightPt).stroke();

    // Draw trim line (dashed)
    const trimX = imgX + bleedPt;
    const trimY = imgY + bleedPt;
    doc.lineWidth(0.5);
    doc.strokeColor("#FF0000");
    doc.dash(4, { space: 4 });
    doc.rect(trimX, trimY, trimWidthPt, trimHeightPt).stroke();
    doc.undash();

    // Draw safe zone (dotted, green)
    const safeX = trimX + safePt;
    const safeY = trimY + safePt;
    const safeW = trimWidthPt - safePt * 2;
    const safeH = trimHeightPt - safePt * 2;
    doc.lineWidth(0.5);
    doc.strokeColor("#00AA00");
    doc.dash(2, { space: 3 });
    doc.rect(safeX, safeY, safeW, safeH).stroke();
    doc.undash();

    // Draw crop marks
    const markLen = mmToPt(cropMarkLenMm);
    const markOff = mmToPt(cropMarkOffMm);
    doc.lineWidth(0.25);
    doc.strokeColor("#000000");

    const line = (x1: number, y1: number, x2: number, y2: number) => {
      doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
    };

    const trimRight = trimX + trimWidthPt;
    const trimBottom = trimY + trimHeightPt;

    // Top-left
    line(trimX, trimY - markOff, trimX, trimY - markOff - markLen);
    line(trimX - markOff, trimY, trimX - markOff - markLen, trimY);
    // Top-right
    line(trimRight, trimY - markOff, trimRight, trimY - markOff - markLen);
    line(trimRight + markOff, trimY, trimRight + markOff + markLen, trimY);
    // Bottom-left
    line(trimX, trimBottom + markOff, trimX, trimBottom + markOff + markLen);
    line(trimX - markOff, trimBottom, trimX - markOff - markLen, trimBottom);
    // Bottom-right
    line(trimRight, trimBottom + markOff, trimRight, trimBottom + markOff + markLen);
    line(trimRight + markOff, trimBottom, trimRight + markOff + markLen, trimBottom);

    // Add dimension labels
    doc.fontSize(6);
    doc.fillColor("#666666");

    // Total size label (below bottom-left)
    doc.text(
      `Total: ${totalWidthMm}\u00d7${totalHeightMm}mm (incl. ${bleedMm}mm bleed)`,
      imgX,
      imgY + totalHeightPt + mmToPt(2),
      { width: totalWidthPt, align: "center" }
    );

    // Trim size label (centre of trim area)
    doc.fontSize(8);
    doc.fillColor("#999999");
    doc.text(
      `Trim: ${widthMm}\u00d7${heightMm}mm`,
      trimX,
      trimY + trimHeightPt / 2 - 12,
      { width: trimWidthPt, align: "center" }
    );
    doc.fontSize(6);
    doc.text(
      `Safe zone: ${safeZoneMm}mm inset`,
      trimX,
      trimY + trimHeightPt / 2 + 2,
      { width: trimWidthPt, align: "center" }
    );

    // Legend
    const legendY = imgY + totalHeightPt + mmToPt(6);
    doc.fontSize(5);

    doc.fillColor("#FF0000").text("\u2014 \u2014 Trim line", imgX, legendY);
    doc.fillColor("#00AA00").text("\u00b7 \u00b7 \u00b7 Safe zone", imgX + mmToPt(25), legendY);
    doc.fillColor("#CCCCCC").text("\u2014\u2014 Bleed edge", imgX + mmToPt(50), legendY);

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
