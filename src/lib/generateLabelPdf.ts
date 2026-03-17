import PDFDocument from "pdfkit";
import sharp from "sharp";

interface LabelPdfOptions {
  /** Canvas PNG as a Buffer */
  canvasPng: Buffer;
  /** Label dimensions in mm */
  widthMm: number;
  heightMm: number;
  /** Bleed in mm (internal design guide — not added to page size) */
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

/**
 * Generates a print-ready PDF from a Fabric.js canvas PNG export.
 *
 * PDF page size = trim + bleed (e.g. 106mm × 156mm with 2mm bleed).
 * Artwork fills the entire page edge-to-edge — NO crop marks, NO white border.
 * Image embedded at 300 DPI.
 */
export async function generateLabelPdf(
  options: LabelPdfOptions
): Promise<LabelPdfResult> {
  const { canvasPng, widthMm, heightMm, bleedMm } = options;

  // PDF page = trim + bleed on each side
  const totalWidthMm = widthMm + bleedMm * 2;
  const totalHeightMm = heightMm + bleedMm * 2;

  // Convert mm to points: 1 inch = 72pt = 25.4mm → 1mm = 72/25.4 pt
  // Use exact fraction to avoid floating-point drift that causes white borders
  const mmToPt = (mm: number) => (mm * 72) / 25.4;

  const totalWidthPt = mmToPt(totalWidthMm);
  const totalHeightPt = mmToPt(totalHeightMm);

  // Target pixel dimensions at 300 DPI
  const targetPxW = Math.round((totalWidthMm / 25.4) * 300);
  const targetPxH = Math.round((totalHeightMm / 25.4) * 300);

  // Process the canvas PNG with Sharp — ensure correct resolution + 300 DPI metadata
  const processedPng = await sharp(canvasPng)
    .resize(targetPxW, targetPxH, { fit: "fill" })
    .withMetadata({ density: 300 })
    .png()
    .toBuffer();

  // Generate preview PNG (smaller, for thumbnails)
  const previewPngBuffer = await sharp(canvasPng)
    .resize(800, Math.round(800 * (totalHeightMm / totalWidthMm)), {
      fit: "fill",
    })
    .png({ quality: 85 })
    .toBuffer();

  // Build the PDF — page size matches artwork exactly (trim + bleed)
  const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({
      size: [totalWidthPt, totalHeightPt],
      margin: 0,
      info: {
        Title: `Coffee Bag Label - ${widthMm}x${heightMm}mm`,
        Author: "Ghost Roastery Label Maker",
        Subject: "Coffee bag label - print ready",
        Creator: "Ghost Roastery (ghostroastery.com)",
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // Place artwork edge-to-edge — fills the entire page
    doc.image(processedPng, 0, 0, {
      width: totalWidthPt,
      height: totalHeightPt,
    });

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
