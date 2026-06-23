import { jsPDF } from "jspdf";
import QRCodeLib from "qrcode";

// ── Colour Palette ──────────────────────────────
const NAVY = "#0f172a";
const GOLD = "#b8860b";
const GOLD_LT = "#d4af37";
const BLACK = "#000000";
const GREY = "#6b7280";
const GREY_LT = "#9ca3af";
const WHITE = "#ffffff";

// ── Helper: hex → RGB ───────────────────────────
function hexRGB(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

// ── Helper: draw centred text ───────────────────
function centreText(
  pdf: jsPDF,
  text: string,
  y: number,
  opts: {
    size?: number;
    color?: string;
    font?: string;
    style?: string;
    letterSpacing?: number;
    pageW?: number;
  } = {}
) {
  const {
    size = 14,
    color = BLACK,
    font = "helvetica",
    style = "normal",
    pageW = 842,
  } = opts;
  pdf.setFont(font, style);
  pdf.setFontSize(size);
  pdf.setTextColor(...hexRGB(color));

  // Manual letter-spacing via character-by-character
  if (opts.letterSpacing && opts.letterSpacing > 0) {
    const totalW =
      pdf.getStringUnitWidth(text) * size * (1 / 72) * 25.4 +
      (text.length - 1) * opts.letterSpacing;
    let x = (pageW - totalW) / 2;
    for (const ch of text) {
      pdf.text(ch, x, y);
      x += pdf.getStringUnitWidth(ch) * size * (1 / 72) * 25.4 + opts.letterSpacing;
    }
  } else {
    pdf.text(text, pageW / 2, y, { align: "center" });
  }
}

// ═══════════════════════════════════════════════════
//  PUBLIC API
// ═══════════════════════════════════════════════════

export interface CertificateData {
  studentName: string;
  courseTitle: string;
  issueDate: string;
  certificateId: string;
}

export const generateCertificatePDF = async (
  _elementIdOrData: string | CertificateData,
  fileName: string = "certificate.pdf"
) => {
  // Accept either the old element-id signature (ignored) or direct data
  let data: CertificateData;
  if (typeof _elementIdOrData === "string") {
    // Legacy call — we can't draw from an element id any more,
    // but callers also pass data via the second overload.
    console.warn("generateCertificatePDF: element-id mode is deprecated. Use data mode.");
    return false;
  } else {
    data = _elementIdOrData;
  }

  const { studentName, courseTitle, issueDate, certificateId } = data;
  const W = 842; // A4 landscape width  in pt‑ish (mm)
  const H = 595; // A4 landscape height in pt‑ish

  try {
    // ── 1. Create PDF ───────────────────────────
    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    });

    // ── 2. Outer borders ────────────────────────
    // Thick navy border
    pdf.setDrawColor(...hexRGB(NAVY));
    pdf.setLineWidth(8);
    pdf.rect(24, 24, W - 48, H - 48);

    // Gold inner border
    pdf.setDrawColor(...hexRGB(GOLD_LT));
    pdf.setLineWidth(2.5);
    pdf.rect(38, 38, W - 76, H - 76);

    // Thin navy innermost border
    pdf.setDrawColor(...hexRGB(NAVY));
    pdf.setLineWidth(0.5);
    pdf.rect(46, 46, W - 92, H - 92);

    // Corner ornaments (gold squares at each corner)
    const ornSize = 14;
    const corners = [
      [42, 42],
      [W - 42 - ornSize, 42],
      [42, H - 42 - ornSize],
      [W - 42 - ornSize, H - 42 - ornSize],
    ];
    pdf.setFillColor(...hexRGB(GOLD_LT));
    for (const [cx, cy] of corners) {
      pdf.rect(cx, cy, ornSize, ornSize, "F");
    }

    // ── 3. Company Logo Area ────────────────────
    // Dark pill with "CL"
    const logoW = 60;
    const logoH = 34;
    const logoX = (W - logoW) / 2;
    const logoY = 78;
    pdf.setFillColor(...hexRGB(NAVY));
    pdf.roundedRect(logoX, logoY, logoW, logoH, 4, 4, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.setTextColor(...hexRGB(WHITE));
    pdf.text("PK", W / 2, logoY + 23, { align: "center" });

    // Company name
    centreText(pdf, "PROKODEX TECHNOLOGIES", logoY + 56, {
      size: 11,
      color: NAVY,
      style: "bold",
      letterSpacing: 3,
    });

    // ── 4. Title ────────────────────────────────
    centreText(pdf, "CERTIFICATE", 186, {
      size: 48,
      color: NAVY,
      style: "bold",
      font: "times",
      letterSpacing: 6,
    });
    centreText(pdf, "OF INTERNSHIP", 210, {
      size: 16,
      color: GOLD,
      style: "bold",
      letterSpacing: 8,
    });

    // Gold decorative line below title
    pdf.setDrawColor(...hexRGB(GOLD_LT));
    pdf.setLineWidth(1);
    pdf.line(W / 2 - 120, 222, W / 2 + 120, 222);

    // ── 5. Body text ────────────────────────────
    centreText(pdf, "This is to proudly certify that", 254, {
      size: 14,
      color: GREY,
      style: "italic",
      font: "times",
    });

    // Student name — large serif
    centreText(pdf, studentName, 302, {
      size: 38,
      color: NAVY,
      style: "bolditalic",
      font: "times",
    });

    // Gold underline below name
    const nameW = pdf.getStringUnitWidth(studentName) * 38 * (1 / 72) * 25.4;
    const nameLineX = (W - nameW) / 2;
    pdf.setDrawColor(...hexRGB(GOLD_LT));
    pdf.setLineWidth(1.5);
    pdf.line(nameLineX - 20, 314, nameLineX + nameW + 20, 314);

    // Description text
    centreText(pdf, "has successfully completed the comprehensive internship program", 348, {
      size: 13,
      color: GREY,
      style: "italic",
      font: "times",
    });
    centreText(pdf, "and demonstrated outstanding excellence in the field of", 366, {
      size: 13,
      color: GREY,
      style: "italic",
      font: "times",
    });

    // Course title
    centreText(pdf, courseTitle.toUpperCase(), 400, {
      size: 22,
      color: NAVY,
      style: "bold",
      letterSpacing: 2,
    });

    // ── 6. Footer — Signatures ──────────────────
    const footerY = 468;

    // Left signature
    pdf.setFont("times", "italic");
    pdf.setFontSize(28);
    pdf.setTextColor(...hexRGB(NAVY));
    pdf.text("S. Mahto", 168, footerY, { align: "center" });

    pdf.setDrawColor(...hexRGB(BLACK));
    pdf.setLineWidth(1);
    pdf.line(90, footerY + 8, 248, footerY + 8);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...hexRGB(BLACK));
    pdf.text("SURAJ MAHTO", 168, footerY + 24, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...hexRGB(GREY));
    pdf.text("CHIEF EXECUTIVE OFFICER", 168, footerY + 36, { align: "center" });

    // Right signature
    pdf.setFont("times", "italic");
    pdf.setFontSize(28);
    pdf.setTextColor(...hexRGB(NAVY));
    pdf.text("A. Sharma", W - 168, footerY, { align: "center" });

    pdf.setDrawColor(...hexRGB(BLACK));
    pdf.setLineWidth(1);
    pdf.line(W - 248, footerY + 8, W - 90, footerY + 8);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.setTextColor(...hexRGB(BLACK));
    pdf.text("ARUN SHARMA", W - 168, footerY + 24, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...hexRGB(GREY));
    pdf.text("HEAD OF ENGINEERING", W - 168, footerY + 36, { align: "center" });

    // ── 7. QR Code (centre bottom) ──────────────
    const baseVerifyUrl = process.env.NEXT_PUBLIC_VERIFY_URL || "https://prokodex.vercel.app/verify";
    const verifyUrl = `${baseVerifyUrl}?id=${certificateId}`;
    const qrDataUrl = await QRCodeLib.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: NAVY, light: WHITE },
      errorCorrectionLevel: "H",
    });

    const qrSize = 80;
    const qrX = (W - qrSize) / 2;
    const qrY = footerY - 12;

    // Gold circular border around QR
    pdf.setDrawColor(...hexRGB(GOLD_LT));
    pdf.setLineWidth(2.5);
    pdf.circle(W / 2, qrY + qrSize / 2, qrSize / 2 + 8);

    // QR image
    pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);

    // "VERIFIED" badge below QR
    const badgeW = 80;
    const badgeH = 16;
    const badgeX = (W - badgeW) / 2;
    const badgeY = qrY + qrSize + 10;
    pdf.setFillColor(...hexRGB(NAVY));
    pdf.rect(badgeX, badgeY, badgeW, badgeH, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...hexRGB(GOLD_LT));
    pdf.text("VERIFIED", W / 2, badgeY + 11, { align: "center" });

    // ── 8. Bottom bar — Date & Credential ID ────
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...hexRGB(GREY_LT));
    pdf.text(`DATE: ${issueDate}`, 75, H - 36);
    pdf.text(`CREDENTIAL ID: ${certificateId}`, W - 75, H - 36, { align: "right" });

    // ── 9. Save ─────────────────────────────────
    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};
