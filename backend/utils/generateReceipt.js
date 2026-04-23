import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import generateQR_code from "./generateQR_code.js";
import { formatDate } from "./util.js";
export async function generateReceipt(receipt, baseUrl) {
  const {
    issuedAt,
    receiptNo,
    status,
    amount,
    publicToken,
    cancelledAt,
    student: { firstName, secondName, course },
  } = receipt;
  const formattedDate = formatDate(issuedAt);
  const formattedCancelledDate = cancelledAt ? formatDate(cancelledAt) : null;
  try {
    const isCancelled = status === "CANCELLED" && cancelledAt;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([250, 400]);
    const { width, height } = page.getSize();
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // Qr code
    const qrCodeData = await generateQR_code(
      `${baseUrl}/site/receipt/${publicToken}`,
    );
    const qrCodeImageBytes = await fetch(qrCodeData).then((res) =>
      res.arrayBuffer(),
    );
    // Embed the QR code image in the PDF
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);
    const headerText = "IT-Park Khiva MCHJ";
    const fontSize = 16;
    const textWidth = fontBold.widthOfTextAtSize(headerText, fontSize);
    const qrSize = 200; // choose size
    // Header
    page.drawText(headerText, {
      x: (width - textWidth) / 2,
      y: height - 40,
      size: fontSize,
      font: fontBold,
    });
    page.drawText(`Receipt code: ${receiptNo}`, {
      x: width / 2 - 60,
      y: height - 60,
      size: 12,
      font: fontBold,
    });
    page.drawLine({
      start: { x: 10, y: height - 70 },
      end: { x: width - 10, y: height - 70 },
      thickness: 1,
      color: rgb(0, 0, 0),
    });
    // Info
    page.drawText(`O'quvchi: ${firstName} ${secondName}`, {
      x: 20,
      y: height - 90,
      size: 12,
      font: fontRegular,
    });
    page.drawText(`Kurs: ${course?.name}`, {
      x: 20,
      y: height - 110,
      size: 12,
      font: fontRegular,
    });
    page.drawText(`Summa: ${amount}`, {
      x: 20,
      y: height - 130,
      size: 12,
      font: fontRegular,
    });
    page.drawText(`Sana: ${formattedDate}`, {
      x: 20,
      y: height - 150,
      size: 12,
      font: fontRegular,
    });
    page.drawText(
      `Chek xolati: ${status === "ACTIVE" ? "Active" : "Bekor qilingan!"}`,
      {
        x: 20,
        y: height - 170,
        size: 12,
        font: fontRegular,
      },
    );
    if (isCancelled) {
      page.drawText(`Bekor qilingan sana: ${formattedCancelledDate}`, {
        x: 20,
        y: height - 190,
        size: 12,
        font: fontRegular,
        // color: rgb(1, 0, 0), // Use red for cancelled status [web:5]
      });
    }

    // page.drawText(`Bekor qilingan sana: ${formattedCancelledDate}`, {
    //   x: isCancelled ? 20 : 0,
    //   y: isCancelled ? height - 190 : 10000,
    //   size: isCancelled ? 12 : 0,
    //   font: fontRegular,
    // });
    // Draw the QR code image on the PDF
    page.drawImage(qrCodeImage, {
      x: (width - qrSize) / 2,
      y: isCancelled ? 5 : 20,
      width: qrSize,
      height: qrSize,
    });
    return await pdfDoc.save();
  } catch (error) {
    throw new Error(error);
  }
}
