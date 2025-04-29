import { PDFDocument, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import generateQR_code from "./generateQR_code.js";
import fontKit from "@pdf-lib/fontkit";
import { createCertificateUrl } from "../v1/certificates/certificates.helper.js";
const __dirname = path.resolve();
const existingPdfBytes = fs.readFileSync(
  path.join(__dirname, "template", "template.pdf")
);
const uploadsPath = path.join(__dirname, "public", "certificates");
const date = new Date();

// color
// Original RGB values
const red = 151;
const green = 193;
const blue = 25;

// Normalize RGB values for pdf-lib
const normalizedRed = red / 255;
const normalizedGreen = green / 255;
const normalizedBlue = blue / 255;

async function createPdf(student, group, courseName, url) {
  try {
    const currentYear = new Date().getFullYear().toString().slice(2, 4);

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const poppins = fs.readFileSync(
      path.join(__dirname, "assets", "font", "Poppins", "Poppins-Regular.ttf")
    );

    // Register fontkit with the PDF document
    pdfDoc.registerFontkit(fontKit);

    const poppinsFont = await pdfDoc.embedFont(poppins);

    const qrCodeData = await generateQR_code(url);
    const qrCodeImageBytes = await fetch(qrCodeData).then((res) =>
      res.arrayBuffer()
    );
    // Embed the QR code image in the PDF
    const qrCodeImage = await pdfDoc.embedPng(qrCodeImageBytes);

    const { width: qrWidth, height: qrHeight } = qrCodeImage.scale(1); // Scale down the image

    const page = pdfDoc.getPage(0);
    const fontSize = 40;
    page.drawText(`${student.firstName} ${student.secondName}`, {
      x: 60,
      y: 310,
      size: fontSize,
      font: poppinsFont,
      color: rgb(0, 0, 0),
    });
    // write course name
    page.drawText(`«${courseName} »`, {
      x: 45,
      y: 223,
      font: poppinsFont,
      size: 20,
      color: rgb(normalizedRed, normalizedGreen, normalizedBlue),
    });
    // Draw the QR code image on the PDF
    page.drawImage(qrCodeImage, {
      x: page.getWidth() - qrWidth - 150,
      y: page.getHeight() - qrHeight - 20,
    });

    // write id
    page.drawText(`${currentYear}/${student.code}`, {
      x: 635,
      y: 130,
      font: poppinsFont,
      size: 15,
      color: rgb(0, 0, 0),
    });
    // date time
    const day = String(date.getDate()).padStart(2, "0"); // Get day of the month (1-31) and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month (0-11, so add 1) and pad with zero
    const year = date.getFullYear();
    // date time
    page.drawText(`${day}.${month}.${year}`, {
      x: 620,
      y: 75,
      font: poppinsFont,
      size: 16,
      color: rgb(0, 0, 0),
    });
    const newFolder = `${uploadsPath}/${currentYear}/${group?.name}`;

    if (!fs.existsSync(newFolder)) {
      fs.mkdirSync(newFolder, { recursive: true });
    }
    const fileURL = `${student.code}.${student.firstName} ${student.secondName}.pdf`;
    const filePath = path.join(newFolder, fileURL);
    const saveURL = `${currentYear}/${group?.name}/${fileURL}`;
    const pdfByte = await pdfDoc.save();
    fs.writeFileSync(filePath, pdfByte);
    // create url certificate
    await createCertificateUrl(student, group, saveURL);
    return pdfByte;
  } catch (error) {
    throw error;
  }
}
export default createPdf;
