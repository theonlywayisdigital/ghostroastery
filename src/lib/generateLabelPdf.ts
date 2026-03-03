import PDFDocument from "pdfkit";
import sharp from "sharp";

interface LabelPdfOptions {
  /** Canvas PNG as a Buffer */
  canvasPng: Buffer;
  /** Label dimensions in mm */
  widthMm: number;
  heightMm: number;
  /** Bleed in mm (added on all sides) */
  bleedMm: number;
}

interface LabelPdfResult {
  /** PDF as a Buffer */
  pdfBuffer: Buffer;
  /** Preview PNG as a Buffer (smaller resolution for thumbnails) */
  previewPngBuffer: Buffer;
  /** Suggested filename */
  filename: string;
}

// Crop mark settings
const CROP_MARK_LENGTH_MM = 5;
const CROP_MARK_OFFSET_MM = 3; // Offset from trim line
const CROP_MARK_WIDTH = 0.25; // Points (thin line)

/**
 * Generates a print-ready PDF from a Fabric.js canvas PNG export.
 *
 * Fixed print dimensions: 94mm × 140mm trim, 3mm bleed → 100mm × 146mm total.
 *
 * The PDF includes:
 * - Full bleed canvas image at 300 DPI
 * - Crop marks at the 94mm × 140mm trim corners
 * - Correct physical dimensions
 */
export async function generateLabelPdf(
  options: LabelPdfOptions
): Promise<LabelPdfResult> {
  const { canvasPng, widthMm, heightMm, bleedMm } = options;

  // Total canvas dimensions (trim + bleed on all sides)
  const totalWidthMm = widthMm + bleedMm * 2;
  const totalHeightMm = heightMm + bleedMm * 2;

  // Convert mm to points (1mm = 2.83465pt)
  const mmToPt = (mm: number) => mm * 2.83465;

  const totalWidthPt = mmToPt(totalWidthMm);
  const totalHeightPt = mmToPt(totalHeightMm);
  const bleedPt = mmToPt(bleedMm);
  const trimWidthPt = mmToPt(widthMm);
  const trimHeightPt = mmToPt(heightMm);

  // Target pixel dimensions at 300 DPI
  const targetPxW = Math.round((totalWidthMm / 25.4) * 300);
  const targetPxH = Math.round((totalHeightMm / 25.4) * 300);

  // Process the canvas PNG with Sharp
  // 1. Ensure correct resolution
  const processedPng = await sharp(canvasPng)
    .resize(targetPxW, targetPxH, { fit: "fill" })
    .png()
    .toBuffer();

  // 2. Generate preview PNG (smaller, for thumbnails)
  const previewPngBuffer = await sharp(canvasPng)
    .resize(800, Math.round(800 * (totalHeightMm / totalWidthMm)), {
      fit: "fill",
    })
    .png({ quality: 85 })
    .toBuffer();

  // 3. Build the PDF
  // PDF page size = total canvas (includes bleed) + extra margin for crop marks
  const cropMarkMarginPt = mmToPt(CROP_MARK_OFFSET_MM + CROP_MARK_LENGTH_MM + 2);
  const pageWidthPt = totalWidthPt + cropMarkMarginPt * 2;
  const pageHeightPt = totalHeightPt + cropMarkMarginPt * 2;

  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: [pageWidthPt, pageHeightPt],
      margin: 0,
      info: {
        Title: `Coffee Bag Label - ${widthMm}x${heightMm}mm`,
        Author: "Ghost Roastery Label Maker",
        Subject: "Coffee bag label",
        Creator: "Ghost Roastery (ghostroastery.com)",
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Image origin (centred in the page, accounting for crop mark margins)
    const imgX = cropMarkMarginPt;
    const imgY = cropMarkMarginPt;

    // Place the canvas image
    doc.image(processedPng, imgX, imgY, {
      width: totalWidthPt,
      height: totalHeightPt,
    });

    // Draw crop marks at the four trim corners
    // Trim rectangle origin relative to page
    const trimX = imgX + bleedPt;
    const trimY = imgY + bleedPt;
    const trimRight = trimX + trimWidthPt;
    const trimBottom = trimY + trimHeightPt;

    const markLen = mmToPt(CROP_MARK_LENGTH_MM);
    const markOff = mmToPt(CROP_MARK_OFFSET_MM);

    doc.lineWidth(CROP_MARK_WIDTH);
    doc.strokeColor("#000000");

    // Helper: draw a line
    const line = (x1: number, y1: number, x2: number, y2: number) => {
      doc.moveTo(x1, y1).lineTo(x2, y2).stroke();
    };

    // Top-left corner
    line(trimX, trimY - markOff, trimX, trimY - markOff - markLen); // vertical up
    line(trimX - markOff, trimY, trimX - markOff - markLen, trimY); // horizontal left

    // Top-right corner
    line(trimRight, trimY - markOff, trimRight, trimY - markOff - markLen);
    line(trimRight + markOff, trimY, trimRight + markOff + markLen, trimY);

    // Bottom-left corner
    line(trimX, trimBottom + markOff, trimX, trimBottom + markOff + markLen);
    line(trimX - markOff, trimBottom, trimX - markOff - markLen, trimBottom);

    // Bottom-right corner
    line(
      trimRight,
      trimBottom + markOff,
      trimRight,
      trimBottom + markOff + markLen
    );
    line(
      trimRight + markOff,
      trimBottom,
      trimRight + markOff + markLen,
      trimBottom
    );

    doc.end();
  });

  const timestamp = Date.now();
  const filename = `label-${timestamp}.pdf`;

  return {
    pdfBuffer,
    previewPngBuffer,
    filename,
  };
}
